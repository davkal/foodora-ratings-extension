import React from 'react';

const STAR_PATH = 'M18.447,7.694l-4.024,3.942l0.952,5.539c0,0.049,0,0.127,0,0.227'
  + 'c0,0.156-0.037,0.287-0.118,0.387'
  + 'c-0.077,0.105-0.185,0.158-0.33,0.158s-0.29-0.049-0.443-0.133L9.49,15.211'
  + 'l-4.974,2.604c-0.167,0.084-0.317,0.133-0.446,0.133'
  + 'c-0.153,0-0.269-0.053-0.348-0.158c-0.079-0.1-0.121-0.23-0.121-0.387'
  + 'c0-0.053,0.009-0.129,0.023-0.227l0.952-5.539L0.536,7.694'
  + 'c-0.18-0.195-0.272-0.37-0.272-0.523c0-0.273,0.208-0.441,0.623-0.507'
  + 'L6.46,5.85L8.947,0.8C9.089,0.489,9.268,0.333,9.49,0.333'
  + 'c0.23,0,0.416,0.156,0.544,0.467l2.506,5.05l5.572,0.814c0.415,0.065,0.625,0.233,0.625,0.507'
  + 'C18.737,7.324,18.639,7.499,18.447,7.694z';

export default class Star extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  handleClick(ev) {
    ev.preventDefault();
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.value, this.props.payload);
    }
  }

  handleMouseOver(ev) {
    ev.preventDefault();
    if (this.props.onItemMouseOver) {
      this.props.onItemMouseOver(this.props.value);
    }
  }

  render() {
    const { rating, size, value } = this.props;
    const transform = `translate(${(value - 1) * size}, 0)`;
    const style = {
      fill: '#d706f4',
      fillOpacity: 0.3
    };
    if (value <= rating) {
      style.fillOpacity = 1;
    }

    return (
      <path style={style} transform={transform} d={STAR_PATH}
        onClick={this.handleClick} onMouseOver={this.handleMouseOver} />
    );
  }

}

Star.SIZE = 19;
