function renderShoppingCartPage() {
  const products = shopStorageService.getProductsInShopingCard();
  const layout = generateShoppingCartLayout(products);
  const contentContainer = document.getElementById("content");
  const result = `<div id="shopping-cart-container" class="d-flex justify-content-center mt-5">${layout}</div>`;
  contentContainer.innerHTML = result;
  addEventListenersToShoppingCartPage();
}

function addEventListenersToShoppingCartPage() {
  document.getElementById("apply-promocode-button").addEventListener("click", (event) => {
    event.preventDefault();
    const rebateInput = document.getElementById("rebate-input");
    const rebateInputValue = rebateInput.value.trim();
    if (!rebateInputValue) return;
    addRebateToCart(rebateInputValue);
    rebateInput.value = "";
    updateTotalPriceInShoppingCart();
  });
}

function deleteProductFromShoppingCart(id) {
  const product = document.querySelector(`[data-product-li="${id}"]`);
  product.parentNode.removeChild(product);
  const updatedProductsObject = shopStorageService.removeItemFromShopCard(id);
  const newProductsAmount = getNumberOfProductsInProductsInShoppingCart(updatedProductsObject);
  updateShoppingCardBadge(newProductsAmount);
  updateTotalPriceInShoppingCart();
  document.getElementById("amount-of-products-in-cart").innerText = newProductsAmount;
  enableOrDisableElement(document.getElementById("checkout-button"), newProductsAmount > 0);
}

function generateShoppingCartProductLayout(product, amount) {
  return `
    <div data-product-id="${product.id}" class="d-flex justify-content-between">
      <div>
        <div>
          <h5 class="my-0 fw-bold">${product.title}</h5>
          <small class="text-muted">${product.description}</small>
        </div>
        <div class="mt-2 d-flex justify-content-start align-items-center">
          <span class="me-2 fw-bold">Amount: </span>
          <button class="btn text-primary" data-plus-id="${product.id}" name="plus-button" onclick="adjustProductAmount('${product.id}', -1)"><i class="bi bi-dash-circle-fill"></i></button>
          <span class="ms-1 me-1" data-id="product-amount-in-shopping-cart">${amount}</span>
          <button class="btn text-primary" data-plus-id="${product.id}" name="plus-button" onclick="adjustProductAmount('${product.id}', 1)"><i class="bi bi-plus-circle-fill"></i></button>
        </div>
      </div>
      <div class="d-flex flex-column">
        <button class="btn btn-link text-danger table-btn" title="Delete" name="delete-button" data-delete-id=${product.id} onclick="deleteProductFromShoppingCart('${product.id}')">
          <i class="bi bi-trash"></i>
        </button>
        <span class="text-muted fw-bold">$${product.price}</span>
      </div>
    </div>
  `;
}

function addRebateToCart(rebateCode) {
  if (!state.appliedRebates.some((r) => r.code === rebateCode)) {
    const rebates = shopStorageService.getRebates();
    const foundRebate = rebates.find((r) => r.code === rebateCode);
    if (foundRebate) {
      const rebatesList = document.getElementById("rebates-list");
      if (rebatesList) {
        rebatesList.insertAdjacentHTML("afterend", generateRebateLayout(foundRebate));
      } else {
        const container = document.getElementById("rebates-container");
        container.innerHTML = generateRebatesLayout([foundRebate]);
      }
      state.appliedRebates.push(foundRebate);
    }
  }
}

function generateRebatesLayout(rebates = []) {
  return rebates.length
    ? `
  <ul class="list-group mt-3" id="rebates-list">
    ${rebates.reduce((res, r) => res + generateRebateLayout(r), "")}
  </ul>
  `
    : "";
}

function generateRebateLayout(rebate) {
  return `
  <li class="list-group-item d-flex justify-content-between">
    <span class="my-0">${rebate.code}</span>
    <small class="text-muted fw-bold">-${rebate.amount}%</small>
  </li>
  `;
}

function getProductsCardsFromProductIds(productIds) {
  const productCards = structuredClone(initialProductCards);
  return Object.keys(productIds).reduce((products, id) => {
    const productData = productCards.find((el) => el.id === id);
    products[id] = { product: productData, amount: productIds[id] };
    return products;
  }, {});
}

function generateShoppingCartLayout(productsInShoppingCart, rebates = []) {
  const products = getProductsCardsFromProductIds(productsInShoppingCart);
  const numerOfProductsInShoppingCard = getNumberOfProductsInProductsInShoppingCart(productsInShoppingCart);

  const productsList = Object.values(products).reduce(
    (res, p) => res + `<li class="list-group-item d-flex justify-content-between lh-sm" data-product-li="${p.product.id}">${generateShoppingCartProductLayout(p.product, p.amount)}</li>`,
    ""
  );

  let totalPrice = getTotalPriceFromProducsObject(products);
  if (rebates.length) {
    totalPrice = calculatePriceWithRebates(totalPrice, rebates);
  }
  state.totalPrice = totalPrice;

  return `
    <div class="col-md-5 col-lg-4 order-md-last">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Your cart</span>
        <span class="badge bg-primary rounded-pill" id="amount-of-products-in-cart">${numerOfProductsInShoppingCard}</span>
      </h4>
      <ul class="list-group mb-3" id="products-in-shopping-cart">
        ${productsList}
        <li class="list-group-item d-flex justify-content-between">
          <span>Total (USD)</span>
          <strong id="total-price">$${totalPrice}</strong>
        </li>
      </ul>

      <form class="card p-2">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Promo code" id="rebate-input">
          <button type="submit" class="btn btn-secondary" id="apply-promocode-button">Redeem</button>
        </div>
        <div id="rebates-container">
          ${generateRebatesLayout(rebates)}
        </div>
      </form>
        ${generateCheckoutButton(numerOfProductsInShoppingCard > 0)}
    </div>`;
}

function calculatePriceWithRebates(price, rebates = []) {
  return (price - price * rebates.reduce((a, b) => a + b.amount / 100, 0)).toFixed(2);
}

function updateTotalPriceInShoppingCart() {
  const shoppingCartProductsIds = shopStorageService.getProductsInShopingCard();
  const products = getProductsCardsFromProductIds(shoppingCartProductsIds);
  const totalPrice = +getTotalPriceFromProducsObject(products);
  const totalPriceWithRebates = calculatePriceWithRebates(totalPrice, state.appliedRebates);
  const totalPriceInShoppingCart = document.getElementById("total-price");
  totalPriceInShoppingCart.innerText = "$" + totalPriceWithRebates;
  state.totalPrice = totalPriceWithRebates;
}

function getTotalPriceFromProducsObject(products) {
  return Object.values(products)
    .reduce((res, p) => res + p.product.price * p.amount, 0)
    .toFixed(2);
}

function adjustProductAmount(productId, adding) {
  const amountInput = document.querySelector(`[data-product-id="${productId}"] [data-id="product-amount-in-shopping-cart"]`);
  if (amountInput.innerText <= 1 && adding < 0) return;
  amountInput.innerText = +amountInput.innerText + adding;
  adding > 0 ? shopStorageService.addProductToShopCard(productId) : shopStorageService.reduceProductAmountInShoppingCardByOne(productId);
  const newProductsAmount = updateShoppingCardBadge();
  updateTotalPriceInShoppingCart();
  document.getElementById("amount-of-products-in-cart").innerText = newProductsAmount;
}
