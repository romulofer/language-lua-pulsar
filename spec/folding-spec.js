describe('language-lua-pulsar tree-sitter folding', () => {
  let editor;
  let languageMode;

  async function setText(text) {
    editor.setText(text);
    await languageMode.atTransactionEnd();
  }

  beforeEach(async () => {
    atom.config.set('core.useTreeSitterParsers', true);
    await atom.packages.activatePackage('language-lua-pulsar');

    editor = await atom.workspace.open('example.lua');
    editor.displayLayer.reset({ foldCharacter: '…' });
    editor.setGrammar(atom.grammars.grammarForScopeName('source.lua'));
    languageMode = editor.languageMode;
    await languageMode.ready;
  });

  it('marks function bodies as foldable', async () => {
    await setText('local function f(a, b)\n  return a + b\nend\n');
    expect(editor.isFoldableAtBufferRow(0)).toBe(true);

    editor.foldBufferRow(0);
    expect(editor.isFoldedAtBufferRow(1)).toBe(true);
    expect(editor.isFoldedAtBufferRow(2)).toBe(false);
  });

  it('marks control blocks as foldable', async () => {
    await setText('for i = 1, 10 do\n  print(i)\nend\n');
    expect(editor.isFoldableAtBufferRow(0)).toBe(true);
  });

  it('marks table constructors as foldable', async () => {
    await setText('local t = {\n  a = 1,\n  b = 2,\n}\n');
    expect(editor.isFoldableAtBufferRow(0)).toBe(true);
  });

  it('marks long block comments as foldable', async () => {
    await setText('--[[\nline one\nline two\n]]\n');
    expect(editor.isFoldableAtBufferRow(0)).toBe(true);
  });
});
