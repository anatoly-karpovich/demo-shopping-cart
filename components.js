function generateProductCardLayout({ id, title, description, price }) {
  return `
  <div class="card me-5" style="width: 15rem;" data-card-id="${id}">
    <img src="..." class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text">${description}</p>
      <div class="d-flex justify-content-between">
        <span class="fs-5 text-primary">$${price}</span>
        <button class="btn btn-outline-primary" name="add-to-card" id="${id}">Add to card</button>
      </div>
    </div>
  </div>
  `;
}

function generateCheckoutButton(text, enable = false) {
  return `
  <div class="mt-3">
    <button class="w-100 btn btn-primary btn-lg" type="submit" id="${text.toLowerCase().split(" ").join("-")}-button" ${enable ? "" : "disabled"}>${text}</button>
  </div>`;
}

function updateShoppingCardBadge(amount) {
  const numberOfProductsInCart = amount ?? shopStorageService.getFullNumberOfProductsInCard();
  document.getElementById("badge-number").innerText = numberOfProductsInCart;
  return numberOfProductsInCart;
}
