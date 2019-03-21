# React Scrollama

## V2 inconsistencies
- Scrollama returns { element, index, direction }. But in React, it's a lot easier to store data in an element, so we just use { element, data, direction }.

[![npm version](https://badge.fury.io/js/react-scrollama.svg)](https://badge.fury.io/js/react-scrollama)
[![Dependency Status](https://david-dm.org/jsonkao/react-scrollama.svg)](https://david-dm.org/jsonkao/react-scrollama)
[![devDependency Status](https://david-dm.org/jsonkao/react-scrollama/dev-status.svg)](https://david-dm.org/jsonkao/react-scrollama?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

React Scrollama is a simple interface for scrollytelling that uses [IntersectionObserver](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) in favor of scroll events. It is adapted from Russel Goldenbeg's [Scrollama](https://github.com/russellgoldenberg/scrollama/) and was first introduced at React NYC: HyHNuVaZJ (watch the full talk [here](https://www.youtube.com/watch?v=zR_LDPLMUvE)).

As seen on [The Columbia Daily Spectator](columbiaspectator.com):
- [Net price inequities in the School of General Studies](https://www.columbiaspectator.com/news/net-price-inequity/)

## Demo

[Take a look at the demo](https://jsonkao.github.io/react-scrollama/)

## Installation

React Scrollama can be installed as an [npm package](https://www.npmjs.com/package/react-scrollama):
```
$ npm install react-scrollama
```

## Basic Usage

A simple example with no frills.

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
            step 1
          </Step>
          <Step data={2}>
            step 2
          </Step>
        </Scrollama>
      </div>      
    );
  }
}
```

## Examples

- [**Dynamic**](https://jsonkao.github.io/react-scrollama/) - Pushing and popping steps


## API

#### `<Scrollama/>`

| Prop        | Type   | Default | Description                                                                            |
|-------------|--------|---------|----------------------------------------------------------------------------------------|
| offset      | number | 0.5     | How far from the top of the viewport to trigger a step. Value between 0 and 1.         |
| debug       | bool   | false   | Whether to show visual debugging tools.                                                |
| onStepEnter | func   |         | Callback that fires when the top or bottom edge of a step enters the offset threshold. |
| onStepExit  | func   |         | Callback that fires when the top or bottom edge of a step exits the offset threshold.  |

The `onStepEnter` and `onStepExit` callbacks receive one argument, an object, with the following properties:

```
{
  element, // The DOM node of the step that was triggered
  data, // The data supplied to the step
  direction, // 'up' or 'down'
}
```

#### `<Step/>`

| Prop     | Type           | Default     | Description                                                      |
|----------|----------------|-------------|------------------------------------------------------------------|
| data     | any            | _undefined_ | Data to be given to `<Scrollama>` callbacks when step triggered. |
| children | PropTypes.node |    N/A      | Children must always be one component, not an array
## Contributing

You're welcome to contribute to React Scrollama. To setup the project:
1. Fork and clone the repository.
2. `npm install`
3. `npm run dev`

The docs page will then be served on http://localhost:8000/ in watch mode, meaning you don't have refresh the page to see your changes.

## License

MIT
