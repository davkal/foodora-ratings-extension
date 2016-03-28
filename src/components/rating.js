import React from 'react';

import Star from './star';

const ITEM_SIZE = 16;

export default class Rating extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      hoverRating: 0
    };
    this.handleMouseOverItem = this.handleMouseOverItem.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClickItem = this.handleClickItem.bind(this);
  }

  handleMouseOverItem(item) {
    const hoverRating = item;
    this.setState({ hoverRating });
  }

  handleMouseLeave(ev) {
    ev.preventDefault();
    const hoverRating = 0;
    this.setState({ hoverRating });
  }

  handleClickItem(item) {
    if (this.props.onRating) {
      this.props.onRating(this.props.index, item);
    }
  }

  render() {
    const { hoverRating } = this.state;
    const { rating } = this.props;
    const currentRating = hoverRating || rating;
    const items = [1, 2, 3, 4, 5];
    return (
      <svg preserveAspectRatio="xMinYMin meet" version="1.1" xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${items.length * Star.SIZE} ${Star.SIZE}`}
        width={items.length * ITEM_SIZE} height={ITEM_SIZE} onMouseLeave={this.handleMouseLeave}
      >
        {items.map(item => <Star
          onItemMouseOver={this.handleMouseOverItem}
          onItemClick={this.handleClickItem}
          item={item}
          rating={currentRating}
          size={ITEM_SIZE}
          key={item}
          />)}
      </svg>
    );
  }

}
