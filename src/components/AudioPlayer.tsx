import { useEffect, useRef } from "react";
const AudioPlayer = ({
  playAudio,
  setPlayAudio,
}: {
  playAudio: boolean;
  setPlayAudio: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (playAudio && audioRef.current) {
      audioRef.current?.play();
    }
    setTimeout(() => {
      setPlayAudio(false);
    }, 2000);
  }, [playAudio]);
  return (
    <audio ref={audioRef} src="./ding-audio.mp3" className="hidden"></audio>
  );
};

export default AudioPlayer;
