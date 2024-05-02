function getNumberOfProductsInProductsInShoppingCart(products) {
  return Object.values(products).reduce((amount, product) => amount + product, 0);
}

function enableOrDisableElement(element, enable = true) {
  enable ? element.removeAttribute("disabled") : element.setAttribute("disabled", "");
}
