import json
from typing import List, Tuple, Dict, Any

from django.conf import settings
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate

# Maximum clarifying questions to ask before forcing generation
MAX_ASK_ROUNDS = 2

_CLASSIFIER_SYSTEM = """You are a request classifier for a UI code generation assistant.

Look at the conversation history and the latest user message. Decide:
1. Is the request specific enough to generate a React component right now?
2. Or do you need ONE more piece of information?

## Generate immediately if:
- The user specifies a component type AND at least one detail (layout, color, behavior, content)
- The user is replying to a previous clarifying question — use all prior answers to generate
- The user is iterating on previously generated code ("make it bigger", "add a footer")

## Ask ONE question if:
- The very first message names only a broad category with zero specifics
  (e.g. "a landing page", "a dashboard", "build me a form")
- You genuinely cannot make a reasonable component without knowing this ONE thing

## Rules:
- Ask at most ONE question per turn — not a list, not multiple, exactly one
- Make the question short and direct (under 15 words)
- If you already asked a question in the history, DO NOT ask another — generate now
- When in doubt, generate — a good guess is better than interrogating the user

Return ONLY valid JSON, no markdown:
{"action": "ask" | "generate", "question": "single question string or empty string"}"""


def classify_request(
    user_input: str,
    history: List[Tuple[str, str]],
    ask_rounds_done: int = 0,
) -> Dict[str, Any]:
    """Classify whether one clarifying question is needed before generating code.

    Args:
        user_input: Current user message.
        history: Full conversation history as (role, content) tuples.
        ask_rounds_done: How many "ask" rounds have already happened this session.

    Returns:
        {"action": "ask" | "generate", "question": str}
    """
    # Force generate if we've already asked the max number of questions
    if ask_rounds_done >= MAX_ASK_ROUNDS:
        return {"action": "generate", "question": ""}

    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0,
        max_tokens=150,
        api_key=settings.OPENAI_API_KEY,
    )

    # Build context string from recent history (last 6 turns, truncated)
    history_lines = []
    for role, content in history[-6:]:
        history_lines.append(f"{role.upper()}: {content[:300]}")
    history_text = "\n".join(history_lines) if history_lines else "(no prior messages)"

    user_prompt = (
        f"Conversation so far:\n{history_text}\n\n"
        f"Latest user message:\n{user_input}"
    )

    prompt = ChatPromptTemplate.from_messages([
        SystemMessage(content=_CLASSIFIER_SYSTEM),
        ("human", "{input}"),
    ])

    try:
        response = (prompt | llm).invoke({"input": user_prompt})
        raw = response.content
        if not isinstance(raw, str):
            return {"action": "generate", "question": ""}
        result: Dict[str, Any] = json.loads(raw)

        action = result.get("action")
        question = result.get("question", "")

        if action not in ("ask", "generate"):
            return {"action": "generate", "question": ""}
        if action == "ask" and not isinstance(question, str):
            return {"action": "generate", "question": ""}

        return {"action": action, "question": question}

    except Exception:
        # Never block the user — fall through to generation
        return {"action": "generate", "question": ""}
