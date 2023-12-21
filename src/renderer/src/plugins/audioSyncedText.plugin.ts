import * as ss from 'superstruct';
import { Plugin } from '../Plugin';

export const AudioSyncedText: Plugin = {
  pluginName: 'Audio Synced Text',
  pluginHandlers: {
    mediaPlayerTimeUpdate: (val: number, { query }) => {
      //
      query.textitems.sort((val) => val);
    },
  },
  validators: { textitems: { TiAudioTimestampSecs: ss.number() } },
};
