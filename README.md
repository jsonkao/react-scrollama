# React Scrollama

[![npm version](https://badge.fury.io/js/react-scrollama.svg)](https://badge.fury.io/js/react-scrollama)
[![Dependency Status](https://david-dm.org/jsonkao/react-scrollama.svg)](https://david-dm.org/jsonkao/react-scrollama)
[![devDependency Status](https://david-dm.org/jsonkao/react-scrollama/dev-status.svg)](https://david-dm.org/jsonkao/react-scrollama?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

React Scrollama is a simple interface for scrollytelling that uses [IntersectionObserver](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) in favor of scroll events. It is adapted from Russel Goldenbeg's [Scrollama](https://github.com/russellgoldenberg/scrollama/).

As seen in:
- [The scramble to secure America’s voting machines](https://www.politico.com/interactives/2019/election-security-americas-voting-machines) ([POLITICO](https://github.com/The-Politico))
- [Lower-income undergraduate students are paying more and more to attend Columbia; wealthier students are paying less and less, federal data shows](https://www.columbiaspectator.com/news/net-price-inequity) ([Columbia Daily Spectator](https://github.com/spec-journalism/))
- [In Certain Science and Engineering Fields, Sex Diversity Among Graduate Students Is Stagnating. In Others, It’s Getting Worse.](https://www.columbiaspectator.com/eye-lead/graduate-sex-diversity/) ([Columbia Daily Spectator](https://github.com/spec-journalism/))

## Demo

[Take a look at the demo.](https://jsonkao.github.io/react-scrollama/)

## Install

React Scrollama can be installed as an [npm package](https://www.npmjs.com/package/react-scrollama):
```
$ npm install react-scrollama
```

**Note: You must include the [IntersectionObserver polyfill](https://www.npmjs.com/package/intersection-observer) yourself for cross-browser support. Also consider including a [`position: sticky` polyfill](https://github.com/dollarshaveclub/stickybits).**

## Usage

A simple example with no frills.

```js
import React, { Component } from 'react';
import { Scrollama, Step } from 'react-scrollama';

class Graphic extends Component {
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

## API

#### `<Scrollama/>`

| Prop            | Type   | Default | Description                                                                            |
|-----------------|--------|---------|----------------------------------------------------------------------------------------|
| offset          | number | 0.5     | How far from the top of the viewport to trigger a step. Value between 0 and 1.         |
| debug           | bool   | false   | Whether to show visual debugging tools.                                                |
| progress        | bool   | false   | Whether to fire incremental step progress updates or not                               |
| onStepEnter     | func   |         | Callback that fires when the top or bottom edge of a step enters the offset threshold. |
| onStepExit      | func   |         | Callback that fires when the top or bottom edge of a step exits the offset threshold.  |
| onStepProgress  | func   |         | Callback that fires the progress a step has made through the threshold.                |

The `onStepEnter` and `onStepExit` callbacks receive one argument, an object, with the following properties:

```
{
  element, // The DOM node of the step that was triggered
  data, // The data supplied to the step
  direction, // 'up' or 'down'
}
```

The `onStepProgress` callback receives one argument, an object, with the following properties:

```
{
  element, // The DOM node of the step that was triggered
  data, // The data supplied to the step
  progress, // The percent of completion of the step (0 to 1)
}
```

#### `<Step/>`

| Prop     | Type           | Default     | Description                                                      |
|----------|----------------|-------------|------------------------------------------------------------------|
| data     | any            | _undefined_ | Data to be given to `<Scrollama>` callbacks when step triggered. |
| children | PropTypes.node |    N/A      | Children must always be one component, not an array              |

## Features roadmap

* Preserving order
* `viewportAbove` and `viewportBelow` intersection observers

## Contributing

All contributions are welcome. To setup the project:
1. Fork and clone the repository.
2. `npm install` both in the library and the `example/`.
3. `npm start` both in the library and the `example/`.

The docs page will then be served on http://localhost:3000.

To push the example build up to `gh-pages`, run `npm run predeploy` and `npm run deploy`.

### Contributors

* [jsonkao](https://github.com/jsonkao)
* [NicholasLYang](https://github.com/NicholasLYang)
* [jonesbp](https://github.com/jonesbp)
* [kennethormandy](https://github.com/kennethormandy)
* [cedricdelpoux](https://github.com/cedricdelpoux)

## License

MIT
