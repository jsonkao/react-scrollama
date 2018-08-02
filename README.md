# React Scrollama

[![npm version](https://badge.fury.io/js/react-scrollama.svg)](https://badge.fury.io/js/react-scrollama)
[![Dependency Status](https://david-dm.org/jsonkao/react-scrollama.svg)](https://david-dm.org/jsonkao/react-scrollama)
[![devDependency Status](https://david-dm.org/jsonkao/react-scrollama/dev-status.svg)](https://david-dm.org/jsonkao/react-scrollama?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![codebeat badge](https://codebeat.co/badges/f8b8644b-fe07-4013-a1af-b0bfe8391530)](https://codebeat.co/projects/github-com-jsonkao-react-scrollama-master)

React Scrollama is a simple interface for scrollytelling that uses [IntersectionObserver](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) in favor of scroll events. It is adapted from Russel Goldenbeg's [Scrollama](https://github.com/russellgoldenberg/scrollama/) and was first introduced at [React NYC: HyHNuVaZJ](https://www.meetup.com/ReactNYC/events/251214926/) (watch the full talk [here](https://youtu.be/yf5wT2fRgEM?t=1h17m21s)).

## Installation

React Scrollama can be installed as an [npm package](https://www.npmjs.com/package/react-scrollama):
```
$ npm install react-scrollama
```

## Basic Usage

```js
import React, { PureComponent } from 'react';
import { Scrollama, Step } from 'react-scrollama';

class Graphic extends PureComponent {
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
          <Step data={1}>
            <p>step 1</p>
          </Step>
          <Step data={2}>
            <p>step 2</p>
          </Step>
        </Scrollama>
      </div>      
    );
  }
}
```
