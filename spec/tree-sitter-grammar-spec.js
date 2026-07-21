const { scopesFor } = require('./spec-helper');

describe('language-lua-pulsar modern tree-sitter grammar', () => {
  let editor;
  let languageMode;

  const source = [
    'local a = 3 // 2',        // row 0
    'local b <const> = 1',     // row 1
    'local s = "hi"',          // row 2
    '-- a comment',            // row 3
    'local n = nil',           // row 4
    'print("x")',              // row 5
    'string.pack("i4", 1)',    // row 6
    'local function greet() end' // row 7
  ].join('\n');

  beforeEach(async () => {
    atom.config.set('core.useTreeSitterParsers', true);
    await atom.packages.activatePackage('language-lua-pulsar');

    editor = await atom.workspace.open('example.lua');
    const grammar = atom.grammars.grammarForScopeName('source.lua');
    editor.setGrammar(grammar);
    languageMode = editor.languageMode;
    await languageMode.ready;

    editor.setText(source);
    await languageMode.atTransactionEnd();
  });

  it('scopes the integer-division operator', () => {
    expect(scopesFor(editor, 0, '//')).toContain('keyword.operator.lua');
  });

  it('scopes <const> attributes as storage modifiers', () => {
    expect(scopesFor(editor, 1, 'const')).toContain('storage.modifier.lua');
  });

  it('scopes double-quoted strings', () => {
    expect(scopesFor(editor, 2, 'hi')).toContain('string.quoted.double.lua');
  });

  it('scopes line comments', () => {
    expect(scopesFor(editor, 3, '--')).toContain('comment.line.double-dash.lua');
  });

  it('scopes language constants', () => {
    expect(scopesFor(editor, 4, 'nil')).toContain('constant.language.lua');
  });

  it('scopes built-in global functions', () => {
    expect(scopesFor(editor, 5, 'print')).toContain('support.function.lua');
  });

  it('scopes standard-library functions', () => {
    expect(scopesFor(editor, 6, 'pack')).toContain('support.function.library.lua');
  });

  it('scopes function definition names', () => {
    expect(scopesFor(editor, 7, 'greet')).toContain('entity.name.function.lua');
  });
});
