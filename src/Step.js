import React, { Component } from 'react';

class Step extends Component {
  state = {
    direction: null, // 'up' or 'down'
    state: null, // 'enter' or 'exit'
    offsetHeight: null,
    progress: 0,
  };

  nodeRef = React.createRef();

  getDOMNode = () => this.nodeRef.current;

  getData = () => this.props.data;

  updateOffsetHeight = () =>
    this.setState({
      offsetHeight: this.getDOMNode().offsetHeight,
    });

  enter = direction => this.setState({ state: 'enter', direction });
  exit = direction => this.setState({ state: 'exit', direction });
  progress = progress => this.setState({ progress });

  render() {
    const { scrollamaId, children } = this.props;

    return React.cloneElement(React.Children.only(children), {
      // place attribuet on child to retrieve id from the raw DOM node (which
      // is what the intersection observer gives our callback
      'data-react-scrollama-id': scrollamaId,

      // place ref on child to calculate offsets
      ref: this.nodeRef,
    });
  }
}

export default Step;
