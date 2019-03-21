import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
import { getPageHeight } from './utils';

const OBSERVER_NAMES = [
  'stepAbove',
  'stepBelow',
  'stepProgress',
  'viewportAbove',
  'viewportBelow'
];

class Scrollama extends Component {
  // step trigger callbacks
  cb = {
    stepEnter: () => {},
    stepExit: () => {},
    stepProgress: () => {}
  };

  // stores intersection observers
  io = {};
  disconnectObserver = name =>
    this.io[name] && this.io[name].forEach(o => o.disconnect());

  // stores step elements by id
  stepElIds = [];

  viewH = 0;
  pageH = 0;
  offsetMargin = 0;

  previousYOffset = 0;
  direction = 'down';
  updateDirection = () => {
    if (window.pageYOffset > this.previousYOffset) {
      this.direction = 'down';
    } else if (window.pageYOffset < this.previousYOffset) {
      this.direction = 'up';
    }
    this.previousYOffset = window.pageYOffset;
  };

  constructor(props) {
    super(props);
    const { children } = this.props;

    React.Children.forEach(children, () => {
      const childId = uuidv4();
      this[childId] = React.createRef();
      this.stepElIds.push(childId);
    });
  }

  getStep = id => {
    const step = this[id];
    if (step && step.current) {
      return step;
    }
    throw 'Could not get step with id ' + id;
  };

  handleResize = () => {
    this.viewH = window.innerHeight;
    this.pageH = getPageHeight();
    this.offsetMargin = this.props.offsetVal * this.viewH;

    if (this.isReady) {
      // recalculate offset heights for each step
      this.stepElIds.forEach(id => {
        this.getStep(id).updateOffsetHeight();
      });
      this.updateIO();
    }
  }

  // Recreate all intersection observers
  updateIO = () => {
    OBSERVER_NAMES.forEach(this.disconnectObserver);
    this.updateStepAboveIO();
    this.updateStepBelowIO();
  };

  /* INTERSECTION OBSERVER CREATORS */

  // Create observers for intersections above steps
  updateStepAboveIO = () => {
    this.io.stepAbove = this.stepElIds.map(id => {
      const step = this.getStep(id);
      const marginTop = -this.offsetMargin + step.state.offsetHeight;
      const marginBottom = this.offsetMargin - this.viewH;
      const options = { rootMargin: `${marginTop}px 0px ${marginBottom}px 0px` };

      const obs = new IntersectionObserver(this.intersectStepAbove, options);
      obs.observe(step.getDOMNode());
      return obs;
    });
  };
  // Create observers for intersections below steps
  updateStepBelowIO = () => {
    this.io.stepAbove = this.stepElIds.map(id => {
      const step = this.getStep(id);
      const marginTop = -this.offsetMargin;
      const marginBottom = this.offsetMargin - this.viewH + step.state.offsetHeight;
      const options = { rootMargin: `${marginTop}px 0px ${marginBottom}px 0px` };

      const obs = new IntersectionObserver(this.intersectStepBelow, options);
      obs.observe(step.getDOMNode());
      return obs;
    });
  };

  /* INTERSECTION OBSERVER HANDLERS */

  // Handles scrolling down and entering or scrolling up and leaving a step
  intersectStepAbove = ([ entry ]) => {
    this.updateDirection();
    const { isIntersecting, boundingClientRect, target: { id } } = entry;

    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - this.offsetMargin;
    const bottomAdjusted = bottom - this.offsetMargin;

    const step = this.getStep(id);

    if (
      isIntersecting &&
        topAdjusted <= 0 &&
        bottomAdjusted >= 0 &&
        this.direction === 'down' &&
        step.state.state !== 'enter'
    )
      this.notifyStepEnter(step, this.direction);
    if (
      !isIntersecting &&
        topAdjusted > 0 &&
        this.direction === 'up' &&
        step.state.state === 'enter'
    )
      this.notifyStepExit(step, this.direction);
  };

  // Handles scrolling up and entering or scrolling down and leaving a step
  intersectStepBelow = ([ entry ]) => {
    this.updateDirection();
    const { isIntersecting, boundingClientRect, target: { id } } = entry;

    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - this.offsetMargin;
    const bottomAdjusted = bottom - this.offsetMargin;

    const step = this.getStep(id);

    if (
      isIntersecting &&
        topAdjusted <= 0 &&
        bottomAdjusted >= 0 &&
        this.direction === 'up' &&
        step.state.state !== 'enter'
    )
      this.notifyStepEnter(step, this.direction);
    if (
      !isIntersecting &&
        bottomAdjusted > 0 &&
        this.direction === 'down' &&
        step.state.state === 'enter'
    )
      this.notifyStepExit(step, this.direction);
  };

  /* NOTIFY CALLBACKS */

  notifyStepEnter = (step, direction) => {
    // Store most recent trigger
    step.enter(direction);

    const resp = {
      element: step.getDOMNode(),
      data: step.getData(),
      direction,
    };
    if (this.cb.stepEnter)
      this.cb.stepEnter(resp);
  };

  notifyStepExit = (step, direction) => {
    // Store most recent trigger
    step.exit(direction);

    const resp = {
      element: step.getDOMNode(),
      data: step.getData(),
      direction,
    };
    if (this.cb.stepExit)
      this.cb.stepExit(resp);
  };

  render() {
    return React.Children.map(this.props.children, (child, index) => {
      const id = this.stepElIds[index];
      return React.cloneElement(child, {
        id,
        ref: this[id],
      });
    });
  }
}
