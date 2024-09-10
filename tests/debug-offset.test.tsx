import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DebugOffset } from '../src';

describe('DebugOffset', () => {
  it('renders correctly with pixel offset', () => {
    render(<DebugOffset offset="50px" />);
    const triggerText = screen.getByText('trigger: 50px');
    expect(triggerText).toBeInTheDocument();
    const markerDiv = triggerText.closest('div');
    expect(markerDiv).toHaveStyle({ top: '50px' });
  });

  it('renders correctly with percentage offset', () => {
    render(<DebugOffset offset={0.3} />);
    const triggerText = screen.getByText('trigger: 0.3');
    expect(triggerText).toBeInTheDocument();
    const markerDiv = triggerText.closest('div');
    expect(markerDiv).toHaveStyle('top: 30%');
  });

  it('applies correct styles to the div element', () => {
    render(<DebugOffset offset="100px" />);
    const markerDiv = screen.getByText('trigger: 100px').closest('div');
    expect(markerDiv).toHaveStyle({
      position: 'fixed',
      left: 0,
      width: '100%',
      height: 0,
      borderTop: '2px dashed black',
      zIndex: 9999,
    });
  });

  it('applies correct styles to the p element', () => {
    render(<DebugOffset offset="100px" />);
    const markerP = screen.getByText('trigger: 100px').closest('p');
    expect(markerP).toHaveStyle({
      fontSize: '12px',
      fontFamily: 'monospace',
      margin: '0',
      padding: '6px',
    });
  });
});




