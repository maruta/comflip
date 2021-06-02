document.addEventListener('DOMContentLoaded', function (event) {
    let roomName = decodeURIComponent(location.hash.slice(1));
    if (!roomName) {
        roomName = prompt('room name?');
        history.pushState(null, null, '#' + roomName);
    }
    
    //document.getElementsByClassName('room-name')[0].innerText=roomName;

    let socket = io({ autoConnect: false });

    socket.on("connect", function () {
        socket.emit('join', roomName);
    });

    socket.connect();

    const tb= $("#logbody");
    let count = 0;
    let logdata = [];
    function addLog(comment){
        let d = new Date();
        let r = $('<tr>');
        r.append(
            $('<th class="idx d-none d-md-table-cell" span="row">').text(count.toFixed())
        )
        let dateString = Intl.DateTimeFormat(navigator.language, { year:'numeric',month: 'short', day: 'numeric', hour:'numeric',minute:'numeric',second:'numeric',hour12:false }).format(d);
        r.append(
            $('<td class="time d-none d-md-table-cell">').text(dateString)
        )
        r.append($('<td class="comment">').text(comment));
        tb.prepend(r);
        count = count+1;
        logdata.push({
            time: d,
            comment: comment
        })
    }

    $('#download').on('click',function(){
        console.log(this);
        const blob = new Blob([JSON.stringify(logdata, null, '  ')], {type: 'application\/json'});

        this.setAttribute("href",URL.createObjectURL(blob));
        this.setAttribute("download", "log.json");
    });
    socket.on('comment', (comment) => {
        addLog(comment);
    });

    addLog("Logger started on "+roomName);
})

