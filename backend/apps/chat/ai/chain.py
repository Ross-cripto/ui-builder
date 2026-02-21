from typing import List, Tuple, Dict, Any

from django.conf import settings
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage

from .prompts import SYSTEM_PROMPT, FEW_SHOT_EXAMPLES
from .output_parser import parse_code_blocks
from .token_manager import trim_history, count_tokens
from .classifier import classify_request


class UIGeneratorChain:
    """LangChain chain that generates UI component code with multi-turn memory.

    Pipeline:
        trim_history → ChatPromptTemplate → ChatOpenAI(gpt-4o) → parse_code_blocks
    """

    def __init__(self):
        self._llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0.3,   # low temp → consistent, correct code
            max_completion_tokens=4096,
            api_key=settings.OPENAI_API_KEY,
        )

        # Build few-shot turns as pre-constructed message objects so that
        # LangChain does NOT try to parse curly braces in code as template variables.
        few_shot_messages: List[BaseMessage] = [SystemMessage(content=SYSTEM_PROMPT)]
        for example in FEW_SHOT_EXAMPLES:
            few_shot_messages.append(HumanMessage(content=example["user"]))
            few_shot_messages.append(AIMessage(content=example["assistant"]))

        self._prompt = ChatPromptTemplate.from_messages(
            [
                *few_shot_messages,
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}"),
            ]
        )

        self._chain = self._prompt | self._llm

    def invoke(
        self,
        user_input: str,
        history: List[Tuple[str, str]],
    ) -> Dict[str, Any]:
        """Run the chain and return a structured result.

        Args:
            user_input: The current user message text.
            history: Ordered list of (role, content) tuples from the DB,
                     NOT including the current user_input.

        Returns:
            {
                "content":     str   — full LLM response (prose + code blocks),
                "code_blocks": list  — parsed [{language, filename, code}],
                "token_count": int   — approximate token count of the response,
            }
        """
        trimmed = trim_history(history)

        lc_history = []
        for role, content in trimmed:
            if role == "user":
                lc_history.append(HumanMessage(content=content))
            else:
                lc_history.append(AIMessage(content=content))

        response = self._chain.invoke(
            {"input": user_input, "history": lc_history}
        )

        content: str = response.content
        code_blocks = parse_code_blocks(content)

        return {
            "content": content,
            "code_blocks": code_blocks,
            "token_count": count_tokens(content),
        }

    def classify_and_invoke(
        self,
        user_input: str,
        history: List[Tuple[str, str]],
        ask_rounds_done: int = 0,
    ) -> Dict[str, Any]:
        """Classify the request first; ask ONE question if vague, else generate code.

        Returns:
            {
                "action":      "ask" | "generate",
                "content":     str,
                "code_blocks": list,
                "token_count": int,
                "questions":   list[str],   # always 0 or 1 item
            }
        """
        classification = classify_request(user_input, history, ask_rounds_done)

        if classification["action"] == "ask":
            question = classification["question"]
            return {
                "action": "ask",
                "content": question,
                "code_blocks": [],
                "token_count": 0,
                "questions": [question],
            }

        result = self.invoke(user_input, history)
        result["action"] = "generate"
        result["questions"] = []
        return result
