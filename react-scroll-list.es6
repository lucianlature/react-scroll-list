import React from 'react';

const LIVE_INTERVAL = 500;
const IS_TOUCH_DEVICE = true;

export default class extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(next) {
    let {itemsPerRow, from, size} = this.state;
    const {length, pageSize} = next;
    from = this.constrainFrom(from, length, itemsPerRow);
    size = this.constrainSize(size, length, pageSize, from);
    this.setState({from, size});
  }

  componentDidMount() {
    this.scrollParent = this.getScrollParent();
    this.updateFrame = this.updateFrame.bind(this);
    window.addEventListener('resize', this.updateFrame);
    this.scrollParent.addEventListener('scroll', this.updateFrame);
    this.updateFrame();
    const {initialIndex} = this.props;
    if (initialIndex == null) return;
    this.afId = requestAnimationFrame(this.scrollTo.bind(this, initialIndex));
  }

  shouldComponentUpdate(props, state) {
    return !isEqual(props, this.props) || !isEqual(state, this.state);
  }

  componentDidUpdate() {
    this.updateFrame();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateFrame);
    this.scrollParent.removeEventListener('scroll', this.updateFrame);
    cancelAnimationFrame(this.afId);
  }

  renderItems() {
    const {from, size} = this.state;
    const items = [];
    for (let i = 0; i < size; ++i) {
      items.push(this.props.itemRenderer(from + i, i));
    }
    return this.props.itemsRenderer(items, c => this.items = c);
  }

  render() {
    const items = this.renderItems();
    return (
      <div>{items}</div>
    );
  }
}
