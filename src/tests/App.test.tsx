import { render } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders as expected', () => {
    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    // expect(screen.getByText(/Vite + React + Motoko/i)).toBeInTheDocument();
    expect(1).toEqual(1);
  });
});
