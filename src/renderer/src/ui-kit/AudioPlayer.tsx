import { useEffect, useState } from 'react';
import {
  GetPlaybackrateSelectoptions,
  GetSecondsSelectoptions,
} from '../pages/SelectOptions';

/**
 *
 * @param $audio
 */
export function MakeAudioPlayer({ $audio }: { $audio: string }) {
  const {
    playing,
    toggle,
    setVolume,
    playbackRate,
    playerRepeatMode,
    seekStep,
    setSeekStep,
    click_single,
    click_repeat,
    click_back,
    click_forw,
    click_stdspeed,
    click_slower,
    click_faster,
  } = useAudio($audio);
  /**
   *
   * @param p
   */
  //   function new_pos(p) {

  //     $('#jquery_jplayer_1').jPlayer('playHead', p);
  //   }

  //   /**
  //    *
  //    */
  //   function set_new_playerseconds() {
  //     // setPlayHead()
  //     const newval = $('#backtime :selected').val();
  //     do_ajax_save_setting('currentplayerseconds', newval);
  //     // console.log("set_new_playerseconds="+newval);
  //   }

  //   /**
  //    *
  //    */
  //   function set_new_playbackrate() {
  //     const newval = $('#playbackrate :selected').val();
  //     do_ajax_save_setting('currentplaybackrate', newval);
  //     $('#jquery_jplayer_1').jPlayer('option', 'playbackRate', newval * 0.1);
  //     // console.log("set_new_playbackrate="+newval);
  //   }

  //   /**
  //    *
  //    */
  //   function set_current_playbackrate() {
  //     const val = $('#playbackrate :selected').val();
  //     $('#jquery_jplayer_1').jPlayer('option', 'playbackRate', val * 0.1);
  //     // console.log("set_current_playbackrate="+val);
  //   }

  // const [{ settings }] = useData(['settings']);
  //   TODO save setting?
  //   const { currentplayerrepeatmode, currentplayerseconds, currentplaybackrate } =

  const $playerskin = 'jplayer.blue.monday.modified';
  return (
    <>
      <link
        type="text/css"
        href={`css/jplayer_skin/${$playerskin}.css`}
        rel="stylesheet"
      />
      {/* <script type="text/javascript" src="js/jquery.jplayer.min.js"></script> */}
      <table
        align="center"
        style={{ marginTop: '5px' }}
        cellSpacing={0}
        cellPadding={0}
      >
        <tr>
          <td className="center borderleft" style={{ paddingLeft: '10px' }}>
            <span
              id="do-single"
              onClick={() => click_single()}
              className={`click${playerRepeatMode ? '' : ' hide'}`}
            >
              <img
                src="icn/arrow-repeat.png"
                alt="Toggle Repeat (Now ON)"
                title="Toogle Repeat (Now ON)"
                style={{ width: '24px', height: '24px' }}
              />
            </span>
            <span
              id="do-repeat"
              onClick={() => click_repeat()}
              className={`click${playerRepeatMode ? ' hide' : ''}`}
            >
              <img
                src="icn/arrow-norepeat.png"
                alt="Toggle Repeat (Now OFF)"
                title="Toggle Repeat (Now OFF)"
                style={{ width: '24px', height: '24px' }}
              />
            </span>
          </td>
          <td className="center bordermiddle">&nbsp;</td>
          <td className="bordermiddle">
            <div id="jquery_jplayer_1" className="jp-jplayer">
              {/* <audio id="jp_audio_0" preload="metadata" src={$audio}></audio> */}
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
                          onClick={() => toggle()}
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
                          onClick={() => toggle()}
                        >
                          pause
                        </a>
                      </li>
                    )}
                    <li>
                      <a href="javascript:;" className="jp-stop" tabIndex={1}>
                        stop
                      </a>
                    </li>
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
                  </ul>
                  <div className="jp-progress">
                    <div className="jp-seek-bar">
                      <div className="jp-play-bar"></div>
                    </div>
                  </div>
                  <div className="jp-volume-bar">
                    <div className="jp-volume-bar-value"></div>
                  </div>
                  <div className="jp-time-holder">
                    <div className="jp-current-time"></div>
                    <div className="jp-duration"></div>
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
            <span id="backbutt" className="click" onClick={() => click_back()}>
              <img
                src="icn/arrow-circle-225-left.png"
                alt="Rewind n seconds"
                title="Rewind n seconds"
              />
            </span>
            &nbsp;&nbsp;
            <span id="forwbutt" className="click" onClick={() => click_forw()}>
              <img
                src="icn/arrow-circle-315.png"
                alt="Forward n seconds"
                title="Forward n seconds"
              />
            </span>
            <span id="playTime" className="hide"></span>
          </td>
          <td className="center bordermiddle">&nbsp;</td>
          <td className="center borderright" style={{ paddingRight: '10px' }}>
            <select id="playbackrate" name="playbackrate">
              <GetPlaybackrateSelectoptions selectedVal={playbackRate} />
            </select>
            <br />
            <span id="slower" className="click" onClick={() => click_slower()}>
              <img
                src="icn/minus.png"
                alt="Slower"
                title="Slower"
                style={{ marginTop: '3px' }}
              />
            </span>
            &nbsp;
            <span
              id="stdspeed"
              className="click"
              onClick={() => click_stdspeed()}
            >
              <img
                src="icn/status-away.png"
                alt="Normal"
                title="Normal"
                style={{ marginTop: '3px' }}
              />
            </span>
            &nbsp;
            <span id="faster" className="click" onClick={() => click_faster()}>
              <img
                onClick={() => click_faster()}
                src="icn/plus.png"
                alt="Faster"
                title="Faster"
                style={{ marginTop: '3px' }}
              />
            </span>
          </td>
        </tr>
      </table>
    </>
  );
}
{
  /* // export function useAudioPlayer() */
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
      $audio = trim($audio);
      if (strcasecmp(substr($audio, -4), '.mp3') == 0) {
          echo 'mp3: ' . prepare_textdata_js(encodeURI($audio));
      } elseif (strcasecmp(substr($audio, -4), '.ogg') == 0) {
          echo 'oga: ' . prepare_textdata_js(encodeURI($audio)) . ", " .
              'mp3: ' . prepare_textdata_js(encodeURI($audio));
      } elseif (strcasecmp(substr($audio, -4), '.wav') == 0) {
          echo 'wav: ' . prepare_textdata_js(encodeURI($audio)) . ", " .
              'mp3: ' . prepare_textdata_js(encodeURI($audio));
      } else {
          echo 'mp3: ' . prepare_textdata_js(encodeURI($audio));
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

const useAudio = (url: string) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(10);
  const [seekStep, setSeekStep] = useState(1);
  const [playerRepeatMode, setPlayerRepeatMode] = useState(1);

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
    // TODO
    // $('#jquery_jplayer_1').bind(
    //   $.jPlayer.event.ended + '.jp-repeat',
    //   function (event) {
    //     $(this).jPlayer('play');
    //   }
    // );
    setPlayerRepeatMode(1);
    return false;
  }

  /**
   *
   */
  function click_back() {
    const t = playHead;
    const b = seekStep;
    const nt = t - b;
    setPlayHead(Math.max(0, nt));
    // $('#jquery_jplayer_1').jPlayer('play', nt);
  }

  /**
   *
   */
  function click_forw() {
    const t = playHead;
    const b = seekStep;
    const nt = t + b;
    setPlayHead(nt);
    // $('#jquery_jplayer_1').jPlayer('play', nt);
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
  function click_slower() {
    console.log('CLICK', playbackRate);
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

  //   const [playHead, setPlayHead] = useState(0);
  const toggle = () => {
    console.log(audio);
    setPlaying(!playing);
  };
  const setVolume = (vol: number) =>
    (audio.volume = Math.max(0, Math.min(vol, 1)));
  const handleSetPlaybackRate = (rate: number) => {
    console.log('SETTING RATE', rate);
    setPlaybackRate(rate);
  };
  const setPlayerHead = (headPos: number) => (audio.currentTime = headPos);
  useEffect(() => {
    playing ? audio.play() : audio.pause();
    audio.playbackRate = playbackRate * 0.1;
  }, [playing, playbackRate, playerRepeatMode]);

  useEffect(() => {
    const stopPlayingOrRepeat = () => {
      if (playerRepeatMode === 1) {
        setPlayerHead(0);
        audio.play();
        return;
      }
      setPlaying(false);
    };
    audio.addEventListener('ended', stopPlayingOrRepeat);
    return () => {
      audio.removeEventListener('ended', stopPlayingOrRepeat);
    };
  }, [playerRepeatMode]);

  return {
    playing,
    toggle,
    setVolume,
    setPlaybackRate: handleSetPlaybackRate,
    playbackRate,
    playerRepeatMode,
    setPlayerRepeatMode,
    seekStep,
    setSeekStep,
    click_single,
    click_repeat,
    click_back,
    click_forw,
    click_stdspeed,
    click_slower,
    click_faster,
  };
};
