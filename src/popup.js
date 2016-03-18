require('./popup.less');

import React from 'react';
import ReactDOM from 'react-dom';

const storage = chrome.storage.local;

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      history: []
    };
  }

  componentDidMount() {
    storage.get('history', (result) => {
      const history = result.history || [];
      this.setState({ history });
    });
  }

  renderItem(item) {
    const hasVariations = item.variations.length > 0;
    return (
      <div className="history-item" key={item.label}>
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
            {items.map(item => this.renderItem(item))}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
