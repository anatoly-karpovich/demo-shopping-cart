function renderCheckoutPage() {
  const layout = generateDemoCheckoutPageLayout();
  const contentContainer = document.getElementById("content");
  contentContainer.innerHTML = layout;
  state.totalPrice = 0;
  state.appliedRebates.length = 0;
  shopStorageService.removeAllProductsFromShopCard();
  updateShoppingCardBadge();
}

function generateDemoCheckoutPageLayout() {
  return `
    <div class="d-flex justify-content-center mt-5">
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Checkout</span>
          <span class="badge bg-primary rounded-pill">${shopStorageService.getFullNumberOfProductsInCard()}</span>
        </h4>
        <ul class="list-group mb-3">
          <li class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">Total:</h6>
            </div>
            <span class="text-muted">$${state.totalPrice}</span>
          </li>
        </ul>
        <div class="d-flex justify-content-center">
          <span class="fs-4 text-primary fw-bold">Thanks for ordering!</span>
        </div>
      </div>
    </div>
    <div class="d-none">Code in SHA 1: 9c4218e5d95c7b3dafe8d0053b0a4e8671eb9b62</div>
  `;
}
