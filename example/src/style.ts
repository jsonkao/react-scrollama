import { createUseStyles } from 'react-jss';

export const useStyles = createUseStyles({
  navbar: {
    position: 'fixed',
    display: 'flex',
    top: 0,
    right: 0,
    zIndex: 1,
    '& a': {
      display: 'block',
      fontSize: '20px',
      padding: '20px',
    },
  },
  pageTitle: {
    textAlign: 'center',
    fontSize: 22,
    margin: '90px 0 10px',
    visibility: 'hidden',
  },
  description: {
    maxWidth: 600,
    margin: '10px auto 30px',
    fontSize: 22,
    lineHeight: '28px',
    '& a': {
      color: 'black',
    },
  },
  pageSubtitle: {
    textAlign: 'center',
    fontSize: 22,
    color: '#888',
  },
  graphicContainer: {
    padding: '40vh 2vw 20vh',
    display: 'flex',
    justifyContent: 'space-between',
  },
  graphic: {
    flexBasis: '60%',
    position: 'sticky',
    width: '100%',
    height: '60vh',
    top: '20vh',
    backgroundColor: '#aaa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& p': {
      fontSize: '5rem',
      fontWeight: 700,
      textAlign: 'center',
      color: '#fff',
    },
  },
  scroller: {
    flexBasis: '35%',
  },
  step: {
    margin: '0 auto 3rem auto',
    padding: '180px 0',
    border: '1px solid #333',
    '& p': {
      textAlign: 'center',
      padding: '1rem',
      fontSize: '1.8rem',
      margin: 0,
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  button: {
    backgroundColor: '#3773ac',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '6px',
    textAlign: 'center',
    display: 'block',
    maxWidth: 220,
    margin: '10px auto 30px',
    fontSize: 19,
    lineHeight: '28px',
    textDecoration: 'none',
  },
  subhed: {
    maxWidth: 600,
    margin: '10px auto 15px',
    fontSize: 22,
    lineHeight: '28px',
    '& a': {
      color: 'black',
    },
    textAlign: 'center',
  },
  whoUsing: {
    maxWidth: 960,
    margin: '30px auto 100px',
    fontSize: 19,
    lineHeight: '26px',
    gridAutoRows: 'minmax(100px, auto)',
    '& a': {
      color: 'black',
    },
    '& img': {
      width: '100%',
    },
    display: 'grid',
    gridTemplateColumns: '2fr 5fr',
    '& > div': {
      padding: '16px 0',
      borderTop: '1px solid #ccc',
      '&:nth-child(odd)': {
        paddingRight: '13px',
        borderRight: '1px solid #ccc',
      },
      '&:nth-child(even)': {
        paddingLeft: '13px',
      },
    },
  },
});
