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

  handleMouseOverItem(value) {
    const hoverRating = value;
    this.setState({ hoverRating });
  }

  handleMouseLeave(ev) {
    ev.preventDefault();
    const hoverRating = 0;
    this.setState({ hoverRating });
  }

  handleClickItem(value, payload) {
    if (this.props.onRating) {
      this.props.onRating(payload, value);
    }
  }

  render() {
    const { hoverRating } = this.state;
    const { item, rating, readOnly } = this.props;
    const currentRating = hoverRating || rating;
    const ratingValues = [1, 2, 3, 4, 5];
    return (
      <svg preserveAspectRatio="xMinYMin meet" version="1.1" xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${ratingValues.length * Star.SIZE} ${Star.SIZE}`}
        width={ratingValues.length * ITEM_SIZE} height={ITEM_SIZE}
        onMouseLeave={this.handleMouseLeave}
      >
        {ratingValues.map(ratingValue => <Star
          onItemMouseOver={readOnly ? null : this.handleMouseOverItem}
          onItemClick={readOnly ? null : this.handleClickItem}
          payload={item}
          value={ratingValue}
          rating={currentRating}
          size={ITEM_SIZE}
          key={ratingValue}
          />)}
      </svg>
    );
  }

}
