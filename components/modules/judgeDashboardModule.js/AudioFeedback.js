import { useEffect } from "react";
// import { useReactMediaRecorder } from "react-media-recorder";
import { useDispatch } from "react-redux";
import { uploadAudioFeedback } from "../../../Redux/Actions";

const AudioFeedback = ({
  stop,
  setStop,
  isActive,
  containerCode,
  recordingStatus,
  setRecordingStatus,
}) => {
  const dispatch = useDispatch();

  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    video: false,
    audio: true,
    echoCancellation: true,
  });

  if (status !== recordingStatus) setRecordingStatus(status);

  useEffect(() => {
    if (isActive) {
      startRecording();
    }
  }, [isActive]);

  useEffect(() => {
    if (stop) {
      stopRecording();
      setStop(false);
    }
  }, [stop]);

  const uploadAudioFile = async (mediaBlobUrl) => {
    const mediaBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    dispatch(uploadAudioFeedback(mediaBlob, containerCode));
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      uploadAudioFile(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  return <div />;
};

export default AudioFeedback;
