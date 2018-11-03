import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';
import { Scrollama, Step } from '../lib';

const styles = {
  main: {
    padding: '70vh 2vw',
    display: 'flex',
    fontFamily: 'Helvetica',
    justifyContent: 'space-between',
  },
  btn: {
    padding: '10px 20px',
    fontSize: '16px',
    position: 'fixed',
    margin: '10px',
    fontFamily: 'Helvetica',
  },
  graphic: {
    flexBasis: '60%',
    position: 'sticky',
    width: '100%',
    padding: '5rem 0',
    top: '160px',
    alignSelf: 'flex-start',
    backgroundColor: '#aaa',
    '& p': {
      fontSize: '5rem',
      textAlign: 'center',
      color: '#fff',
    },
  },
  scroller: {
    flexBasis: '35%',
  },
  step: {
    margin: '0 auto 2rem auto',
    paddingTop: 200,
    paddingBottom: 200,
    border: '1px solid #333',
    '& p': {
      textAlign: 'center',
      padding: '1rem',
      fontSize: '1.5rem',
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
};

class MainApp extends PureComponent {
  state = {
    data: 0,
    numSteps: 4,
  };

  onStepEnter = ({ element, data }) => {
    element.style.backgroundColor = 'lightgoldenrodyellow';
    this.setState({ data });
  };

  onStepExit = ({ element }) => {
    element.style.backgroundColor = '#fff';
  };

  inc = () => this.setState({ numSteps: this.state.numSteps + 1 });
  dec = () => {
    const { numSteps } = this.state;
    if (--numSteps >= 0) {
      this.setState({ numSteps });
    }
  };

  render() {
    const { data, numSteps } = this.state;
    const { classes } = this.props;

    const ary = [];
    for (let i = 0; i < numSteps; i++)
      ary.push(i);

    return (
      <div>
        <div className={classes.btnContainer}>
          <button onClick={this.inc} className={classes.btn}>Remove step from bottom</button>
          <button onClick={this.dec} className={classes.btn}>Add step to bottom</button>      
        </div>
        <div>
          <div classnumStepsame={classes.main}>
            <div classnumStepsame={classes.scroller}>
              <Scrollama
                offset={0.33}
                onStepEnter={this.onStepEnter}
                onStepExit={this.onStepExit}
                debug
              >
                {ary.map((_, value) => (
                  <Step data={value} key={value}>
                    <div classnumStepsame={classes.step}>
                      <p>step value: {value}</p>
                    </div>
                  </Step>
                ))}
              </Scrollama>
            </div>
            <div classnumStepsame={classes.graphic}>
              <p>{data}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const StyledMainApp = injectSheet(styles)(MainApp);

ReactDOM.render(<StyledMainApp />, document.getElementById('root'));
