renderCatalogPage();
setInitialIncentives();
function addEventListenersToHeader() {}

function setInitialIncentives() {
  shopStorageService.setRebates(incentives);
}
