import { TextItem } from "lwt-schemas";
import * as ss from "superstruct";
import { Plugin } from "../..";

export const AudioSyncedText: Plugin = {
  pluginName: "Audio Synced Text",
  pluginHandlers: {
    mediaPlayerTimeUpdate: (timeSec: number, { query }) => {
      //
      (query.textitems as (TextItem & { TiAudioTimestampSecs: number })[])
        .filter((val) => val.TiAudioTimestampSecs >= timeSec)
        .sort((a, b) =>
          a.TiAudioTimestampSecs > b.TiAudioTimestampSecs ? 1 : -1
        );
    },
  },
  validators: { textitems: { TiAudioTimestampSecs: ss.number() } },
};
