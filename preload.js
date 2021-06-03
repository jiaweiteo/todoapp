const { contextBridge, ipcRenderer } = require('electron');

//Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

contextBridge.exposeInMainWorld( 
    "api", {
        receive: (channel, func) => {
            ipcRenderer.on("todo:addFromMainProcess", (event, data) => {
                console.log("in preload");
                document.querySelector('ul').innerHTML += '<p>' + data + '</p>';
            });
            ipcRenderer.on("todo:clearFromMainProcess", () => {
                document.querySelector('ul').innerHTML = "";
            });
        }
    }
)