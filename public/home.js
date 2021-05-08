document.addEventListener('DOMContentLoaded', function (event) {
    const roomNameInput = document.getElementById("room-name");
    const emitterLink = document.getElementById("emitter-link");
    const rendererLink = document.getElementById("renderer-link");
    const qrcodeElm = document.getElementById("qrcode");

    const updateLinks = () => {
        const roomName = roomNameInput.value;
        const emitterURL = new URL("/e#"+roomName,document.baseURI);
        emitterLink.setAttribute('href',emitterURL.href);
        emitterLink.innerText = emitterURL.href;
        QRCode.toCanvas(qrcodeElm, emitterURL.href);
        const rendererURL = new URL("/renderer#"+roomName,document.baseURI);
        rendererLink.setAttribute('href',rendererURL.href);
        rendererLink.innerText = rendererURL.href;
    }

    updateLinks();
    roomNameInput.oninput = updateLinks;

})