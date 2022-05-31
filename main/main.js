// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const log = require("electron-log");
const path = require("path");
const Store = require("electron-store");
const { Tweet } = require("./tweet");
const hookLog = require("./hookLog");

const TwitterPinAuth = require("twitter-pin-auth");
const open = require("open");
const prompt = require("electron-prompt");

const store = new Store();

const token = require('./twi_token.json')

const twitterConsumerToken = token;

const twitterPinAuth = new TwitterPinAuth(
    twitterConsumerToken.key,
    twitterConsumerToken.secret,
    "",
    false
);

let twitterAccessToken;

async function twitterAuth(mainWindow) {
    if (store.get("token.key") && store.get("token.secret")) {
        log.info("Already Authenticated.");

        twitterAccessToken = store.get("token");
    } else {
        log.warn("Not Authenticated.");
        store.delete("token");

        await dialog.showMessageBox(mainWindow, {
            type: "question",
            message:
                "Twitter認証を行います。\nあなたのブラウザでTwitter認証画面を開きます。\n認証が終わったら、表示されたPINコードを入力してください。\n準備はいいですか？",
            buttons: ["おっけー！"]
        });

        let twitterAuthUrl = await twitterPinAuth.requestAuthUrl();

        open(twitterAuthUrl);
        log.debug(twitterAuthUrl);

        let inputPin = await prompt({
            title: "Twitter認証",
            label: "PINコードを入力",
            inputAttrs: {
                type: "text",
            },
            type: "input",
            alwaysOnTop: true
        }, mainWindow);

        if (inputPin === null) {
            log.error("canceled");
            return;
        } else {
            log.info(inputPin);
        }

        let oauthResponse = await twitterPinAuth.authorize(inputPin).catch(function(err) {
            log.error(err);
        });

        log.info(oauthResponse);

        store.set("token.key", oauthResponse.accessTokenKey);
        store.set("token.secret", oauthResponse.accessTokenSecret);

        twitterAccessToken = store.get("token");

        log.info(oauthResponse);
    }

    return;
}

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "../renderer/preload.js"),
        },
    });

    await twitterAuth(mainWindow);

    if (!twitterAccessToken) {
        log.error("Can't Authenticate.");
        mainWindow.close()
    } else {
        mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"),);

        tweet = new Tweet(twitterConsumerToken, twitterAccessToken, mainWindow);

        hookLog.initChokidar(tweet, mainWindow);
    }
}


async function getTwitterName() {
    const twittername = await tweet.getUserName()

    return twittername;
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    ipcMain.handle('getTwitterName', getTwitterName)

    ipcMain.on('deleteTwitterData', async (event, title) => {
        let res = await dialog.showMessageBox(mainWindow, {
            type: "question",
            message:
                "Twitterの認証情報を削除しますか？\n削除すると、ソフトウェアは終了します。\nもう一度起動すると、Twitterを再度認証することができます。",
            buttons: ["削除する！", "やめとく！"]
        });

        if (res.response === 0) {
            store.delete("token");

            await dialog.showMessageBox(mainWindow, {
                type: "question",
                message:
                    "認証情報を削除しました。\nソフトウェアを終了します。",
                buttons: ["おっけー！"]
            });

            await mainWindow.close()
        }
    })

    createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
