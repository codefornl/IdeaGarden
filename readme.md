[![Dependency Status](https://david-dm.org/codefornl/IdeaGarden.svg?path=src/server)](https://david-dm.org/codefornl/IdeaGarden?path=src/server)

#IdeaGarden

#requirements

IdeaGarden requires mongodb.

#Configure

Make sure to call the scripts with all the ENV vars. Check the Dockerfile for their defaults

#Install
We use gulp as a build system. gulp can be installed with:

```
sudo npm install -g gulp
```

cd into the directory for IdeaGarden
```
npm install
gulp build
gulp install_npm
```

#Run

You can run IdeaGarden locally with
```
gulp run
```

for development you can use `gulp develop`. This will start the server and automagically rebuild on file changes.
It will watch changes in the source directory.

#Test data

There is a file with some test data. Run it with

```
node build/admin/populate_database.js
```

To add some test data to the mongodb database
