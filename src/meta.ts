import { StyleVariant } from './styles';

type VersionNumber =
  | `${number}.${number}.${number}`
  | `LEGACY-${number}.${number}.${number}`;
type FullMonthName =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';
type AppVersion =
  | {
      versionNumber: VersionNumber;
      releaseDate: `${FullMonthName} ${number} ${number}`;
    }
  | {
      versionNumber: 'NEXT';
      releaseDate: `א_0`;
    };

export type TAppContext = AppVersion & {
  styleVariant: StyleVariant;
  dbBackend: 'SQLite' | 'MySQL' | 'Postgres';
  wizardDataUri: string;
};
export const AppVariables: TAppContext = {
  versionNumber: 'LEGACY-1.0.0',
  releaseDate: 'February 20 2023',
  styleVariant: 'dark',
  dbBackend: 'SQLite',
  wizardDataUri: '',
} as const;
