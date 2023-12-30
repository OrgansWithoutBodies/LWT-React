import { render, screen } from '@testing-library/react';

import { Terms } from './Terms.component';

describe('App', () => {
  it('renders App component', () => {
    // https://testing-library.com/docs/example-react-router/
    render(
      <Terms
        textFilter={null}
        pageNum={null}
        status={null}
        tag1={null}
        tag12={0}
        tag2={null}
      />
    );

    screen.debug();
  });
});
