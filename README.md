# react-scrollama

React Scrollama is a simple interface for scrollytelling. It uses [IntersectionObserver](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) in favor of scroll events, and is largely based off of Russel Goldenberg's [Scrollama](https://github.com/russellgoldenberg/scrollama/) library.

## Installation

React Scrollama can be installed as an [npm package](https://www.npmjs.com/package/react-scrollama):
```
$ npm install react-scrollama
```

## Basic Usage

```js
import React, { PureComponent } from 'react';
import { Scrollama, Step } from 'react-scrollama';

class Example extends PureComponent {
  state = {
    data: 0,
  };
  
  onStepEnter = ({ element, data, direction }) => this.setState({ data });
  
  render() {
    const { data } = this.state;
    
    return (
      <div>
        <p>data: {data}</p>
        <Scrollama onStepEnter={this.onStepEnter}>
          <Step datum={1}>
            <p>step 1</p>
          </Step>
          <Step datum={2}>
            <p>step 2</p>
          </Step>
        </Scrollama>
      </div>      
    );
  }
}
```