import { AppVariables } from 'lwt-build';
import { LoremIpsum } from 'lwt-ui-kit';
import { Plugin } from './Plugin';
import { LWTReactInfo } from './plugins/LWTReactInfo';
import { TatoebaPlugin } from './plugins/tatoeba.plugin';

const plugins: readonly Plugin[] = [
  //
  // ChineseMeasureWordColumnPlugin,
  // Term conjugation
  // Japanese Parser a la Lute
  // UserPlugin,
  // AnkiSyncServer,
  TatoebaPlugin,
  //   OtherPlugin,
  // Pons
  // LibreTranslate
  // MyMemory
  // GoogleTranslate
  // MicrosoftTranslate
  // PapagoTranslate
  // YandexTranslate
  // PonsTranslate

  // DeeplPlugin,
  {
    pluginName: 'lwt-react-info',
    landingPageLinks: [
      null,
      { link: '/lwt_react_info', label: 'LWT React Info' },
    ],
    routes: { '/lwt_react_info': LWTReactInfo },
  },
  {
    pluginName: 'demo-lorem-ipsum',
    landingPageLinks: [
      null,
      { link: '/lorem_ipsum', label: 'Demo Plugin Route' },
    ],
    routes: { '/lorem_ipsum': () => LoremIpsum({ len: 100 }) },
  },
] as const;

export const PLUGINS: Readonly<Plugin[]> = AppVariables.pluginsEnabled
  ? plugins
  : [];
