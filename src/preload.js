const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dIpc", () => ipcRenderer);
contextBridge.exposeInMainWorld("dPrettier", () => require("prettier"));
contextBridge.exposeInMainWorld("ipcon", () => ipcRenderer.on);

contextBridge.exposeInMainWorld("electron", { ipcRenderer: { ...ipcRenderer, on: ipcRenderer.on } });