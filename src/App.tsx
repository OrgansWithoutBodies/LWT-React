import React from 'react';
import ReactDOM from 'react-dom';
import { Library } from './Library.component';

export function App(): JSX.Element {
  return <Library />;
}

export function startApplication(): void {
  ReactDOM.render(<App />, document.getElementById('root'));
}
