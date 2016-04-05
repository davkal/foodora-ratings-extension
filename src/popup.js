require('./popup.less');

import React from 'react';
import ReactDOM from 'react-dom';

import Rating from './components/rating';

const storage = chrome.storage.local;

function groupByOrderId(history) {
  const items = history.slice();
  items.reverse();
  const results = [];
  let currentOrder;

  items.forEach(item => {
    if (currentOrder !== item.orderId) {
      results.push([]);
    }
    currentOrder = item.orderId;
    const orderItems = results[results.length - 1];
    orderItems.push(item);
  });

  return results;
}

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      history: []
    };
    this.handleItemRating = this.handleItemRating.bind(this);
  }

  componentDidMount() {
    storage.get('history', (result) => {
      const history = result.history || [];
      this.setState({ history });
    });
  }

  handleItemRating(nextItem, rating) {
    const { history } = this.state;
    const index = history.indexOf(nextItem);
    const item = history[index];
    if (item) {
      item.rating = rating;
      storage.set({ history }, () => {
        this.setState({ history });
      });
    }
  }

  renderItem(item) {
    const hasVariations = item.variations.length > 0;
    return (
      <div className="history-item" key={item.label}>
        <div className="history-item-ratings">
          <Rating rating={item.rating} item={item} onRating={this.handleItemRating} />
        </div>
        <div className="history-item-label">{item.label}</div>
        {hasVariations
          && <div className="history-item-variations">{item.variations.join(', ')}</div>}
      </div>
    );
  }

  renderOrder(order) {
    const first = order[0];

    return (
      <div className="history-order" key={first.orderId}>
        <div className="history-order-vendor">
          {first.vendorName}
        </div>
        <div className="history-order-items">
          {order.map(item => this.renderItem(item))}
        </div>
      </div>
    );
  }

  render() {
    const items = groupByOrderId(this.state.history);
    console.log(items);
    return (
      <div className="app">
        <div className="app-header">Foodora Order History</div>
        <div className="app-section">
          <div className="history">
            {items.map(order => this.renderOrder(order))}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
