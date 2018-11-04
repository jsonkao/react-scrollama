import React, { PureComponent } from 'react';

class Step extends PureComponent {
  state = {
    direction: null, // 'up' or 'down'
    state: null, // 'enter' or 'exit'
    offsetHeight: null,
  };

  componentDidMount() {
    const { isNew, addSelf } = this.props;
    if (isNew) {
      window.requestAnimationFrame(() => {
        this.updateOffsetHeight();
        addSelf();
      });
    }
  }

  domNode = React.createRef();

  getDOMNode = () => this.domNode.current;

  getData = () => this.props.data;

  updateOffsetHeight = () => {
    this.setState({ offsetHeight: this.domNode.current.offsetHeight });
  };

  enter = direction => this.setState({ state: 'enter', direction });

  exit = direction => this.setState({ state: 'exit', direction });

  componentWillUnmount() {
    this.props.removeSelf();
  }

  render() {
    const { id, children } = this.props;
    return React.cloneElement(React.Children.only(children), {
      id,
      ref: this.domNode,
    });
  }
}

export default Step;
