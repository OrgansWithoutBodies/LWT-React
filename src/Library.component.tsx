import React from 'react';
type Text = {name: string, contents?: string}
const TEXTS: Text[] = [
  {name: "TEST"},
  {name: "TEST123"},
]
export function Library(): JSX.Element {
  return <>
  {TEXTS.map((txt) => {
    return <div>{txt.name}</div>
  })}
  </>;
}
