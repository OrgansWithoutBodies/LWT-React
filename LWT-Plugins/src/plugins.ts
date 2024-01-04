import { Plugin } from "lwt-plugins";
import { LoremIpsum } from "./plugins/lorem-ipsum/LoremIpsum";
import { LWTReactInfo } from "./plugins/lwt-react-info/LWTReactInfo";
import { TatoebaPlugin } from "./plugins/tatoeba/tatoeba.plugin";
export const registeredPlugins: readonly Plugin[] = [
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
    pluginName: "lwt-react-info",
    landingPageLinks: [
      null,
      { link: "/lwt_react_info", label: "LWT React Info" },
    ],
    routes: { "/lwt_react_info": LWTReactInfo },
  },
  {
    pluginName: "demo-lorem-ipsum",
    landingPageLinks: [null, { link: "/lorem_ipsum", label: "Lorem Ipsum" }],
    routes: { "/lorem_ipsum": () => LoremIpsum({ len: 1000 }) },
  },
] as const;
