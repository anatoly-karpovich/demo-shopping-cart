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

  setProductsInShopCard(products) {
    this.#storageService.setDataByKey("shoppingCard", products);
  }

  getProductsInShopingCard() {
    const products = this.#storageService.getDataByKey("shoppingCard");
    return products ?? [];
  }

  addProductToShopCard(productId) {
    const products = this.getProductsInShopingCard();
    products.push(productId);
    this.setProductsInShopCard(products);
    return products;
  }

  removeItemFromShopCard(productId) {
    const products = this.getProductsInShopingCard();
    const productIndex = products.findIndex((product) => product === productId);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      this.setProductsInShopCard(products);
    }
    return products;
  }

  removeAllItemsWithSpecificIdFromCart(productId) {
    const products = this.getProductsInShopingCard();
    const productsAfterRemoving = products.filter((id) => id !== productId);
    this.setProductsInShopCard(productsAfterRemoving);
    return productsAfterRemoving;
  }

  getRebates() {
    return this.#storageService.getDataByKey("rebates");
  }

  setRebates(rebates) {
    this.#storageService.setDataByKey("rebates", rebates);
  }
}

const shopStorageService = new ShopStorageService();
