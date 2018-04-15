# Live Minecraft Overviewer

> Show live player positions to Minecraft Overviewer

## Requirements
- [Minecraft Overviewer](https://overviewer.org/)
- [Sponge Forge](https://www.spongepowered.org/downloads) or [Sponge Vanilla](https://www.spongepowered.org/downloads)
- [Web-API Plugin](https://ore.spongepowered.org/Valandur/Web-API)

## Webserver proxy settings
Proxy for the Web-API endpoints. Allowing only GET-Requests because Web-API has some methods to change stuff!
### Nginx
```
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
### Caddy
```
proxy /api localhost:<webapi-port> {
    # allow authentication header
    header_downstream Access-Control-Allow-Headers "X-WEBAPI-KEY"

    # pre-flight info is valid for 20 days
    header_downstream Access-Control-Max-Age 1728000

    # only allow GET and OPTIONS methods
    header_downstream Allow "GET, OPTIONS"
}
```
## Installation

### Copy webassets
```
# copy file to webassets directory, so overviewer will use them
cp index.html <minecraft>/webassets
cp -r dist/ <minecraft>/webassets

# change settings in index.html!
window.settings = {
    webapi: {
        url: 'https://<minecraft-webapi-url>',
        key: 'API_KEY'
    }
}
```
### Change WebAPI Settings
Apply the following changes to `config/webapi/permissions.conf`.

Disable the whitelist because everyone needs access to the API
```
useWhitelist=false
```

Add an non rate limited `overviewer` key with the following permissions.
```
keys {
    overviewer {
        permissions {
            info="*"
            player {
                list {
                    "*"=true
                    address=false
                    location {
                        world {
                            "*"=false
                            name=true
                        }
                    }
                    uuid=false
                }
            }
        }
        rateLimit=0
    }
}
```

## Build from Source
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
