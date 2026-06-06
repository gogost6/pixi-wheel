---
description: "Use when editing, creating, or refactoring any source file in this project. Read llms-full.txt for full project context before making changes."
applyTo: "src/**"
---

# Pixi Wheel — Pre-Change Context Rule

Before making any edit or creating any file under `src/`, read `llms-full.txt` in the workspace root.

- It contains the full project context, API references, and conventions used in this codebase.
- Do not rely solely on file contents currently open in the editor — `llms-full.txt` is the authoritative source.
- After reading, proceed with the change using only what is needed; do not over-engineer.
