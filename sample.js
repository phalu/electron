// Modules
const {app, BrowserWindow,session} = require('electron')
const windowStateKeeper = require('electron-window-state')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

	let ses = session.defaultSession

	let getCookies = () => {
		ses.cookies.get({})
			.then(cookies => {
				console.log(cookies)
			})
			.catch(errors => {
				console.log(errors)
			})
	}


	let customSes = session.fromPartition('part1')

	let winState = windowStateKeeper({
		defaultWidth: 1000, defaultHeight: 800
	})

  mainWindow = new BrowserWindow({
    width: winState.width, height: winState.height,
		x: winState.x, y: winState.y,
		minWidth: 300, minHeight: 120,
		frame: false,
		titleBarStyle: 'hidden',
    webPreferences: { nodeIntegration: true, session: customSes },
  })

	mainWindow.webContents.openDevTools()

	winState.manage(mainWindow)

  // Load index.html into the new BrowserWindow
	mainWindow.loadFile('index.html')

	ses.cookies.remove('https://myappdomain.com','cookie1').then(()=> {
		getCookies()
	})

	// let cookie = { url: 'https://myappdomain.com', name:'cookie1', value: 'electron', expirationDate:1622818789}

	// ses.cookies.set(cookie)
	// 	.then(()=> {
	// 		console.log('cookie 1 set')
	// 		getCookies()
	// 	})

		// mainWindow.webContents.on("did-finish-load", e => {
		// 	getCookies()
		// })


	// wc.on('login', (e,request, authInfo, callback) => {
	// 	console.log('Logging in');
	// 	callback('user', 'passwd')
	// })
	// wc.on('did-navigate', (e, url, statusCode, message) => {
	// 	console.log(`navigated to : ${url}`)
	// 	console.log(statusCode)
	//
	// })

	// wc.on('dom-ready', () => {
	// 	console.log('DOM Ready')
	// })
	// Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

// mainWindow.on('focus', ()=> {
// 	console.log('Main window focused')
// })
//
//
// secondaryWindow.on('focus', ()=> {
// 	console.log('Second window focused')
// })
//
// app.on('browser-window-focus', () => {
// 	console.log('App focused ')
// })
//
// console.log(BrowserWindow.getAllWindows())


  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })


}


// Electron `app` is ready
app.on('ready', () => {
	createWindow()
})

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
