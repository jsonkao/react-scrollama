import React, { PureComponent } from 'react';

class Step extends PureComponent {
  state = {
    direction: null, // 'up' or 'down'
    state: null, // 'enter' or 'exit'
    offsetHeight: null,
  };

  componentDidMount() {
    const { isNew, updateIO } = this.props;
    if (isNew) {
      window.requestAnimationFrame(() => {
        console.log('mounted new step, starting observe...');
        this.updateOffsetHeight();
        updateIO();
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
    this.props.unobserveSelf();
  }

  render() {
    const { id } = this.props;
    if (!id) {
      return <div></div>;
    }
    if (this.props.isNew)
      console.log('rendering new step')
    return React.cloneElement(React.Children.only(this.props.children), {
      id,
      ref: this.domNode,
    });
  }
}

export default Step;
