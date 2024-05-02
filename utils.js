function getNumberOfProductsInProductsInShoppingCart(products) {
  return Object.values(products).reduce((amount, product) => amount + product, 0);
}
