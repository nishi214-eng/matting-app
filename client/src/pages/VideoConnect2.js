import React from 'react';
import socketClient from 'socket.io-client';

const SERVER = "http://localhost:3001";

const socket = socketClient(SERVER);

var isHost = false;
var room = 'hoge';

const constraints = {
  video: true,
  audio: false,
}
const offerOptions = {
  offerToReceiveVideo: 1,
}

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


export default function VideoConnect2() {
    const localVideoRef = React.useRef(null);
    const remoteVideoRef = React.useRef(null);
    const [isKnocking, setIsKnocking] = React.useState(false);
    const [canCalling, setCanCalling] = React.useState(false);
    const [isAllowed, setIsAllowed] = React.useState(false);
  
    socket.on('knocked response', (numClients, room) => {
      if (numClients === 0) {
        socket.emit('create', room);
      } else if (numClients === 1) {
        socket.emit('join', room);
      } else {
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
      } else {
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
      console.log('Offer received');
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
        peerConnection.addIceCandidate(
          new RTCIceCandidate({
            sdpMLineIndex: description.label,
            candidate: description.candidate,
          })
        ).catch(handleIceCandidateError);
      }
    });
  
    function createPeerConnection() {
      try {
        peerConnection = new RTCPeerConnection(config);
        peerConnection.onicecandidate = handleConnection;
        peerConnection.onaddstream = handleAddStream;
        peerConnection.onremovestream = handleRemoveStream;
        console.log('PeerConnection is created');
      } catch (error) {
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
      } else {
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
  
    React.useEffect(() => {
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
  
    React.useEffect(() => {
      remoteVideoRef.current.srcObject = remoteStream;
    }, [isAllowed]);
  
    return (
      <div className="VideoView">
        <video playsInline autoPlay ref={localVideoRef} />
        <video playsInline autoPlay ref={remoteVideoRef} />
        <br />
        <button onClick={allowJoin} disabled={!isKnocking}>ALLOW</button>
        <button onClick={calling} disabled={!canCalling}>CALL</button>
      </div>
    );
  }
  