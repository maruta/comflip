document.addEventListener('DOMContentLoaded', function (event) {
    let roomName = decodeURIComponent(location.hash.slice(1));

    if (!roomName) {
        roomName = prompt('room name?');
        history.pushState(null, null, '#' + roomName);
    }

    const form = document.getElementById("form");
    const repeatElm = document.getElementById("repeat");
    const commentElm = document.getElementById("comment");
    const titleElm = document.getElementById("title");

    const getDisplayName = (n) => {
        let dn = n;
        let tmp = n.split('+');
        if (tmp.length >= 2) {
            tmp.pop();
            dn = tmp.join('+');
        }
        return dn;
    }

    titleElm.innerText = "Comment to " + getDisplayName(roomName);

    let history = "";

    repeatElm.onclick = (event) => {
        commentElm.value = history;
    }
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const comment = commentElm.value;
        if (comment == "") return;

        fetch('/api/emit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                room: roomName,
                comment: commentElm.value
            }),
        })
        history = comment;
        commentElm.value = "";
    });
});
