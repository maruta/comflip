document.addEventListener('DOMContentLoaded', function (event) {
    const elmScreen = document.getElementsByClassName('screen')[0]
    let duration
    let lineHeight
    let screenWidth, screenHeight
    let numLines

    let resizeFunc = () => {
        screenWidth = elmScreen.offsetWidth
        screenHeight = elmScreen.offsetHeight
        if (lineHeight != undefined) {
            numLines = Math.floor(screenHeight / lineHeight)
        }
    }

    resizeFunc()
    window.onresize = resizeFunc

    let lastComments = []

    let putComment = (text, line) => {
        let elmWrapper = document.createElement("div")
        elmWrapper.classList.add('wrapper')
        let elmComment = document.createElement("div")
        elmComment.classList.add('comment')
        let elmText = document.createElement("p")
        elmText.classList.add('text')
        let elmLining = document.createElement("p")
        elmLining.classList.add('lining')
        elmText.innerText = text
        elmLining.innerText = text
        elmComment.appendChild(elmLining)
        elmComment.appendChild(elmText)
        elmWrapper.appendChild(elmComment)
        elmScreen.appendChild(elmWrapper)

        const width = elmText.offsetWidth - screenWidth
        const height = elmText.offsetHeight

        if (lineHeight == undefined) {
            lineHeight = height
            numLines = Math.floor(screenHeight / height)
            const s = window.getComputedStyle(elmText)
            let re = /(([0-9]*)|(([0-9]*)\.([0-9]*)))\s*(.*)\s*/
            const ts = s.animationDuration.match(re)
            if (ts[1] == 'ms') {
                duration = parseFloat(ts[0])
            } else {
                duration = parseFloat(ts[0]) * 1000
            }
        }

        const t = Date.now()

        if (line == undefined) {
            // Find a line where comments do not collide.
            let found = false
            for (line = 0; line < numLines; line++) {
                if (lastComments[line] == undefined) {
                    found = true
                    break
                }
                let lc = lastComments[line]
                let speed = (screenWidth + width) / duration
                let lcSpeed = (screenWidth + lc.width) / duration
                // check current position
                if (lcSpeed * (t - lc.t0) < lc.width) continue
                // check final position
                if (lcSpeed * (t + screenWidth / speed - lc.t0) < screenWidth + lc.width) continue
                found = true
                break
            }

            if (!found) {
                // Give up and place randomly.                
                line = Math.floor(Math.random() * numLines)
            }
        }

        elmWrapper.style.top = (line * lineHeight).toFixed(0) + "px"


        let comment = {
            elm: elmWrapper,
            line: line,
            width: width,
            height: height,
            t0: t
        }

        setTimeout(() => {
            elmWrapper.remove()
        }, duration);

        lastComments[line] = comment
        return comment
    }


    let roomName = decodeURIComponent(location.hash.slice(1));
    if (!roomName) {
        roomName = prompt('room name?');
        history.pushState(null, null, '#' + roomName);
    }

    let socket = io({ autoConnect: false });

    socket.on("connect", function () {
        socket.emit('join', roomName);
    });

    socket.connect();

    socket.on('comment', (comment) => {
        putComment(comment);
    });

    // Wait a moment for the custom CSS to be loaded.
    setTimeout(() => putComment('Waiting for your comments on ' + roomName), 100);

    // Prevent heroku's dyno from going to sleep.
    setInterval(()=>{
        const qs = new URLSearchParams({room: roomName});
        fetch(`/api/heartbeat?${qs}`);
    }, 10*1000*60);
})

