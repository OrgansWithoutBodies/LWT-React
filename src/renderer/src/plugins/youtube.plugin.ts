import * as ss from 'superstruct';

export const YoutubePlugin = {
  validators: {
    languages: {
      LgYoutubeSubtitleKey: ss.optional(ss.string()),
    },
  } as const,
  service: {
    getYoutubeMP3AndURL: async (youtubeUrl: string) => {},
  },
};
