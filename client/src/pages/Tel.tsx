import { useRef,useEffect } from "react";
export default function VideoView() {
  const videoRef = useRef(null);
  const constraints = {
    video: true,
    audio: true,
  }
  // カメラ映像と音声の取得
  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
            (videoRef.current as HTMLVideoElement).srcObject = stream;
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  return (
    // ビデオの表示
    <div className="VideoView">
      <video playsInline autoPlay ref={videoRef} />
    </div>
  )
}
