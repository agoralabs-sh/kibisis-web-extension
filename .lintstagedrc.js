module.exports = {
  '**/*.{js,json,ts}': (filenames) => `prettier --write ${filenames.join(' ')}`,
};
