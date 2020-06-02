# React Scrollama

<p align="left">
  <a href="https://www.npmjs.com/package/react-scrollama">
    <img src="https://img.shields.io/npm/v/react-scrollama.svg" alt="npm version"/>
  </a>
  <a href="https://david-dm.org/jsonkao/react-scrollama">
    <img src="https://img.shields.io/david/jsonkao/react-scrollama" alt="dependency status"/>
  </a>
</p>

React Scrollama is a lightweight interface for scrollytelling that uses [IntersectionObserver](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) in favor of scroll events. It is adapted from Russel Goldenbeg's [Scrollama](https://github.com/russellgoldenberg/scrollama/).

As seen in:
- [Sex Diversity Among Graduate Students Is Stagnating](https://www.columbiaspectator.com/eye-lead/graduate-sex-diversity/) ([Columbia Daily Spectator](https://github.com/graphicsdesk))
- [The scramble to secure America’s voting machines](https://www.politico.com/interactives/2019/election-security-americas-voting-machines) ([POLITICO](https://github.com/The-Politico))
- [Lower-income undergraduate students are paying more and more to attend Columbia; wealthier students are paying less and less, federal data shows](https://www.columbiaspectator.com/news/net-price-inequity) ([Columbia Daily Spectator](https://github.com/graphicsdesk))

## Demo

Take a look at [the demo](https://jsonkao.github.io/react-scrollama), presented at [ReactNYC](https://www.youtube.com/watch?v=zR_LDPLMUvE).

## Install

React Scrollama can be installed as an [npm package](https://www.npmjs.com/package/react-scrollama):
```
$ npm install react-scrollama
```

**Note: As of version 2.2.0, the [IntersectionObserver polyfill](https://www.npmjs.com/package/intersection-observer) has been removed from the build. You must include it yourself for cross-browser support.** Check [here](https://caniuse.com/#feat=intersectionobserver) to see if you need to include the polyfill.

## Usage

A no-frills example:

```js
import React, {useState} from 'react'
import {Scrollama, Step} from 'react-scrollama'

const ScrollamaDemo = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(null)
  
  // When a Scrollama Step is triggered the callback receives its data prop, which in this demo stores the step index.
  const onStepEnter = ({ data }) => {
    setCurrentStepIndex(data) 
  }
  
  return (
    <div style={{ margin: '50vh 0', border: '2px dashed skyblue' }}>
      <div style={{ position: "sticky", top: 0, border: '1px dashed orchid' }}>
        I'm sticky. The current triggered step index is: {currentStepIndex}
      </div>
      <Scrollama onStepEnter={onStepEnter} debug>
        {[1, 2, 3, 4].map((_, stepIndex) => (
          <Step data={stepIndex} key={stepIndex}>
            <div style={{ margin: '50vh 0', border: '1px dashed gray', opacity: currentStepIndex === stepIndex ? 1 : 0.2 }}>
              I'm a Scrollama Step of index {stepIndex}.
            </div>
          </Step>
        ))}
      </Scrollama>
    </div>
  )
}

export default ScrollamaDemo
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

```js
{
  element, // The DOM node of the step that was triggered
  data, // The data supplied to the step
  direction, // 'up' or 'down'
}
```

The `onStepProgress` callback receives one argument, an object, with the following properties:

```js
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

## Contributors

* [jsonkao](https://github.com/jsonkao)
* [NicholasLYang](https://github.com/NicholasLYang)
* [jonesbp](https://github.com/jonesbp)
* [kennethormandy](https://github.com/kennethormandy)
* [cedricdelpoux](https://github.com/cedricdelpoux)

## License

MIT
