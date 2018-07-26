import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

class Step extends PureComponent {
  state = {
    direction: null, // 'up' or 'down'
    state: null, // 'enter' or 'exit'
    offsetHeight: null,
  };

  updateOffsetHeight = () => {
    this.setState({ offsetHeight: ReactDOM.findDOMNode(this).offsetHeight });
  };

  enter = direction => this.setState({ state: 'enter', direction });

  exit = direction => this.setState({ state: 'exit', direction });

  render() {
    const { id } = this.props;
    return React.cloneElement(React.Children.only(this.props.children), { id });
  }
}

export default Step;
