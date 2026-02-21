from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Session, Message
from .serializers import (
    SessionSerializer,
    SessionListSerializer,
    MessageSerializer,
    SendMessageSerializer,
)
from .ai.chain import UIGeneratorChain


class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return SessionListSerializer
        return SessionSerializer

    @action(detail=True, methods=["post", "get"], url_path="messages")
    def messages(self, request, pk=None):
        session = self.get_object()

        if request.method == "GET":
            msgs = session.messages.all()
            return Response(MessageSerializer(msgs, many=True).data)

        # POST — send a user message and get AI response
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_content = serializer.validated_data["content"]

        # Save user message
        user_msg = Message.objects.create(
            session=session,
            role=Message.Role.USER,
            content=user_content,
        )

        # Auto-title the session from the first user message
        if session.title == "New Chat":
            session.title = user_content[:60]
            session.save(update_fields=["title", "updated_at"])

        # Build conversation history (all messages before this one)
        history = list(
            session.messages
            .exclude(pk=user_msg.pk)
            .order_by("created_at")
            .values_list("role", "content")
        )

        # Count how many times the AI already asked a clarifying question in this session
        ask_rounds_done = session.messages.filter(
            role=Message.Role.ASSISTANT,
            action=Message.Action.ASK,
        ).count()

        # Invoke the LangChain chain (classify first, then generate or ask)
        chain = UIGeneratorChain()
        result = chain.classify_and_invoke(user_content, history, ask_rounds_done)

        # Save assistant message
        assistant_msg = Message.objects.create(
            session=session,
            role=Message.Role.ASSISTANT,
            content=result["content"],
            code_blocks=result["code_blocks"],
            action=result["action"],
            questions=result["questions"],
            token_count=result["token_count"],
        )

        return Response(
            MessageSerializer(assistant_msg).data,
            status=status.HTTP_201_CREATED,
        )
