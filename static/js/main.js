import Message from '../js/objects/Message.js';
import User from '../js/objects/User.js';
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
var username = "";
const socket = io();
var user;
var meetingID = window.location.pathname.split("/")[2];
var chatHidden = false;
var peerID;
const videoGrid = document.getElementById("video-grid");
let myVideoStream;
let peers = [];
const myVideo = document.createElement("video");
myVideo.muted = true;
window.onload = () => {
    if (isUUID(meetingID)) {
        createUser(false)
    } else {
        alert("Invalid meeting ID")
        window.location = "/"
    }
    $(".chat-input").on('keypress', function (e) {
        if (e.which == (12 + 1)) {
            var m = new Message(username, $(".chat-input").val(), meetingID);
            document.getElementById("messages").innerHTML += m.toHTML()
            $(".chat-input").val("");
            socket.emit('message', JSON.stringify(m));
        }
    })
    $("#leave").on('click', function (e) {
        if (user) {
            socket.emit('userDisconnected', JSON.stringify(user));
        }
        setTimeout(function () {
            window.location = "/"
        }, 100);

    })
    $("#hidechat").on('click', function () {
        if (chatHidden == false) {
            $("#main").attr('class', 'col-sm-12 p-0 main__left')
            $("#chat").hide();
            chatHidden = true;
        } else {
            $("#main").attr('class', ' main__left')
            $("#chat").show();
            chatHidden = false;
        }
    })
}
var peer = new Peer({
    config: {
        'iceServers': [
            { url: 'stun:stun.l.google.com:19302' }
        ]
    },
    secure: true
});
const isUUID = (uuid) => {
    let s = "" + uuid;
    s = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
    if (s === null) {
        return false;
    }
    return true;
}
peer.on("open", id => {
    peerID = id;
    console.log("connection established: " + peerID);
})
window.onbeforeunload = function () {
    e.preventDefault();
    e.returnValue = 'Test';
}
const initVideo = () => {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    }).then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        peer.on("call", call => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", userStream => {
                addVideoStream(video, userStream);
            })
        })
        socket.on('newUser', function (msg) {
            const input = JSON.parse(msg);
            var userID = input.userID;
            if (input.meetingID == meetingID) {
                console.log(`connecting to user: ${userID}`)
                setTimeout(function () {
                    connectToNewUser(userID, stream);
                }, 1000);

            }
        })
    });
}
const connectToNewUser = (userId, stream) => {
    console.log("connecting to" + userId)
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })
    peers[userId] = call
}
socket.on('userDisconnected', function (msg) {
    const data = JSON.parse(msg);
    if (peers[data.userID]) peers[data.userID].close()
})
socket.on('message', function (msg) {
    if (msg == "userExists") {
        createUser(true)
    } else if (msg == "userOK") {
        socket.emit('newUser', JSON.stringify(user));
        initVideo();
    } else {
        const input = JSON.parse(msg);
        if (input.user !== username && input.meetingID == meetingID) {
            const recv = new Message(input.user, input.content, input.meetingID);
            document.getElementById("messages").innerHTML += recv.toHTML()
        }
    }
});
const addVideoStream = (video, stream) => {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play();
        videoGrid.append(video);
    })
}
const createUser = (exists) => {
    var message = exists ? "Username taken, please enter valid a username to join this meeting." : "Please enter a username to join this meeting."
    Swal.fire({
        title: message,
        html: `<input type="text" id="username" class="form-control" placeholder="Username">`,
        confirmButtonText: 'Join Meeting',
        focusConfirm: false,
        allowOutsideClick: false,
        preConfirm: () => {
            const login = Swal.getPopup().querySelector('#username').value
            if (!login) {
                Swal.showValidationMessage(`Please enter a valid username`)
            }
            return { login: login }
        }
    }).then((result) => {
        username = result.value.login;
        $("#app").attr('style', '');
        user = new User(username, meetingID, peerID);
        socket.emit("checkUser", JSON.stringify(user));
    });
};