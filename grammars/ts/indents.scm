; Indentation hints for Lua blocks.
; @indent  -> lines after this token indent one level.
; @dedent  -> this line dedents one level.

; Bracketed constructs.
["(" "{" "["] @indent
[")" "}" "]"] @dedent

; Block openers.
[
  "then"
  "do"
  "repeat"
  "function"
] @indent

(else_statement "else" @indent)

; Block closers.
[
  "end"
  "until"
] @dedent

; Branch keywords dedent their own line; the following block re-indents via
; the matching "then"/"else" above.
(elseif_statement "elseif" @dedent)
(else_statement "else" @dedent)
