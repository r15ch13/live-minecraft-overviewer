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
    add_header 'Access-Control-Allow-Headers' 'Authorization,X-Requested-With,Content-Type';
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Headers' 'X-WEBAPI-KEY';
    add_header 'Allow' 'GET, OPTIONS';
}
```
### Caddy
```
proxy /api localhost:<webapi-port> {
    header_downstream Access-Control-Allow-Origin "*"
    header_downstream Access-Control-Allow-Headers "X-WEBAPI-KEY"
    header_downstream Allow "GET, OPTIONS"
}
```
## Setup
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
