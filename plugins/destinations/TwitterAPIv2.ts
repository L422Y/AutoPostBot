import { BaseDestinationPlugin } from "../../lib/BaseDestinationPlugin"
import * as dotenv from "dotenv"
import Twitter from 'twitter-api-v2'


dotenv.config()

export class TwitterAPIv2 extends BaseDestinationPlugin {

    name = "TwitterAPIv2"

    endpointURL = `https://api.twitter.com/2/tweets`
    requestTokenURL = "https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write"
    authorizeURL = new URL("https://api.twitter.com/oauth/authorize")
    accessTokenURL = "https://api.twitter.com/oauth/access_token"

    appKey = process.env.TWITTER_APP_KEY
    appSecret = process.env.TWITTER_APP_SECRET
    accessToken = process.env.TWITTER_ACCESS_TOKEN
    accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET


    client: Twitter
    post: any

    constructor(options?: any) {
        super(options)

        if (!this.appKey || !this.appSecret || !this.accessToken || !this.accessSecret) {
            this.log("Twitter key/secret or token/secret not set. Cannot enable TwitterAPIv2 destination plugin. Exiting...")
            process.exit(1)
        }

        this.client =  new Twitter({
            appKey: this.appKey,
            appSecret: this.appSecret,
            accessToken: this.accessToken,
            accessSecret: this.accessSecret
        })

        this.sendPost = this.sendPost.bind(this)

    }


    async sendPost(postContent: string): Promise<void> {
        try {
            // Make the request
            const response = await this.client.v2.tweet(postContent)
            const id = response.data.id
            this.log(`Post ${id} sent.`)
        } catch (e) {
            this.log("Unable to send Post.")
            this.log(e)
            process.exit(-1)
        }
    }

}
