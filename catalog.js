function renderCatalogPage(cards = initialProductCards) {
  generateProductsComponent(cards);
  updateShoppingCardBadge();
  addEventListenersToCatalogPage();
}

function generateProductsComponent(cards = initialProductCards) {
  const cardsLayout = cards.reduce((layout, card) => layout + generateProductCardLayout(card), "");
  const contentContainer = document.getElementById("content");
  const result = `<div class="d-flex justify-content-center mt-5" id="cards-container">${cardsLayout}</div>`;
  contentContainer.innerHTML = result;
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
