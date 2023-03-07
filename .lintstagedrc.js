module.exports = {
  '**/*.{js,json,ts,tsx}': (filenames) =>
    `prettier --write ${filenames.join(' ')}`,
};
