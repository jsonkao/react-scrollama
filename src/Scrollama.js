import React, { Component, Fragment } from 'react';
import DebugOffset from './DebugOffset';

const OBSERVER_NAMES = [
  'stepAbove',
  'stepBelow',
  'stepProgress',
  'viewportAbove',
  'viewportBelow',
];

class Scrollama extends Component {
  // step trigger callbacks
  cb = {
    stepEnter: () => null,
    stepExit: () => null,
    stepProgress: () => null,
  };

  // intersection observers
  io = {};

  // disconnects all observers of a certain function
  disconnectObserver = name =>
    this.io[name] && this.io[name].forEach(o => o.disconnect());

  // stores step elements by id
  stepElIds = [];

  viewH = window.innerHeight;
  pageH = 0;
  offsetVal = 0;
  offsetMargin = 0;
  previousYOffset = 0;
  progressThreshold = 0;

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
  isDebug = false;

  progressMode = false;

  constructor(props) {
    super(props);
    const {
      children,
      onStepEnter,
      onStepExit,
      onStepProgress,
      offset = 0.3,
      progress = false,
      threshold = 4,
      debug,
    } = this.props;

    React.Children.forEach(children, (_, idx) => {
      const childId = `react-scrollama-${idx}`;
      this[childId] = React.createRef();
      this.stepElIds.push(childId);
    });

    if (offset && !isNaN(offset))
      this.offsetVal = Math.min(Math.max(0, offset), 1);

    this.cb.stepEnter = onStepEnter;
    this.cb.stepExit = onStepExit;
    this.cb.stepProgress = onStepProgress;

    this.isDebug = debug;
    this.progressMode = progress;
    this.progressThreshold = Math.max(1, +threshold);

    this.isReady = true;

    // offsetMargin stored in state because it's the only property that is
    // changed after Scrollama's construction and may be rendered (<DebugOffset/>'s
    // position depends on it)
    this.state = {
      offsetMargin: this.offsetVal * this.viewH,
    };
  }

  componentDidMount() {
    this.domDidLoad.bind(this)();
  }

  domDidLoad() {
    this.handleResize();
    this.handleEnable(true);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('load', this.domDidLoad.bind(this));
    window.removeEventListener('resize', this.handleResize);
    this.handleEnable(false);
  }

  /* Get step can take a step id or grab an id off a target element */
  getStep = arg => {
    const id =
      arg instanceof Element ? arg.getAttribute('data-react-scrollama-id') : arg;
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
      if (this.isEnabled) this.updateIO();
    }
  };

  handleEnable = enable => {
    if (enable && !this.isEnabled) {
      if (this.isReady) {
        this.updateIO();
      } else {
        console.error(
          'react scrollama: handleEnable() called before scroller was ready',
        );
        this.isEnabled = false;
        return;
      }
    }
    if (!enable && this.isEnabled) {
      OBSERVER_NAMES.forEach(this.disconnectObserver);
    }
    this.isEnabled = enable;
  };

  // Recreate all intersection observers
  updateIO = () => {
    OBSERVER_NAMES.forEach(this.disconnectObserver);
    this.updateStepAboveIO();
    this.updateStepBelowIO();

    if (this.progressMode) this.updateStepProgressIO();
  };

  /* INTERSECTION OBSERVER CREATORS */

  // Create observers for intersections above steps
  updateStepAboveIO = () => {
    const { offsetMargin } = this.state;
    this.io.stepAbove = this.stepElIds.map(id => {
      const step = this.getStep(id);
      const stepStateOffsetHeight = step.updateOffsetHeight();
      const marginTop = -offsetMargin +  stepStateOffsetHeight; //step.state.offsetHeight;
      const marginBottom = offsetMargin - this.viewH;
      const options = {
        rootMargin: `${marginTop}px 0px ${marginBottom}px 0px`,
      };

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
      const stepStateOffsetHeight = step.updateOffsetHeight();
      const marginTop = -offsetMargin;
      const marginBottom = offsetMargin - this.viewH + stepStateOffsetHeight; //step.state.offsetHeight;
      const options = {
        rootMargin: `${marginTop}px 0px ${marginBottom}px 0px`,
      };

      const obs = new IntersectionObserver(this.intersectStepBelow, options);
      obs.observe(step.getDOMNode());
      return obs;
    });
  };

  // Create observers for progress
  updateStepProgressIO = () => {
    const { offsetMargin } = this.state;
    this.io.stepProgress = this.stepElIds.map(id => {
      const step = this.getStep(id);
      const marginTop = -offsetMargin + step.state.offsetHeight;
      const marginBottom = offsetMargin - this.viewH;
      const options = {
        rootMargin: `${marginTop}px 0px ${marginBottom}px 0px`,
        threshold: this.createThreshold(step.state.offsetHeight),
      };

      const obs = new IntersectionObserver(this.intersectStepProgress, options);
      obs.observe(step.getDOMNode());
      return obs;
    });
  };

  /* INTERSECTION OBSERVER HANDLERS */

  // Handles scrolling down and entering or scrolling up and leaving a step
  intersectStepAbove = ([entry]) => {
    this.updateDirection();
    const { offsetMargin } = this.state;
    const {
      isIntersecting,
      boundingClientRect: { top, bottom },
      target,
    } = entry;

    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;

    const step = this.getStep(target);

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
      // Should be >0, but >-0.05 fixes a weird floating point issue in Chrome.
      // The exact –ε is different for every this.prop.offset. Very sad folks.
      topAdjusted > -0.5 &&
      this.direction === 'up' &&
      step.state.state === 'enter'
    )
      this.notifyStepExit(step, this.direction);
  };

  // Handles scrolling up and entering or scrolling down and leaving a step
  intersectStepBelow = ([entry]) => {
    this.updateDirection();
    const { offsetMargin } = this.state;
    const {
      isIntersecting,
      boundingClientRect: { top, bottom },
      target,
    } = entry;

    const topAdjusted = top - offsetMargin;
    const bottomAdjusted = bottom - offsetMargin;

    const step = this.getStep(target);

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

  intersectStepProgress = ([entry]) => {
    this.updateDirection();
    const {
      isIntersecting,
      intersectionRatio,
      boundingClientRect: { bottom },
      target,
    } = entry;

    const bottomAdjusted = bottom - this.state.offsetMargin;
    if (isIntersecting && bottomAdjusted >= 0)
      this.notifyStepProgress(this.getStep(target), intersectionRatio);
  };

  createThreshold = height => {
    const count = Math.ceil(height / this.progressThreshold);
    const t = [];
    const ratio = 1 / count;
    for (let i = 0; i <= count; i += 1) {
      t.push(i * ratio);
    }
    return t;
  };

  /* NOTIFY CALLBACKS */

  notifyStepProgress = (step, progress) => {
    if (progress !== undefined) step.progress(progress);

    const resp = {
      element: step.getDOMNode(),
      data: step.getData(),
      progress: step.state.progress,
    };
    if (step.state.state === 'enter') this.cb.stepProgress(resp);
  };

  notifyStepEnter = (step, direction) => {
    step.enter(direction);

    const resp = {
      element: step.getDOMNode(),
      data: step.getData(),
      direction,
    };
    if (this.cb.stepEnter) this.cb.stepEnter(resp);

    if (this.progressMode) this.notifyStepProgress(step);
  };

  notifyStepExit = (step, direction) => {
    if (this.progressMode) {
      if (direction === 'down' && step.state.progress < 1)
        this.notifyStepProgress(step, 1);
      if (direction === 'up' && step.state.progress > 0)
        this.notifyStepProgress(step, 0);
    }
    step.exit(direction);

    const resp = {
      element: step.getDOMNode(),
      data: step.getData(),
      direction,
    };
    if (this.cb.stepExit) this.cb.stepExit(resp);
  };

  render() {
    return (
      <Fragment>
        {this.isDebug && (
          <DebugOffset
            offsetMargin={this.state.offsetMargin}
            offsetVal={this.offsetVal}
          />
        )}
        {React.Children.map(this.props.children, (child, index) => {
          const id = this.stepElIds[index];
          return React.cloneElement(child, {
            scrollamaId: id,
            ref: this[id],
          });
        })}
      </Fragment>
    );
  }
}

function getPageHeight() {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  );
}

export default Scrollama;
