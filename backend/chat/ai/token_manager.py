import tiktoken
from typing import List, Tuple

MODEL_NAME = "gpt-4o"
MAX_CONTEXT_TOKENS = 128_000
MAX_RESPONSE_TOKENS = 4_096
# Reserve budget for system prompt + few-shot examples (~2 500 tokens)
SYSTEM_OVERHEAD = 2_500
MAX_HISTORY_TOKENS = MAX_CONTEXT_TOKENS - MAX_RESPONSE_TOKENS - SYSTEM_OVERHEAD

_encoder = None


def _get_encoder():
    global _encoder
    if _encoder is None:
        _encoder = tiktoken.encoding_for_model(MODEL_NAME)
    return _encoder


def count_tokens(text: str) -> int:
    return len(_get_encoder().encode(text))


def trim_history(
    messages: List[Tuple[str, str]],
    max_tokens: int = MAX_HISTORY_TOKENS,
) -> List[Tuple[str, str]]:
    """Sliding-window trim: keeps the most recent messages that fit within max_tokens.

    GPT-4o has a 128K context window, so for most conversations this function
    returns the full history unchanged.
    """
    total = 0
    kept: List[Tuple[str, str]] = []

    for role, content in reversed(messages):
        # tiktoken overhead: ~4 tokens per message for role/formatting markers
        msg_tokens = count_tokens(content) + 4
        if total + msg_tokens > max_tokens:
            break
        kept.append((role, content))
        total += msg_tokens

    kept.reverse()
    return kept
