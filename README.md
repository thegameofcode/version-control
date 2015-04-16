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
    },
    "public" : [],
    "installPath" : "/install",
    "versionPath" : "/version"
 }

var versionCheck = require('version-control')(options);
```

- _header_: header that is required to be included
- _platforms_: object that allows you to setup valid platforms and valid versions
- _public_: array of string with public paths that must to be ignored by version-control (use * as a wildcard)
- _installPath_: (default empty) base path that tells version-control to redirect to the latest install link for platform (e.g. an installPath of "/install" makes a call to "/install/all" point to "http://test.link" with the example settings)
- _versionPath_: (default "/version") base path that allows a client to check if its version is allowed
