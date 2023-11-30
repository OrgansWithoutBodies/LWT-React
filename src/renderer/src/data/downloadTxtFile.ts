export const downloadTextFile = (
  textData: string,
  serializedAs: 'SQL' | 'JSON'
) => {
  // text content
  const file = new Blob([textData], { type: 'text/plain' }); // anchor link
  const element = document.createElement('a');
  element.href = URL.createObjectURL(file);
  element.download = `LWT-Backup.${serializedAs.toLowerCase()}`; // simulate link click
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};
