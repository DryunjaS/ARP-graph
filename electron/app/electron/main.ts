import { app, BrowserWindow, ipcMain } from "electron"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, "..")

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"]
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron")
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist")

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, "public")
	: RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, "logo.png"),

		autoHideMenuBar: true,
		fullscreen: true,

		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		win.loadFile(path.join(RENDERER_DIST, "index.html"))
	}
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
		win = null
	}
})

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
ipcMain.on("close-app", () => {
	app.quit()
})
ipcMain.on("toggle-fullscreen", () => {
	if (win && win.isFullScreen()) {
		win.setFullScreen(false)
	} else if (win) {
		win.setFullScreen(true)
	}
})
app.whenReady().then(createWindow)
