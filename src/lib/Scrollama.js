import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { getPageHeight } from './utils';
import DebugOffset from './DebugOffset';

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
  offsetVal = 0;
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

  isReady = false;
  isEnabled = false;
  isDebug = true;

  constructor(props) {
    super(props);
    const { children, onStepEnter, onStepExit, offset } = this.props;

    React.Children.forEach(children, () => {
      const childId = uuidv4();
      this[childId] = React.createRef();
      this.stepElIds.push(childId);
    });

    this.offsetVal = offset;
    this.cb.stepEnter = onStepEnter;
    this.cb.stepExit = onStepExit;

    this.isReady = true;

    // offsetMargin stored in state because it's the only property that is
    // changed after Scrollama's construction and may be rendered (<DebugOffset/>'s
    // position depends on it)
    this.state = {
      offsetMargin: 0,
    };
  }

  async componentDidMount() {
    await this.handleResize();
    this.handleEnable(true);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.handleEnable(false);
  }

  getStep = id => {
    const step = this[id];
    if (step && step.current) {
      return step.current;
    }
    throw 'Could not get step with id ' + id;
  };

  handleResize = () => {
    this.viewH = window.innerHeight;
    this.pageH = getPageHeight();
    this.setState({ offsetMargin: this.offsetVal * this.viewH });

    if (this.isReady) {
      // recalculate offset heights for each step
      this.stepElIds.forEach(id => {
        const step = this.getStep(id);
        step.updateOffsetHeight();
      });
      this.updateIO();
    }
  }

  handleEnable = enable => {
    if (enable && !this.isEnabled) {
      if (this.isReady) this.updateIO();
      this.isEnabled = true;
    } else {
      OBSERVER_NAMES.forEach(this.disconnectObserver);
      this.isEnabled = false;
    }
  };

  // Recreate all intersection observers
  updateIO = () => {
    OBSERVER_NAMES.forEach(this.disconnectObserver);
    this.updateStepAboveIO();
    this.updateStepBelowIO();
  };

  /* INTERSECTION OBSERVER CREATORS */

  // Create observers for intersections above steps
  updateStepAboveIO = () => {
    const { offsetMargin } = this.state;
    this.io.stepAbove = this.stepElIds.map(id => {
      const step = this.getStep(id);
      const marginTop = -offsetMargin + step.state.offsetHeight;
      const marginBottom = offsetMargin - this.viewH;
      const options = { rootMargin: `${marginTop}px 0px ${marginBottom}px 0px` };

      const obs = new IntersectionObserver(this.intersectStepAbove, options);
      obs.observe(step.getDOMNode());
      return obs;
    });
  };
  // Create observers for intersections below steps
  updateStepBelowIO = () => {
    const { offsetMargin } = this.state;
    this.io.stepBelow = this.stepElIds.map(id => {
      const step = this.getStep(id);
      const marginTop = -offsetMargin;
      const marginBottom = offsetMargin - this.viewH + step.state.offsetHeight;
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
    const { offsetMargin } = this.state;
    const { isIntersecting, boundingClientRect, target: { id } } = entry;

    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;

    const step = this.getStep(id);

    if (
      isIntersecting &&
        topAdjusted <= 0 &&
        bottomAdjusted >= 0 &&
        this.direction === 'down' &&
        step.state.state !== 'enter'
    )
      this.notifyStepEnter(step, this.direction);

    // Exiting from above means not intersecting and topAdjusted is positive
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
    const { offsetMargin } = this.state;
    const { isIntersecting, boundingClientRect, target: { id } } = entry;

    const { top, bottom } = boundingClientRect;
    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;

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
        bottomAdjusted < 0 &&
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
    return (
      <Fragment>
        {this.isDebug && (
          <DebugOffset offsetMargin={this.state.offsetMargin} offsetVal={this.offsetVal} />
        )}
        {React.Children.map(this.props.children, (child, index) => {
          const id = this.stepElIds[index];
          return React.cloneElement(child, {
            id,
            ref: this[id],
          });
        })}
      </Fragment>
    );
  }
}

Scrollama.defaultProps = {
  offset: 0.33,
};

Scrollama.propTypes = {
  offsetVal: PropTypes.number,
  onStepEnter: PropTypes.func,
  onStepExit: PropTypes.func,
};

export default Scrollama;
