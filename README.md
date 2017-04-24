# Live Minecraft Overviewer

> Show live player positions to Minecraft Overviewer

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# copy file to webassets directory, so overviewer will use them
cp index.html <minecraft>/webassets
cp -r dist/ <minecraft>/webassets
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
