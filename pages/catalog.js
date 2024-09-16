function renderCatalogPage(cards = initialProductCards) {
  generateProductsComponent(cards);
  updateShoppingCardBadge();
  addEventListenersToCatalogPage();
  state.appliedRebates = [];
}

function generateProductsComponent(cards = initialProductCards) {
  const cardsLayout = generateProductCardsLayout(cards);
  const contentContainer = document.getElementById("content");
  const result = `<div class=" mt-5" id="cards-container">${cardsLayout}</div>`;
  contentContainer.innerHTML = result;
}

function generateProductCardsLayout(cards) {
  const rowGenerator = (rowLayout) => `<div class="mb-5 d-flex justify-content-center">${rowLayout}</div>`;
  let result = "";
  let row = "";
  for (let i = 1; i <= cards.length; i++) {
    row += generateProductCardLayout(cards[i - 1]);
    if (!(i % 5)) {
      result += rowGenerator(row);
      row = "";
    }
  }
  if (row) {
    result += rowGenerator(row);
  }
  return result;
}

function addEventListenersToCatalogPage() {
  const cardsContainer = document.getElementById("cards-container");
  const shoppingCardButton = document.getElementById("shopping-cart-btn");

  //Cards
  cardsContainer.addEventListener("click", (event) => {
    event.preventDefault();
    //Add product to cart
    if (event.target.name === "add-to-card") {
      const updatedProducts = shopStorageService.addProductToShopCard(event.target.id);
      updateShoppingCardBadge(updatedProducts.length);
    }
  });

  //Shopping Cart
  shoppingCardButton.addEventListener("click", (event) => {
    event.preventDefault();
    renderShoppingCartPage();
  });
}
