require('./popup.less');

import React from 'react';
import ReactDOM from 'react-dom';

import Rating from './components/rating';

const storage = chrome.storage.local;

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

  handleItemRating(index, rating) {
    const { history } = this.state;
    const item = history[index];
    if (item) {
      item.rating = rating;
      if (!item.orderId) {
        item.orderId = `${item.vendorId}-${item.addedAt}`;
      }
      storage.set({ history }, () => {
        this.setState({ history });
      });
    }
  }

  renderItem(item, index) {
    const hasVariations = item.variations.length > 0;
    return (
      <div className="history-item" key={item.label}>
        <div className="history-item-ratings">
          <Rating rating={item.rating} index={index} onRating={this.handleItemRating} />
        </div>
        <div className="history-item-label">{item.label}</div>
        {hasVariations
          && <div className="history-item-variations">{item.variations.join(', ')}</div>}
      </div>
    );
  }

  render() {
    const items = this.state.history;
    return (
      <div className="app">
        <div className="app-header">Foodora Order History</div>
        <div className="app-section">
          <div className="history">
            {items.map((item, index) => this.renderItem(item, index))}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
