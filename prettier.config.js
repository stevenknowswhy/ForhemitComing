module.exports = {
  root: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: ["<THIRD_PARTY_MODULES>", "", "<TYPES>", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true
};
