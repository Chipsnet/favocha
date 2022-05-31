const { contextBridge, ipcRenderer } = require("electron");
const PACKAGE_JSON = require("../package.json");

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, process.versions[type]);
    }

    const element = document.getElementById("app-version");
    element.innerText = `v${PACKAGE_JSON.version}`;
});

contextBridge.exposeInMainWorld('electronAPI', {
    getTwitterName: () => ipcRenderer.invoke('getTwitterName'),
    handleTweetSend: (callback) => ipcRenderer.on('tweetSend', callback),
    handlePathChanged: (callback) => ipcRenderer.on('pathChanged', callback),
    deleteTwitterData: () => ipcRenderer.send('deleteTwitterData')
})