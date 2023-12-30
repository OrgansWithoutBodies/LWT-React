import { SettingSpec, SettingsObject, settingSpec } from "lwt-schemas";
import { useSettingWithDefault } from "lwt-ui-kit";
import SplitPane from "react-split-pane";
type FrameSizeKeys<
  THFrameKey extends keyof SettingsObject,
  TLFrameKey extends keyof SettingsObject,
  TRFrameKey extends keyof SettingsObject
> = {
  hFrameHeightKey: SettingsObject[THFrameKey] extends SettingsObject["set-text-h-frameheight-no-audio"]
    ? THFrameKey
    : never;
  lFrameWidthPercKey: SettingsObject[TLFrameKey] extends SettingsObject["set-test-l-framewidth-percent"]
    ? TLFrameKey
    : never;
  rFrameHeightPercKey: SettingsObject[TRFrameKey] extends SettingsObject["set-test-r-frameheight-percent"]
    ? TRFrameKey
    : never;
};
/**
 *
 */
export function FourFramePage<
  THFrameKey extends keyof SettingSpec,
  TLFrameKey extends keyof SettingSpec,
  TRFrameKey extends keyof SettingSpec
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
      minSize={`${settingSpec["set-test-l-framewidth-percent"]["min"]}%`}
      maxSize={`${settingSpec["set-test-l-framewidth-percent"]["max"]}%`}
      defaultSize={`${lFrameWidthPerc}%`}
    >
      <SplitPane
        style={{ overflowWrap: "break-word" }}
        minSize={`${settingSpec["set-test-h-frameheight"]["min"]}`}
        maxSize={`${settingSpec["set-test-h-frameheight"]["max"]}`}
        split="horizontal"
        defaultSize={`${hFrameHeight}`}
      >
        <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>
          <ULFrame />
        </div>
        <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>
          <BLFrame />
        </div>
      </SplitPane>
      <SplitPane
        minSize={`${settingSpec["set-test-r-frameheight-percent"]["min"]}%`}
        maxSize={`${settingSpec["set-test-r-frameheight-percent"]["max"]}%`}
        split="horizontal"
        defaultSize={`${rFrameHeightPerc}%`}
      >
        <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>
          <URFrame />
        </div>
        <div style={{ overflowY: "auto", scrollbarWidth: "none" }}>
          <BRFrame />
        </div>
      </SplitPane>
    </SplitPane>
  );
}
