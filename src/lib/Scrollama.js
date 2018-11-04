import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import uuid from 'uuid';
import 'intersection-observer';
import DebugOffset from './DebugOffset';

const styles = {};

const ZERO_MOE = 1; // zero with some rounding margin of error

const getPageHeight = () => {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  );
};

class Scrollama extends PureComponent {
  constructor(props) {
    super(props);
    const { offset, debug, children, onStepEnter, onStepExit } = this.props;

    const stepElIds = [];
    React.Children.forEach(children, () => {
      const childId = uuid.v4();
      this[childId] = React.createRef();
      stepElIds.push(childId);
    });

    let offsetVal = 0;
    if (offset && !isNaN(offset)) {
      offsetVal = Math.min(Math.max(0, offset), 1);
    }

    this.state = {
      isEnabled: false,
      debugMode: debug,

      callback: {
        stepEnter: onStepEnter,
        stepExit: onStepExit,
      },
      io: {},
      stepElIds,

      direction: null,

      vh: 0,
      ph: 0,
      offsetVal,
      offsetMargin: 0,
      previousYOffset: -1,
    };

    window.addEventListener('resize', this.handleResize);
  }

  async componentDidMount() {
    await this.handleResize();
    this.handleEnable(true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.handleEnable(false);
  }

  getRefComponent = id => {
    const comp = this[id];
    return (comp && comp.current) ||
      console.error('Could not retrieve step with id', id);
  };

  getDOMNode = step => step.domNode.current;

  handleResize = () => {
    const { stepElIds, offsetVal, isEnabled } = this.state;
    const vh = window.innerHeight;
    this.setState({
      vh,
      ph: getPageHeight(),
      offsetMargin: offsetVal * vh,
    });

    stepElIds.forEach(id => {
      const step = this.getRefComponent(id);
      step.updateOffsetHeight();
    });

    if (isEnabled) {
      this.updateIO();
    }
  };

  handleEnable = enable => {
    const { isEnabled, io } = this.state;
    if (enable && !isEnabled) {
      this.updateIO();
      this.setState({ isEnabled: true });
    } else if (!enable) {
      if (io.stepAbove) io.stepAbove.forEach(obs => obs.disconnect());
      if (io.stepBelow) io.stepBelow.forEach(obs => obs.disconnect());
      this.setState({ isEnabled: false });
    }
  };

  updateIO = () => {
    this.updateStepAboveIO();
    this.updateStepBelowIO();
  };

  updateStepAboveIO = () => {
    const { io, stepElIds, vh, offsetMargin } = this.state;
    if (io.stepAbove) {
      io.stepAbove.forEach(obs => obs.disconnect());
    }

    this.setState({
      io: {
        ...io,
        stepAbove: stepElIds.map(id => {
          const step = this.getRefComponent(id);
          const marginTop = step.state.offsetHeight;
          const marginBottom = -vh + offsetMargin;
          const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;

          const options = {
            root: null,
            rootMargin,
            threshold: 0,
          };

          const obs = new IntersectionObserver(
            this.intersectStepAbove,
            options,
          );
          obs.observe(step.getDOMNode());
          return obs;
        }),
      },
    });
  };

  updateStepBelowIO = () => {
    const { io, stepElIds, vh, ph, offsetMargin } = this.state;
    if (io.stepBelow) {
      io.stepBelow.forEach(obs => obs.disconnect());
    }

    this.setState({
      io: {
        ...io,
        stepBelow: stepElIds.map(id => {
          const step = this.getRefComponent(id);
          const marginTop = -offsetMargin;
          const marginBottom = ph - vh + step.state.offsetHeight + offsetMargin;
          const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;

          const options = {
            root: null,
            rootMargin,
            threshold: 0,
          };

          const obs = new IntersectionObserver(
            this.intersectStepBelow,
            options,
          );
          obs.observe(step.getDOMNode());
          return obs;
        }),
      },
    });
  };

  updateDirection = () => {
    const { previousYOffset } = this.state;
    const { pageYOffset } = window;
    if (pageYOffset > previousYOffset) {
      this.setState({ direction: 'down' });
    } else if (pageYOffset < previousYOffset) {
      this.setState({ direction: 'up' });
    }
    this.setState({ previousYOffset: pageYOffset });
  };

  notifyStepEnter = (step, direction) => {
    const { callback: { stepEnter } } = this.state;
    step.enter(direction);

    const resp = {
      element: step.getDOMNode(),
      data: step.getData(),
      direction,
    };
    if (stepEnter && typeof stepEnter === 'function') {
      stepEnter(resp);
    }
  };

  notifyStepExit = (step, direction) => {
    const { callback: { stepExit } } = this.state;
    step.exit(direction);

    const resp = {
      element: step.getDOMNode(),
      data: step.getData(),
      direction,
    };
    if (stepExit && typeof stepExit === 'function') {
      stepExit(resp);
    }
  };

  // callback for io.stepAbove. Called if top edge of step crosses threshold.
  intersectStepAbove = entries => {
    this.updateDirection();
    const { offsetMargin, direction } = this.state;

    entries.forEach(entry => {
      const { isIntersecting, boundingClientRect, target: { id } } = entry;
      // bottom is how far bottom edge of el is from top of viewport
      const { bottom, height } = boundingClientRect;
      const bottomAdjusted = bottom - offsetMargin;

      const step = this.getRefComponent(id);
      if (!step) {
        return;
      }
      const { state } = step.state;
      if (bottomAdjusted >= -ZERO_MOE) {
        if (isIntersecting && direction === 'down' && state !== 'enter') {
          this.notifyStepEnter(step, direction);
        } else if (!isIntersecting && direction === 'up' && state === 'enter') {
          this.notifyStepExit(step, direction);
        } else if (
          !isIntersecting &&
          bottomAdjusted >= height &&
          direction === 'down' &&
          state === 'enter'
        ) {
          this.notifyStepExit(step, direction);
        }
      }
    });
  };

  // callback for io.stepBelow. Called if top edge of step crosses threshold.
  intersectStepBelow = entries => {
    this.updateDirection();
    const { offsetMargin, direction } = this.state;

    entries.forEach(entry => {
      const { isIntersecting, boundingClientRect, target: { id } } = entry;

      const { bottom, height } = boundingClientRect;
      const bottomAdjusted = bottom - offsetMargin;

      const step = this.getRefComponent(id);
      if (!step) {
        return;
      }
      const { state } = step.state;
      if (
        bottomAdjusted >= -ZERO_MOE &&
        bottomAdjusted < height &&
        isIntersecting &&
        direction === 'up' &&
        state !== 'enter'
      ) {
        this.notifyStepEnter(step, direction);
      } else if (
        bottomAdjusted <= ZERO_MOE &&
        !isIntersecting &&
        direction === 'down' &&
        state === 'enter'
      ) {
        this.notifyStepExit(step, direction);
      }
    });
  };

  addStep = id => {
    const { stepElIds } = this.state;
    stepElIds.push(id);
    this.setState({ stepElIds });

    this.updateIO();
  };

  removeStep = badId => {
    const { stepElIds } = this.state;

    // remove badId from our store of step id's
    const badIndex = stepElIds.findIndex(id => id === badId);
    if (badIndex >= 0) {
      stepElIds.splice(badIndex, badIndex + 1);
      this.setState({ stepElIds });
    }
    
    delete this[badId]; // remove our ref to the removed step
    this.updateIO(); // update observers
  };

  render() {
    const { stepElIds, debugMode, offsetMargin, offsetVal } = this.state;
    const { children } = this.props;
    return (
      <div>
        {debugMode && (
          <DebugOffset offsetMargin={offsetMargin} offsetVal={offsetVal} />
        )}
        {React.Children.map(children, (child, index) => {
          const doesExist = !!stepElIds[index];
          if (doesExist) {
            var id = stepElIds[index];
          } else {
            var id = uuid.v4();
            this[id] = React.createRef();
          }
          return React.cloneElement(child, {
            id,
            isNew: !doesExist,
            addSelf: () => this.addStep(id),
            removeSelf: () => this.removeStep(id),
            ref: this[id],
          });
        })}
      </div>
    );
  }
}

Scrollama.defaultProps = {
  offset: 0.5,
  debug: false,
};

export default injectSheet(styles)(Scrollama);
