import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import { Scrollama, Step } from 'react-scrollama';

/* let MyComponent = React.forwardRef((props, ref) => {
  const { i, d } = props;
  return (
    <div style={{ margin: '50vh 0' }} ref={ref}>
      <p>
        step index = {i}; data value = {d}
      </p>
    </div>
  );
}); */

class MyComponent extends Component {
  render() {
    const { d, i } = this.props;
    return (
      <div style={{ margin: '50vh 0' }}>
        <p>
          step index = {i}; data value = {d}
        </p>
      </div>
    );
  }
}

class Graphic extends Component {
  state = {
    data: 0,
  };

  onStepEnter = ({ data }) => this.setState({ data });

  render() {
    const { data } = this.state;

    return (
      <div>
        <p style={{ position: 'sticky', top: 0 }}>data: {data}</p>
        <Scrollama onStepEnter={this.onStepEnter} debug>
          {[1, 2, 3, 4].map((d, i) => (
            <Step data={d} key={i}>
              {i % 2 === 0 ? (
                <div style={{ margin: '50vh 0' }}>
                  <p>
                    step index = {i}; data value = {d}
                  </p>
                </div>
              ) : (
                <MyComponent d={d} i={i} />
              )}
            </Step>
          ))}
        </Scrollama>
      </div>
    );
  }
}

ReactDOM.render(<Graphic />, document.getElementById('root'));
