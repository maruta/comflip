document.addEventListener('DOMContentLoaded', function (event) {
    const roomNameInput = document.getElementById("room-name");
    const emitterLink = document.getElementById("emitter-link");
    const rendererLink = document.getElementById("renderer-link");
    const emitterUrlText = document.getElementById("emitter-url-text");
    const rendererUrlText = document.getElementById("renderer-url-text");

    const qrcodeElm = document.getElementById("qrcode");
    const emitterIframe = document.getElementById("emitter-iframe");
    const rendererIframe = document.getElementById("renderer-iframe");
    const hostElm = document.getElementById("host");
    hostElm.innerText = location.host;

    const updateLinks = () => {
        const roomName = roomNameInput.value;
        const emitterURL = new URL("/e#"+roomName,document.baseURI);
        emitterLink.setAttribute('href',emitterURL.href);
        emitterUrlText.innerText = emitterURL.href;
        emitterIframe.src = emitterURL.href;
        QRCode.toCanvas(qrcodeElm, emitterURL.href);
        const rendererURL = new URL("/renderer#"+roomName,document.baseURI);
        rendererLink.setAttribute('href',rendererURL.href);
        rendererIframe.src = rendererURL.href;
        rendererUrlText.innerText = rendererURL.href;
    }

    updateLinks();
    roomNameInput.oninput = updateLinks;

})