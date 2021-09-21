const Express = require('express');
const ExpressHandlebars = require('express-handlebars');
const NodeFetch = require('node-fetch');

const App = Express();

App.engine('handlebars', ExpressHandlebars());

App.set('views', '/app/src/views');
App.set('view engine', 'handlebars');

App.use('/favicon.ico', Express.static('/app/favicon.ico'));

let AccessTokenValue = '';

const ClientId = process.env['TWITTER_CLIENT_ID'];
const ClientSecret = process.env['TWITTER_CLIENT_SECRET'];

if (!ClientId || !ClientSecret) {
    console.error('[ERROR] A ClientId and ClientSecret must be supplied!');
    process.exit(1);
}

function base64Encode(value) {
    return Buffer.from(value).toString('base64');
}

function GetAccessToken(callback) {
    if (AccessTokenValue) {
        if (callback) {
            callback(AccessTokenValue); /// Use the cached access token.
        }
    } else {
        const url = `https://api.twitter.com/oauth2/token?grant_type=client_credentials`;
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${base64Encode(`${ClientId}:${ClientSecret}`)}`
            }
        };
    
        const execCallbackFunc = json => {
            if (!json['access_token']) {
                throw new Error('[ERROR] No access_token found!');
            }
    
            if (callback) {
                callback(json['access_token']);
            }
        };
    
        NodeFetch(url, options)
            .then(response => response.json())
            .then(json => execCallbackFunc(json))
            .catch(reason => console.error(reason));
    }
}

function GetUsers(login, callback) {
    const url = `https://api.twitter.com/2/users/by/username/${login}`;
    const options = {
        headers: {
            'Authorization': `Bearer ${AccessTokenValue}`
        }
    }

    const execCallbackFunc = json => {
        if (!json['data'] || !json['data']['id']) {
            throw new Error('[ERROR] No user_id found!');
        }

        if (callback) {
            callback(json['data']['id']);
        }
    };

    NodeFetch(url, options)
        .then(response => response.json())
        .then(json => execCallbackFunc(json))
        .catch(reason => console.error(reason));
}

function GetTweets(userId, callback) {
    const url = `https://api.twitter.com/2/users/${userId}/tweets?exclude=retweets,replies&tweet.fields=id,text,created_at&max_results=25`;
    const options = {
        headers: {
            'Authorization': `Bearer ${AccessTokenValue}`
        }
    };

    const execCallbackFunc = json => {
        if (callback) {
            callback(json);
        }
    };

    NodeFetch(url, options)
        .then(response => response.json())
        .then(json => execCallbackFunc(json))
        .catch(reason => console.error(reason));
}

App.get('/', (request, response) => {
    response.render('static');
});

App.get('/api/v1/:login', (request, response) => {
    const login = request.params['login'];

    GetAccessToken(accessToken => {
        AccessTokenValue = accessToken;

        GetUsers(login, userId => {
            GetTweets(userId, tweets => {
                const context = {
                    title: login,
                    description: `${login}'s Twitter feed`,
                    link: `https://app.atomic-reader.com/twitter-rss/api/v1/${login}`,
                    items: tweets.data.map(item => {
                        return {
                            guid: item.id,
                            title: `${login} tweeted`,
                            description: item.text,
                            link: `https://twitter.com/${login}/status/${item.id}`,
                            published: item.created_at
                        };
                    })
                };
    
                response.render('rss', context, (error, html) => {
                    if (error) {
                        response.sendStatus(500);
                    } else {
                        response.contentType('application/rss+xml').send(html);
                    }
                });
            });
        });
    });
});

const Port = 8080;
App.listen(Port, '0.0.0.0', () => {
    console.log(`Listening at http://localhost:${Port}`);
});
