# version-control

[![Build Status](https://travis-ci.org/thegameofcode/version-control.svg?branch=master)](https://travis-ci.org/thegameofcode/version-control)

A nodejs middleware for client version controlling

It forces a custom header to be sent from the client in order to allow a call to pass through this middleware

header must be sent in the form of:
```
x-app-version : [PLATFORM]/[VERSION_NUMBER]
```


How to use
---

install middleware

```
npm install --save version-control
```

sample code

```javascript
var restify = require('restify');
var server = restify.createServer({
        name: 'test-server'
    });

var versionCheck = require('version-control')();
server.use(versionCheck);
server.listen(3000, function(){
    console.log('listening on port 3000');
});
```

Settings
---

you can also provide custom settings

```javascript
var options = {
    "header" : "x-app-version",
    "platforms" : {
        "all" : {
            "link": "http://test.link",
            "1.0" : true
        }
    }
 }

var versionCheck = require('version-control')(options);
```

- _header_: header that is required to be included
- _platforms_: object that allows you to setup valid platforms and valid versions
