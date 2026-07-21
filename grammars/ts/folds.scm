; Foldable blocks. Each folds from the end of its first row to the node's end.
[
  (function_declaration)
  (function_definition)
  (if_statement)
  (while_statement)
  (for_statement)
  (repeat_statement)
  (do_statement)
  (table_constructor)
  (arguments)
  (parameters)
] @fold
  (#set! fold.endAt endPosition)

; Fold long block comments (--[[ ... ]]).
((comment) @fold
  (#match? @fold "^--\\[=*\\[")
  (#set! fold.endAt endPosition))
