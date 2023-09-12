import { Spin } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVoiceRecodingUrl } from "../../../requests/container";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import ReactAudioPlayer from "react-audio-player";
import {
  SendIcon,
  PauseIcon,
  DeleteIcon,
  RecordMicIcon,
} from "../../../utility/iconsLibrary";
import { notify } from "../../../Redux/Actions";

const Recoding = ({
  setRecodingPayload,
  containerCode,
  onFeedBackChange,
  setRecording,
}) => {
  const [recordState, setRecordState] = useState(null);
  const judgeState = useSelector((state) => state.judge);
  const { containers } = judgeState;
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleUploadClick = async (audioData) => {
    const formData = new FormData();
    formData.append("file", audioData.blob);
    try {
      setLoading(true);
      const res = await getVoiceRecodingUrl(formData);
      onFeedBackChange(containerCode, res.location, true);
      setLoading(false);
      setRecording("");
      return res.location;
      setIsRecording(false);
      setAudioBlob(null);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const start = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        setRecordState(RecordState.START);
        setRecording("audio");
        // Microphone permission granted, stream contains the audio stream
        // You can use the stream to create a MediaStreamSource or perform other operations
      })
      .catch(function (error) {
        if (
          error.name === "PermissionDeniedError" ||
          error.name === "NotAllowedError"
        ) {
          console.error("Microphone permission denied by the user.");
          dispatch(
            notify({
              type: "error",
              message: "Microphone permission denied by the user.",
            })
          );
        } else {
          console.error("Error accessing microphone:", error);
          dispatch(notify({ type: "error", message: error }));
        }
      });
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
  };

  const pause = () => {
    setRecordState(RecordState.PAUSE);
  };

  const onStop = async (audioData, name) => {
    if (!audioData) return;
    if (name == "Pause delete") {
      return;
    }

    setRecodingPayload(audioData);
    const container = containers?.find(
      (container) => container.containerCode === containerCode
    );
    const responseUrl = await handleUploadClick(audioData);

    setAudio(responseUrl);
  };

  const handleDelete = (name) => {
    if (name == "Pause delete") {
      stop();
      onStop("", name);
      setAudio(null);
      setRecordState(null);
      setRecording("");
      return;
    }
    setAudio(null);
    setRecordState(null);
    setRecording("");
  };

  return (
    <div
      className={`${
        audio ? "static audioRecorderBlock" : "audioRecorderBlock"
      }`}
    >
      <strong className="teamScoringTitle">Audio Feedback</strong>
      {audio ? (
        <div className="audioRecordSended">
          <ReactAudioPlayer
            className=""
            src={audio}
            autoPlay={false}
            controls
          />
          <button
            className="ant-btn ant-btn-primary buttonDelete"
            onClick={() => handleDelete("")}
          >
            <DeleteIcon />
          </button>
        </div>
      ) : (
        <div className="audioRecorderHolder">
          <AudioReactRecorder state={recordState} onStop={onStop} />
          {recordState == "start" || recordState == "pause" ? (
            <button
              className="ant-btn ant-btn-primary buttonDelete"
              onClick={() => handleDelete("Pause delete")}
            >
              <DeleteIcon />
            </button>
          ) : (
            ""
          )}
          <span className={recordState == "start" ? "recording" : ""}>
            {recordState == "start" ? " " : ""}

            <div className="audio-player">
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </span>

          <div className="audioRecorderButtons">
            {/* <h1>Timer: {time.minutes < 10 ? '0' : ''}{time.minutes}:{time.seconds < 10 ? '0' : ''}{time.seconds}</h1> */}
            {!recordState || recordState == "pause" ? (
              <button
                className="ant-btn ant-btn-primary buttonPlay"
                onClick={start}
              >
                <RecordMicIcon />
              </button>
            ) : (
              ""
            )}

            {!recordState || recordState == "pause" ? (
              ""
            ) : (
              <button
                disabled={loading}
                className="ant-btn ant-btn-primary buttonPause"
                onClick={pause}
              >
                <PauseIcon />
              </button>
            )}
            {recordState == "pause" || recordState == "start" ? (
              <button
                disabled={loading}
                className="ant-btn ant-btn-primary buttonSend"
                onClick={stop}
              >
                <SendIcon />
              </button>
            ) : (
              ""
            )}
            {loading ? <div className="loader-icon" /> : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recoding;
