
import React from 'react';
import ReactDOM from 'react-dom';

import Rating from './components/rating';

const storage = chrome.storage.local;
const CART_SELECTOR = '.desktop-cart'; // div with vendor data
const CART_ORDER_SELECTOR = '.desktop-cart__order'; // div with orders
const CART_ITEM_SELECTOR = '.summary__item__row_desktop .summary__item__name'; // div order item
const CHECKOUT_BUTTON_ID = 'checkout-finish-and-pay-button';
const CHECKOUT_CLASS = 'checkout';
const CHECKOUT_BUTTON_DISABLED_CLASS = 'button--disabled';
const MENU_CLASS = 'menu';
const MENU_RESTAURANT_SELECTOR = '.menu__list-wrapper';
const MENU_ITEM_SELECTOR = '.menu__item';

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

function makeHistoryItem(item, vendor, ts, orderId) {
  const itemId = `${orderId}-${item.label}`;
  return {
    orderId,
    itemId,
    label: item.label,
    variations: item.variations,
    vendorId: vendor.id,
    vendorCode: vendor.code,
    vendorName: vendor.name,
    vendorCategory: vendor.category,
    addedAt: ts
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

function processOrder() {
  const order = document.querySelector(CART_ORDER_SELECTOR);
  if (order) {
    // cart found, looking for items in it
    const items = Array.prototype.map.call(order.querySelectorAll(CART_ITEM_SELECTOR),
      parseItemNode);

    // getting vendor metadata
    const cart = document.querySelector(CART_SELECTOR);
    const vendor = JSON.parse(cart.dataset.vendor);

    // save order in history
    if (vendor !== null && items.length > 0) {
      const now = +new Date;
      const orderId = `${now}-${vendor.id}`;
      addItemsToHistory(items.map((item) => makeHistoryItem(item, vendor, now, orderId)));
    } else {
      console.log('No vendor or items found');
    }
  }
}

function handleClickCheckout(ev) {
  const testing = false;
  if (testing === ev.currentTarget.classList.contains(CHECKOUT_BUTTON_DISABLED_CLASS)) {
    processOrder();
  }
}

function injectRatings(ratings) {
  // find menu item
  const items = document.querySelectorAll(MENU_ITEM_SELECTOR);
  Array.prototype.forEach.call(items, (item) => {
    const data = JSON.parse(item.dataset.object);
    ratings.forEach(rating => {
      if (rating.label === data.name) {
        console.log(`Rating found for ${rating.label}`);
        const container = document.createElement('div');
        container.setAttribute('style', 'display: table-cell; vertical-align: middle;');
        item.appendChild(container);
        ReactDOM.render(<Rating readOnly rating={rating.rating} />, container);
      }
    });
  });
}

function checkHistoryForRatings() {
  // get restaurant ID
  const menu = document.querySelector(MENU_RESTAURANT_SELECTOR);
  const vendor = JSON.parse(menu.dataset.vendor);

  // check history
  if (vendor && vendor.code) {
    storage.get('history', (result) => {
      const history = result.history || [];
      const ratings = history.filter(item => item.vendorCode === vendor.code && item.rating);
      if (ratings.length > 0) {
        console.log(`${ratings.length} rating(s) found for ${vendor.name}`);
        injectRatings(ratings);
      } else {
        console.log(`No ratings found for ${vendor.name}`);
      }
    });
  } else {
    console.log('Vendor not found');
  }
}


/**
 * Start a DOM mutation observer that looks for elements appearing
 */
function startDOMObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((record) => {
      Array.prototype.forEach.call(record.addedNodes, (node) => {
        if (node.nodeType === node.ELEMENT_NODE) {
          if (node.classList.contains(CHECKOUT_CLASS)) {
            const checkoutButton = document.getElementById(CHECKOUT_BUTTON_ID);
            if (checkoutButton) {
              console.log('checkout button appeared, registering order handler');
              // TODO unregister when going back
              checkoutButton.addEventListener('click', handleClickCheckout);
            }
          } else if (node.classList.contains(MENU_CLASS)) {
            // menu found, inject ratings if we have some
            checkHistoryForRatings();
          }
        }
      });
    });
  });

  observer.observe(document, {
    subtree: true,
    childList: true
  });
}

// storage.clear();
// kick things off by starting observer
startDOMObserver();
