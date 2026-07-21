describe('language-lua grammar registration', () => {
  beforeEach(async () => {
    await atom.packages.activatePackage('language-lua');
  });

  it('registers a grammar for source.lua', () => {
    const grammar = atom.grammars.grammarForScopeName('source.lua');
    expect(grammar).toBeTruthy();
    expect(grammar.scopeName).toBe('source.lua');
  });

  it('associates the common Lua file extensions', () => {
    const grammar = atom.grammars.selectGrammar('example.lua', '');
    expect(grammar.scopeName).toBe('source.lua');

    const rockspec = atom.grammars.selectGrammar('mylib.rockspec', '');
    expect(rockspec.scopeName).toBe('source.lua');
  });

  it('selects Lua from a shebang line', () => {
    const grammar = atom.grammars.selectGrammar('noext', '#!/usr/bin/env lua\n');
    expect(grammar.scopeName).toBe('source.lua');
  });

  it('provides a TextMate fallback grammar', () => {
    const textmate = atom.grammars.grammars.find(
      (g) => g.scopeName === 'source.lua' && typeof g.tokenizeLine === 'function'
    );
    expect(textmate).toBeTruthy();
  });

  it('provides a modern tree-sitter grammar when enabled', () => {
    atom.config.set('core.useTreeSitterParsers', true);
    const grammar = atom.grammars.grammarForScopeName('source.lua');
    expect(grammar).toBeTruthy();
    expect(typeof grammar.getLanguageSync).toBe('function');
  });
});
