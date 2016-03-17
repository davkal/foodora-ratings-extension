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
    return <div>{item.label}</div>;
  }

  render() {
    const items = this.state.history;
    return (
      <div className="app">
        <div className="app-header">
          <h1>Foodora Order History</h1>
        </div>
        <div className="app-content">
          {items.map(item => this.renderItem(item))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
