
const storage = chrome.storage.local;
const CART_CONTAINER_CLASS = 'desktop-cart-container'; // added to page
const CART_CLASS = 'desktop-cart'; // div with vendor data
const CART_ORDER_CLASS = 'desktop-cart__order'; // div with orders
const CART_ITEM_CLASS = 'summary__item__name'; // div order item

function addItemsToHistory(items) {
  storage.get('history', (result) => {
    const history = result.history || [];
    items.forEach(item => {
      history.push(item);
    });
    storage.set({ history }, () => {
      console.log('saved items', history);
    });
  });
}

function makeHistoryItem(item, vendor) {
  return {
    label: item.label,
    variations: item.variations,
    vendorId: vendor.id,
    vendorCode: vendor.code,
    vendorName: vendor.name,
    vendorCategory: vendor.category,
    addedAt: +new Date
  };
}

function parseItemNode({ childNodes }) {
  let label;
  const variations = [];
  Array.prototype.forEach.call(childNodes, (node, i) => {
    if (i === 0) {
      label = node.textContent.trim();
    } else {
      const variation = node.textContent.replace('+', '').trim();
      if (variation) {
        variations.push(variation);
      }
    }
  });
  return { label, variations };
}

function processOrder(order) {
  // cart found, looking for items in it
  const items = Array.prototype.map.call(order.getElementsByClassName(CART_ITEM_CLASS),
    parseItemNode);

  // getting vendor metadata
  let vendor = null;
  const carts = document.getElementsByClassName(CART_CLASS);
  Array.prototype.forEach.call(carts, (cart) => {
    vendor = JSON.parse(cart.dataset.vendor);
  });

  // save order in history
  if (vendor !== null && items.length > 0) {
    addItemsToHistory(items.map((item) => makeHistoryItem(item, vendor)));
  } else {
    console.log('No vendor or items found');
  }
}

/**
 * Start a DOM mutation observer that looks for a shopping cart
 */
function startCartObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((record) => {
      Array.prototype.forEach.call(record.addedNodes, (node) => {
        if (node.nodeType === node.ELEMENT_NODE && node.className === CART_CONTAINER_CLASS) {
          // check if the cart appeared
          const orders = node.getElementsByClassName(CART_ORDER_CLASS);
          Array.prototype.forEach.call(orders, processOrder);
        }
      });
    });
  });

  observer.observe(document, {
    subtree: true,
    childList: true
  });
}

storage.clear();
// kick things off by starting observer
startCartObserver();