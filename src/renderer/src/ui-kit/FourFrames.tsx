import SplitPane from 'react-split-pane';
import { Settings, settingSpec } from '../data/settings';
import { useSettingWithDefault } from '../hooks/useSettingWithDefault';
type FrameSizeKeys<
  THFrameKey extends keyof Settings,
  TLFrameKey extends keyof Settings,
  TRFrameKey extends keyof Settings
> = {
  hFrameHeightKey: Settings[THFrameKey] extends Settings['set-text-h-frameheight-no-audio']
    ? THFrameKey
    : never;
  lFrameWidthPercKey: Settings[TLFrameKey] extends Settings['set-test-l-framewidth-percent']
    ? TLFrameKey
    : never;
  rFrameHeightPercKey: Settings[TRFrameKey] extends Settings['set-test-r-frameheight-percent']
    ? TRFrameKey
    : never;
};
/**
 *
 */
export function FourFramePage<
  THFrameKey extends keyof Settings,
  TLFrameKey extends keyof Settings,
  TRFrameKey extends keyof Settings
>({
  frameSizes: { lFrameWidthPercKey, rFrameHeightPercKey, hFrameHeightKey },
  ULFrame,
  BLFrame,
  URFrame,
  BRFrame,
}: {
  ULFrame: () => JSX.Element;
  BLFrame: () => JSX.Element;
  URFrame: () => JSX.Element;
  BRFrame: () => JSX.Element;
  frameSizes: FrameSizeKeys<THFrameKey, TLFrameKey, TRFrameKey>;
}) {
  //   maybe this in individual pane?
  //   useUpdateActiveText({ textID });

  const {
    [lFrameWidthPercKey]: lFrameWidthPerc,

    [rFrameHeightPercKey]: rFrameHeightPerc,

    // ['set-text-visit-statuses-via-key']: ADDFILTER,

    [hFrameHeightKey]: hFrameHeight,
  } = useSettingWithDefault([
    lFrameWidthPercKey,
    rFrameHeightPercKey,
    hFrameHeightKey,
  ]);

  return (
    <SplitPane
      split="vertical"
      minSize={settingSpec['set-test-l-framewidth-percent']['min']}
      maxSize={settingSpec['set-test-l-framewidth-percent']['max']}
      defaultSize={`${lFrameWidthPerc}%`}
    >
      <SplitPane
        style={{ overflowWrap: 'break-word' }}
        minSize={`${settingSpec['set-test-r-frameheight-percent']['min']}%`}
        maxSize={`${settingSpec['set-test-r-frameheight-percent']['max']}%`}
        split="horizontal"
        defaultSize={`${hFrameHeight}`}
      >
        <div style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
          <ULFrame />
        </div>
        <div style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
          <BLFrame />
        </div>
      </SplitPane>
      <SplitPane
        split="horizontal"
        minSize={50}
        defaultSize={`${rFrameHeightPerc}%`}
      >
        <div style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
          <URFrame />
        </div>
        <div style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
          <BRFrame />
        </div>
      </SplitPane>
    </SplitPane>
  );
}
