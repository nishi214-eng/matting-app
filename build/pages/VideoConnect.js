"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VideoConnect;
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const react_1 = __importDefault(require("react"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const useSnackber_1 = require("../store/useSnackber");
const react_2 = require("react");
const LocalPhone_1 = __importDefault(require("@mui/icons-material/LocalPhone"));
const SERVER = "http://localhost:3001";
const socket = (0, socket_io_client_1.default)(SERVER);
var isHost = false;
const constraints = {
    video: true,
    audio: true,
};
const offerOptions = {
    offerToReceiveVideo: 1,
};
var localStream = null;
var remoteStream = null;
var peerConnection = null;
var isStarted = false;
let config = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" },
        { "urls": "stun:stun2.l.google.com:19302" },
    ]
};
function VideoConnect({ room }) {
    const { showAlert } = (0, react_2.useContext)(useSnackber_1.AlertContext);
    const localVideoRef = react_1.default.useRef(null);
    const remoteVideoRef = react_1.default.useRef(null);
    const [isKnocking, setIsKnocking] = react_1.default.useState(false);
    const [canCalling, setCanCalling] = react_1.default.useState(false);
    const [isAllowed, setIsAllowed] = react_1.default.useState(false);
    socket.on('knocked response', (numClients, room) => {
        if (numClients === 0) {
            socket.emit('create', room);
        }
        else if (numClients === 1) {
            socket.emit('join', room);
        }
        else {
            console.log("room [" + room + "] is full.");
        }
    });
    socket.on('created', (room) => {
        console.log('[Server said] you created room [' + room + ']');
        isHost = true;
        if (!isStarted) {
            startConnect();
        }
    });
    socket.on('joined', (room, id) => {
        console.log('[Server said] ' + id + ' joined room [' + room + ']');
        if (isHost) {
            setIsKnocking(true);
        }
        else {
            if (!isStarted) {
                startConnect();
            }
        }
    });
    socket.on('allowed', () => {
        console.log('allowed!');
        setIsAllowed(true);
    });
    socket.on('offer', (description) => {
        showAlert(`通話を受信しました！応答する場合は「接続」を押してください`, "success");
        if (!isHost && !isStarted) {
            startConnect();
        }
        peerConnection.setRemoteDescription(description)
            .then(() => {
            return peerConnection.createAnswer();
        })
            .then(setLocalAndSendMessage)
            .catch(handleAnswerError);
    });
    socket.on('answer', (description) => {
        console.log('Answer received');
        if (isStarted) {
            peerConnection.setRemoteDescription(description).catch(handleSetRemoteError);
        }
    });
    socket.on('candidate', (description) => {
        console.log('Candidate received');
        if (isStarted) {
            peerConnection.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: description.label,
                candidate: description.candidate,
            })).catch(handleIceCandidateError);
        }
    });
    function createPeerConnection() {
        try {
            peerConnection = new RTCPeerConnection(config);
            peerConnection.onicecandidate = handleConnection;
            peerConnection.onaddstream = handleAddStream;
            peerConnection.onremovestream = handleRemoveStream;
            console.log('PeerConnection is created');
        }
        catch (error) {
            console.error('[ERROR] PeerConnection creation failed:', error);
            return;
        }
    }
    function handleConnection(event) {
        if (event.candidate && peerConnection.signalingState !== 'stable') {
            console.log(peerConnection.signalingState);
            socket.emit('message', {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
            });
        }
        else {
            console.log('End of candidates');
        }
    }
    function handleAddStream(event) {
        console.log('Add stream');
        remoteStream = event.stream;
    }
    function handleRemoveStream(event) {
        console.log('[ERROR] Stream removed:', event);
    }
    function startConnect() {
        createPeerConnection();
        peerConnection.addStream(localStream);
        isStarted = true;
        if (!isHost) {
            peerConnection.createOffer(offerOptions)
                .then(setLocalAndSendMessage)
                .catch(handleOfferError);
        }
    }
    function setLocalAndSendMessage(description) {
        peerConnection.setLocalDescription(description)
            .then(() => {
            socket.emit('message', description);
        })
            .catch(handleSetLocalError);
    }
    function handleOfferError(error) {
        console.error("[ERROR] Offer creation failed:", error);
    }
    function handleAnswerError(error) {
        console.error("[ERROR] Answer creation failed:", error);
    }
    function handleIceCandidateError(error) {
        console.error("[ERROR] ICE Candidate addition failed:", error);
    }
    function handleSetRemoteError(error) {
        console.error("[ERROR] Remote SDP set failed:", error);
    }
    function handleSetLocalError(error) {
        console.error("[ERROR] Local SDP set failed:", error);
    }
    function allowJoin() {
        console.log('Allowing join');
        socket.emit('allow');
        setIsAllowed(true);
    }
    function calling() {
        console.log('Sending knock');
        socket.emit('knock', room);
    }
    react_1.default.useEffect(() => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
            localStream = stream;
            console.log(localStream);
            localVideoRef.current.srcObject = stream;
            setCanCalling(true);
        })
            .catch((error) => {
            console.error("ERROR accessing media devices:", error);
        });
    }, []);
    react_1.default.useEffect(() => {
        remoteVideoRef.current.srcObject = remoteStream;
    }, [isAllowed]);
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
            gap: 2, // アイテム間のスペース
        }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: 2, marginBottom: 2, flexDirection: 'column', }, children: [(0, jsx_runtime_1.jsx)("video", { playsInline: true, autoPlay: true, muted: true, ref: localVideoRef, style: {
                            width: '300px',
                            height: 'auto',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                        } }), (0, jsx_runtime_1.jsx)("video", { playsInline: true, autoPlay: true, ref: remoteVideoRef, style: {
                            width: '300px',
                            height: 'auto',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                        } })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: allowJoin, disabled: !isKnocking, sx: {
                            padding: '10px 20px',
                            borderRadius: '8px',
                            minWidth: '120px',
                            backgroundColor: '#4CAF50',
                            '&:hover': {
                                backgroundColor: '#45a049',
                            },
                        }, children: "\u63A5\u7D9A" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "secondary", onClick: calling, disabled: !canCalling, sx: {
                            padding: '10px 20px',
                            borderRadius: '8px',
                            minWidth: '120px',
                            backgroundColor: '#2196F3',
                            '&:hover': {
                                backgroundColor: '#0b7dda',
                            },
                        }, children: "CALL" })] })] }));
}
