(function() {
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
//if Array.prototype.includes not support  
var root = this;

var mobile = function(obj) {
    if (obj instanceof mobile)
        return obj;
    if (!(this instanceof mobile))
        return new mobile(obj);
    this._wrapped = obj;
};
mobile.userAgent = null;
// set Ignore Method for isAny and get getDevice
var ignoreMethod = [
        'setUserAgent',
        'getUserAgent',
        'isAny',
        'isWindows',
        'isIOS',
        'getDevice'
    ];
// Set browser Agent
mobile.setUserAgent = function(userAgent) {

    this.userAgent = userAgent;
};
// Get browser Agent
mobile.getUserAgent = function() {
    return this.userAgent;
};

mobile.isBlackBerryPlayBook = function() {
    return this.getUserAgent().match(/PlayBook/i);
};


mobile.isAndroid = function() {
    return this.getUserAgent().match(/Android/i);
};

mobile.isBlackBerry = function() {
    return this.getUserAgent().match(/BlackBerry/i);
};


mobile.isBlackBerry10 = function() {
    return this.getUserAgent().match(/BB10/i);
};

mobile.isIOS = function() {
    return this.isIPhone() || this.isIPad() || this.isIPod();
};

mobile.isIPhone = function() {
    return this.getUserAgent().match(/iPhone/i);
};

mobile.isIPad = function() {
    return this.getUserAgent().match(/iPad/i);
};

mobile.isIPod = function() {
    return this.getUserAgent().match(/iPod/i);
};

mobile.isOpera = function() {
    return this.getUserAgent().match(/Opera Mini/i);
};

mobile.isWindows = function() {
    return this.isWindowsDesktop() || this.isWindowsMobile();
};

mobile.isWindowsMobile = function() {
    return this.getUserAgent().match(/IEMobile/i);
};

mobile.isWindowsDesktop = function() {
    return this.getUserAgent().match(/WPDesktop/i);
};

mobile.isFireFox = function() {
    return this.getUserAgent().match(/Firefox/i);
};

mobile.isNexus = function() {
    return this.getUserAgent().match(/Nexus/i);   
};

mobile.isKindleFire = function() {
    return this.getUserAgent().match(/Kindle Fire/i);
};

mobile.isPalm = function() {
    return this.getUserAgent().match(/PalmSource|Palm/i);
};

mobile.isAny = function() {
    var foundAny = false;
    var getAllMethods = Object.getOwnPropertyNames(mobile).filter(function(property) {
        return typeof mobile[property] == 'function';
    });

    for (var index in getAllMethods) {
        if (getAllMethods[index] === 'setUserAgent' || getAllMethods[index] === 'getUserAgent' ||
                getAllMethods[index] === 'isAny' || getAllMethods[index] === 'isWindows' ||
                getAllMethods[index] === 'isIOS') {
            continue;
        }
        if (mobile[getAllMethods[index]]()) {
            foundAny = true;
            break;
        }
    }
    return foundAny;
};

mobile.getDevice = function() {
    var foundAny = false;
    var getAllMethods = Object.getOwnPropertyNames(mobile).filter(function(property) {
        // console.log(typeof mobile[property] == 'function');
        return typeof mobile[property] == 'function';
    });
    for (var index in getAllMethods) {
        if (ignoreMethod.includes(getAllMethods[index]) ) {
        //    console.log(getAllMethods[index]); 
            continue;
        }
        // console.log(mobile[getAllMethods[index]]());
        if (mobile[getAllMethods[index]]()) {
            return mobile[getAllMethods[index]]();
        }
    }
    return false;
    
};

if(typeof window === 'function' || typeof window === 'object') {
    mobile.setUserAgent(navigator.userAgent);
} 

if (typeof exports !== 'undefined') {
    
    var middleware = function(isMiddleware) {

        isMiddleware = isMiddleware === (void 0)  ? true : isMiddleware;

        if(isMiddleware) {
            return function(req, res, next) {
                
                var userAgent = req.headers['user-agent'] || '';
                mobile.setUserAgent(userAgent);
                req.mobile = mobile;
                
                if ('function' === typeof res.locals) {
                    res.locals({mobile: mobile});
                } else {
                    res.locals.mobile = mobile;
                }
                
                next();
            };
        } else {
            return mobile;
        }

    };
    
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = middleware;
    }
    exports = middleware;
} 
else {
    root.mobile = mobile;
}
}.call(this));