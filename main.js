var electron = require('electron');
var app      = electron.app;
var win      = null;

function createWindow () {
  let win = new electron.BrowserWindow({
    width: 1024,
    height: 578,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
  win.removeMenu()
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
