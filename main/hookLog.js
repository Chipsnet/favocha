const Tail = require('tail-file');
const chokidar = require('chokidar')

let targetFile;
let logTail;

function initChokidar(tweet, mainWindow) {
    chokidar.watch(`${process.env.APPDATA}\\..\\LocalLow\\VRChat\\VRChat\\*.txt`, { usePolling: true }).on("all", (eventName, path) => {
        if (eventName === "add") {
            console.log("new file found");
            mainWindow.webContents.send('pathChanged', path)
            
            if (targetFile != path) {
                startTail(path, tweet)
                targetFile = path
            }
        }
    
        if (eventName === "change") {
            console.log("file change found");
            mainWindow.webContents.send('pathChanged', path)
            
            if (targetFile != path) {
                startTail(path, tweet)
                targetFile = path
            }
        }
    })
}

function startTail(path, tweet) {
    if (logTail) {
        console.log("stopping tail");
        logTail.stop()
    }

    console.log("starting tail");
    
    logTail = new Tail(path, line => {
        //console.log(line)

        if (line.includes('Added world to favorites')) {
            let serchId = line.match(/(:.*){2}/)
            let id = serchId[1].slice(2)

            console.log(id);
            tweet.tweet(id)
        }
    })
}

exports.initChokidar = initChokidar