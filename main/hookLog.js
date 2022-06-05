const Tail = require("tail-file");
const chokidar = require("chokidar");
const log = require("electron-log");

class Hook {
    constructor(mainWindow, tweet, tweetState = true) {
        this.targetFile = null;
        this.logTail = null;
        this.mainWindow = mainWindow;
        this.tweet = tweet;
        this.tweetState = tweetState;
    }

    initChokidar() {
        log.debug('initChokidar Called.')

        chokidar
            .watch(
                `${process.env.APPDATA}\\..\\LocalLow\\VRChat\\VRChat\\*.txt`,
                { usePolling: true }
            )
            .on("all", (eventName, path) => {
                if (eventName === "add") {
                    log.debug("New file found: ", path);
                    this.mainWindow.webContents.send("pathChanged", path);

                    if (this.targetFile != path) {
                        this.startTail(path);
                        this.targetFile = path;
                    }
                }

                if (eventName === "change") {
                    log.debug("File change Found: ", path);
                    this.mainWindow.webContents.send("pathChanged", path);

                    if (this.targetFile != path) {
                        this.startTail(path);
                        this.targetFile = path;
                    }
                }
            });
    }

    startTail(path) {
        if (this.logTail) {
            log.info("Tail Stopped.");
            this.logTail.stop();
        }

        log.info("Starting Tail...");

        this.logTail = new Tail(path, (line) => {
            //console.log(line)

            if (line.includes("Added world to favorites")) {
                if (!this.tweetState) {
                    log.info('Not tweet due tweetState is false.')
    
                    return;
                }

                log.debug("World Favorite found.", line);

                let serchId = line.match(/(:.*){2}/);
                let id = serchId[1].slice(2);

                console.log(id);
                this.tweet.tweet(id);
            }
        });

        log.info("Tail Started.");
    }
}

exports.Hook = Hook;