const Twitter = require('twitter')
const parser = require("ogp-parser");

class Tweet {
    constructor(consumerToken, accessToken, mainWindow) {
        this.consumerToken = consumerToken;
        this.accessToken = accessToken
        this.mainWindow = mainWindow
        this.twitterClient = new Twitter({
            consumer_key: consumerToken.key,
            consumer_secret: consumerToken.secret,
            access_token_key: accessToken.key,
            access_token_secret: accessToken.secret
        })
    }

    async getUserName() {
        const getTwitterResponse = () => new Promise((resolve, reject) => {
            this.twitterClient.get('account/verify_credentials', (error, response) => {
                if (error) {
                    reject(error)
                }

                resolve(response)
            })
        })

        const res = await getTwitterResponse()

        return res.name
    }

    async getWorldName(url) {
        let ogData = await parser(url, { skipOembed: true })
        console.log(ogData["seo"]["twitter:title"]);

        return ogData["seo"]["twitter:title"]
    }

    async tweet(id) {
        let worldName = await this.getWorldName(`https://vrchat.com/home/world/${id}`)

        let tweet = `VRChatで${worldName}をFavoriteしました！\n\nhttps://vrchat.com/home/world/${id}\n#Favocha`

        this.mainWindow.webContents.send('tweetSend', tweet)

        this.twitterClient.post('statuses/update', { status: tweet }, (error, tweet, response) => {
            if (error) {
                console.error(error);
            }
        })
    }
}

exports.Tweet = Tweet;