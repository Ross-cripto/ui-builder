import re
from typing import List, Dict


# Matches fenced code blocks: ```language\n// filename: X\n...code...```
_CODE_BLOCK_RE = re.compile(
    r"```(\w+)\s*\n(?://\s*filename:\s*(\S+)\s*\n)?(.*?)```",
    re.DOTALL,
)


def parse_code_blocks(text: str) -> List[Dict[str, str]]:
    """Extract fenced code blocks from an LLM markdown response.

    Returns a list of dicts: [{language, filename, code}]
    """
    blocks = []
    for match in _CODE_BLOCK_RE.finditer(text):
        language = match.group(1).strip()
        filename = match.group(2) or _default_filename(language)
        code = match.group(3).strip()
        blocks.append(
            {
                "language": language,
                "filename": filename,
                "code": code,
            }
        )
    return blocks


def _default_filename(language: str) -> str:
    extension_map = {
        "tsx": "Component.tsx",
        "ts": "module.ts",
        "jsx": "Component.jsx",
        "js": "module.js",
        "css": "styles.css",
        "html": "index.html",
    }
    return extension_map.get(language, f"file.{language}")
