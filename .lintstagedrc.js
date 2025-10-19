module.exports = {
  '*.{js,json,ts}': ['prettier --write', 'git add'],
  '*.md': ['markdown-toc -i', 'prettier --write', 'git add']
};
