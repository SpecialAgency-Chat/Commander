const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { exec:dExec } = require("child_process");
const exec = async (command) => new Promise((resolve, reject) => dExec(command, (err, stdout, stderr) => {
  if (err) {
    reject(err);
  } else {
    resolve(stderr + stdout);
  }
}));

const VERSION = "1.0.0";

let mainWindow = null;
let isLaunched = false;

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", async () => {
  if (isLaunched) return;
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 700,
    resizable: false,
    title: "Commander v" + VERSION,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.setMenu(null);

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.webContents.openDevTools();

});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});



ipcMain.on("run", async (event, [code]) => {
  try {
    await eval(code);
    event.returnValue = "run_success";
  } catch (e) {
    console.dir(e, { depth: null });
    const r = e.toString();
    if (r.includes("this field is")) {
      event.returnValue = "Some field is not defined";
    } else {
      event.returnValue = r;
    }
  }
})