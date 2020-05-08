import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

class Step extends Component {
  state = {
    direction: null, // 'up' or 'down'
    state: null, // 'enter' or 'exit'
    offsetHeight: null,
    progress: 0,
  };

  nodeRef = React.createRef();

  getDOMNode = () => this.nodeRef.current instanceof HTMLElement ? this.nodeRef.current : findDOMNode(this);

  getData = () => this.props.data;

  updateOffsetHeight = () =>
    this.setState({ offsetHeight: this.getDOMNode().offsetHeight });

  enter = direction => this.setState({ state: 'enter', direction });
  exit = direction => this.setState({ state: 'exit', direction });
  progress = progress => this.setState({ progress });

  componentDidMount() {
    console.log(this.nodeRef, this.nodeRef.current instanceof HTMLElement, findDOMNode(this))
  }

  render() {
    /**
     * The child right now has to be a DOM element because we're only placing
     * a ref on the container. So if we pass a text node into Step or a
     * React component, that ref is on the class, not the underlying Dom
     * component. Right now the DOM component would have to forward its ref
     * to its DOM child.
     */
    const { id, children } = this.props;

    return React.cloneElement(React.Children.only(children), {
      // place id on child to retrieve id from the raw DOM node (which
      // is what the intersection observer gives our callback
      id,

      // place ref on child to calculate offsets
      ref: this.nodeRef,
    });
  }
}

export default Step;
