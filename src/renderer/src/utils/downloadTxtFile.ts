export const downloadBackupFile = (
  textData: string,
  serializedAs: 'SQL' | 'JSON'
) => {
  const fileName = `LWT-Backup.${serializedAs.toLowerCase()}`;
  downloadTextFile(textData, fileName);
};

export const downloadTextFile = (textData: string, fileName: string) => {
  // text content
  const file = new Blob([textData], { type: 'text/plain' }); // anchor link
  const element = document.createElement('a');
  element.href = URL.createObjectURL(file);
  element.download = fileName; // simulate link click
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};
