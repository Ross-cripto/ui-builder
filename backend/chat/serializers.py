from rest_framework import serializers
from .models import Session, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "role", "content", "code_blocks", "action", "questions", "created_at"]
        read_only_fields = ["id", "role", "code_blocks", "action", "questions", "created_at"]


class SessionSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        fields = ["id", "title", "created_at", "updated_at", "messages"]
        read_only_fields = ["id", "created_at", "updated_at"]


class SessionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ["id", "title", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class SendMessageSerializer(serializers.Serializer):
    content = serializers.CharField(max_length=10000)
