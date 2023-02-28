import * as fs from 'fs';
export default function CreateIconMap() {
  const srcDirectoryRoot = './src/icons';
  const srcDirectory = srcDirectoryRoot + '/icn';
  const iconFiles: string[] = [];
  try {
    if (fs.existsSync(srcDirectory)) {
      const files = fs.readdirSync(srcDirectory);
      files.forEach((file) => {
        if (file.endsWith('.png')) {
          iconFiles.push('"' + file.split('.')[0] + '",');
        }
      });

      const namesString = iconFiles.reduce(
        (prev, current) => prev + current,
        ''
      );
      // if its stupid but it works, then is it actually stupid?🤔
      const fileString =
        'export const IconNameMap=[' + namesString + '] as const;';
      fs.writeFile(srcDirectoryRoot + '/index.ts', fileString, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}
CreateIconMap();
