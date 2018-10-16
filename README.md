# siteSelection

> A React.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:5000
npm run dev

# build for production with minification
# production is base on deployment, normally running it with double clicking is deprecated.
# so if you want to run it offline, you must change the webpack.config.js like the following


# now you can build the production and it can run with double clicking
npm run build

# automatically create release version
//running this command can create production and move it to frontEnd-CAL-release folder.
//this way you can see the frontEnd page with double clicking index.html.
# shell
bash release.sh
# windows

## mock data
we use fake server for testing, it requires addition repositories mock.js and json server. please use npm to install.
```bash
#install json-server to create a fake server
npm install -g json-server
#start server(read the document to see how to create a fake database)
json-server --watch db.json
```
