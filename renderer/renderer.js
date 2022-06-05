// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var toastElList = [].slice.call(document.querySelectorAll(".toast"));
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl);
});

(async function () {
    const twitterUserName = await window.electronAPI.getTwitterName()

    document.getElementById('twitter-name').innerText = twitterUserName
}());

window.electronAPI.handleTweetSend((event, value) => {
    document.getElementById('toast-title').innerText = "ツイートを送信しました！"
    document.getElementById('toast-body').innerText = value

    toastList[0].show();
})

window.electronAPI.handlePathChanged((event, value) => {
    document.getElementById('file-path').innerText = value
})

const twitterBtn = document.getElementById('delete-twitter')

twitterBtn.addEventListener('click', () => {
    window.electronAPI.deleteTwitterData()
})

const toggleTweetStateBtn = document.getElementById('toggleTweetState')
const TweetStateBadge = document.getElementById('tweetState')

toggleTweetStateBtn.addEventListener('click', async () => {
    tweetState = await window.electronAPI.toggleTweetState()

    if (tweetState) {
        toggleTweetStateBtn.className = "btn btn-danger btn-sm mt-2 mb-4"
        toggleTweetStateBtn.innerText = "一時停止する"

        TweetStateBadge.className = "badge bg-primary"
        TweetStateBadge.innerText = "動作中"
    } else {
        toggleTweetStateBtn.className = "btn btn-primary btn-sm mt-2 mb-4"
        toggleTweetStateBtn.innerText = "再開する"

        TweetStateBadge.className = "badge bg-danger"
        TweetStateBadge.innerText = "一時停止中"
    }
})