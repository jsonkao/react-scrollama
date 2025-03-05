import { useState } from 'react';
import { Scrollama, Step } from 'react-scrollama';

import type { ScrollamaCallback, ScrollamaProgressCallback } from 'react-scrollama';
import { useStyles } from './style';

const Demo = () => {
  const classes = useStyles();
  const [data, setData] = useState(0);
  const [progress, setProgress] = useState(0);
  const steps = [10, 20, 30];

  const onStepEnter: ScrollamaCallback<number> = ({ data }) => {
    setData(data);
  };

  const onStepExit: ScrollamaCallback<number> = ({ direction, data }) => {
    if (direction === 'up' && data === steps[0]) {
      setData(0);
    }
  };

  const onStepProgress: ScrollamaProgressCallback<number> = ({ progress }) => {
    setProgress(progress);
  };

  return (
    <div>
      <div className={classes.navbar}>
        <a href="https://github.com/jsonkao/react-scrollama">GitHub</a>
      </div>
      <p className={classes.pageTitle}>
        <a href="https://github.com/jsonkao/react-scrollama">React Scrollama</a>
        Demo
      </p>
      <p className={classes.description}>
        <b>React Scrollama</b> is a lightweight and simple interface for scrollytelling in React
        that uses IntersectionObserver in favor of scroll events. The library has been used by the
        <a href="https://datatopics.worldbank.org/sdgatlas/">World Bank's</a>
        Atlas of Sustainable Development Goals and Politico.
      </p>

      <a className={classes.button} href="https://github.com/jsonkao/react-scrollama">
        Learn and get started
      </a>

      <p className={classes.pageSubtitle}>Scroll ↓</p>
      <div className={classes.graphicContainer}>
        <div className={classes.scroller}>
          <Scrollama<number>
            onStepEnter={onStepEnter}
            onStepExit={onStepExit}
            onStepProgress={onStepProgress}
            offset="400px"
            debug>
            {steps.map((value) => {
              const isVisible = value === data;
              const background = isVisible ? `rgba(44,127,184, ${progress})` : 'white';
              const visibility = isVisible ? 'visible' : 'hidden';
              return (
                <Step data={value} key={value}>
                  <div className={classes.step} style={{ background }}>
                    <p>step value: {value}</p>
                    <p style={{ visibility }}>{`${Math.round(progress * 1000) / 10}%`}</p>
                  </div>
                </Step>
              );
            })}
          </Scrollama>
        </div>
        <div className={classes.graphic}>
          <p>{data}</p>
        </div>
      </div>
      <p className={classes.subhed}>
        <b>Who's using React Scrollama?</b>
      </p>
      <div className={classes.whoUsing}>
        <div>
          <a href="https://www.worldbank.org/en/home" rel="nofollow">
            <img
              src="https://user-images.githubusercontent.com/15334952/111389696-ca705b00-8687-11eb-9db9-4f0919715834.png"
              alt="World Bank"
              width="220"
              style={{ maxWidth: '100%' }}
            />
          </a>
          <br />
          <a href="https://www.un.org/en/" rel="nofollow">
            <img
              src="https://user-images.githubusercontent.com/15334952/111392820-c0515b00-868d-11eb-9b82-5eaace6612c9.png"
              alt="United Nations"
            />
          </a>
          <br />
          <a href="https://datatopics.worldbank.org/sdgatlas/" rel="nofollow">
            17 interactive visualization stories
          </a>
          <a href="https://twitter.com/maartenzam/status/1371951848039579664" rel="nofollow">
            using
          </a>
          React Scrollama for scrollytelling
        </div>
        <div>
          <a href="https://datatopics.worldbank.org/sdgatlas/" rel="nofollow">
            <img
              src="https://user-images.githubusercontent.com/15334952/111390361-fb04c480-8688-11eb-9fa1-3991ee73dd05.png"
              alt="World Bank"
            />
          </a>
        </div>
        <div>
          <a href="https://www.politico.com/" rel="nofollow">
            <img
              src="https://camo.githubusercontent.com/5e5aaf160fb5b4446d2c0dff5dc8781a14f2b5608e380a7c1d70962541f9e9a5/68747470733a2f2f6a6f6c7474782e6f72672f77702d636f6e74656e742f75706c6f6164732f323031392f31302f706f6c697469636f2d6c6f676f2e706e67"
              alt="Politico"
              style={{ maxWidth: '170px' }}
              data-canonical-src="https://jolttx.org/wp-content/uploads/2019/10/politico-logo.png"
            />
          </a>
          <br />
          <a
            href="https://www.politico.com/interactives/2019/election-security-americas-voting-machines"
            rel="nofollow">
            <i>The scramble to secure America's voting machines</i>
          </a>
          by
          <a href="https://bzjin.github.io" rel="nofollow">
            Beatrice Jin
          </a>
        </div>
        <div>
          <a
            href="https://www.politico.com/interactives/2019/election-security-americas-voting-machines"
            rel="nofollow">
            <img
              src="https://user-images.githubusercontent.com/15334952/111391036-2dfb8800-868a-11eb-9c64-3f322ef1e588.png"
              alt="Politico"
            />
          </a>
        </div>
        <div>
          <a href="http://graphicsdesk.github.io/" rel="nofollow">
            <img
              src="https://camo.githubusercontent.com/9c8c61dc63925ee922545f0d0468d5d0d25623459d7b46de3dce4cc85a57c98a/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f737065632d696d616765686f7374696e672f737065637461746f722d6c6f676f2e706e67"
              width="180"
              alt="Columbia Spectator"
              data-canonical-src="https://s3.amazonaws.com/spec-imagehosting/spectator-logo.png"
              style={{ maxWidth: '100%' }}
            />
          </a>
          <br />
          <a
            href="https://www.columbiaspectator.com/eye-lead/graduate-sex-diversity"
            rel="nofollow">
            <i>Sex Diversity Among Grad Students is Stagnating</i>
          </a>
          by Jason Kao
        </div>
        <div>
          <a
            href="https://www.columbiaspectator.com/eye-lead/graduate-sex-diversity"
            rel="nofollow">
            <img
              src="https://user-images.githubusercontent.com/15334952/111391310-b843ec00-868a-11eb-9744-72ee913cdbe1.png"
              alt="Columbia Spectator"
            />
          </a>
        </div>
      </div>
      <a className={classes.button} href="https://github.com/jsonkao/react-scrollama">
        Learn and get started
      </a>
    </div>
  );
};

export default Demo;
