exports.activate = function () {
  if (!atom.grammars.addInjectionPoint) return;

  // LuaJIT FFI: highlight C source inside `ffi.cdef[[ ... ]]`.
  atom.grammars.addInjectionPoint('source.lua', {
    type: 'function_call',
    language(node) {
      const { firstChild } = node;
      if (!firstChild) return;
      // Match `cdef` or `ffi.cdef`.
      if (firstChild.type === 'identifier' && firstChild.text === 'cdef') {
        return 'c';
      }
      if (
        firstChild.type === 'dot_index_expression' &&
        firstChild.lastChild &&
        firstChild.lastChild.text === 'cdef'
      ) {
        return 'c';
      }
    },
    content(node) {
      const args = node.lastChild;
      if (!args) return;
      const string = args.descendantsOfType('string')[0];
      if (string && /^\[=*\[/.test(string.text)) {
        return string.descendantsOfType('string_content');
      }
    },
    languageScope: null
  });
};

exports.consumeHyperlinkInjection = (hyperlink) => {
  hyperlink.addInjectionPoint('source.lua', {
    types: ['comment', 'string_content']
  });
};

exports.consumeTodoInjection = (todo) => {
  todo.addInjectionPoint('source.lua', { types: ['comment'] });
};
