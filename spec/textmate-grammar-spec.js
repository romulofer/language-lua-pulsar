describe('language-lua TextMate grammar (fallback)', () => {
  let grammar;

  // Return the scopes of the first token whose text contains `value`.
  function scopesOfToken(line, value) {
    const { tokens } = grammar.tokenizeLine(line);
    const token = tokens.find((t) => t.value.includes(value));
    if (!token) {
      throw new Error(
        `no token containing "${value}" in: ${JSON.stringify(tokens.map((t) => t.value))}`
      );
    }
    return token.scopes;
  }

  beforeEach(async () => {
    await atom.packages.activatePackage('language-lua');
    grammar = atom.grammars.grammars.find(
      (g) => g.scopeName === 'source.lua' && typeof g.tokenizeLine === 'function'
    );
    expect(grammar).toBeTruthy();
  });

  it('tokenizes the integer-division operator', () => {
    expect(scopesOfToken('local x = 3 // 2', '//')).toContain('keyword.operator.lua');
  });

  it('tokenizes bitwise operators', () => {
    expect(scopesOfToken('a << b', '<<')).toContain('keyword.operator.lua');
    expect(scopesOfToken('a >> b', '>>')).toContain('keyword.operator.lua');
    expect(scopesOfToken('a & b', '&')).toContain('keyword.operator.lua');
    expect(scopesOfToken('a ~ b', '~')).toContain('keyword.operator.lua');
  });

  it('tokenizes <const> / <close> attributes as storage modifiers', () => {
    expect(scopesOfToken('local x <const> = 1', 'const')).toContain('storage.modifier.lua');
    expect(scopesOfToken('local h <close> = f()', 'close')).toContain('storage.modifier.lua');
  });

  it('tokenizes goto labels', () => {
    expect(scopesOfToken('::top::', 'top')).toContain('entity.name.label.lua');
  });

  it('tokenizes hexadecimal and float numbers', () => {
    expect(scopesOfToken('local n = 0xFF', '0xFF')).toContain('constant.numeric.lua');
    expect(scopesOfToken('local n = 0x1.8p3', '0x1.8p3')).toContain('constant.numeric.lua');
    expect(scopesOfToken('local n = 1.5e-3', '1.5e-3')).toContain('constant.numeric.lua');
  });

  it('tokenizes unicode / hex / decimal string escapes', () => {
    expect(scopesOfToken('local s = "\\u{48}"', '\\u{48}')).toContain('constant.character.escape.lua');
    expect(scopesOfToken('local s = "\\x41"', '\\x41')).toContain('constant.character.escape.lua');
    expect(scopesOfToken('local s = "\\65"', '\\65')).toContain('constant.character.escape.lua');
  });

  it('highlights Lua 5.4 library functions', () => {
    expect(scopesOfToken('math.type(1)', 'math.type')).toContain('support.function.library.lua');
    expect(scopesOfToken('string.pack("i4", 1)', 'string.pack')).toContain('support.function.library.lua');
    expect(scopesOfToken('table.move(t, 1, 2, 3)', 'table.move')).toContain('support.function.library.lua');
    expect(scopesOfToken('utf8.len(s)', 'utf8.len')).toContain('support.function.library.lua');
  });

  it('still highlights retained Lua 5.1 / LuaJIT functions', () => {
    expect(scopesOfToken('unpack(t)', 'unpack')).toContain('support.function.lua');
    expect(scopesOfToken('math.pow(2, 3)', 'math.pow')).toContain('support.function.library.lua');
    expect(scopesOfToken('setfenv(f, env)', 'setfenv')).toContain('support.function.lua');
  });

  it('highlights control keywords and goto', () => {
    expect(scopesOfToken('goto done', 'goto')).toContain('keyword.control.lua');
    expect(scopesOfToken('for i = 1, 3 do end', 'for')).toContain('keyword.control.lua');
  });
});
