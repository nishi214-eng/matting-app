"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VideoView;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function VideoView() {
    const videoRef = (0, react_1.useRef)(null);
    const constraints = {
        video: true,
        audio: true,
    };
    // カメラ映像と音声の取得
    (0, react_1.useEffect)(() => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        })
            .catch((error) => {
            console.log(error);
        });
    }, []);
    return (
    // ビデオの表示
    (0, jsx_runtime_1.jsx)("div", { className: "VideoView", children: (0, jsx_runtime_1.jsx)("video", { playsInline: true, autoPlay: true, ref: videoRef }) }));
}
