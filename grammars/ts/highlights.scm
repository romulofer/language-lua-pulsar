; Lua highlights for Pulsar's modern-tree-sitter.
; Scopes mirror the legacy TextMate grammar (source.lua) so existing themes
; colour tree-sitter and TextMate buffers identically. Targets Lua 5.4 while
; keeping 5.1/LuaJIT built-ins highlighted for compatibility.

; COMMENTS
; ========

((comment) @comment.block.lua
  (#match? @comment.block.lua "^--\\[=*\\["))

((comment) @comment.line.double-dash.lua
  (#match? @comment.line.double-dash.lua "^--(?!\\[=*\\[)"))

(hash_bang_line) @comment.line.shebang.lua

; STRINGS
; =======

((string) @string.quoted.other.multiline.lua
  (#match? @string.quoted.other.multiline.lua "^\\[=*\\["))

((string) @string.quoted.single.lua
  (#match? @string.quoted.single.lua "^'"))

((string) @string.quoted.double.lua
  (#match? @string.quoted.double.lua "^\""))

(escape_sequence) @constant.character.escape.lua

; NUMBERS / CONSTANTS
; ==================

(number) @constant.numeric.lua

[
  (nil)
  (true)
  (false)
] @constant.language.lua

(vararg_expression) @constant.language.lua

; SCREAMING_CASE identifiers read as constants, matching the TextMate grammar.
((identifier) @constant.language.lua
  (#match? @constant.language.lua "^[A-Z][A-Z0-9_]*$"))

; KEYWORDS
; ========

(break_statement) @keyword.control.lua
"return" @keyword.control.lua

[
  "goto"
  "in"
  "local"
] @keyword.control.lua

(do_statement ["do" "end"] @keyword.control.lua)
(while_statement ["while" "do" "end"] @keyword.control.lua)
(repeat_statement ["repeat" "until"] @keyword.control.lua)
(if_statement ["if" "then" "end"] @keyword.control.lua)
(elseif_statement ["elseif" "then"] @keyword.control.lua)
(else_statement "else" @keyword.control.lua)
(for_statement ["for" "do" "end"] @keyword.control.lua)
(function_declaration ["function" "end"] @keyword.control.lua)
(function_definition ["function" "end"] @keyword.control.lua)

; goto / label targets.
(goto_statement (identifier) @entity.name.label.lua)
(label_statement (identifier) @entity.name.label.lua)

; OPERATORS
; =========

(binary_expression operator: _ @keyword.operator.lua)
(unary_expression operator: _ @keyword.operator.lua)

[
  "and"
  "or"
  "not"
] @keyword.operator.lua

; ATTRIBUTES (Lua 5.4: <const>, <close>; Lua 5.5 also allows <const> on globals)
; NOTE: the bundled tree-sitter-lua parser is 5.4-era and does not recognise the
; Lua 5.5 `global` declaration keyword (it produces ERROR nodes). Highlighting of
; `global` is provided only by the TextMate fallback grammar until the .wasm
; parser gains 5.5 support.
; =====================================

(attribute
  "<" @punctuation.definition.begin.lua
  (identifier) @storage.modifier.lua
  ">" @punctuation.definition.end.lua)

; VARIABLES
; =========

(identifier) @variable.other.lua

((identifier) @variable.language.self.lua
  (#eq? @variable.language.self.lua "self"))

(parameters (identifier) @variable.parameter.function.lua)

; Table fields / member access.
(field name: (identifier) @variable.other.member.lua)
(dot_index_expression field: (identifier) @variable.other.member.lua)

; STANDARD LIBRARY TABLES
; =======================

((identifier) @support.type.lua
  (#any-of? @support.type.lua
    "coroutine" "debug" "io" "math" "os" "package" "string" "table" "utf8"))

; FUNCTIONS
; =========

; Definitions.
(function_declaration
  name: [
    (identifier) @entity.name.function.lua
    (dot_index_expression field: (identifier) @entity.name.function.lua)
  ])

(function_declaration
  name: (method_index_expression method: (identifier) @entity.name.function.lua))

(assignment_statement
  (variable_list .
    name: [
      (identifier) @entity.name.function.lua
      (dot_index_expression field: (identifier) @entity.name.function.lua)
    ])
  (expression_list . value: (function_definition)))

(table_constructor
  (field
    name: (identifier) @entity.name.function.lua
    value: (function_definition)))

; Global built-in functions (5.4 core + retained 5.1/LuaJIT).
(function_call
  name: (identifier) @support.function.lua
  (#any-of? @support.function.lua
    "assert" "collectgarbage" "dofile" "error" "getmetatable" "ipairs"
    "load" "loadfile" "next" "pairs" "pcall" "print" "rawequal" "rawget"
    "rawlen" "rawset" "require" "select" "setmetatable" "tonumber" "tostring"
    "type" "warn" "xpcall"
    ; retained for Lua 5.1 / LuaJIT
    "getfenv" "setfenv" "loadstring" "module" "unpack")
  (#set! capture.final true))

; Library functions accessed as `lib.fn(...)`.
(function_call
  name: (dot_index_expression
    table: (identifier) @_lib
    field: (identifier) @support.function.library.lua)
  (#any-of? @_lib
    "coroutine" "debug" "io" "math" "os" "package" "string" "table" "utf8")
  (#set! capture.final true))

; Method calls: obj:method(...)
(function_call
  name: (method_index_expression method: (identifier) @entity.name.function.lua))

; Any other call: name(...)
(function_call
  name: [
    (identifier) @entity.name.function.lua
    (dot_index_expression field: (identifier) @entity.name.function.lua)
  ])

; PUNCTUATION
; ===========

";" @punctuation.terminator.statement.lua
"," @punctuation.separator.lua
["." ":"] @punctuation.separator.lua

["(" ")"] @punctuation.definition.parameters.lua
["[" "]"] @punctuation.definition.index.lua
(table_constructor ["{" "}"] @punctuation.definition.table.lua)
