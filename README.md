# Live Minecraft Overviewer

> Show live player positions on Minecraft Overviewer

- Inspired by [PlayerMarkers](https://github.com/overviewer/Minecraft-Overviewer-Addons/tree/master/PlayerMarkers)
- Uses [Minotar](https://minotar.net) for player heads
- Build with [Vue.js](https://vuejs.org/)

## Requirements
- [Minecraft Overviewer](https://overviewer.org/)
- [Sponge Forge](https://www.spongepowered.org/downloads) or [Sponge Vanilla](https://www.spongepowered.org/downloads)
- [Web-API Plugin](https://ore.spongepowered.org/Valandur/Web-API)

## Installation

### Configure Minecraft Overviewer
Copy `index.html` and `dist` to the `webassets` directory, so Overviewer will use them on the next update.

```bash
λ cp index.html <minecraft>/webassets
λ cp -r dist/ <minecraft>/webassets
```

Add [`customwebassets`](http://docs.overviewer.org/en/latest/config/#custom-web-assets) option to you Overviewer config file
```python
customwebassets = "<minecraft>/webassets"
```

Add your Web-API URL and the `overviewer` API key to `index.html`.
```js
window.settings = {
    webapi: {
        url: 'http://<minecraft-webapi-url>',
        key: 'overviewer'
    }
}
```
### Configure Web-API
Apply the following changes to `<minecraft>/config/webapi/permissions.conf`.

Disable the whitelist because the API has to be accessible for everyone.
```hocon
useWhitelist=false
```

Add an `overviewer` key with the following permissions.
```hocon
keys {
    overviewer {
        permissions {
            info="*"
            player {
                list {
                    "*"=false
                    location="*"
                    name=true
                    uuid=true
                }
                one {
                    boots="*"
                    chestplate="*"
                    experience="*"
                    food="*"
                    gameMode="*"
                    health="*"
                    helmet="*"
                    latency=true
                    leggings="*"
                    location="*"
                    name=true
                    uuid=true
                }
            }
        }
        # disable rate limit
        rateLimit=0
    }
}
```

### Configure Webserver
Add proxy settings for the Web-API endpoints to allow the `X-WEBAPI-KEY` header.
#### Nginx
```nginx
location /api {
    proxy_pass http://localhost:<webapi-port>/api;
    proxy_http_version 1.1;

    # allow authentication header
    add_header 'Access-Control-Allow-Headers' 'X-WEBAPI-KEY';

    # pre-flight info is valid for 20 days
    add_header 'Access-Control-Max-Age' 1728000;

    # only allow GET and OPTIONS methods
    add_header 'Allow' 'GET, OPTIONS';

    # disable logs
    access_log off;
    error_log off;
}
```
#### Caddy
```caddyfile
proxy /api localhost:<webapi-port> {
    # allow authentication header
    header_downstream Access-Control-Allow-Headers "X-WEBAPI-KEY"

    # pre-flight info is valid for 20 days
    header_downstream Access-Control-Max-Age 1728000

    # only allow GET and OPTIONS methods
    header_downstream Allow "GET, OPTIONS"
}
```

## Build from Source
``` bash
# install dependencies
npm install

# let webpack proxy all traffic to a running Minecraft Overviewer
export WEBPACK_PROXY_MINECRAFT_API='<minecraft-overviewer>'

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For a detailed explanation of how things work, consult the [docs for vue-loader](https://vue-loader.vuejs.org/en/).

# License
[The MIT License (MIT)](http://r15ch13.mit-license.org/)
