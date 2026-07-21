// Shared helpers for the language-lua specs.

// Column of the first occurrence of `substr` on `row` of the editor's buffer.
function colOf(editor, row, substr) {
  const line = editor.lineTextForBufferRow(row);
  const col = line.indexOf(substr);
  if (col === -1) {
    throw new Error(`"${substr}" not found on row ${row}: ${JSON.stringify(line)}`);
  }
  return col;
}

// Scope names active at [row, col], as a plain array.
function scopesAt(editor, row, col) {
  return editor
    .scopeDescriptorForBufferPosition([row, col])
    .getScopesArray();
}

// Scope names at the first occurrence of `substr` on `row`.
function scopesFor(editor, row, substr, offset = 0) {
  return scopesAt(editor, row, colOf(editor, row, substr) + offset);
}

module.exports = { colOf, scopesAt, scopesFor };
