import { render, screen } from '@testing-library/react';

import { NewLanguage } from './NewLanguage';

describe('New Language', () => {
  it('Page Renders With All Expected Elements', () => {
    render(<NewLanguage />);

    screen.debug();
  });
  it('Validators Catch Errors', () => {
    render(<NewLanguage />);

    screen.debug();
  });
  it('Valid New Language Successfully Adds', () => {
    render(<NewLanguage />);

    screen.debug();
  });
});
// https://medium.com/@andrew.aarestad/unit-testing-node-js-with-tsyringe-and-typeorm-69e2952019bf
