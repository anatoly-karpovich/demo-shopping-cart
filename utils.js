function getNumberOfProductsInProductsInShoppingCart(products) {
  return Object.values(products).reduce((amount, product) => amount + product, 0);
}

function enableOrDisableElement(element, enable = true) {
  enable ? element.removeAttribute("disabled") : element.setAttribute("disabled", "");
}

async function sendRebatesRequest(rebate) {
  const localUrl = "http://localhost:5000";
  const prodUrl = "https://aqa-course-project.app";
  const res = await fetch(`${prodUrl}/api/promocodes/${rebate}`);
  hideSpinner();
  const response = await res.json();
  return response;
}

function showSpinner() {
  const spinner = document.querySelector(`.overlay`);
  spinner.style.display = "block";
}

function hideSpinner() {
  const spinner = document.querySelector(`.overlay`);
  spinner.style.display = "none";
}
/**
 * Добро пожаловать в утилиты:)
 * код: 5-PERCENT-FOR-UTILS
 */
