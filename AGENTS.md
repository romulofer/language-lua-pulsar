# AGENTS.md

Guidance for AI agents working in this repository.

## Project

`language-lua` is a **Pulsar** editor package (Pulsar is the community
successor to Atom) providing Lua language support:

- **Grammars** (`grammars/`)
  - `modern-tree-sitter-lua.cson` — the default grammar. Uses the bundled
    WebAssembly parser `grammars/ts/tree-sitter-lua.wasm` (from
    [tree-sitter-grammars/tree-sitter-lua](https://github.com/tree-sitter-grammars/tree-sitter-lua))
    together with the query files in `grammars/ts/`:
    `highlights.scm`, `folds.scm`, `indents.scm`, `locals.scm`, `tags.scm`.
  - `lua.cson` — the legacy TextMate grammar, kept as a fallback for when
    tree-sitter parsing is disabled. Both grammars share `scopeName: source.lua`.
- **`lib/main.js`** — registers injection points (LuaJIT `ffi.cdef` → C,
  plus hyperlink/TODO comment injections).
- **`settings/language-lua.cson`** — comment delimiters and indentation rules.
- **`snippets/language-lua.cson`** — Lua snippets.

Target language: **Lua 5.4**, while keeping **Lua 5.1 / LuaJIT** built-ins
highlighted for compatibility.

## Conventions

- Grammar scope names mirror the TextMate scopes (`*.lua`) so the two grammars
  colour identically under any theme.
- The `.wasm` parser is ABI version 15; it must stay compatible with the
  `web-tree-sitter` runtime vendored in the target Pulsar version
  (`MIN_COMPATIBLE_VERSION` 13). Do not replace the parser with a newer ABI
  without verifying it loads.
- When changing `.scm` queries, verify they compile against the bundled
  `.wasm` before considering the change done.

## Hard rules for agents

- **Do NOT author git commits.** Leave all commits to a human maintainer.
- **Do NOT push to any remote / upstream.** No `git push`, no PR creation.
- Make and edit files only; report what changed and let the maintainer commit.
