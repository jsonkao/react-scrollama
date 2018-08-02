import React, { PureComponent } from 'react';

class Step extends PureComponent {
  state = {
    direction: null, // 'up' or 'down'
    state: null, // 'enter' or 'exit'
    offsetHeight: null,
  };

  domNode = React.createRef();

  getDOMNode = () => this.domNode.current;

  getData = () => this.props.data;

  updateOffsetHeight = () => {
    this.setState({ offsetHeight: this.domNode.current.offsetHeight });
  };

  enter = direction => this.setState({ state: 'enter', direction });

  exit = direction => this.setState({ state: 'exit', direction });

  render() {
    const { id } = this.props;
    return React.cloneElement(React.Children.only(this.props.children), { id, ref: this.domNode });
  }
}

export default Step;
