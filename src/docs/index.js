import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';
import { Scrollama, Step } from '../lib';

const styles = {
  main: {
    margin: '70vh 2vw',
    display: 'flex',
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
    fontFamily: 'Helvetica',
    justifyContent: 'space-between',
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
  };

  onStepEnter = ({ element, data }) => {
    element.style.backgroundColor = 'lightgoldenrodyellow';
    this.setState({ data });
  };

  onStepExit = ({ element }) => {
    element.style.backgroundColor = '#fff';
  };

  render() {
    const { data } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.main}>
        <div className={classes.scroller}>
          <Scrollama
            offset={0.33}
            onStepEnter={this.onStepEnter}
            onStepExit={this.onStepExit}
            debug
          >
            {[1, 2, 3, 4].map(value => (
              <Step data={value} key={value}>
                <div className={classes.step}>
                  <p>step value: {value}</p>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
        <div className={classes.graphic}>
          <p>{data}</p>
        </div>
      </div>
    );
  }
}

const StyledMainApp = injectSheet(styles)(MainApp);

ReactDOM.render(<StyledMainApp />, document.getElementById('root'));
