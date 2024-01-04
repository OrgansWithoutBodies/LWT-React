import { formatTime } from "lwt-common";
import React, { ForwardedRef, useEffect, useState } from "react";
import { Icon } from "./Icon";
import {
  GetPlaybackrateSelectoptions,
  GetSecondsSelectoptions,
} from "./SelectOptions";

// TODO timemarkers that sync up words to points of time in audio
// TODO plays
/**
 *
 * @param audio
 */
function AudioPlayerImpl(
  { audioURL: audioURL }: { audioURL: string },
  ref: ForwardedRef<HTMLAudioElement>
) {
  const [headPos, setHeadPos] = useState<number>(0);

  const {
    getCurrentHead,
    playing,
    toggle,
    setVolume,
    playbackRate,
    playerRepeatMode,
    seekStep,
    setPlaybackRate,
    setSeekStep,
    setPlayerRepeatMode,
    setHead,
    setHeadPerc,
    volume,
    duration,
    setPlaying,
    // audio,
  } = useAudio(
    audioURL,
    // ref,
    (val) => setHeadPos(val)
  );
  //   TODO
  //   ref = audio;
  console.log("TEST123-audio", ref, audioURL);

  const headPerc = (headPos / duration) * 100;
  /**
   *
   */
  function click_slower() {
    const newPlaybackRate = Math.max(5, playbackRate - 1);
    setPlaybackRate(newPlaybackRate);
  }

  /**
   *
   */
  function click_faster() {
    const newPlaybackRate = Math.min(15, playbackRate + 1);
    setPlaybackRate(newPlaybackRate);
  }

  /**
   *
   */
  function click_single() {
    // $('#jquery_jplayer_1').unbind($.jPlayer.event.ended + '.jp-repeat');
    // $('#do-single').addClass('hide');
    // $('#do-repeat').removeClass('hide');
    setPlayerRepeatMode(0);
    // do_ajax_save_setting('currentplayerrepeatmode', '0');
    return false;
  }

  /**
   *
   */
  function click_repeat() {
    setPlayerRepeatMode(1);
    return false;
  }

  /**
   *
   */
  function click_stdspeed() {
    setPlaybackRate(10);
  }

  /**
   *
   */
  function click_back() {
    const t = getCurrentHead();
    const b = seekStep;
    const nt = t - b;
    setHead(Math.max(0, nt));
  }

  /**
   *
   */
  function click_forw() {
    const t = getCurrentHead();
    const b = seekStep;
    const nt = t + b;
    setHead(nt);
  }

  function onStop() {
    setPlaying(false);
    setHead(0);
  }

  // const [{ settings }] = useData(['settings']);
  //   const { currentplayerrepeatmode, currentplayerseconds, currentplaybackrate } =

  //   const $playerskin = 'jplayer.blue.monday.modified';
  return (
    <>
      {/* <link
        type="text/css"
        href={`css/jplayer_skin/${$playerskin}.css`}
        rel="stylesheet"
      /> */}

      <table
        align="center"
        style={{ marginTop: "5px" }}
        cellSpacing={0}
        cellPadding={0}
      >
        <tbody>
          <tr>
            <td className="center borderleft" style={{ paddingLeft: "10px" }}>
              <span
                id="do-single"
                onClick={click_single}
                className={`click${playerRepeatMode ? "" : " hide"}`}
              >
                <Icon
                  src="arrow-repeat"
                  title="Toggle Repeat (Now ON)"
                  style={{ width: "24px", height: "24px" }}
                />
              </span>
              <span
                id="do-repeat"
                onClick={click_repeat}
                className={`click${playerRepeatMode ? " hide" : ""}`}
              >
                <Icon
                  src="arrow-norepeat"
                  title="Toggle Repeat (Now OFF)"
                  style={{ width: "24px", height: "24px" }}
                />
              </span>
            </td>
            <td className="center bordermiddle">&nbsp;</td>
            <td className="bordermiddle">
              <div id="jquery_jplayer_1" className="jp-jplayer">
                {/* <audio id="jp_audio_0" preload="metadata" src={audio}></audio> */}
              </div>
              <div id="jp_container_1" className="jp-audio">
                <div className="jp-type-single">
                  <div className="jp-gui jp-interface">
                    <ul className="jp-controls">
                      {!playing ? (
                        <li>
                          <a
                            href="javascript:;"
                            className="jp-play"
                            tabIndex={1}
                            onClick={toggle}
                          >
                            play
                          </a>
                        </li>
                      ) : (
                        <li>
                          <a
                            href="javascript:;"
                            className="jp-pause"
                            tabIndex={1}
                            onClick={toggle}
                          >
                            pause
                          </a>
                        </li>
                      )}
                      <li>
                        <a
                          href="javascript:;"
                          className="jp-stop"
                          tabIndex={1}
                          onClick={onStop}
                        >
                          stop
                        </a>
                      </li>
                      {volume !== 0 ? (
                        <li>
                          <a
                            href="javascript:;"
                            className="jp-mute"
                            tabIndex={1}
                            title="mute"
                            onClick={() => setVolume(0)}
                          >
                            mute
                          </a>
                        </li>
                      ) : (
                        <li>
                          <a
                            href="javascript:;"
                            className="jp-unmute"
                            onClick={() => setVolume(1)}
                            tabIndex={1}
                            title="unmute"
                          >
                            unmute
                          </a>
                        </li>
                      )}
                    </ul>
                    <div
                      className="jp-progress"
                      onClick={(event) => console.log(event)}
                    >
                      <div
                        className="jp-seek-bar"
                        // TODO mouse drag events
                        onClick={(event) =>
                          getPercentClickedAlongElementWidth(event, setHeadPerc)
                        }
                      >
                        <div
                          className="jp-play-bar"
                          style={{ width: `${headPerc}%` }}
                        ></div>
                      </div>
                    </div>
                    <div
                      onClick={(event) =>
                        getPercentClickedAlongElementWidth(event, setVolume)
                      }
                      className="jp-volume-bar"
                    >
                      <div
                        className="jp-volume-bar-value"
                        style={{ width: `${volume * 100}%` }}
                      ></div>
                    </div>
                    <div className="jp-time-holder">
                      <div className="jp-current-time">
                        {formatTime(headPos)}
                      </div>
                      <div className="jp-duration">{formatTime(duration)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td className="center bordermiddle">&nbsp;</td>
            <td className="center bordermiddle">
              <select
                id="backtime"
                name="backtime"
                onChange={({ target: { value } }) =>
                  setSeekStep(Number.parseInt(value))
                }
              >
                <GetSecondsSelectoptions selectedVal={seekStep} />
              </select>
              <br />
              <span
                id="backbutt"
                className="click"
                onClick={() => click_back()}
              >
                <Icon src="arrow-circle-225-left" title="Rewind n seconds" />
              </span>
              &nbsp;&nbsp;
              <span
                id="forwbutt"
                className="click"
                onClick={() => click_forw()}
              >
                <Icon src="arrow-circle-315" title="Forward n seconds" />
              </span>
              <span id="playTime" className="hide"></span>
            </td>
            <td className="center bordermiddle">&nbsp;</td>
            <td className="center borderright" style={{ paddingRight: "10px" }}>
              <select
                id="playbackrate"
                name="playbackrate"
                onChange={({ target: { value } }) =>
                  setPlaybackRate(Number.parseInt(value))
                }
              >
                <GetPlaybackrateSelectoptions selectedVal={playbackRate} />
              </select>
              <br />
              <span
                id="slower"
                className="click"
                onClick={() => click_slower()}
              >
                <Icon src="minus" title="Slower" style={{ marginTop: "3px" }} />
              </span>
              &nbsp;
              <span
                id="stdspeed"
                className="click"
                onClick={() => click_stdspeed()}
              >
                <Icon
                  src="status-away"
                  title="Normal"
                  style={{ marginTop: "3px" }}
                />
              </span>
              &nbsp;
              <span
                id="faster"
                className="click"
                onClick={() => click_faster()}
              >
                <Icon
                  onClick={() => click_faster()}
                  src="plus"
                  title="Faster"
                  style={{ marginTop: "3px" }}
                />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

{
  /* <?php echo ($repeatMode ? "click_repeat();\n" : ''); ?> */
}

{
  /* {

$(document).ready(function(){
      $("#jquery_jplayer_1").jPlayer({
    ready: function () {
      $(this).jPlayer("setMedia", { <?php
      audio = trim(audio);
      if (strcasecmp(substr(audio, -4), '.mp3') == 0) {
          echo 'mp3: ' . prepare_textdata_js(encodeURI(audio));
      } elseif (strcasecmp(substr(audio, -4), '.ogg') == 0) {
          echo 'oga: ' . prepare_textdata_js(encodeURI(audio)) . ", " .
              'mp3: ' . prepare_textdata_js(encodeURI(audio));
      } elseif (strcasecmp(substr(audio, -4), '.wav') == 0) {
          echo 'wav: ' . prepare_textdata_js(encodeURI(audio)) . ", " .
              'mp3: ' . prepare_textdata_js(encodeURI(audio));
      } else {
          echo 'mp3: ' . prepare_textdata_js(encodeURI(audio));
      }
      ?> });
    },
    swfPath: "js",
    noVolume: {ipad: /^no$/, iphone: /^no$/, ipod: /^no$/, android_pad: /^no$/, android_phone: /^no$/, blackberry: /^no$/, windows_ce: /^no$/, iemobile: /^no$/, webos: /^no$/, playbook: /^no$/}
  });

  $("#jquery_jplayer_1").bind($.jPlayer.event.timeupdate, function(event) { 
      $("#playTime").text(Math.floor(event.jPlayer.status.currentTime));
    });

  $("#jquery_jplayer_1").bind($.jPlayer.event.play, function(event) { 
      set_current_playbackrate();
      // console.log("play");
    });

  $("#playbackrate").change(set_new_playbackrate);
  $("#backtime").change(set_new_playerseconds);} 
  */
}

const useAudio = (
  url: string,
  // ref: Ref<HTMLAudioElement>,
  onTimeUpdate: (val: number) => void = () => {}
) => {
  const [audio] = useState(() => {
    const a = new Audio(url);
    a.preload = "metadata";
    console.log("audio", { a });
    return a;
  });
  //   TODO none of this working
  //   const audioRef = useRef<HTMLAudioElement>(audio);
  //   ref = audioRef;
  //   audio.preload = 'metadata';
  //   console.log('TEST123-AUDIOREF', ref);
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(10);
  const [seekStep, setSeekStep] = useState(1);
  const [head, setHead] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playerRepeatMode, setPlayerRepeatMode] = useState(1);
  const handleSetPlayHead = (settingHead: number) => {
    setHead(settingHead);
    audio.currentTime = settingHead;
  };

  const toggle = () => {
    setPlaying(!playing);
  };
  const handleSetVolume = (vol: number) => {
    setVolume(Math.max(0, Math.min(vol, 1)));
  };
  const handleSetPlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
  };
  const setPlayerHead = (headPos: number) => (audio.currentTime = headPos);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);
  useEffect(() => {
    audio.volume = volume;
  }, [volume]);
  useEffect(() => {
    audio.currentTime = head;
  }, [head]);
  useEffect(() => {
    audio.playbackRate = playbackRate * 0.1;
  }, [playbackRate]);

  useEffect(() => {
    const stopPlayingOrRepeat = () => {
      if (playerRepeatMode === 1) {
        setPlayerHead(0);
        audio.play();
        return;
      }
      setPlaying(false);
    };
    const timeUpdate = (val: Event): void =>
      // TODO why cast necessary?
      onTimeUpdate((val.target as any as { currentTime: number }).currentTime);
    audio.addEventListener("timeupdate", timeUpdate);
    audio.addEventListener("ended", stopPlayingOrRepeat);
    return () => {
      console.log("TEST123-TEARDOWN");
      setPlaying(false);
      audio.removeEventListener("timeupdate", timeUpdate);
      audio.removeEventListener("ended", stopPlayingOrRepeat);
    };
  }, [playerRepeatMode]);
  return {
    playing,
    toggle,
    setPlaying,
    setVolume: handleSetVolume,
    volume,
    setPlaybackRate: handleSetPlaybackRate,
    playbackRate,
    playerRepeatMode,
    setPlayerRepeatMode,
    seekStep,
    setSeekStep,
    audio,
    setHead: handleSetPlayHead,
    setHeadPerc: (perc: number) => handleSetPlayHead(perc * audio.duration),
    getCurrentHead: () => audio.currentTime,
    duration: audio.duration,
  };
};
export const AudioPlayer = React.forwardRef(AudioPlayerImpl);
// TODO click and drag
const getPercentClickedAlongElementWidth = (
  { pageX, currentTarget }: React.MouseEvent,
  setPerc: (vol: number) => void
) => {
  const { left, width } = currentTarget.getBoundingClientRect();
  setPerc((pageX - left) / width);
};

export function createBufferAudioURL(audioBuffer: Uint8Array) {
  if (!window.AudioContext) {
    if (!(window as any).webkitAudioContext) {
      throw new Error("Your browser does NOT support any AudioContext!");
      // return undefined;
    }
    window.AudioContext = (window as any).webkitAudioContext;
  }
  var blob = new Blob([audioBuffer], { type: "audio/mp3" });

  var url = window.URL.createObjectURL(blob);
  console.log({ url });
  return url;
}
