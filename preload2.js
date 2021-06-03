const { contextBridge, ipcRenderer } = require('electron');

//Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

contextBridge.exposeInMainWorld( 
    "api", {
        send: (channel, data) => {
            //whitelist channels
            let validChannels = ["todo:addFromSubWindow"];
            if (validChannels.includes(channel)) {
                // console.log(data);
                ipcRenderer.send(channel, data);
            }
        }
    }
)