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
  });
}

function generateShoppingCartProductLayout(product, amount) {
  return `
    <div data-product-id="${product.id}">
      <div>
        <h5 class="my-0 fw-bold">${product.title}</h5>
        <small class="text-muted">${product.description}</small>
      </div>
      <div class="mt-2 d-flex justify-content-start">
        <span class="me-2 fw-bold">Amount: </span>
        <span>${amount}</span>
      </div>
    </div>
    <div class="d-flex align-items-center">
      <span class="text-muted fw-bold">$${product.price}</span>
    </div>
  `;
}

function addRebateToCart(rebateCode) {
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

function generateShoppingCartLayout(productIds, rebates = []) {
  const productCards = structuredClone(initialProductCards);
  const products = productIds.reduce((res, id) => {
    const productData = structuredClone(productCards.find((el) => el.id === id));
    if (!res[id]) res[id] = { product: productData, amount: 0 };
    res[id].amount++;
    return res;
  }, {});

  const productsList = Object.values(products).reduce(
    (res, p) => res + `<li class="list-group-item d-flex justify-content-between lh-sm">${generateShoppingCartProductLayout(p.product, p.amount)}</li>`,
    ""
  );

  let totalPrice = Object.values(products).reduce((res, p) => res + p.product.price * p.amount, 0);
  if (rebates.length) {
    totalPrice = applyRebatesToPrice(totalPrice, rebates);
  }

  return `
    <div class="col-md-5 col-lg-4 order-md-last">
      <h4 class="d-flex justify-content-between align-items-center mb-3">
        <span class="text-primary">Your cart</span>
        <span class="badge bg-primary rounded-pill">${productIds.length}</span>
      </h4>
      <ul class="list-group mb-3">
        ${productsList}
        <li class="list-group-item d-flex justify-content-between">
          <span>Total (USD)</span>
          <strong>$${totalPrice.toFixed(2)}</strong>
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
    </div>`;
}

function applyRebatesToPrice(price, rebates = []) {
  return (price - price * rebates.reduce((a, b) => a + b.amount / 100, 0)).toFixed(2);
}
