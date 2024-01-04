import * as ss from "superstruct";

export const YoutubeCaptionPlugin = {
  pluginDependencies: ["youtube-audio-download", "text-reader-audio-sync"],
  validators: {
    languages: {
      LgYoutubeSubtitleKey: ss.optional(ss.string()),
    },
  } as const,
  service: {
    getYoutubeMP3AndURL: async (youtubeUrl: string) => {
      console.log("TEST123-TODO", youtubeUrl);
    },
  },
};
