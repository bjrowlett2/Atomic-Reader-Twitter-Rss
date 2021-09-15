# Atomic Reader Twitter Rss

## Configure

Head over to https://developer.twitter.com/ and create a project/app.

* Name: `Atomic-Reader`
* Use Case: `Building consumer tools (hobbyist)`
* Description: `An Atom and RSS 2.0 feed reader`
* App Name: `Atomic-Reader-Rss`

Create a `twitter.env` file with the following contents:

```
TWITTER_CLIENT_ID=<twitter_client_id>
TWITTER_CLIENT_SECRET=<twitter_client_secret>
```

## Build and Deploy

Execute `.\Build.cmd` (requires Docker).

Feeds are available at: `http://localhost:30002/api/v1/:twitterUserName`.
