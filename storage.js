class DataStorageService {
  #storage = localStorage;

  #setValueByKey(key, value) {
    this.#storage.setItem(key, JSON.stringify(value));
  }

  #getValueByKey(key) {
    const value = this.#storage.getItem(key);
    return JSON.parse(value);
  }

  setDataByKey(key, data) {
    this.#setValueByKey(key, data);
  }

  getDataByKey(key) {
    const data = this.#getValueByKey(key);
    return data;
  }

  removeItemByKey(key) {
    this.#storage.removeItem(key);
  }
}

class ShopStorageService {
  #storageService = new DataStorageService();

  #setProductsInShopCard(products) {
    this.#storageService.setDataByKey("shoppingCard", products);
  }

  getProductsInShopingCard() {
    const products = this.#storageService.getDataByKey("shoppingCard");
    return products ?? {};
  }

  getFullNumberOfProductsInCard() {
    const products = this.getProductsInShopingCard();
    return getNumberOfProductsInProductsInShoppingCart(products);
  }

  addProductToShopCard(productId) {
    const products = this.getProductsInShopingCard();
    if (!products[productId]) products[productId] = 0;
    products[productId]++;
    this.#setProductsInShopCard(products);
    return products;
  }

  reduceProductAmountInShoppingCardByOne(productId) {
    const products = this.getProductsInShopingCard();
    products[productId].length > 1 ? products[productId]-- : delete products[productId];
    this.#setProductsInShopCard(products);
    return products;
  }

  removeItemFromShopCard(productId) {
    const products = this.getProductsInShopingCard();
    delete products[productId];
    this.#setProductsInShopCard(products);
    return products;
  }

  getRebates() {
    return this.#storageService.getDataByKey("rebates");
  }

  setRebates(rebates) {
    this.#storageService.setDataByKey("rebates", rebates);
  }
}

const shopStorageService = new ShopStorageService();
