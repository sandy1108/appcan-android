/*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
var rAF = window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    window.oRequestAnimationFrame       ||
    window.msRequestAnimationFrame      ||
    function (callback) { window.setTimeout(callback, 1000 / 60); };

var utils = (function () {
    var me = {};

    var _elementStyle = document.createElement('div').style;
    var _vendor = (function () {
        var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
            transform,
            i = 0,
            l = vendors.length;

        for ( ; i < l; i++ ) {
            transform = vendors[i] + 'ransform';
            if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
        }

        return false;
    })();

    function _prefixStyle (style) {
        if ( _vendor === false ) return false;
        if ( _vendor === '' ) return style;
        return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
    }

    me.getTime = Date.now || function getTime () { return new Date().getTime(); };

    me.extend = function (target, obj) {
        for ( var i in obj ) {
            target[i] = obj[i];
        }
    };

    me.addEvent = function (el, type, fn, capture) {
        el.addEventListener(type, fn, !!capture);
    };

    me.removeEvent = function (el, type, fn, capture) {
        el.removeEventListener(type, fn, !!capture);
    };

    me.prefixPointerEvent = function (pointerEvent) {
        return window.MSPointerEvent ? 
            'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
            pointerEvent;
    };

    me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
        var distance = current - start,
            speed = Math.abs(distance) / time,
            destination,
            duration;

        deceleration = deceleration === undefined ? 0.0006 : deceleration;

        destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
        duration = speed / deceleration;

        if ( destination < lowerMargin ) {
            destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
            distance = Math.abs(destination - current);
            duration = distance / speed;
        } else if ( destination > 0 ) {
            destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
            distance = Math.abs(current) + destination;
            duration = distance / speed;
        }

        return {
            destination: Math.round(destination),
            duration: duration
        };
    };

    var _transform = _prefixStyle('transform');

    me.extend(me, {
        hasTransform: _transform !== false,
        hasPerspective: _prefixStyle('perspective') in _elementStyle,
        hasTouch: 'ontouchstart' in window,
        hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
        hasTransition: _prefixStyle('transition') in _elementStyle
    });

    // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
    me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

    me.extend(me.style = {}, {
        transform: _transform,
        transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
        transitionDuration: _prefixStyle('transitionDuration'),
        transitionDelay: _prefixStyle('transitionDelay'),
        transformOrigin: _prefixStyle('transformOrigin')
    });

    me.hasClass = function (e, c) {
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
        return re.test(e.className);
    };

    me.addClass = function (e, c) {
        if ( me.hasClass(e, c) ) {
            return;
        }

        var newclass = e.className.split(' ');
        newclass.push(c);
        e.className = newclass.join(' ');
    };

    me.removeClass = function (e, c) {
        if ( !me.hasClass(e, c) ) {
            return;
        }

        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
        e.className = e.className.replace(re, ' ');
    };

    me.offset = function (el) {
        var left = -el.offsetLeft,
            top = -el.offsetTop;

        // jshint -W084
        while (el = el.offsetParent) {
            left -= el.offsetLeft;
            top -= el.offsetTop;
        }
        // jshint +W084

        return {
            left: left,
            top: top
        };
    };

    me.preventDefaultException = function (el, exceptions) {
        for ( var i in exceptions ) {
            if ( exceptions[i].test(el[i]) ) {
                return true;
            }
        }

        return false;
    };

    me.extend(me.eventType = {}, {
        touchstart: 1,
        touchmove: 1,
        touchend: 1,

        mousedown: 2,
        mousemove: 2,
        mouseup: 2,

        pointerdown: 3,
        pointermove: 3,
        pointerup: 3,

        MSPointerDown: 3,
        MSPointerMove: 3,
        MSPointerUp: 3
    });

    me.extend(me.ease = {}, {
        quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function (k) {
                return k * ( 2 - k );
            }
        },
        circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',   // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
            fn: function (k) {
                return Math.sqrt( 1 - ( --k * k ) );
            }
        },
        back: {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: function (k) {
                var b = 4;
                return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
            }
        },
        bounce: {
            style: '',
            fn: function (k) {
                if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
                    return 7.5625 * k * k;
                } else if ( k < ( 2 / 2.75 ) ) {
                    return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
                } else if ( k < ( 2.5 / 2.75 ) ) {
                    return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
                } else {
                    return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
                }
            }
        },
        elastic: {
            style: '',
            fn: function (k) {
                var f = 0.22,
                    e = 0.4;

                if ( k === 0 ) { return 0; }
                if ( k == 1 ) { return 1; }

                return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
            }
        }
    });

    me.tap = function (e, eventName) {
        var ev = document.createEvent('Event');
        ev.initEvent(eventName, true, true);
        ev.pageX = e.pageX;
        ev.pageY = e.pageY;
        e.target.dispatchEvent(ev);
    };

    me.click = function (e) {
        var target = e.target,
            ev;

        if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
            ev = document.createEvent('MouseEvents');
            ev.initMouseEvent('click', true, true, e.view, 1,
                target.screenX, target.screenY, target.clientX, target.clientY,
                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                0, null);

            ev._constructed = true;
            target.dispatchEvent(ev);
        }
    };

    return me;
})();

function IScroll (el, options) {
    this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
    this.scroller = this.wrapper.children[0];
    this.scrollerStyle = this.scroller.style;       // cache style for better performance

    this.options = {

        resizeScrollbars: true,

        mouseWheelSpeed: 20,

        snapThreshold: 0.334,

// INSERT POINT: OPTIONS 

        startX: 0,
        startY: 0,
        scrollY: true,
        directionLockThreshold: 5,
        momentum: true,

        bounce: true,
        bounceTime: 600,
        bounceEasing: '',

        preventDefault: true,
        preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

        HWCompositing: true,
        useTransition: true,
        useTransform: true,
        
        isBack:true,//自定义添加：
        isRelease:false,
        
        topOffset:0,//自定义添加：内容距离头部的相对位置，开始滑动
        bottomOffset:0//自定义添加：内容距离底部的相对位置，开始滑动
    };

    for ( var i in options ) {
        this.options[i] = options[i];
    }

    // Normalize options
    this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

    this.options.useTransition = utils.hasTransition && this.options.useTransition;
    this.options.useTransform = utils.hasTransform && this.options.useTransform;

    this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
    this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

    // If you want eventPassthrough I have to lock one of the axes
    this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
    this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

    // With eventPassthrough we also need lockDirection mechanism
    this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
    this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

    this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

    this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

    if ( this.options.tap === true ) {
        this.options.tap = 'tap';
    }

    if ( this.options.shrinkScrollbars == 'scale' ) {
        this.options.useTransition = false;
    }

    this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

    if ( this.options.probeType == 3 ) {
        this.options.useTransition = false; }

// INSERT POINT: NORMALIZATION

    // Some defaults    
    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;
    this._events = {};

// INSERT POINT: DEFAULTS

    this._init();
    this.refresh();

    this.scrollTo(this.options.startX, this.options.startY);
    this.enable();
}

IScroll.prototype = {
    version: '5.1.3',

    _init: function () {
        this._initEvents();

        if ( this.options.scrollbars || this.options.indicators ) {
            this._initIndicators();
        }

        if ( this.options.mouseWheel ) {
            this._initWheel();
        }

        if ( this.options.snap ) {
            this._initSnap();
        }

        if ( this.options.keyBindings ) {
            this._initKeys();
        }

// INSERT POINT: _init

    },

    destroy: function () {
        this._initEvents(true);

        this._execEvent('destroy');
    },

    _transitionEnd: function (e) {
        if ( e.target != this.scroller || !this.isInTransition ) {
            return;
        }

        this._transitionTime();
        if ( !this.resetPosition(this.options.bounceTime) ) {
            this.isInTransition = false;
            this._execEvent('scrollEnd');
        }
    },

    _start: function (e) {
        // React to left mouse button only
        if ( utils.eventType[e.type] != 1 ) {
            if ( e.button !== 0 ) {
                return;
            }
        }

        if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
            return;
        }

        if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
            e.preventDefault();
        }

        var point = e.touches ? e.touches[0] : e,
            pos;

        this.initiated  = utils.eventType[e.type];
        this.moved      = false;
        this.distX      = 0;
        this.distY      = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.directionLocked = 0;

        this._transitionTime();

        this.startTime = utils.getTime();

        if ( this.options.useTransition && this.isInTransition ) {
            this.isInTransition = false;
            pos = this.getComputedPosition();
            this._translate(Math.round(pos.x), Math.round(pos.y));
            this._execEvent('scrollEnd');
        } else if ( !this.options.useTransition && this.isAnimating ) {
            this.isAnimating = false;
            this._execEvent('scrollEnd');
        }

        this.startX    = this.x;
        this.startY    = this.y;
        this.absStartX = this.x;
        this.absStartY = this.y;
        this.pointX    = point.pageX;
        this.pointY    = point.pageY;

        this._execEvent('beforeScrollStart');
    },

    _move: function (e) {
        if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
            return;
        }

        if ( this.options.preventDefault ) {    // increases performance on Android? TODO: check!
            e.preventDefault();
        }

        var point       = e.touches ? e.touches[0] : e,
            deltaX      = point.pageX - this.pointX,
            deltaY      = point.pageY - this.pointY,
            timestamp   = utils.getTime(),
            newX, newY,
            absDistX, absDistY;

        this.pointX     = point.pageX;
        this.pointY     = point.pageY;

        this.distX      += deltaX;
        this.distY      += deltaY;
        absDistX        = Math.abs(this.distX);
        absDistY        = Math.abs(this.distY);

        // We need to move at least 10 pixels for the scrolling to initiate
        if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
            return;
        }

        // If you are scrolling in one direction lock the other
        if ( !this.directionLocked && !this.options.freeScroll ) {
            if ( absDistX > absDistY + this.options.directionLockThreshold ) {
                this.directionLocked = 'h';     // lock horizontally
            } else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
                this.directionLocked = 'v';     // lock vertically
            } else {
                this.directionLocked = 'n';     // no lock
            }
        }

        if ( this.directionLocked == 'h' ) {
            if ( this.options.eventPassthrough == 'vertical' ) {
                e.preventDefault();
            } else if ( this.options.eventPassthrough == 'horizontal' ) {
                this.initiated = false;
                return;
            }

            deltaY = 0;
        } else if ( this.directionLocked == 'v' ) {
            if ( this.options.eventPassthrough == 'horizontal' ) {
                e.preventDefault();
            } else if ( this.options.eventPassthrough == 'vertical' ) {
                this.initiated = false;
                return;
            }

            deltaX = 0;
        }

        deltaX = this.hasHorizontalScroll ? deltaX : 0;
        deltaY = this.hasVerticalScroll ? deltaY : 0;

        newX = this.x + deltaX;
        newY = this.y + deltaY;

        // Slow down if outside of the boundaries
        if ( newX > 0 || newX < this.maxScrollX ) {
            newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
        }
        if ( newY > 0 || newY < this.maxScrollY ) {
            newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
        }

        this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

        if ( !this.moved ) {
            this._execEvent('scrollStart');
        }

        this.moved = true;

        this._translate(newX, newY);

/* REPLACE START: _move */
        if ( timestamp - this.startTime > 300 ) {
            this.startTime = timestamp;
            this.startX = this.x;
            this.startY = this.y;

            if ( this.options.probeType == 1 ) {
                this._execEvent('scroll');
            }
        }

        if ( this.options.probeType > 1 ) {
            this._execEvent('scroll');
        }
/* REPLACE END: _move */

    },

    _end: function (e) {
        if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
            return;
        }

        if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
            e.preventDefault();
        }

        var point = e.changedTouches ? e.changedTouches[0] : e,
            momentumX,
            momentumY,
            duration = utils.getTime() - this.startTime,
            newX = Math.round(this.x),
            newY = Math.round(this.y),
            distanceX = Math.abs(newX - this.startX),
            distanceY = Math.abs(newY - this.startY),
            time = 0,
            easing = '';

        this.isInTransition = 0;
        this.initiated = 0;
        this.endTime = utils.getTime();
        
        if(this.options.isRelease ===false && this.y>=this.options.topOffset || this.y<=this.maxScrollY-this.options.bottomOffset){
            this._execEvent('release');
        }
        
        // reset if we are outside of the boundaries
        //自定义xiu
        if ( this.resetPosition(this.options.bounceTime) ) {
        //if ( this.resetPositionToOffset(this.options.bounceTime) ) {
            return;
        }

        this.scrollTo(newX, newY);  // ensures that the last position is rounded

        // we scrolled less than 10 pixels
        if ( !this.moved ) {
            if ( this.options.tap ) {
                utils.tap(e, this.options.tap);
            }

            if ( this.options.click ) {
                utils.click(e);
            }

            this._execEvent('scrollCancel');
            return;
        }

        if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
            this._execEvent('flick');
            return;
        }

        // start momentum animation if needed
        if ( this.options.momentum && duration < 300 ) {
            momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
            momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
            newX = momentumX.destination;
            newY = momentumY.destination;
            time = Math.max(momentumX.duration, momentumY.duration);
            this.isInTransition = 1;
        }


        if ( this.options.snap ) {
            var snap = this._nearestSnap(newX, newY);
            this.currentPage = snap;
            time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(newX - snap.x), 1000),
                        Math.min(Math.abs(newY - snap.y), 1000)
                    ), 300);
            newX = snap.x;
            newY = snap.y;

            this.directionX = 0;
            this.directionY = 0;
            easing = this.options.bounceEasing;
        }

// INSERT POINT: _end

        if ( newX != this.x || newY != this.y ) {
            // change easing function when scroller goes out of the boundaries
            if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
                easing = utils.ease.quadratic;
            }

            this.scrollTo(newX, newY, time, easing);
            return;
        }

        this._execEvent('scrollEnd');
    },

    _resize: function () {
        var that = this;

        clearTimeout(this.resizeTimeout);

        this.resizeTimeout = setTimeout(function () {
            that.refresh();
        }, this.options.resizePolling);
    },

    resetPosition: function (time,toOffset) {
        var x = this.x,
            y = this.y;
        var toOffset = toOffset === void 0 ? this.options.isBack : toOffset;//自定义添加
        
        time = time || 0;

        if ( !this.hasHorizontalScroll || this.x > 0 ) {
            x = 0;
        } else if ( this.x < this.maxScrollX ) {
            x = this.maxScrollX;
        }

        if ( !this.hasVerticalScroll || this.y > 0 ) {
            y = 0;
        } else if ( this.y < this.maxScrollY ) {
            y = this.maxScrollY;
        }

        if ( x == this.x && y == this.y ) {
            return false;
        }

        //自定义添加以下
        if(toOffset === false){
            if( y >= 0){
                y = this.options.topOffset;
            }else if ( y <= this.maxScrollY ){
                y = this.maxScrollY - this.options.bottomOffset;
            }
        }
        //以上自定义添加
        this.scrollTo(x, y, time, this.options.bounceEasing);
        //自定义添加：释放回到初始位置后，this.options.isRelease 重置为false
        
        return true;
    },
    
    //自定义添加方法
    resetPositionToOffset: function (time) {
        var x = this.x,
            y = this.y;

        time = time || 0;

        if ( !this.hasHorizontalScroll || this.x > 0 ) {
            x = 0;
        } else if ( this.x < this.maxScrollX ) {
            x = this.maxScrollX;
        }

        if ( !this.hasVerticalScroll || this.y > 0 ) {
            y = 0;
        } else if ( this.y < this.maxScrollY ) {
            y = this.maxScrollY;
        }

        if ( x == this.x && y == this.y ) {
            return false;
        }
        
        if(this.options.isBack === false){
            if(y >= 0){
                y = this.options.topOffset;
            }else if ( y <= this.maxScrollY ){
                y = this.maxScrollY - this.options.bottomOffset;
            }
        }
        
        this.scrollTo(x, y, time, this.options.bounceEasing);

        return true;
    },

    disable: function () {
        this.enabled = false;
    },

    enable: function () {
        this.enabled = true;
    },

    refresh: function () {
        var rf = this.wrapper.offsetHeight;     // Force reflow

        this.wrapperWidth   = this.wrapper.clientWidth;
        this.wrapperHeight  = this.wrapper.clientHeight;
        
        

/* REPLACE START: refresh */

        this.scrollerWidth  = this.scroller.offsetWidth;
        //this.scrollerHeight   = this.scroller.offsetHeight;//自定义添加后注释掉
        
        //自定义添加以下
        this.scrollerHeight = this.scroller.offsetHeight - this.options.topOffset - this.options.bottomOffset;
        this.scroller.style.marginTop = -this.options.topOffset + 'px';
        this.scroller.style.marginBottom = -this.options.bottomOffset + 'px';
        //自定义添加以上

        this.maxScrollX     = this.wrapperWidth - this.scrollerWidth;
        this.maxScrollY     = this.wrapperHeight - this.scrollerHeight;

/* REPLACE END: refresh */

        this.hasHorizontalScroll    = this.options.scrollX && this.maxScrollX < 0;
        this.hasVerticalScroll      = this.options.scrollY && this.maxScrollY < 0;

        if ( !this.hasHorizontalScroll ) {
            this.maxScrollX = 0;
            this.scrollerWidth = this.wrapperWidth;
        }

        if ( !this.hasVerticalScroll ) {
            this.maxScrollY = 0;
            this.scrollerHeight = this.wrapperHeight;
        }

        this.endTime = 0;
        this.directionX = 0;
        this.directionY = 0;

        this.wrapperOffset = utils.offset(this.wrapper);

        this._execEvent('refresh');

        this.resetPosition();

// INSERT POINT: _refresh

    },

    on: function (type, fn) {
        if ( !this._events[type] ) {
            this._events[type] = [];
        }

        this._events[type].push(fn);
    },

    off: function (type, fn) {
        if ( !this._events[type] ) {
            return;
        }

        var index = this._events[type].indexOf(fn);

        if ( index > -1 ) {
            this._events[type].splice(index, 1);
        }
    },

    _execEvent: function (type) {
        if ( !this._events[type] ) {
            return;
        }

        var i = 0,
            l = this._events[type].length;

        if ( !l ) {
            return;
        }

        for ( ; i < l; i++ ) {
            this._events[type][i].apply(this, [].slice.call(arguments, 1));
        }
    },

    scrollBy: function (x, y, time, easing) {
        x = this.x + x;
        y = this.y + y;
        time = time || 0;

        this.scrollTo(x, y, time, easing);
    },

    scrollTo: function (x, y, time, easing) {
        easing = easing || utils.ease.circular;

        this.isInTransition = this.options.useTransition && time > 0;

        if ( !time || (this.options.useTransition && easing.style) ) {
            this._transitionTimingFunction(easing.style);
            this._transitionTime(time);
            this._translate(x, y);
        } else {
            this._animate(x, y, time, easing.fn);
        }
    },

    scrollToElement: function (el, time, offsetX, offsetY, easing) {
        el = el.nodeType ? el : this.scroller.querySelector(el);

        if ( !el ) {
            return;
        }

        var pos = utils.offset(el);

        pos.left -= this.wrapperOffset.left;
        pos.top  -= this.wrapperOffset.top;

        // if offsetX/Y are true we center the element to the screen
        if ( offsetX === true ) {
            offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
        }
        if ( offsetY === true ) {
            offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
        }

        pos.left -= offsetX || 0;
        pos.top  -= offsetY || 0;

        pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
        pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

        time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

        this.scrollTo(pos.left, pos.top, time, easing);
    },

    _transitionTime: function (time) {
        time = time || 0;

        this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

        if ( !time && utils.isBadAndroid ) {
            this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
        }


        if ( this.indicators ) {
            for ( var i = this.indicators.length; i--; ) {
                this.indicators[i].transitionTime(time);
            }
        }


// INSERT POINT: _transitionTime

    },

    _transitionTimingFunction: function (easing) {
        this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


        if ( this.indicators ) {
            for ( var i = this.indicators.length; i--; ) {
                this.indicators[i].transitionTimingFunction(easing);
            }
        }


// INSERT POINT: _transitionTimingFunction

    },

    _translate: function (x, y) {
        if ( this.options.useTransform ) {

/* REPLACE START: _translate */

            this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

/* REPLACE END: _translate */

        } else {
            x = Math.round(x);
            y = Math.round(y);
            this.scrollerStyle.left = x + 'px';
            this.scrollerStyle.top = y + 'px';
        }

        this.x = x;
        this.y = y;


    if ( this.indicators ) {
        for ( var i = this.indicators.length; i--; ) {
            this.indicators[i].updatePosition();
        }
    }


// INSERT POINT: _translate

    },

    _initEvents: function (remove) {
        var eventType = remove ? utils.removeEvent : utils.addEvent,
            target = this.options.bindToWrapper ? this.wrapper : window;

        eventType(window, 'orientationchange', this);
        eventType(window, 'resize', this);

        if ( this.options.click ) {
            eventType(this.wrapper, 'click', this, true);
        }

        if ( !this.options.disableMouse ) {
            eventType(this.wrapper, 'mousedown', this);
            eventType(target, 'mousemove', this);
            eventType(target, 'mousecancel', this);
            eventType(target, 'mouseup', this);
        }

        if ( utils.hasPointer && !this.options.disablePointer ) {
            eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
            eventType(target, utils.prefixPointerEvent('pointermove'), this);
            eventType(target, utils.prefixPointerEvent('pointercancel'), this);
            eventType(target, utils.prefixPointerEvent('pointerup'), this);
        }

        if ( utils.hasTouch && !this.options.disableTouch ) {
            eventType(this.wrapper, 'touchstart', this);
            eventType(target, 'touchmove', this);
            eventType(target, 'touchcancel', this);
            eventType(target, 'touchend', this);
        }

        eventType(this.scroller, 'transitionend', this);
        eventType(this.scroller, 'webkitTransitionEnd', this);
        eventType(this.scroller, 'oTransitionEnd', this);
        eventType(this.scroller, 'MSTransitionEnd', this);
    },

    getComputedPosition: function () {
        var matrix = window.getComputedStyle(this.scroller, null),
            x, y;

        if ( this.options.useTransform ) {
            matrix = matrix[utils.style.transform].split(')')[0].split(', ');
            x = +(matrix[12] || matrix[4]);
            y = +(matrix[13] || matrix[5]);
        } else {
            x = +matrix.left.replace(/[^-\d.]/g, '');
            y = +matrix.top.replace(/[^-\d.]/g, '');
        }

        return { x: x, y: y };
    },

    _initIndicators: function () {
        var interactive = this.options.interactiveScrollbars,
            customStyle = typeof this.options.scrollbars != 'string',
            indicators = [],
            indicator;

        var that = this;

        this.indicators = [];

        if ( this.options.scrollbars ) {
            // Vertical scrollbar
            if ( this.options.scrollY ) {
                indicator = {
                    el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                    interactive: interactive,
                    defaultScrollbars: true,
                    customStyle: customStyle,
                    resize: this.options.resizeScrollbars,
                    shrink: this.options.shrinkScrollbars,
                    fade: this.options.fadeScrollbars,
                    listenX: false
                };

                this.wrapper.appendChild(indicator.el);
                indicators.push(indicator);
            }

            // Horizontal scrollbar
            if ( this.options.scrollX ) {
                indicator = {
                    el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                    interactive: interactive,
                    defaultScrollbars: true,
                    customStyle: customStyle,
                    resize: this.options.resizeScrollbars,
                    shrink: this.options.shrinkScrollbars,
                    fade: this.options.fadeScrollbars,
                    listenY: false
                };

                this.wrapper.appendChild(indicator.el);
                indicators.push(indicator);
            }
        }

        if ( this.options.indicators ) {
            // TODO: check concat compatibility
            indicators = indicators.concat(this.options.indicators);
        }

        for ( var i = indicators.length; i--; ) {
            this.indicators.push( new Indicator(this, indicators[i]) );
        }

        // TODO: check if we can use array.map (wide compatibility and performance issues)
        function _indicatorsMap (fn) {
            for ( var i = that.indicators.length; i--; ) {
                fn.call(that.indicators[i]);
            }
        }

        if ( this.options.fadeScrollbars ) {
            this.on('scrollEnd', function () {
                _indicatorsMap(function () {
                    this.fade();
                });
            });

            this.on('scrollCancel', function () {
                _indicatorsMap(function () {
                    this.fade();
                });
            });

            this.on('scrollStart', function () {
                _indicatorsMap(function () {
                    this.fade(1);
                });
            });

            this.on('beforeScrollStart', function () {
                _indicatorsMap(function () {
                    this.fade(1, true);
                });
            });
        }


        this.on('refresh', function () {
            _indicatorsMap(function () {
                this.refresh();
            });
        });

        this.on('destroy', function () {
            _indicatorsMap(function () {
                this.destroy();
            });

            delete this.indicators;
        });
    },

    _initWheel: function () {
        utils.addEvent(this.wrapper, 'wheel', this);
        utils.addEvent(this.wrapper, 'mousewheel', this);
        utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

        this.on('destroy', function () {
            utils.removeEvent(this.wrapper, 'wheel', this);
            utils.removeEvent(this.wrapper, 'mousewheel', this);
            utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
        });
    },

    _wheel: function (e) {
        if ( !this.enabled ) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        var wheelDeltaX, wheelDeltaY,
            newX, newY,
            that = this;

        if ( this.wheelTimeout === undefined ) {
            that._execEvent('scrollStart');
        }

        // Execute the scrollEnd event after 400ms the wheel stopped scrolling
        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(function () {
            that._execEvent('scrollEnd');
            that.wheelTimeout = undefined;
        }, 400);

        if ( 'deltaX' in e ) {
            if (e.deltaMode === 1) {
                wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
            } else {
                wheelDeltaX = -e.deltaX;
                wheelDeltaY = -e.deltaY;
            }
        } else if ( 'wheelDeltaX' in e ) {
            wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
            wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
        } else if ( 'wheelDelta' in e ) {
            wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
        } else if ( 'detail' in e ) {
            wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
        } else {
            return;
        }

        wheelDeltaX *= this.options.invertWheelDirection;
        wheelDeltaY *= this.options.invertWheelDirection;

        if ( !this.hasVerticalScroll ) {
            wheelDeltaX = wheelDeltaY;
            wheelDeltaY = 0;
        }

        if ( this.options.snap ) {
            newX = this.currentPage.pageX;
            newY = this.currentPage.pageY;

            if ( wheelDeltaX > 0 ) {
                newX--;
            } else if ( wheelDeltaX < 0 ) {
                newX++;
            }

            if ( wheelDeltaY > 0 ) {
                newY--;
            } else if ( wheelDeltaY < 0 ) {
                newY++;
            }

            this.goToPage(newX, newY);

            return;
        }

        newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
        newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

        if ( newX > 0 ) {
            newX = 0;
        } else if ( newX < this.maxScrollX ) {
            newX = this.maxScrollX;
        }

        if ( newY > 0 ) {
            newY = 0;
        } else if ( newY < this.maxScrollY ) {
            newY = this.maxScrollY;
        }

        this.scrollTo(newX, newY, 0);

        if ( this.options.probeType > 1 ) {
            this._execEvent('scroll');
        }

// INSERT POINT: _wheel
    },

    _initSnap: function () {
        this.currentPage = {};

        if ( typeof this.options.snap == 'string' ) {
            this.options.snap = this.scroller.querySelectorAll(this.options.snap);
        }

        this.on('refresh', function () {
            var i = 0, l,
                m = 0, n,
                cx, cy,
                x = 0, y,
                stepX = this.options.snapStepX || this.wrapperWidth,
                stepY = this.options.snapStepY || this.wrapperHeight,
                el;

            this.pages = [];

            if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
                return;
            }

            if ( this.options.snap === true ) {
                cx = Math.round( stepX / 2 );
                cy = Math.round( stepY / 2 );

                while ( x > -this.scrollerWidth ) {
                    this.pages[i] = [];
                    l = 0;
                    y = 0;

                    while ( y > -this.scrollerHeight ) {
                        this.pages[i][l] = {
                            x: Math.max(x, this.maxScrollX),
                            y: Math.max(y, this.maxScrollY),
                            width: stepX,
                            height: stepY,
                            cx: x - cx,
                            cy: y - cy
                        };

                        y -= stepY;
                        l++;
                    }

                    x -= stepX;
                    i++;
                }
            } else {
                el = this.options.snap;
                l = el.length;
                n = -1;

                for ( ; i < l; i++ ) {
                    if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
                        m = 0;
                        n++;
                    }

                    if ( !this.pages[m] ) {
                        this.pages[m] = [];
                    }

                    x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                    y = Math.max(-el[i].offsetTop, this.maxScrollY);
                    cx = x - Math.round(el[i].offsetWidth / 2);
                    cy = y - Math.round(el[i].offsetHeight / 2);

                    this.pages[m][n] = {
                        x: x,
                        y: y,
                        width: el[i].offsetWidth,
                        height: el[i].offsetHeight,
                        cx: cx,
                        cy: cy
                    };

                    if ( x > this.maxScrollX ) {
                        m++;
                    }
                }
            }

            this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

            // Update snap threshold if needed
            if ( this.options.snapThreshold % 1 === 0 ) {
                this.snapThresholdX = this.options.snapThreshold;
                this.snapThresholdY = this.options.snapThreshold;
            } else {
                this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
            }
        });

        this.on('flick', function () {
            var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.x - this.startX), 1000),
                        Math.min(Math.abs(this.y - this.startY), 1000)
                    ), 300);

            this.goToPage(
                this.currentPage.pageX + this.directionX,
                this.currentPage.pageY + this.directionY,
                time
            );
        });
    },

    _nearestSnap: function (x, y) {
        if ( !this.pages.length ) {
            return { x: 0, y: 0, pageX: 0, pageY: 0 };
        }

        var i = 0,
            l = this.pages.length,
            m = 0;

        // Check if we exceeded the snap threshold
        if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
            Math.abs(y - this.absStartY) < this.snapThresholdY ) {
            return this.currentPage;
        }

        if ( x > 0 ) {
            x = 0;
        } else if ( x < this.maxScrollX ) {
            x = this.maxScrollX;
        }

        if ( y > 0 ) {
            y = 0;
        } else if ( y < this.maxScrollY ) {
            y = this.maxScrollY;
        }

        for ( ; i < l; i++ ) {
            if ( x >= this.pages[i][0].cx ) {
                x = this.pages[i][0].x;
                break;
            }
        }

        l = this.pages[i].length;

        for ( ; m < l; m++ ) {
            if ( y >= this.pages[0][m].cy ) {
                y = this.pages[0][m].y;
                break;
            }
        }

        if ( i == this.currentPage.pageX ) {
            i += this.directionX;

            if ( i < 0 ) {
                i = 0;
            } else if ( i >= this.pages.length ) {
                i = this.pages.length - 1;
            }

            x = this.pages[i][0].x;
        }

        if ( m == this.currentPage.pageY ) {
            m += this.directionY;

            if ( m < 0 ) {
                m = 0;
            } else if ( m >= this.pages[0].length ) {
                m = this.pages[0].length - 1;
            }

            y = this.pages[0][m].y;
        }

        return {
            x: x,
            y: y,
            pageX: i,
            pageY: m
        };
    },

    goToPage: function (x, y, time, easing) {
        easing = easing || this.options.bounceEasing;

        if ( x >= this.pages.length ) {
            x = this.pages.length - 1;
        } else if ( x < 0 ) {
            x = 0;
        }

        if ( y >= this.pages[x].length ) {
            y = this.pages[x].length - 1;
        } else if ( y < 0 ) {
            y = 0;
        }

        var posX = this.pages[x][y].x,
            posY = this.pages[x][y].y;

        time = time === undefined ? this.options.snapSpeed || Math.max(
            Math.max(
                Math.min(Math.abs(posX - this.x), 1000),
                Math.min(Math.abs(posY - this.y), 1000)
            ), 300) : time;

        this.currentPage = {
            x: posX,
            y: posY,
            pageX: x,
            pageY: y
        };

        this.scrollTo(posX, posY, time, easing);
    },

    next: function (time, easing) {
        var x = this.currentPage.pageX,
            y = this.currentPage.pageY;

        x++;

        if ( x >= this.pages.length && this.hasVerticalScroll ) {
            x = 0;
            y++;
        }

        this.goToPage(x, y, time, easing);
    },

    prev: function (time, easing) {
        var x = this.currentPage.pageX,
            y = this.currentPage.pageY;

        x--;

        if ( x < 0 && this.hasVerticalScroll ) {
            x = 0;
            y--;
        }

        this.goToPage(x, y, time, easing);
    },

    _initKeys: function (e) {
        // default key bindings
        var keys = {
            pageUp: 33,
            pageDown: 34,
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40
        };
        var i;

        // if you give me characters I give you keycode
        if ( typeof this.options.keyBindings == 'object' ) {
            for ( i in this.options.keyBindings ) {
                if ( typeof this.options.keyBindings[i] == 'string' ) {
                    this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                }
            }
        } else {
            this.options.keyBindings = {};
        }

        for ( i in keys ) {
            this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
        }

        utils.addEvent(window, 'keydown', this);

        this.on('destroy', function () {
            utils.removeEvent(window, 'keydown', this);
        });
    },

    _key: function (e) {
        if ( !this.enabled ) {
            return;
        }

        var snap = this.options.snap,   // we are using this alot, better to cache it
            newX = snap ? this.currentPage.pageX : this.x,
            newY = snap ? this.currentPage.pageY : this.y,
            now = utils.getTime(),
            prevTime = this.keyTime || 0,
            acceleration = 0.250,
            pos;

        if ( this.options.useTransition && this.isInTransition ) {
            pos = this.getComputedPosition();

            this._translate(Math.round(pos.x), Math.round(pos.y));
            this.isInTransition = false;
        }

        this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

        switch ( e.keyCode ) {
            case this.options.keyBindings.pageUp:
                if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
                    newX += snap ? 1 : this.wrapperWidth;
                } else {
                    newY += snap ? 1 : this.wrapperHeight;
                }
                break;
            case this.options.keyBindings.pageDown:
                if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
                    newX -= snap ? 1 : this.wrapperWidth;
                } else {
                    newY -= snap ? 1 : this.wrapperHeight;
                }
                break;
            case this.options.keyBindings.end:
                newX = snap ? this.pages.length-1 : this.maxScrollX;
                newY = snap ? this.pages[0].length-1 : this.maxScrollY;
                break;
            case this.options.keyBindings.home:
                newX = 0;
                newY = 0;
                break;
            case this.options.keyBindings.left:
                newX += snap ? -1 : 5 + this.keyAcceleration>>0;
                break;
            case this.options.keyBindings.up:
                newY += snap ? 1 : 5 + this.keyAcceleration>>0;
                break;
            case this.options.keyBindings.right:
                newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
                break;
            case this.options.keyBindings.down:
                newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
                break;
            default:
                return;
        }

        if ( snap ) {
            this.goToPage(newX, newY);
            return;
        }

        if ( newX > 0 ) {
            newX = 0;
            this.keyAcceleration = 0;
        } else if ( newX < this.maxScrollX ) {
            newX = this.maxScrollX;
            this.keyAcceleration = 0;
        }

        if ( newY > 0 ) {
            newY = 0;
            this.keyAcceleration = 0;
        } else if ( newY < this.maxScrollY ) {
            newY = this.maxScrollY;
            this.keyAcceleration = 0;
        }

        this.scrollTo(newX, newY, 0);

        this.keyTime = now;
    },

    _animate: function (destX, destY, duration, easingFn) {
        var that = this,
            startX = this.x,
            startY = this.y,
            startTime = utils.getTime(),
            destTime = startTime + duration;

        function step () {
            var now = utils.getTime(),
                newX, newY,
                easing;

            if ( now >= destTime ) {
                that.isAnimating = false;
                that._translate(destX, destY);
                
                if ( !that.resetPosition(that.options.bounceTime) ) {
                    that._execEvent('scrollEnd');
                }

                return;
            }

            now = ( now - startTime ) / duration;
            easing = easingFn(now);
            newX = ( destX - startX ) * easing + startX;
            newY = ( destY - startY ) * easing + startY;
            that._translate(newX, newY);

            if ( that.isAnimating ) {
                rAF(step);
            }

            if ( that.options.probeType == 3 ) {
                that._execEvent('scroll');
            }
        }

        this.isAnimating = true;
        step();
    },

    handleEvent: function (e) {
        switch ( e.type ) {
            case 'touchstart':
            case 'pointerdown':
            case 'MSPointerDown':
            case 'mousedown':
                this._start(e);
                break;
            case 'touchmove':
            case 'pointermove':
            case 'MSPointerMove':
            case 'mousemove':
                this._move(e);
                break;
            case 'touchend':
            case 'pointerup':
            case 'MSPointerUp':
            case 'mouseup':
            case 'touchcancel':
            case 'pointercancel':
            case 'MSPointerCancel':
            case 'mousecancel':
                this._end(e);
                break;
            case 'orientationchange':
            case 'resize':
                this._resize();
                break;
            case 'transitionend':
            case 'webkitTransitionEnd':
            case 'oTransitionEnd':
            case 'MSTransitionEnd':
                this._transitionEnd(e);
                break;
            case 'wheel':
            case 'DOMMouseScroll':
            case 'mousewheel':
                this._wheel(e);
                break;
            case 'keydown':
                this._key(e);
                break;
            case 'click':
                if ( !e._constructed ) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
        }
    }
};
function createDefaultScrollbar (direction, interactive, type) {
    var scrollbar = document.createElement('div'),
        indicator = document.createElement('div');

    if ( type === true ) {
        scrollbar.style.cssText = 'position:absolute;z-index:9999';
        indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
    }

    indicator.className = 'iScrollIndicator';

    if ( direction == 'h' ) {
        if ( type === true ) {
            scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
            indicator.style.height = '100%';
        }
        scrollbar.className = 'iScrollHorizontalScrollbar';
    } else {
        if ( type === true ) {
            scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
            indicator.style.width = '100%';
        }
        scrollbar.className = 'iScrollVerticalScrollbar';
    }

    scrollbar.style.cssText += ';overflow:hidden';

    if ( !interactive ) {
        scrollbar.style.pointerEvents = 'none';
    }

    scrollbar.appendChild(indicator);

    return scrollbar;
}

function Indicator (scroller, options) {
    this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
    this.wrapperStyle = this.wrapper.style;
    this.indicator = this.wrapper.children[0];
    this.indicatorStyle = this.indicator.style;
    this.scroller = scroller;

    this.options = {
        listenX: true,
        listenY: true,
        interactive: false,
        resize: true,
        defaultScrollbars: false,
        shrink: false,
        fade: false,
        speedRatioX: 0,
        speedRatioY: 0
    };

    for ( var i in options ) {
        this.options[i] = options[i];
    }

    this.sizeRatioX = 1;
    this.sizeRatioY = 1;
    this.maxPosX = 0;
    this.maxPosY = 0;

    if ( this.options.interactive ) {
        if ( !this.options.disableTouch ) {
            utils.addEvent(this.indicator, 'touchstart', this);
            utils.addEvent(window, 'touchend', this);
        }
        if ( !this.options.disablePointer ) {
            utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
            utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
        }
        if ( !this.options.disableMouse ) {
            utils.addEvent(this.indicator, 'mousedown', this);
            utils.addEvent(window, 'mouseup', this);
        }
    }

    if ( this.options.fade ) {
        this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
        this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
        this.wrapperStyle.opacity = '0';
    }
}

Indicator.prototype = {
    handleEvent: function (e) {
        switch ( e.type ) {
            case 'touchstart':
            case 'pointerdown':
            case 'MSPointerDown':
            case 'mousedown':
                this._start(e);
                break;
            case 'touchmove':
            case 'pointermove':
            case 'MSPointerMove':
            case 'mousemove':
                this._move(e);
                break;
            case 'touchend':
            case 'pointerup':
            case 'MSPointerUp':
            case 'mouseup':
            case 'touchcancel':
            case 'pointercancel':
            case 'MSPointerCancel':
            case 'mousecancel':
                this._end(e);
                break;
        }
    },

    destroy: function () {
        if ( this.options.interactive ) {
            utils.removeEvent(this.indicator, 'touchstart', this);
            utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
            utils.removeEvent(this.indicator, 'mousedown', this);

            utils.removeEvent(window, 'touchmove', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
            utils.removeEvent(window, 'mousemove', this);

            utils.removeEvent(window, 'touchend', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
            utils.removeEvent(window, 'mouseup', this);
        }

        if ( this.options.defaultScrollbars ) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
    },

    _start: function (e) {
        var point = e.touches ? e.touches[0] : e;

        e.preventDefault();
        e.stopPropagation();

        this.transitionTime();

        this.initiated = true;
        this.moved = false;
        this.lastPointX = point.pageX;
        this.lastPointY = point.pageY;

        this.startTime  = utils.getTime();

        if ( !this.options.disableTouch ) {
            utils.addEvent(window, 'touchmove', this);
        }
        if ( !this.options.disablePointer ) {
            utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
        }
        if ( !this.options.disableMouse ) {
            utils.addEvent(window, 'mousemove', this);
        }

        this.scroller._execEvent('beforeScrollStart');
    },

    _move: function (e) {
        var point = e.touches ? e.touches[0] : e,
            deltaX, deltaY,
            newX, newY,
            timestamp = utils.getTime();

        if ( !this.moved ) {
            this.scroller._execEvent('scrollStart');
        }

        this.moved = true;

        deltaX = point.pageX - this.lastPointX;
        this.lastPointX = point.pageX;

        deltaY = point.pageY - this.lastPointY;
        this.lastPointY = point.pageY;

        newX = this.x + deltaX;
        newY = this.y + deltaY;

        this._pos(newX, newY);


        if ( this.scroller.options.probeType == 1 && timestamp - this.startTime > 300 ) {
            this.startTime = timestamp;
            this.scroller._execEvent('scroll');
        } else if ( this.scroller.options.probeType > 1 ) {
            this.scroller._execEvent('scroll');
        }


// INSERT POINT: indicator._move

        e.preventDefault();
        e.stopPropagation();
    },

    _end: function (e) {
        if ( !this.initiated ) {
            return;
        }

        this.initiated = false;

        e.preventDefault();
        e.stopPropagation();

        utils.removeEvent(window, 'touchmove', this);
        utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
        utils.removeEvent(window, 'mousemove', this);

        if ( this.scroller.options.snap ) {
            var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

            var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.scroller.x - snap.x), 1000),
                        Math.min(Math.abs(this.scroller.y - snap.y), 1000)
                    ), 300);

            if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
                this.scroller.directionX = 0;
                this.scroller.directionY = 0;
                this.scroller.currentPage = snap;
                this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
            }
        }

        if ( this.moved ) {
            this.scroller._execEvent('scrollEnd');
        }
    },

    transitionTime: function (time) {
        time = time || 0;
        this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

        if ( !time && utils.isBadAndroid ) {
            this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
        }
    },

    transitionTimingFunction: function (easing) {
        this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
    },

    refresh: function () {
        this.transitionTime();

        if ( this.options.listenX && !this.options.listenY ) {
            this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
        } else if ( this.options.listenY && !this.options.listenX ) {
            this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
        } else {
            this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
        }

        if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
            utils.addClass(this.wrapper, 'iScrollBothScrollbars');
            utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

            if ( this.options.defaultScrollbars && this.options.customStyle ) {
                if ( this.options.listenX ) {
                    this.wrapper.style.right = '8px';
                } else {
                    this.wrapper.style.bottom = '8px';
                }
            }
        } else {
            utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
            utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

            if ( this.options.defaultScrollbars && this.options.customStyle ) {
                if ( this.options.listenX ) {
                    this.wrapper.style.right = '2px';
                } else {
                    this.wrapper.style.bottom = '2px';
                }
            }
        }

        var r = this.wrapper.offsetHeight;  // force refresh

        if ( this.options.listenX ) {
            this.wrapperWidth = this.wrapper.clientWidth;
            if ( this.options.resize ) {
                this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                this.indicatorStyle.width = this.indicatorWidth + 'px';
            } else {
                this.indicatorWidth = this.indicator.clientWidth;
            }

            this.maxPosX = this.wrapperWidth - this.indicatorWidth;

            if ( this.options.shrink == 'clip' ) {
                this.minBoundaryX = -this.indicatorWidth + 8;
                this.maxBoundaryX = this.wrapperWidth - 8;
            } else {
                this.minBoundaryX = 0;
                this.maxBoundaryX = this.maxPosX;
            }

            this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));  
        }

        if ( this.options.listenY ) {
            this.wrapperHeight = this.wrapper.clientHeight;
            if ( this.options.resize ) {
                this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                this.indicatorStyle.height = this.indicatorHeight + 'px';
            } else {
                this.indicatorHeight = this.indicator.clientHeight;
            }

            this.maxPosY = this.wrapperHeight - this.indicatorHeight;

            if ( this.options.shrink == 'clip' ) {
                this.minBoundaryY = -this.indicatorHeight + 8;
                this.maxBoundaryY = this.wrapperHeight - 8;
            } else {
                this.minBoundaryY = 0;
                this.maxBoundaryY = this.maxPosY;
            }

            this.maxPosY = this.wrapperHeight - this.indicatorHeight;
            this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
        }

        this.updatePosition();
    },

    updatePosition: function () {
        var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
            y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

        if ( !this.options.ignoreBoundaries ) {
            if ( x < this.minBoundaryX ) {
                if ( this.options.shrink == 'scale' ) {
                    this.width = Math.max(this.indicatorWidth + x, 8);
                    this.indicatorStyle.width = this.width + 'px';
                }
                x = this.minBoundaryX;
            } else if ( x > this.maxBoundaryX ) {
                if ( this.options.shrink == 'scale' ) {
                    this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                    this.indicatorStyle.width = this.width + 'px';
                    x = this.maxPosX + this.indicatorWidth - this.width;
                } else {
                    x = this.maxBoundaryX;
                }
            } else if ( this.options.shrink == 'scale' && this.width != this.indicatorWidth ) {
                this.width = this.indicatorWidth;
                this.indicatorStyle.width = this.width + 'px';
            }

            if ( y < this.minBoundaryY ) {
                if ( this.options.shrink == 'scale' ) {
                    this.height = Math.max(this.indicatorHeight + y * 3, 8);
                    this.indicatorStyle.height = this.height + 'px';
                }
                y = this.minBoundaryY;
            } else if ( y > this.maxBoundaryY ) {
                if ( this.options.shrink == 'scale' ) {
                    this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                    this.indicatorStyle.height = this.height + 'px';
                    y = this.maxPosY + this.indicatorHeight - this.height;
                } else {
                    y = this.maxBoundaryY;
                }
            } else if ( this.options.shrink == 'scale' && this.height != this.indicatorHeight ) {
                this.height = this.indicatorHeight;
                this.indicatorStyle.height = this.height + 'px';
            }
        }

        this.x = x;
        this.y = y;

        if ( this.scroller.options.useTransform ) {
            this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
        } else {
            this.indicatorStyle.left = x + 'px';
            this.indicatorStyle.top = y + 'px';
        }
    },

    _pos: function (x, y) {
        if ( x < 0 ) {
            x = 0;
        } else if ( x > this.maxPosX ) {
            x = this.maxPosX;
        }

        if ( y < 0 ) {
            y = 0;
        } else if ( y > this.maxPosY ) {
            y = this.maxPosY;
        }

        x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
        y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

        this.scroller.scrollTo(x, y);
    },

    fade: function (val, hold) {
        if ( hold && !this.visible ) {
            return;
        }

        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = null;

        var time = val ? 250 : 500,
            delay = val ? 0 : 300;

        val = val ? '1' : '0';

        this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

        this.fadeTimeout = setTimeout((function (val) {
            this.wrapperStyle.opacity = val;
            this.visible = +val;
        }).bind(this, val), delay);
    }
};

IScroll.utils = utils;

if ( typeof module != 'undefined' && module.exports ) {
    module.exports = IScroll;
} else {
    window.IScroll = IScroll;
}

})(window, document, Math);

/*
    author:jiaobingqian
    email:bingqian.jiao@3g2win.com
    description:web/weixin main function
    create:2015.08.07
    update:______/___author___

*/
(function(){
    
    var currZIndex = 9000;
    var currZIndex2 = 99999;
    var currPages = 1;
    var curWwwPath=window.document.location.href;
    
    var jsFiles=document.scripts;
    var jsBasePath=jsFiles[jsFiles.length-1].src.substring(0,jsFiles[jsFiles.length-1].src.lastIndexOf("/js/")+1);



    var isWebApp = function(){
        var iswa = location.href.indexOf('http') > -1;
        return iswa;
    }();
    
    var isWeiXin = function(){
        return navigator.userAgent.match(/micromessenger/i);
    };
    
    function loadjs(src, success, error) {
        var node = document.createElement('script');
        var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        node.src = src;
        
        if ('onload' in node) {
            node.onload = success;
            node.onerror = error;
        } else {
            node.onreadystatechange = function() {
                if (/loaded|complete/.test(node.readyState)) {
                    success();
                }
            }
        }
        
        head.appendChild(node);
    }
    var configWeiXin = function(url,callback){
        if(!isWeiXin()){
            return;
        }
        callback = callback || function(){};
        var getConfig = function(success){
            var xhr = new XMLHttpRequest();
            url = url || 'http://weixin.appcan.cn:8083/wechat_api/jsapi/jsconfig?debug=true&url='+location.href.split('#')[0];
            xhr.open('GET',url,true);
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4){
                    if (xhr.status == 200){
                        try{ 
                            var resData= JSON.parse(xhr.response);
                            if(resData.error){
                                //alert(xhr.response);
                            }else{
                                success(JSON.parse(xhr.response));
                            }
                        }catch(e){
                            alert(e);
                            success({});
                        } 
                    }else{
                        callback(null);
                    }
                }else{
                    callback(null);
                }
            };
            xhr.send(null);
        };
        var wxjsSdk = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
        loadjs(wxjsSdk,function(){
            getConfig(function(config){
                wx.config(config.res);
                //alert('config 111 success!');
                callback(config);
            });
        },function(e){
            callback(null);
        });
    };
    window.setWeiXinConfig = configWeiXin;
    
    
    var webchatUrl = location.origin + '/wechat_api/jsapi/jsconfig?debug=false&url='+location.href.split('#')[0];
    window.setWeiXinConfig(webchatUrl);

    //像素转em
    function px2em(px) {
        var basePx = window.getComputedStyle(document.body, '');
        var fontSize = parseInt(basePx.fontSize, 10);
        px = parseInt(px);
        return px / fontSize;
    }

    function isDefine(value) {
            if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined') {
                return false;
            } else {
                value = value + "";
                value = value.replace(/\s/g, "");
                if (value == "") {
                    return false;
                }
                return true;
            }
        }
    /**
     * 向指定的选项填充内容
     * @param string id 元素id
     * @param string html 填充的内容
     * @param string showstr 如果html为空，备选显示的html值变量
     */
    function setHtml(id, html, showstr) {
        var showval = isDefine(showstr) ? showstr : "";
        if ("string" == typeof(id)) {
            var ele = window.top.Zepto('#' + id);
            if (ele != null) {
                ele.html(isDefine(html) ? html : showval);
            } else {

            }
        } else if (id != null) {
            id.innerHTML = isDefine(html) ? html : showval;
        }
    }

    function canonical_uri(src, base_path) {
        var root_page = /^[^?#]*\//.exec(location.href)[0],
            root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
            absolute_regex = /^\w+\:\/\//;

        // is `src` is protocol-relative (begins with // or ///), prepend protocol 
        if (/^\/\/\/?/.test(src)) {
            src = location.protocol + src;
        }
        // is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /) 
        else if (!absolute_regex.test(src) && src.charAt(0) != "/" && src.indexOf('../') == -1) {
            // prepend `base_path`, if any 
            src = (base_path || "") + src;
        }
        // make sure to return `src` as absolute 
        return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain + src : (src.indexOf('../') == 0 ? root_domain + src.substr(2) : root_page + src)));
    }
  
    function loadjscssfile(filename, filetype) {

        var isExist = false;
        if (filetype == "js") {
            var  scripts = document.getElementsByTagName('script');    
            for (var  i = 0; i < scripts.length; i++) {
                if (scripts[i]['src'].indexOf(filename) != -1) {
                    isExist = true;
                    return;
                }
            }
            if (!isExist) {
                var fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", filename);
            }
        } else if (filetype == "css") {
            var  links = document.getElementsByTagName('link');    
            for (var  i = 0; i < links.length; i++) {
                if (links[i]['href'].indexOf(filename) != -1) {
                    isExist = true;
                    return;
                }
            }
            if (!isExist) {
                var fileref = document.createElement('link');
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
            }
        }
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }

    }

    //获取绝对路径
    function realPath(path){
        var DOT_RE = /\/\.\//g;
        var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;
        var MULTI_SLASH_RE = /([^:/])\/+\//g;
        // /a/b/./c/./d ==> /a/b/c/d
        path = path.replace(DOT_RE, "/");
        /*
            a//b/c ==> a/b/c
            a///b/////c ==> a/b/c
            DOUBLE_DOT_RE matches a/b/c//../d path correctly only if replace // with / first
        */
        path = path.replace(MULTI_SLASH_RE, "$1/");
        // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, "/");
        }
        return path;
    }

    function pathJoin(url,joinUrl){
        if(joinUrl.indexOf('http:') > -1){
            return joinUrl;
        }
        if(joinUrl.indexOf('//') == 0){
            return location.href.split('//')[0] + joinUrl;
        }
        if(url[url.length-1] != '/'){
            url = url.substr(0,url.lastIndexOf('/')+1);
        }
        var newUrl = url + joinUrl;
        return realPath(newUrl);
    }
    
    function getQueryString(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.top.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); return null; 
    } 
    
    //非popover页面加载IScroll调用函数
    function bounceSetting(enableBounce){
        
        //添加iscroll
        setTimeout(function(){
            //如果IScroll函数未加载完成
            if(!IScroll){ return ; }
            
            if(uexWindow._iscroll && uexWindow._iscroll.contentScroll){
                uexWindow._iscroll.contentScroll.destroy();
                uexWindow._iscroll.contentScroll = null;
            }
            
            //添加IScroll wrap && container 
            var popContent = Zepto("body").children();    
            var scrollContainer = Zepto('.scroll-container').length == 1 ? Zepto('.scroll-container') : Zepto('<div class="scroll-container" style=" min-height:100%; left:0;top:0;"></div>');
            var scrollWrapper = Zepto('.scroll-wrapper').length == 1 ? Zepto('.scroll-wrapper') :Zepto('<div class="scroll-wrapper" style="background-color:#ffffff;position:relative; height:100%;width:100%;overflow:hidden;"></div>');
            var originHtmlContainer = Zepto('.origin-html').length == 1 ? Zepto('.origin-html') :Zepto('<div class="origin-html" style="position:relative;width:100%;"></div>');
            
            if(!(scrollContainer.length && scrollContainer.selector && scrollWrapper.length && scrollWrapper.selector)){
                Zepto(originHtmlContainer).append(popContent);
                Zepto(scrollContainer).append(originHtmlContainer);
                Zepto(scrollWrapper).append(scrollContainer);
                Zepto("body")[0].appendChild(scrollWrapper[0]);
                
                if(originHtmlContainer.height()<scrollWrapper.height()){
                    originHtmlContainer.css("height",Zepto('body')[0].scrollHeight);
                }
                window._isFullScreen = true;
                //添加底部弹动内容区域
                scrollContainer.append('<div class="pullUpTips" style="height:52px;"><span class="pullUpIcon" style="display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px; "></span><span class="pullUpLabel" style="display:inline-block; line-height:52px; height:52px;"></span></div>');   
                //顶部弹动内容区域添加
                Zepto('<div class="pullDownTips" style="height:52px;"><span class="pullDownIcon" style="display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px; "></span><span class="pullDownLabel" style="display:inline-block; line-height:52px; height:52px;"></span></div>').insertBefore(Zepto('.scroll-container').children()[0]);   
 
                    
            }
            
            //设置弹动区域显示时默认配置

            var bounceImagePath = jsBasePath +'js/resource/blueArrow.png';
            
            var defaultParams ={
                'imagePath': bounceImagePath,
                'textColor': '#f0ecf3',
                'levelText': '',
                'pullToReloadText': '拖动刷新',
                'releaseToReloadText': '释放刷新',
                'loadingText': '加载中，请稍等',
                'loadingImagePath': ''
            };
            !uexWindow._iscroll.topParams && (uexWindow._iscroll.topParams = defaultParams);
            !uexWindow._iscroll.bottomParams && (uexWindow._iscroll.bottomParams = defaultParams);

            //showBounceView中参数flag设置是否显示弹动区域内容1:显示，0：不显示
            if(uexWindow._iscroll.topBounceShow){
                Zepto(".pullDownIcon")[0].style.cssText ='display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(-180deg) translateZ(0);';
                Zepto(".pullDownLabel").html(uexWindow._iscroll.topParams.pullToReloadText);
            }
            if(uexWindow._iscroll.topBounceColor){
                Zepto(".pullDownTips").css({"background-color":uexWindow._iscroll.topBounceColor});
            } 
            if(uexWindow._iscroll.bottomBounceShow){
                Zepto(".pullUpIcon")[0].style.cssText ='display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(0deg) translateZ(0);';
                Zepto(".pullUpLabel").html(uexWindow._iscroll.bottomParams.pullToReloadText);
            }
            if(uexWindow._iscroll.bottomBounceColor){
                Zepto(".pullUpTips").css({"background-color":uexWindow._iscroll.bottomBounceColor});
            }
            
            var pullDownTips = Zepto(".pullDownTips");
            var pullDownHeight = pullDownTips[0].offsetHeight;
            var pullDownIcon = Zepto(".pullDownIcon");
            var pullDownLabel = Zepto(".pullDownLabel");
            
            var pullUpTips = Zepto(".pullUpTips");
            var pullUpHeight =  pullUpTips[0]?pullUpTips[0].offsetHeight:0;
            var pullUpIcon = Zepto(".pullUpIcon");
            var pullUpLabel = Zepto(".pullUpLabel");

            //此变量用于修复滑动时maxScrollY获取不正确的问题
            var OrigMaxScrollY ;
            
            var enableCallback = false;
            
            //实例化IScroll
            uexWindow._iscroll.contentScroll = new IScroll(scrollWrapper[0],{
                useTransition: true,
                topOffset: pullDownHeight,
                bottomOffset: pullUpHeight,
                probeType:3,
                bounce:enableBounce,
                preventDefault:true,
                preventDefaultException:{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/,className:/(^|\s)btn|not-btn(\s|$)/}
            });
            
            //scrollStart事件：滑动开始
            uexWindow._iscroll.contentScroll.on('scrollStart',function(){
                enableCallback = false;
                //禁止弹动
                if(this.options.bounce == false){
                    this.refresh();
                    return false;
                } 
                
                if(this.options.isRelease === false && this.directionY == -1 && this.y <= 0){

                    //顶部向下拉
                    if(uexWindow._iscroll.topNotifyState){
                        uexWindow.onBounceStateChange(0,0);
                    }
                    if(uexWindow._iscroll.topBounceShow && !uexWindow._iscroll.topHidden){
                        pullDownIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(-180deg) translateZ(0)';
                        pullDownLabel.html(uexWindow._iscroll.topParams.pullToReloadText);
                    }
                    else if(uexWindow._iscroll.topBounceColor){
                        Zepto(".pullDownTips").css({"background-color":uexWindow._iscroll.topBounceColor});
                    }
                }else if(this.options.isRelease === false && this.directionY == 1 && this.y >= this.maxScrollY){
                    
                    //底部向上拉
                    if(uexWindow._iscroll.bottomNotifyState){
                        uexWindow.onBounceStateChange(1,0);
                    }
                    if(uexWindow._iscroll.bottomBounceShow && !uexWindow._iscroll.bottomHidden){
                        pullUpIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(0deg) translateZ(0)';
                        pullUpLabel.html(uexWindow._iscroll.bottomParams.pullToReloadText);
                    }else if(uexWindow._iscroll.bottomBounceColor){
                        Zepto(".pullUpTips").css({"background-color":uexWindow._iscroll.bottomBounceColor});
                    }
                }
                if(this.options.isRelease === false){
                    this.refresh();
                }
            });
            
            //scroll事件：滑动中
            uexWindow._iscroll.contentScroll.on('scroll',function(evt){
                
                //禁止弹动
                if(this.options.bounce == false){
                    return ; 
                } 
                
                //禁止顶部弹动
                if(uexWindow._iscroll.topHidden && this.y >= 0){
                    this.scrollTo(0, 0); 
                    return ;
                }

                //禁止底部弹动
                if(uexWindow._iscroll.bottomHidden == 0 && this.y <= OrigMaxScrollY){
                    this.scrollTo(0, this.maxScrollY);
                    return ;
                }
                
                // //禁止顶部弹动
                // if(uexWindow._iscroll.topBounceShow == 0 && this.y >= 0){
                    // this.scrollTo(0, 0); 
                    // return ;
                // }
// 
                // //禁止底部弹动
                // if(uexWindow._iscroll.bottomBounceShow == 0 && this.y <= OrigMaxScrollY){
                    // this.scrollTo(0, OrigMaxScrollY);
                    // return ;
                //}
                
                //顶部resetBounceView执行
                if(uexWindow._iscroll.topReset === true && this.options.isRelease === true &&  this.y <= this.options.topOffset){

                    uexWindow._iscroll.contentScroll.options.isBack = true;

                    //未恢复到0,此处取1
                    if(this.y <=1){
                        uexWindow._iscroll.topReset =false;
                        this.options.isRelease = false;
                    }
                }
                
                //底部resetBounceView执行
                if(uexWindow._iscroll.bottomReset === true && this.options.isRelease === true &&  this.y >= this.maxScrollY - this.options.bottomOffset){

                    uexWindow._iscroll.contentScroll.options.isBack = true;
                    
                    //未恢复到0,此处取
                    if(this.y >=this.maxScrollY-this.options.bottomOffset){
                        uexWindow._iscroll.bottomReset =false;
                        this.options.isRelease = false;
                    }
                }
                
                
                //顶部下拉弹动处理
                if(this.options.isRelease === false && uexWindow._iscroll.topBounceShow && !uexWindow._iscroll.topHidden){
                    
                    //超越边界
                    if (this.y > pullDownHeight && !pullDownTips[0].className.match('flip')) {
                        this.options.isBack = false;
                        enableCallback = true;
                        pullDownTips[0].className = 'pullDownTips flip';
                        pullDownLabel.html(uexWindow._iscroll.topParams.releaseToReloadText);
                        pullDownIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(0deg) translateZ(0)';

                        if(uexWindow._iscroll.topNotifyState){
                            uexWindow.onBounceStateChange(0,1);
                        }
                    } else if (this.y < pullDownHeight && pullDownTips[0].className.match('flip')) {
                        pullDownTips[0].className = 'pullDownTips';
                        pullDownIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(-180deg) translateZ(0)';
                        pullDownLabel.html(uexWindow._iscroll.topParams.pullToReloadText);
                        this.minScrollY = -pullDownTips[0].offsetHeight;
                    }
                }

                //底部上拉弹动
                if(this.options.isRelease === false && uexWindow._iscroll.bottomBounceShow && !uexWindow._iscroll.bottomHidden && window._isFullScreen){
                    
                    var tipsHeight = Zepto(".pullUpTips")[0].offsetHeight;
                    
                    if(this.y < (this.maxScrollY - tipsHeight) && !pullUpTips[0].className.match('flip')) {
                        
                        this.options.isBack = false;
                        enableCallback = true;
                        pullUpTips[0].className = 'pullUpTips flip';
                        pullUpLabel.html(uexWindow._iscroll.bottomParams.releaseToReloadText);
                        pullUpIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(-180deg) translateZ(0)';
                        if(uexWindow._iscroll.bottomNotifyState){
                            uexWindow.onBounceStateChange(1,1);
                        } 
                    }else if(this.y >= (this.maxScrollY - tipsHeight) && pullUpTips[0].className.match('flip')){
                       
                        pullUpTips[0].className = 'pullUpTips';
                        pullUpLabel.html(uexWindow._iscroll.bottomParams.pullToReloadText);
                        pullUpIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._iscroll.bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(0deg) translateZ(0)';

                    }
                }
                
            });
            
            //下拉/上拉松手释放监控事件
            uexWindow._iscroll.contentScroll.on('release',function(){
                
                //标记是否已经释放
                this.options.isRelease = true;
                
                //禁止释放弹动
                if(this.options.bounce == false){
                    return ; 
                }
                
                //顶部释放刷新
                if(this.y>0 && uexWindow._iscroll.topBounceShow&& !uexWindow._iscroll.topHidden ){
                    pullDownTips[0].className = 'pullDownTips loading';

                    pullDownIcon.css({
                        'display':'inline-block',
                        'width':'52px',
                        'height':'52px',
                        'background':'url('+uexWindow._iscroll.bottomParams.loadingImagePath+') 0 0 no-repeat',
                        '-webkit-background-size': '52px 52px', 
                        'background-size': '52px 52px', 
                        '-webkit-transition-property': '-webkit-transform',
                        '-webkit-transition-duration': '5s', 
                        '-webkit-transform': 'rotate(360deg) translateZ(0)'
                    });
                    pullDownLabel.html(uexWindow._iscroll.topParams.loadingText);                                
                    
                    // 执行onBounceStateChange回调函数                              
                    if(uexWindow._iscroll.topNotifyState && enableCallback){                    
                        uexWindow.onBounceStateChange(0,2);                
                    }else{
                        uexWindow.resetBounceView(0);
                    }
                }
                
                //底部释放刷新
                if(this.y < this.maxScrollY && uexWindow._iscroll.bottomBounceShow && !uexWindow._iscroll.bottomHidden ){
                    pullUpTips[0].className = 'pullUpTips loading';
                    pullUpIcon.css({
                        'display':'inline-block',
                        'width':'52px',
                        'height':'52px',
                        'background':'url('+uexWindow._iscroll.bottomParams.loadingImagePath+') 0 0 no-repeat',
                        '-webkit-background-size': '52px 52px', 
                        'background-size': '52px 52px', 
                        '-webkit-transition-property': '-webkit-transform',
                        '-webkit-transition-duration': '5s', 
                        '-webkit-transform': 'rotate(360deg) translateZ(0)'
                    });
                    
                    pullUpLabel.html(uexWindow._iscroll.bottomParams.loadingText);   
                    
                    // 执行onBounceStateChange回调函数      
                    if(uexWindow._iscroll.bottomNotifyState && enableCallback){
                        uexWindow.onBounceStateChange(1,2);
                    }else{
                        uexWindow.resetBounceView(1);
                    }
                }
            });
            
        },60);
        
    }
    
     /**
     * openPopover加载页面设置IScroll
     * @param string popName popover页面name
     * @param bool enableBounce 是否允许弹动
     */
    function popoverBounceSetting(popName,enableBounce,popBgcolor){
        window = top.window || window;
        document = top.document || document;
        Zepto = top.Zepto || Zepto;
        if(uexWindow._popoverList[popName] && uexWindow._popoverList[popName].contentScroll){
            uexWindow._popoverList[popName].contentScroll.destroy();
            uexWindow._popoverList[popName].contentScroll = null;
        }
        
        //头部popover内不加弹动
        if(popName =='pop_header'){
            uexWindow._lock = false;
            if(Zepto("#" + popName +" iframe")[0].style.opacity == '0'){
                Zepto("#" + popName +" iframe")[0].style.opacity = '1'; 
            }
            
            if(uexWindow._popoverQueue.length >0){
                var nextPopName = uexWindow._popoverQueue.shift();
                loadIframe(nextPopName);
            }
            return;
        }
        
        //添加iscroll
        setTimeout(function(){
            var contentWindow = Zepto("#" + popName +" iframe")[0].contentWindow;
            uexWindow._popoverList[popName] = uexWindow._popoverList[popName] || {};
            uexWindow._popoverList[popName].contentWindow = contentWindow;
            
            //如果IScroll函数未加载完成
            if(!contentWindow.IScroll){
                if(Zepto("#" + popName +" iframe")[0].style.opacity == '0'){
                    Zepto("#" + popName +" iframe")[0].style.opacity = '1'; 
                }
                uexWindow._lock = false;
                return ; 
            }
            
            //设置iframe内部iscroll的wrap,wrap外层添加Container
            var scrollContainer = contentWindow.Zepto('.scroll-container').length == 1 ? Zepto('.scroll-container') : Zepto('<div class="scroll-container" style="min-height:100%;postion:relative;overflow:hidden; left:0;"></div>');
            var scrollWrapper = contentWindow.Zepto('.scroll-wrapper').length == 1 ? Zepto('.scroll-wrapper') :Zepto('<div class="scroll-wrapper" style="background-color:'+popBgcolor+';position:relative; height:100%;width:100%;overflow:hidden;"></div>');
            var originHtmlContainer = contentWindow.Zepto('.origin-html').length == 1 ? Zepto('.origin-html') :Zepto('<div class="origin-html" style="position:relative;width:100%;"></div>');
            
            if(!(scrollContainer.length && scrollContainer.selector && scrollWrapper.length && scrollWrapper.selector)){

                Zepto("#" + popName +" iframe")[0].contentWindow.Zepto("body").children().appendTo(originHtmlContainer);
                
                originHtmlContainer.appendTo(scrollContainer);
                scrollContainer.appendTo(scrollWrapper);
                scrollWrapper.appendTo(Zepto("#" + popName +" iframe")[0].contentWindow.Zepto("body"));
                
                if(Zepto("#" + popName +" iframe")[0].style.opacity == '0'){
                    Zepto("#" + popName +" iframe")[0].style.opacity = '1'; 
                }

                if(originHtmlContainer.height() < scrollWrapper.height()){
                     //iframe中content内容未超过一屏，设置高度为外层content高度
                     originHtmlContainer.css("height",contentWindow.Zepto('body')[0].scrollHeight);
                }
                //添加底部弹动内容区域
                scrollContainer.append('<div class="pullUpTips" style="height:52px;"><span class="pullUpIcon" style="display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px; "></span><span class="pullUpLabel" style="display:inline-block; line-height:52px; height:52px;"></span></div>');    
                //添加顶部弹动内容区域
                contentWindow.Zepto('<div class="pullDownTips" style="height:52px; "><span class="pullDownIcon" style="display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px; "></span><span class="pullDownLabel" style="display:inline-block; line-height:52px; height:52px;"></span></div>').insertBefore(contentWindow.Zepto('.scroll-container').children()[0]);
            
            }
            
            //设置弹动区域显示时默认配置
            var bounceImagePath = jsBasePath + 'js/resource/blueArrow.png';
            var loadingImagePath = jsBasePath + 'js/resource/icon-refresh-act.png';
            
            var defaultParams ={
                'imagePath': bounceImagePath,
                'textColor': '#f0ecf3',
                'levelText': '',
                'pullToReloadText': '拖动刷新',
                'releaseToReloadText': '释放刷新',
                'loadingText': '加载中，请稍等',
                'loadingImagePath': loadingImagePath
            };
            !uexWindow._popoverList[popName].topParams && (uexWindow._popoverList[popName].topParams = defaultParams);
            !uexWindow._popoverList[popName].bottomParams && (uexWindow._popoverList[popName].bottomParams = defaultParams);
            
            //showBounceView中参数flag设置是否显示弹动区域内容1:显示，0：不显示
            if(uexWindow._popoverList[popName].topBounceShow){
                contentWindow.Zepto(".pullDownIcon")[0].style.cssText ='display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(-180deg) translateZ(0);';
                contentWindow.Zepto(".pullDownLabel").html(uexWindow._popoverList[popName].topParams.pullToReloadText);
            }
            if(uexWindow._popoverList[popName].topBounceColor){
                contentWindow.Zepto(".pullDownTips").css({"background-color":uexWindow._popoverList[popName].topBounceColor});
            }
            if(uexWindow._popoverList[popName].bottomBounceShow){
                contentWindow.Zepto(".pullUpIcon")[0].style.cssText ='display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(0deg) translateZ(0);';
                contentWindow.Zepto(".pullUpLabel").html(uexWindow._popoverList[popName].bottomParams.pullToReloadText);
            }
            if(uexWindow._popoverList[popName].bottomBounceColor){
                contentWindow.Zepto(".pullUpTips").css({"background-color":uexWindow._popoverList[popName].bottomBounceColor});
            }
            
            var pullDownTips = contentWindow.Zepto(".pullDownTips");
            var pullDownHeight = pullDownTips[0] ? pullDownTips[0].offsetHeight:0;
            var pullDownIcon = contentWindow.Zepto(".pullDownIcon");
            var pullDownLabel = contentWindow.Zepto(".pullDownLabel");
            
            var pullUpTips = contentWindow.Zepto(".pullUpTips");
            var pullUpHeight = pullUpTips[0]?pullUpTips[0].offsetHeight:0;
            var pullUpIcon = contentWindow.Zepto(".pullUpIcon");
            var pullUpLabel = contentWindow.Zepto(".pullUpLabel");

            var enableCallback = false;
            
            //实例化IScroll
            uexWindow._popoverList[popName].contentScroll = new contentWindow.IScroll(scrollWrapper[0],{
                probeType:3,
                useTransition: true,
                topOffset: pullDownHeight,
                bottomOffset:pullDownHeight,
                bounce:enableBounce,
                preventDefault:true,
                preventDefaultException:{tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/,className:/(^|\s)btn|not-btn(\s|$)/}
            });
            
            //scrollStart事件：开始滑动
            uexWindow._popoverList[popName].contentScroll.on('scrollStart',function(){
                
                enableCallback = false;
                
                //禁止弹动
                if(this.options.bounce == false){
                    this.refresh();
                    if(this.scrollerHeight>this.wrapperHeight && !contentWindow.Zepto('.pullUpTips').length){
                        scrollContainer.append('<div class="pullUpTips" style="height:52px;"><span class="pullUpIcon" style="display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px; "></span><span class="pullUpLabel" style="display:inline-block; line-height:52px; height:52px;"></span></div>');
                        if(uexWindow._popoverList[popName].bottomBounceShow){
                            contentWindow.Zepto(".pullUpIcon")[0].style.cssText ='display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(0deg) translateZ(0);';
                            contentWindow.Zepto(".pullUpLabel").html(uexWindow._popoverList[popName].bottomParams.pullToReloadText);
                        }
                        if(uexWindow._popoverList[popName].bottomBounceColor){
                            contentWindow.Zepto(".pullUpTips").css({"background-color":uexWindow._popoverList[popName].bottomBounceColor});
                        }
                    }
                    return;
                } 
                
                if(this.options.isRelease === false && this.directionY == -1 && this.y <=0){
                    //顶部下拉弹动
                    if(uexWindow._popoverList[popName].topNotifyState){
                        contentWindow.uexWindow.onBounceStateChange(0,0);
                    }
                    if(uexWindow._popoverList[popName].topBounceShow && !uexWindow._popoverList[popName].topHidden){
                        pullDownIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(-180deg) translateZ(0)';
                        pullDownLabel.html(uexWindow._popoverList[popName].topParams.pullToReloadText);
                    }
                    else if(uexWindow._popoverList[popName].topBounceColor){
                        contentWindow.Zepto(".pullDownTips").css({"background-color":uexWindow._popoverList[popName].topBounceColor});
                    }
                }else if(this.options.isRelease === false && this.directionY == 1 && this.y<=this.maxScrollY){
                    
                    //底部上拉弹动
                    if(uexWindow._popoverList[popName].bottomNotifyState){
                        contentWindow.uexWindow.onBounceStateChange(1,0);
                    }
                    if(uexWindow._popoverList[popName].bottomBounceShow && !uexWindow._popoverList[popName].bottomHidden){
                        pullUpIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(0deg) translateZ(0)';
                        pullUpLabel.html(uexWindow._popoverList[popName].bottomParams.pullToReloadText);
                    }else if(uexWindow._popoverList[popName].bottomBounceColor){
                        contentWindow.Zepto(".pullUpTips").css({"background-color":uexWindow._popoverList[popName].bottomBounceColor});
                    }
                }
                if(this.options.isRelease === false){
                    this.refresh();
                    if(this.scrollerHeight>this.wrapperHeight && !contentWindow.Zepto('.pullUpTips').length){
                        scrollContainer.append('<div class="pullUpTips" style="height:52px;"><span class="pullUpIcon" style="display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px; "></span><span class="pullUpLabel" style="display:inline-block; line-height:52px; height:52px;"></span></div>');
                        if(uexWindow._popoverList[popName].bottomBounceShow){
                            contentWindow.Zepto(".pullUpIcon")[0].style.cssText ='display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 0ms; -webkit-transform: rotate(0deg) translateZ(0);';
                            contentWindow.Zepto(".pullUpLabel").html(uexWindow._popoverList[popName].bottomParams.pullToReloadText);
                        }
                        if(uexWindow._popoverList[popName].bottomBounceColor){
                            contentWindow.Zepto(".pullUpTips").css({"background-color":uexWindow._popoverList[popName].bottomBounceColor});
                        }
                    }
                    
                }
            });

            //scroll事件：滑动中
            uexWindow._popoverList[popName].contentScroll.on('scroll',function(evt){
                
                //禁止弹动
                if(this.options.bounce == false){
                    return ; 
                } 
                
                //禁止顶部弹动
                if(uexWindow._popoverList[popName].enableBounce == 0 && this.y >= 0){
                    this.scrollTo(0, 0); 
                    return ;
                }

                //禁止顶部弹动
                if(uexWindow._popoverList[popName].topHidden && this.y >= 0){
                    this.scrollTo(0, 0); 
                    return ;
                }

                //禁止底部弹动
                if(uexWindow._popoverList[popName].bottomHidden && this.y <= this.maxScrollY){
                    this.scrollTo(0,this.maxScrollY);
                    return ;
                }

                ////禁止顶部弹动
                // if(uexWindow._popoverList[popName].topBounceShow == 0 && this.y >= 0){
                    // this.scrollTo(0, 0); 
                    // return ;
                // }

                ////禁止底部弹动
                // if(uexWindow._popoverList[popName].bottomBounceShow == 0  && this.y <= this.maxScrollY){
                    // this.scrollTo(0, OrigMaxScrollY);
                    // return ;
                // }
 
                
                //顶部resetBounceView执行
                if(uexWindow._popoverList[popName].topReset === true && this.options.isRelease === true &&  this.y <= this.options.topOffset){

                    uexWindow._popoverList[popName].contentScroll.options.isBack = true;
                    //未恢复到0,此处取1
                    if(this.y <=1){
                        uexWindow._popoverList[popName].topReset =false;
                        this.options.isRelease = false;
                    }
                }
                
                //底部resetBounceView执行
                if(uexWindow._popoverList[popName].bottomReset === true && this.options.isRelease === true &&  this.y >= this.maxScrollY - this.options.bottomOffset){

                    uexWindow._popoverList[popName].contentScroll.options.isBack = true;
                    
                    if(this.y >= this.maxScrollY-this.options.bottomOffset){
                        uexWindow._popoverList[popName].bottomReset =false;
                        this.options.isRelease = false;
                    }
                }
                
                //顶部下拉弹动
                if(uexWindow._popoverList[popName].topBounceShow && !uexWindow._popoverList[popName].topHidden){
                    if (this.options.isRelease === false && this.y > pullDownHeight && !pullDownTips[0].className.match('flip')) {
                        this.options.isBack = false;
                        enableCallback = true;
                        pullDownTips[0].className = 'pullDownTips flip';
                        pullDownLabel.html(uexWindow._popoverList[popName].topParams.releaseToReloadText);
                        pullDownIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(0deg) translateZ(0)';
                        
                        this.minScrollY = 0;
                        if(uexWindow._popoverList[popName].topNotifyState){
                            contentWindow.uexWindow.onBounceStateChange(0,1);
                        }
                    } else if (this.options.isRelease === false && this.y < pullDownHeight && pullDownTips[0].className.match('flip')) {
                        
                        pullDownTips[0].className = 'pullDownTips';

                        pullDownIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].topParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(-180deg) translateZ(0)';
                        pullDownLabel.html(uexWindow._popoverList[popName].topParams.pullToReloadText);
                        
                        this.minScrollY = -pullDownTips[0].offsetHeight;
                    } 
                }

                //底部上拉弹动
                if(uexWindow._popoverList[popName].bottomBounceShow && !uexWindow._popoverList[popName].bottomHidden){
                    var tipsHeight = contentWindow.Zepto(".pullUpTips")[0].offsetHeight;

                    if(this.options.isRelease === false && this.y < (this.maxScrollY - tipsHeight) && !pullUpTips[0].className.match('flip')) {
                        this.options.isBack = false;
                        enableCallback = true;
                        pullUpTips[0].className = 'pullUpTips flip';
                        pullUpLabel.html(uexWindow._popoverList[popName].bottomParams.releaseToReloadText);
                        pullUpIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(-180deg) translateZ(0)';
                        if(uexWindow._popoverList[popName].bottomNotifyState){
                            contentWindow.uexWindow.onBounceStateChange(1,1);
                        }
                    }else if(this.options.isRelease === false && this.y >= (this.maxScrollY - tipsHeight) && pullUpTips[0].className.match('flip')){
                        
                        pullUpTips[0].className = 'pullUpTips';
                        pullUpLabel.html(uexWindow._popoverList[popName].bottomParams.pullToReloadText);
                        pullUpIcon[0].style.cssText = 'display:inline-block;*display:inline;margin:auto;float:left; width: 24px;  height: 52px;  background: url('+uexWindow._popoverList[popName].bottomParams.imagePath+') 0 0 no-repeat;  -webkit-background-size: 24px 52px;  background-size: 24px 52px;  -webkit-transition-property: -webkit-transform;  -webkit-transition-duration: 250ms; -webkit-transform: rotate(0deg) translateZ(0)';

                         
                    }else{
                        
                    }
                }else{
                    
                }
                
            });
            
            //下拉/上拉松手释放监控事件
            uexWindow._popoverList[popName].contentScroll.on('release',function(){
                
                //标记是否已经释放
                this.options.isRelease = true;
                
                //禁止释放弹动
                if(this.options.bounce == false){
                    return ; 
                }
                
                //顶部释放刷新
                if(this.y>0 && uexWindow._popoverList[popName].topBounceShow&& !uexWindow._popoverList[popName].topHidden ){
                    
                    pullDownTips[0].className = 'pullDownTips loading';
                    pullDownIcon.css({
                        'display':'inline-block',
                        'width':'52px',
                        'height':'52px',
                        'background':'url('+uexWindow._popoverList[popName].bottomParams.loadingImagePath+') 0 0 no-repeat',
                        '-webkit-background-size': '52px 52px', 
                        'background-size': '52px 52px', 
                        '-webkit-transition-property': '-webkit-transform',
                        '-webkit-transition-duration': '5s', 
                        '-webkit-transform': 'rotate(360deg) translateZ(0)'
                    });
                    pullDownLabel.html(uexWindow._popoverList[popName].topParams.loadingText);                                
                    
                    // 执行onBounceStateChange回调函数                              
                    if(uexWindow._popoverList[popName].topNotifyState && enableCallback){                    
                        contentWindow.uexWindow.onBounceStateChange(0,2);                
                    }else{
                        contentWindow.uexWindow.resetBounceView(0);       
                    }
                }
                
                //底部释放刷新
                if(this.y < this.maxScrollY && uexWindow._popoverList[popName].bottomBounceShow && !uexWindow._popoverList[popName].bottomHidden ){
                    pullUpTips[0].className = 'pullUpTips loading';
                    pullUpIcon.css({
                        'display':'inline-block',
                        'width':'52px',
                        'height':'52px',
                        'background':'url('+uexWindow._popoverList[popName].bottomParams.loadingImagePath+') 0 0 no-repeat',
                        '-webkit-background-size': '52px 52px', 
                        'background-size': '52px 52px', 
                        '-webkit-transition-property': '-webkit-transform',
                        '-webkit-transition-duration': '5s', 
                        '-webkit-transform': 'rotate(360deg) translateZ(0)'
                    });
                    
                    pullUpLabel.html(uexWindow._popoverList[popName].bottomParams.loadingText);   
                    
                    // 执行onBounceStateChange回调函数      
                    if(uexWindow._popoverList[popName].bottomNotifyState && enableCallback){
                        contentWindow.uexWindow.onBounceStateChange(1,2);
                    }else{
                        contentWindow.uexWindow.resetBounceView(1);       
                    }
                }
            });
            
            //结束一个popover的iframe加载后，执行下一个popover的iframe加载
            uexWindow._lock = false;
            if(uexWindow._popoverQueue.length >0){
                var nextPopName = uexWindow._popoverQueue.shift();
                loadIframe(nextPopName);
            }
            
        },6);
        
    }
    
    function loadIframe(popArgs){
        window = top.window || window;
        document = top.document || document;
        Zepto = top.Zepto || Zepto;
        //openPopover结束前禁止再次openPopover
        if(uexWindow._lock){
            if( uexWindow._popoverQueue.length ==0 || (uexWindow._popoverQueue.length >0 && uexWindow._popoverQueue[uexWindow._popoverQueue.length-1] != popArgs)){
                uexWindow._popoverQueue.push(popArgs);
            }
            return false;
        }
        uexWindow._lock = true;
        
        var popName = popArgs.popName;
        uexWindow._popoverList[popName] = {'popName':popName};
        uexWindow._iscroll.popName = popName;//标识是否是popover的bounce
        var popContainer = Zepto("#" + popName);
        var iframecnt = Zepto("#cnt_" + popName);
        var popNameData =  popArgs;
        
        var popBackgroundColor = popArgs.bgColor||"#ffffff";

        var popIframe = document.createElement('iframe');
            popIframe.id ='iframe_'+popName;
            popIframe.src = popArgs.inData;
            popIframe.setAttribute('class', 'up ub ub-ver uabs ub-con');
            popIframe.style.height="100%";
            popIframe.style.width="100%";
        if(popArgs.bgColor =='#ffffff'){
            popIframe.style.opacity="0";
        }
        if (popIframe.attachEvent){ 
            popIframe.attachEvent("onload", function(){
                var enableBounce = uexWindow._popoverList[popName].enableBounce ? true:false;
                popoverBounceSetting(popName,enableBounce,popBackgroundColor);
               
                if(popArgs.inWindName && Zepto('#'+popArgs.inWindName).length>0){
                    var contentWidth = Zepto('#'+popArgs.inWindName).width();
                    var contentHeight = Zepto('#'+popArgs.inWindName).height();
                    window.top.uexWindow.setPopoverFrame(popArgs.inWindName,popArgs.x,popArgs.y,contentWidth,contentHeight);
                }
               
                var pageHistory = null; 
                var curWind = null;
               
               //
                popNameData.h = window.top.getComputedStyle(popContainer[0],null).height;
                popNameData.w = window.top.getComputedStyle(popContainer[0],null).width;
                popNameData.y = window.top.getComputedStyle(popContainer[0],null).top;
                popNameData.x = window.top.getComputedStyle(popContainer[0],null).left;
               
                pageHistory = sessionStorage.getItem('pageHistory');
                if(pageHistory){
                    pageHistory = JSON.parse(pageHistory);
                    curWind = pageHistory.curWind;
                    if(!pageHistory['win_'+curWind]){
                        pageHistory['win_'+curWind] ={};
                    }
                    if(!pageHistory['win_'+curWind].lastPop){
                        pageHistory['win_'+curWind].firstPop = popName;
                        pageHistory['win_'+curWind].prevPop = popName;
                    }else{
                        pageHistory['win_'+curWind].prevPop = pageHistory['win_'+curWind].lastPop;
                    }
                    pageHistory['win_'+curWind].lastPop = popName;
                    pageHistory['win_'+curWind][popName] = popNameData;
                }else{
                    pageHistory = {
                        'firstWind':'default',
                        'prevWind':'default',
                        'curWind':'default',
                        'windList':['default'], //递增序列
                        'win_default':{
                            'firstPop':popName,
                            'prevPop':popName,
                            'lastPop':popName
                        }
                    };
                    pageHistory['win_default'][popName] = popNameData;
                }
                sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
                //
                window.top.isBack = false;
                
            }); 
        } else {
            popIframe.onload = function(){
               var enableBounce = uexWindow._popoverList[popName].enableBounce ? true:false;
               popoverBounceSetting(popName,enableBounce,popBackgroundColor);
               
               if(popArgs.inWindName && Zepto('#'+popArgs.inWindName).length>0){
                   var contentWidth = Zepto('#'+popArgs.inWindName).width();
                   var contentHeight = Zepto('#'+popArgs.inWindName).height();
                   window.top.uexWindow.setPopoverFrame(popArgs.inWindName,popArgs.x,popArgs.y,contentWidth,contentHeight);
               }
               
               var pageHistory = null; 
               var curWind = null;
               
               //
               popNameData.h = window.top.getComputedStyle(popContainer[0],null).height;
               popNameData.w = window.top.getComputedStyle(popContainer[0],null).width;
               popNameData.y = window.top.getComputedStyle(popContainer[0],null).top;
               popNameData.x = window.top.getComputedStyle(popContainer[0],null).left;
               
               pageHistory = sessionStorage.getItem('pageHistory');
               if(pageHistory){
                   pageHistory = JSON.parse(pageHistory);
                   curWind = pageHistory.curWind;
                   if(!pageHistory['win_'+curWind]){
                       pageHistory['win_'+curWind] ={};
                   }
                   if(!pageHistory['win_'+curWind].lastPop){
                       pageHistory['win_'+curWind].firstPop = popName;
                       pageHistory['win_'+curWind].prevPop = popName;
                   }else{
                       pageHistory['win_'+curWind].prevPop = pageHistory['win_'+curWind].lastPop;
                   }
                   pageHistory['win_'+curWind].lastPop = popName;
                   pageHistory['win_'+curWind][popName] = popNameData;
               }else{
                   pageHistory = {
                       'firstWind':'default',
                       'prevWind':'default',
                       'curWind':'default',
                       'windList':['default'], //递增序列
                       'win_default':{
                           'firstPop':popName,
                           'prevPop':popName,
                           'lastPop':popName
                       }
                   };
                   pageHistory['win_default'][popName] = popNameData;
               }
               sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
               //
               window.top.isBack = false;
           }; 
       }
        iframecnt.append(popIframe);
    }

    /*
     * uexWindow 定义
     */
    window.uexWindow = {
        _lock : false,
        _popoverQueue:[],
        _popoverList:{},
        _iscroll:{},
        _isFunction: function(value) { return type(value) == "function"; },
        _isWindow: function(obj) { return obj != null && obj == obj.window ;},
        _isDocument: function(obj) { return obj != null && obj.nodeType == obj.DOCUMENT_NODE ;},
        _isObject: function(obj) { return typeof(obj) == "object" ;},
        _isPlainObject: function(obj) {
            return this._isObject(obj) && !this._isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype ;
        },
        _emptyFun:function(){},
        setPopTabIndex:function(popName,tabIndex){
            var pageHistory = sessionStorage.getItem('pageHistory');
            var curWindName = null;
            if(pageHistory){
                 pageHistory = JSON.parse(pageHistory);
                 curWindName = pageHistory.curWind;
                 pageHistory[curWindName + "_pop_" + popName +"_tabIndex"] = tabIndex;
                 sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
            }
            
        },
        open: function(inWindName, inDataType, inData, inAniID, inWidth, inHeight, inFlag, inAnimDuration, extraInfo) {
            var curArgs = null;
            var openArgs = {};
            if(arguments.length === 1 && uexWindow._isPlainObject(inWindName)){
                curArgs = inWindName;
                inWindName = curArgs['inWindName'];
                inDataType = curArgs['inDataType'];
                inData = curArgs['inData'];
                inAniID = curArgs['inAniID'];
                inWidth = curArgs['inWidth'];
                inHeight = curArgs['inHeight'];
                inFlag = curArgs['inFlag'];
                inAnimDuration = curArgs['inAnimDuration'];
                extraInfo = curArgs['extraInfo'];
                if(!curArgs['isBack']){
                    window.top.isBack = false;
                }
            }else{
                window.top.isBack = false;
            }
            
            var pageHistory = sessionStorage.getItem('pageHistory');
            var prevWind = null;
            var curWind = null;
            
            if(!window.top.isBack){
                openArgs.inWindName = inWindName;
                openArgs.inDataType = inDataType;
                openArgs.inData = inData;
                openArgs.inAniID = inAniID;
                openArgs.inWidth = inWidth;
                openArgs.inHeight = inHeight;
                
                openArgs.inFlag = inFlag;
                openArgs.inAnimDuration = inAnimDuration;
                openArgs.extraInfo = extraInfo;

                //记录跳转历史
                
                if(pageHistory){
                    pageHistory = JSON.parse(pageHistory);
                    prevWind = pageHistory.curWind;
                    curWind = inWindName ? inWindName:'wind_'+currPages;
                    
                    pageHistory.prevWind = prevWind;
                    pageHistory.curWind = curWind;
                    pageHistory['win_'+curWind] ={
                        'openArgs':openArgs
                    };
                    //
                    var openWindName = openArgs.inWindName;
                    var windList = pageHistory.windList;
                    var windListLength = windList.length;
                    var openWindIndex = pageHistory.windList.indexOf(openWindName);
                    if(openWindIndex >=0){
                        for(var i = windListLength;i>openWindIndex;i--){
                            var idx = i;
                            delete pageHistory['win_' + windList[idx]];
                            pageHistory.windList.pop();
                        }
                    }
                    
                    //
                    if(pageHistory.windList.indexOf(curWind) < 0){
                        pageHistory.windList.push(curWind);
                    }
                    
                }else{
                    pageHistory = {
                        'firstWind':'default',
                        'prevWind':'default',
                        'curWind':'default',
                        'windList':['default'], //递增序列
                        'win_default':{
                            'openArgs':openArgs
                        }
                    };
                }
                sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
                
                window.top.location.href = inData;
            }else{
                
                //close返回调用打开历史记录页面
                var urlIndex = null;
                var baseUrl = "";
                
                if(curArgs.prevInData && inData.indexOf('/')<0){
                    urlIndex = window.location.href.lastIndexOf(curArgs.prevInData);
                }else if(curArgs.prevInData && inData.indexOf('/')>0){
                    var prevIndataIndex = window.location.href.lastIndexOf(curArgs.prevInData);
                    urlIndex = window.location.href.substr(0,prevIndataIndex-1).lastIndexOf('/')+1;
                }
                baseUrl = urlIndex>0?window.location.href.substr(0,urlIndex):window.location.origin+"/";
                if(inData.split('.').length == 2){
                    if(inData.indexOf('/')!=0){
                        window.top.location.href =  baseUrl + inData + '#isBack';
                    }else{
                        window.top.location.href =  inData.substr(1) + '#isBack';
                    }
                }else{
                    window.top.location.href = inData + '#isBack';
                }
            }

        },
        cbOpen: function(d) {
            
        },
        setWindowFrame: function(inX, inY, inAnimDuration) {},
        close: function() {

            var pageHistory = sessionStorage.getItem('pageHistory');
            var prevWind = null;
            var curWind = null;
            var openArgs = null;
            
            
            if(pageHistory){
                pageHistory = JSON.parse(pageHistory);
                curWind = pageHistory.curWind;
                prevWind = pageHistory.prevWind;
                pageHistory.curWind = prevWind;

                if(curWind == 'default' || prevWind == 'default' || !prevWind){
                    pageHistory.prevWind = 'default';
                }else{
                    pageHistory.prevWind = pageHistory.windList[pageHistory.windList.indexOf(prevWind)-1]||"default";
                }
                openArgs = pageHistory['win_'+prevWind].openArgs||{'inWindName':'default','inData':'index.html'};
                prevOpenArgs = pageHistory['win_'+curWind].openArgs;
                
                if(prevOpenArgs){
                    openArgs.prevInData = prevOpenArgs.inData ||"";
                }
                openArgs.isBack = true;
                window.top.isBack = true;
                
                //var openWindName = openArgs.inWindName;
                //var windList = pageHistory.windList;
                //var openWindIndex = pageHistory.windList.indexOf(openWindName);
                //delete pageHistory['win_' + windList[openWindIndex]];
                pageHistory.windList.pop();

                sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
                window.top.uexWindow.open(openArgs);
            }else{
                window.top.history.back(-1);
                event.stopPropagation();
            }
        },
        cbClose: function() {

        },
        closeByName: function(n, a) {

        },
        openPopover: function(inWindName, inDataType, inData, data, x, y, w, h, fontSize, type, bottomMargin, extraInfo) {
            Zepto = top.Zepto||Zepto;
            var curArgs = null;
            if(arguments.length === 1 && uexWindow._isPlainObject(inWindName)){
                curArgs = inWindName;
                inWindName = curArgs['inWindName'];
                inDataType = curArgs['inDataType'];
                inData = curArgs['inData'];
                data = curArgs['data'];
                x = curArgs['x'];
                y = curArgs['y'];
                w = curArgs['w'];
                h = curArgs['h'];
                fontSize = curArgs['fontSize'];
                type = curArgs['type'];
                bottomMargin = curArgs['bottomMargin'];
                extraInfo = curArgs['extraInfo'];
            }else{
                curArgs ={
                    'inWindName': inWindName,
                    'inDataType': inDataType,
                    'inData': inData,
                    'data': data,
                    'x': x,
                    'y': y,
                    'w': w,
                    'h': h,
                    'fontSize': fontSize,
                    'type': type,
                    'bottomMargin': bottomMargin,
                    'extraInfo': extraInfo
                };
            }
            
            if (inWindName == "") inWindName = "index";
            var popName = 'pop_' + inWindName;
            var popContainer = Zepto("#" + popName);
            var content = Zepto("#content");
            if (popContainer.length > 0) {
                popContainer.remove();
            }
            var bgColor ="#ffffff";
            if(bottomMargin >=0 && extraInfo){
                extraInfoObj = JSON.parse(extraInfo) || {};
                if(extraInfoObj.extraInfo.opaque){
                    bgColor = "rgba(0,0,0,0)";
                }else if(!extraInfoObj.extraInfo.opaque && extraInfoObj.extraInfo.bgColor){
                    bgColor = extraInfoObj.extraInfo.bgColor;
                }
            }
            popContainer = Zepto('<div id="pop_' + inWindName + '" class="batou_zhy" style="overflow:hidden;"></div>');
            var iframecnt = Zepto('<div id="cnt_pop_' + inWindName + '" class="up ub ub-ver uabs ub-con" style="height:100%;overflow:hidden;"></div>');   
            Zepto(popContainer[0]).html("");
            Zepto(popContainer[0]).append(iframecnt);

            var eleZIndex = currZIndex++;
            x = x || 0;
            y = y || 0;
            w = (w || '100%') == '100%' ? '100%' : px2em(w) + 'em';
            h = (h || '100%') == '100%' ? '100%' : px2em(h) + 'em';

            Zepto(popContainer[0]).css({
                top: px2em(y) + 'em',
                left: px2em(x) + 'em',
                width: w,
                height: h,
                position: 'absolute',
                background: bgColor,
                zIndex: eleZIndex
            });
            Zepto("body").append(popContainer[0]);
            var popArgs ={
                'popName':popName,
                'inWindName':inWindName,
                'inDataType':inDataType,
                'inData':inData,
                'data':data,
                'fontSize':fontSize,
                'type':type,
                'bottomMargin':bottomMargin,
                'extraInfo':extraInfo,
                'x':x,
                'y':y,
                'w':w,
                'h':h,
                'bgColor':bgColor
            };
            loadIframe(popArgs);
        },
        closePopover: function(inPopName) {
            window = top.window || window;
            Zepto = top.Zepto || Zepto;
            var popElement = Zepto("#pop_" + inPopName);
            if (popElement.length > 0) {
                if(popElement[0].remove && typeof(popElement[0].remove) == 'function'){
                    popElement[0].remove();
                }else{
                    Zepto(popElement[0]).remove();
                }
                
            }
            //TODO:clear popover sessionStorage info
            var pageHistory = sessionStorage.getItem('pageHistory');
            var curWind = null;
            var prevPop = null;
            if(pageHistory){
                pageHistory = JSON.parse(pageHistory);
                curWind = pageHistory.curWind;
                if(pageHistory['win_'+curWind] && pageHistory['win_'+curWind].lastPop == 'pop_'+inPopName){
                    prevPop = pageHistory['win_'+curWind].prevPop||pageHistory['win_'+curWind].firstPop;
                    pageHistory['win_'+curWind].lastPop = prevPop;
                    sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
                }
            }
            
        },
        openMultiPopover: function(inContent, inPopName, inDataType, inX, inY, inWidth, inHeight, inFontSize, inFlag, inIndexSelected) {},
        closeMultiPopover: function(inPopName) {},
        setSelectedPopOverInMultiWindow: function(inPopName, indexPage) {},
        setPopoverFrame: function(inPopName, inX, inY, inWidth, inHeight) {
            var popEle = window.top.Zepto("#pop_" + inPopName);
            if (popEle.length > 0) {
                //var zIndex = currZIndex++;
                popEle.css({
                    //'z-index':zIndex,
                    'left':inX+'px'||0,
                    'top':inY+'px'||0,
                    'width':inWidth+'px'||0,
                    'height':inHeight+'px'||0
                });
                //window.top.uexWindow._iscroll.popName = "pop_" + inPopName;
            }
        },
        setBounce: function(v) {
            window.top.uexWindow._popoverList = window.top.uexWindow._popoverList || {};
            var outUexWin = window.top.uexWindow._popoverList;
            var curUexWin = window.uexWindow;
            
            //页面是否通过popover弹出加载的iframe
            if(!window.top.uexWindow._iscroll){window.top.uexWindow._iscroll={};}
            if(window.top.uexWindow._iscroll.popName){
                var popName = window.top.uexWindow._iscroll.popName;
                outUexWin[popName].enableBounce = (v != 0 ? true : false);
                outUexWin[popName].contentScroll && (outUexWin[popName].contentScroll.options.bounce = outUexWin[popName].enableBounce);
            }else{
                uexWindow._iscroll.enableBounce = (v != 0 ? true : false);
                uexWindow._iscroll.contentScroll && (uexWindow._iscroll.contentScroll.options.bounce = uexWindow._iscroll.enableBounce);
            }
        },
        _setFrameOriginHeight:function(popName){
            var cntWind =  window.top.Zepto("#"+popName+" iframe")[0].contentWindow;
            var retHeight = 0;
            var eles = cntWind.Zepto(".origin-html")[0]&& cntWind.Zepto(".origin-html")[0].children;
            if(eles && eles.length>0){
                for(var i =0;i<eles.length;i++){
                    retHeight += Zepto(eles[i]).height();
                }
            }else{
                retHeight = cntWind.Zepto(".origin-html").height();
            }
            retHeight && Zepto(cntWind.Zepto(".origin-html")[0]).height(retHeight);
        },
        refreshBounce: function() {
            window.top.uexWindow._popoverList = window.top.uexWindow._popoverList || {};
            var outUexWin = window.top.uexWindow._popoverList;
            var curUexWin = window.uexWindow;
            if(window.top.uexWindow._iscroll.popName){//页面是通过popover弹出加载的iframe
                var popName = window.top.uexWindow._iscroll.popName;
                outUexWin[popName].contentScroll && outUexWin[popName].contentScroll.refresh();
                uexWindow._setFrameOriginHeight(popName);
            }else{
                curUexWin._iscroll.contentScroll && curUexWin._iscroll.contentScroll.refresh();
            }
        },
        showBounceView: function(inType, inColor, inFlag) {
            //uexWindow._iscroll.contentScroll.refresh();//弹动结束后刷新
            inType = (inType === void 0 ? 0 : inType);
            window.top.uexWindow._popoverList = window.top.uexWindow._popoverList || {};
            var outUexWin = window.top.uexWindow._popoverList;
            var curUexWin = window.uexWindow;
            
            if(window.top.uexWindow._iscroll.popName){//页面是通过popover弹出加载的iframe
                var popName = window.top.uexWindow._iscroll.popName;
                if(inType != 0){
                    outUexWin[popName].bottomBounceColor = inColor;
                    outUexWin[popName].bottomBounceShow = inFlag;
                }else{
                    outUexWin[popName].topBounceColor = inColor;
                    outUexWin[popName].topBounceShow = inFlag;
                }
            }else{
                if(inType != 0){
                    curUexWin._iscroll.bottomBounceColor = inColor;
                    curUexWin._iscroll.bottomBounceShow = inFlag;
                }else{
                    curUexWin._iscroll.topBounceColor = inColor;
                    curUexWin._iscroll.topBounceShow = inFlag;
                }
                if(uexWindow._iscroll.enableBounce){
                    bounceSetting(true);
                }else{
                    bounceSetting(false);
                }
            }
        },
        resetBounceView: function(inType) {
            inType = (inType === void 0 ? 0 : inType);
            window.top.uexWindow._popoverList = window.top.uexWindow._popoverList || {};
            var outUexWin = window.top.uexWindow._popoverList;
            var curUexWin = window.uexWindow;
            
            //页面是通过popover弹出加载的iframe
            if(window.top.uexWindow._iscroll.popName){
                var popName = window.top.uexWindow._iscroll.popName;
                if(inType != 0){
                    outUexWin[popName].bottomReset = true;
                }else{
                    outUexWin[popName].topReset = true;
                    
                }
            }else{
                if(inType != 0){
                    curUexWin._iscroll.bottomReset =  true;
                }else{
                    curUexWin._iscroll.topReset = true;
                }
            }
        },
        hiddenBounceView: function(inType) {
            inType = (inType === void 0 ? 0 : inType);
            window.top.uexWindow._popoverList = window.top.uexWindow._popoverList || {};
            var outUexWin = window.top.uexWindow._popoverList;
            var curUexWin = window.uexWindow;
            
            if(window.top.uexWindow._iscroll.popName){//页面是通过popover弹出加载的iframe
                var popName = window.top.uexWindow._iscroll.popName;
                if(inType == 0){
                    outUexWin[popName].topHidden = true;
                }else{
                    outUexWin[popName].bottomHidden = true;
                }
            }else{
                if(inType == 0){
                    curUexWin._iscroll.topHidden =  true;
                }else{
                    curUexWin._iscroll.bottomHidden = true;
                }
            }
        },
        notifyBounceEvent: function(inType, inStatus) {
            inType = (inType === void 0 ? 0 : inType);
            inStatus = (inStatus === void 0 ? 0 : inStatus);
            window.top.uexWindow._popoverList = window.top.uexWindow._popoverList || {};
            var outUexWin = window.top.uexWindow._popoverList;
            var curUexWin = window.uexWindow;
            
            //页面是通过popover弹出加载的iframe
            if(window.top.uexWindow._iscroll.popName){
                var popName = window.top.uexWindow._iscroll.popName;
                if(inType != 0){
                    outUexWin[popName].bottomNotifyState = (inStatus == 0 ? false : true);
                }else{
                    outUexWin[popName].topNotifyState = (inStatus == 0 ? false : true);
                }
            }else{
                if(inType != 0){
                    curUexWin._iscroll.bottomNotifyState = (inStatus == 0 ? false : true);
                }else{
                    curUexWin._iscroll.topNotifyState = (inStatus == 0 ? false : true);
                }
            }
        },
        setBounceParams: function(inType, inJson) {
            try{
                window.top.uexWindow._popoverList = window.top.uexWindow._popoverList || {};
                var outUexWin = window.top.uexWindow._popoverList;
                var curUexWin = window.uexWindow;
                inJson = JSON.parse(inJson);
                
                var bounceImagePath = jsBasePath +'js/resource/blueArrow.png';
                var loadingImagePath = jsBasePath +'js/resource/icon-refresh-act.png';

                var bounceParams = {
                    'imagePath': inJson.imagePath || bounceImagePath,
                    'textColor': inJson.textColor || '#f0ecf3',
                    'levelText': inJson.levelText || '',
                    'pullToReloadText': inJson.pullToReloadText || '拖动刷新',
                    'releaseToReloadText': inJson.releaseToReloadText || '释放刷新',
                    'loadingText': inJson.loadingText || '加载中，请稍等',
                    'loadingImagePath': inJson.loadingImagePath || loadingImagePath
                };

                if(bounceParams.imagePath && bounceParams.imagePath.indexOf('res://') == 0){
                    //bounceParams.imagePath = jsBasePath +"wgtRes/"+ bounceParams.imagePath.split('res://')[1];
                    bounceParams.imagePath = jsBasePath +"wgtRes/"+ bounceParams.imagePath.split('res://')[1];
                }
                
                if(window.top.uexWindow._iscroll.popName){//页面是通过popover弹出加载的iframe
                    var popName = window.top.uexWindow._iscroll.popName;
                    if(inType!=0){
                        outUexWin[popName].bottomParams = bounceParams;
                    }else{
                        outUexWin[popName].topParams = bounceParams;
                    }
                }else{
                    if(inType!=0){
                        curUexWin._iscroll.bottomParams = bounceParams;
                    }else{
                        curUexWin._iscroll.topParams = bounceParams;
                    }
                }
            }catch(e){
                console.log(e);
            }
        },
        openSlibing: function(inType, inDataType, inUrl, inData, inWidth, inHeight) {},
        showSlibing: function(inType) {},
        closeSlibing: function(inType) {},
        evaluateScript: function(inWindowName, inType, inScript) {
            //只支持当前窗口执行
            window.top.eval(inScript);
        },
        evaluatePopoverScript: function(inWindowName, inPopName, inScript) {
            if (window.top.Zepto('#pop_' + inPopName).find('iframe').length > 0) {
                var win = window.top.Zepto('#pop_' + inPopName).find('iframe')[0].contentWindow;
                win.eval(inScript);
            }
        },
        loadObfuscationData: function(inUrl) {},
        back: function() {
            window.top.history.go(-1);
        },
        pageBack: function() {},
        forward: function() {
            
        },
        pageForward: function() {},
        windowBack: function() {},
        windowForward: function() {},
        alert: function(inTitle, inMessage, inButtonLable) {
            var plugincss = jsBasePath + "js/resource/appcan.plugin.css";
            loadjscssfile(plugincss,"css");
            var alertHtml = '<div class="loader_alert up ub ub-ver" style="background-color:rgba(0,0,0,.5);display:none !important;"><div class="ub-f1 tx-l t-bla zhy_top" ><div class="ub ub-ver  zhy_win"><div class="uinn uc-t1"><div class="ub ub-ver zhy_bg t-wh uc-a "><div class="zhy_uinn uc-t1 tx-c zhy_border ubb"><div class="uinn loader_alert_1">提示</div><div class="uinn loader_alert_2"> 一旦提交，无法撤销</div></div><div class=" " onclick="uexWindow.closeAlert()"><div class="ub tx-c"><div class=" ub-f1 zhy_pading loader_alert_3">确定</div></div></div></div></div></div></div></div>';
            if (Zepto('.loader_alert').length == 0) {
                Zepto('body').append(alertHtml);
            }
            Zepto(".loader_alert_1").html(inTitle);
            Zepto(".loader_alert_2").html(inMessage)
            Zepto(".loader_alert_3").html(inButtonLable)
            var alertZIndex = currZIndex2++;
            Zepto('.loader_alert').css({
                "color":"rgba(225,225,225,225)",
                "background-color": "rgba(0,0,0,.5)",
                "z-index": alertZIndex
            }).show();
        },
        closeAlert: function() {
            Zepto('.loader_alert').css({
                display: 'none !important'
            });
        },
        confirm: function(inTitle, inMessage, inButtonLable) {
            var plugincss = jsBasePath + "js/resource/appcan.plugin.css";
            loadjscssfile(plugincss,"css");
            var confirmHtml = '<div class="loader_confirm up ub ub-ver"style="background-color:rgba(0,0,0,.5);display:none !important;"><div class="ub-f1 tx-l t-bla zhy_top"><div class="ub ub-ver uinn"><div class="uinn uc-t1"><div class="ub ub-ver zhy_bg t-wh uc-a "><div class="zhy_uinn uc-t1 tx-c zhy_border ubb"><div class="uinn loader_confirm_1">您确定进行账户转换操作么？</div><div class="uinn loader_confirm_2"> 一旦提交，无法撤销 </div></div><div class=" "><div class="ub tx-c loader_confirm_3"><div class="ubr zhy_border ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,0)">确定</div><div class="ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,1)">取消</div></div></div></div></div></div></div></div>';
            if (Zepto('.loader_confirm').length == 0) {
                Zepto('body').append(confirmHtml);
            }
            Zepto(".loader_confirm_1").html(inTitle);
            Zepto(".loader_confirm_2").html(inMessage);
            
            var bl = inButtonLable.length;
            if (bl == 1) {
                Zepto(".loader_confirm_3").html('<div class="ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,0)">' + inButtonLable[0] + '</div>');
            }
            if (bl == 2) {
                Zepto(".loader_confirm_3").html('<div class="ubr zhy_border ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,0)">' + inButtonLable[0] + '</div><div class="ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,1)">' + inButtonLable[1] + '</div>');
            }
            if (bl == 3) {
                Zepto(".loader_confirm_3").html('<div class="ubr zhy_border ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,0)">' + inButtonLable[0] + '</div><div class="ubr zhy_border ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,1)">' + inButtonLable[1] + '</div><div class="ub-f1 zhy_pading" onclick="uexWindow._cbConfirm(0,0,2)">' + inButtonLable[2] + '</div>');
            }
            var confirmZIndex = currZIndex2++;
           
            setTimeout(function(){ 
                 Zepto('.loader_confirm').css({
                     "color":"rgba(225,225,225,225)",
                     "background-color": "rgba(0,0,0,.5)",
                     "z-index": confirmZIndex
                 }).show();
            },30);
        },
        _cbConfirm: function(opid, dataType, data) {
            Zepto('.loader_confirm').css({
                display: 'none !important'
            });
            uexWindow.cbConfirm && uexWindow.cbConfirm(opid, 2, data);
        },
        prompt: function(inTitle, inMessage, inDefaultValue, inButtonLable) {},
        toast: function(inType, inLocation, inMsg, inDuration) {
            var plugincss = jsBasePath + "js/resource/appcan.plugin.css";
            loadjscssfile(plugincss,"css");
            var toastHtml = '<div class="loader_toast up ub ub-ver" style="background-color:rgba(0,0,0,.5);display:none !important;"><div class="ub-f1 tx-l t-bla zhy_top"><div class="ub uinn zhy_win"><div class="ub-f1"></div><div class="uinn ub-f1 uc-t1"><div class="ub ub-ver zhy_bg t-wh uc-a loader_toast_1"><div class="ub ub-pc ub-ac uinn"><div class="zhy_jiazai"></div></div><div class=" uc-t1 tx-c"><div class="uinn">登录成功！</div></div></div></div><div class="ub-f1"></div></div></div></div>'; 
            if (Zepto('.loader_toast').length == 0) {
                Zepto('body').append(toastHtml);
            }

            if (parseInt(inType) == 0) {
                Zepto(".loader_toast_1").html('<div class="zhy_uinn uc-t1 tx-c"><div class="uinn">' + inMsg + '</div></div>');
            } else {
                Zepto(".loader_toast_1").html('<div class="ub ub-pc ub-ac uinn"><div class="zhy_jiazai"></div></div><div class=" uc-t1 tx-c"><div class="uinn">' + inMsg + '</div></div>');
            }
            if (inDuration && inDuration != '0' && parseInt(inDuration) > 0) {
                var T = setTimeout(function() {
                    uexWindow.closeToast();
                }, inDuration);
            }
            var toastZIndex = currZIndex2++;
            Zepto('.loader_toast').css({
                "color":"rgba(225,225,225,225)",
                'background-color': 'rgba(0,0,0,.5);',
                'z-index': toastZIndex
            }).show();
        },
        closeToast: function() {
            Zepto('.loader_toast').css({
                'display': 'none !important;'
            });
        },
        actionSheet: function(inTitle, inCancel, inButtonLables) {

            var plugincss = jsBasePath + "js/resource/appcan.plugin.css";
            loadjscssfile(plugincss,"css");
            var actionSheetHtml = '<div class="loader_actionsheet up ub ub-ver" style="background-color:rgba(0,0,0,.5);display:none !important;"><div class="ub-f1 tx-l t-bla"><div class="ub ub-ver  zhy_winss"><div class=" uc-t1"><div class="ub ub-ver zhy_bg t-wh "><div class=" uc-t1 tx-c"><div class="uinn loader_actionsheet_1">提示</div><div class="uinn loader_actionsheet_2"></div></div><div class=" "><div class="ub tx-c" onclick="uexWindow._cbActionSheet()"><div class=" ub-f1 zhy_pading loader_actionsheet_3">取消</div></div></div></div></div></div></div></div>';
            if (Zepto('.loader_actionsheet').length == 0) {
                Zepto('body').append(actionSheetHtml);
            }
            Zepto('.loader_actionsheet_1').html(inTitle);
            var btnstr = '';
            for (var i = 0; i < inButtonLables.length; i++) {
                if (i > 4) {
                    break;
                }
                btnstr += '<div class="ub tx-c zhy_border ubb"  onclick="uexWindow._cbActionSheet(\'' + i + '\')"><div class=" ub-f1 zhy_pading">' + inButtonLables[i] + '</div></div>'
            }
            Zepto('.loader_actionsheet_2').html(btnstr);
            Zepto('.loader_actionsheet_3').html(inCancel);

            var actionSheetZIndex = currZIndex2++;
            setTimeout(function(){ 
                Zepto('.loader_actionsheet').css({
                    "color":"rgba(225,225,225,225)",
                    "background-color": 'rgba(0,0,0,.5);',
                    "z-index": actionSheetZIndex
                }).show();
            },30);
            return false;
        },
        _cbActionSheet: function(index) {
            Zepto('.loader_actionsheet').css({
                display: 'none !important'
            });
            if (index) {
                uexWindow.cbActionSheet && uexWindow.cbActionSheet('0', '0', index);
            }
        },
        getState: function() {
            return 0;
        },
        onOAuthInfo: function(windowName, url) {},
        setReportKey: function(inKeyCode, inEnable) {},
        preOpenStart: function() {},
        preOpenFinish: function() {},
        getUrlQuery: function() {},
        didShowKeyboard: function() {},
        beginAnimition: function() {},
        setAnimitionDelay: function(inDelay) {},
        setAnimitionDuration: function(inDuration) {},
        setAnimitionCurve: function(InCurve) {},
        setAnimitionRepeatCount: function(InCount) {},
        setAnimitionAutoReverse: function(inReverse) {},
        makeTranslation: function(inToX, inToY, inToZ) {},
        makeScale: function(inToX, inToY, inToZ) {},
        makeRotate: function(inDegrees, inX, inY, inZ) {},
        makeAlpha: function(inAlpha) {},
        commitAnimition: function() {},
        openAd: function(inType, inDTime, inInterval, inFlag) {},
        statusBarNotification: function(inTitle, inMsg) {},
        bringToFront: function() {},
        sendToBack: function() {},
        insertAbove: function(inName) {},
        insertBelow: function(inName) {},
        insertPopoverAbovePopover: function(inNameA, inNameB) {},
        insertPopoverBelowPopover: function(inNameA, inNameB) {},
        bringPopoverToFront: function(inName) {
            Zepto = top.Zepto||Zepto;
            uexWindow = window.top.uexWindow || window.uexWindow;
            var ZIndex = currZIndex++;
            var lastPop = null;
            Zepto("#pop_" + inName).css('z-index', ZIndex);
            uexWindow._iscroll.popName = "pop_" + inName;
            var pageHistory = sessionStorage.getItem('pageHistory');
            var windName = null;
            if(pageHistory){
                pageHistory = JSON.parse(pageHistory);
                windName = pageHistory.curWind;
                lastPop = pageHistory['win_'+windName].lastPop;
                pageHistory['win_'+windName].prevPop = lastPop;
                pageHistory['win_'+windName].lastPop = "pop_" + inName;
                sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
            }
        },
        sendPopoverToBack: function(inName) {

        },
        setSwipeRate: function(inRate) {},
        insertWindowAboveWindow: function(inNameA, inNameB) {},
        insertWindowBelowWindow: function(inNameA, inNameB) {},
        setWindowHidden: function(inVisible) {},
        setOrientation: function(orientation) {},
        setWindowScrollbarVisible: function(Visible) {},
        postGlobalNotification: function() {},
        subscribeChannelNotification: function() {},
        publishChannelNotification: function() {},
        getState: function() {},
        statusBarNotification: function() {},
        setMultilPopoverFlippingEnbaled: function(inEnable){}
    };
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexAudio weixin录音接口
        create:2015.08.07
        update:______/___author___

    */
 
    window.uexAudio = {
        currentPath:'',
        open:function(path){
            if(isWeiXin()){
                this.currentPath = path;
                return;
            }
        },
        play:function(repeats){
            var wx = window.top.wx;
            var that = this;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.playVoice({
                        localId: that.currentPath // 需要播放的音频的本地ID，由stopRecord接口获得
                    });
                    
                    wx.onVoicePlayEnd({
                        success: function (res) {
                            var localId = res.localId; // 返回音频的本地ID
                            uexAudio.onPlayFinished && uexAudio.onPlayFinished(1);
                        }
                    });
                });
                
                return;
            }
        },
        pause:function(){
            var wx = window.top.wx;
            var that = this;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.pauseVoice({
                        localId: that.currentPath // 需要暂停的音频的本地ID，由stopRecord接口获得
                    });
                });
                return;
            }
        },
        replay:function(){
            var wx = window.top.wx;
            var that = this;
            if(isWeiXin()){
                wx.ready(function(){
                    
                    wx.playVoice({
                        localId: that.currentPath // 需要播放的音频的本地ID，由stopRecord接口获得
                    });
                    
                    wx.onVoicePlayEnd({
                        success: function (res) {
                            var localId = res.localId; // 返回音频的本地ID
                            uexAudio.onPlayFinished && uexAudio.onPlayFinished(1);
                        }
                    });
                    
                });
                return;
            }
            
        },
        stop:function(){
            var wx = window.top.wx;
            var that = this;
            if(isWeiXin()){
                
                wx.ready(function(){
                    wx.stopVoice({
                        localId: that.currentPath // 需要停止的音频的本地ID，由stopRecord接口获得
                    });
                });
                return;
            }
        },
        volumeUp:function(){
            
            
        },
        volumeDown:function(){
            
            
        },
        openPlayer:function(){
            
        },
        closePlayer:function(){
            
        },
        startBackgroundRecord:function(mode,filename){

            var wx = window.top.wx;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.startRecord({
                      cancel: function () {
                        //alert('用户拒绝授权录音');
                      }
                    });
                    wx.onVoiceRecordEnd({
                        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                        complete: function (res) {
                            var localId = res.localId;
                            uexAudio.cbBackgroundRecord && uexAudio.cbBackgroundRecord(0,1,localId);
                        }
                    });
                });
                return;
            }
            //否则不支持
            
        },
        stopBackgroundRecord:function(){
            var wx = window.top.wx;
            
            if(isWeiXin()){
                wx.ready(function(){
                    wx.stopRecord({
                        success: function (res) {
                            var localId = res.localId;
                            uexAudio.cbBackgroundRecord && uexAudio.cbBackgroundRecord(0,1,localId);
                        },
                        fail: function (res) {
                            alert(JSON.stringify(res));
                        }
                    });
                });
                return;
            }
            //否则不支持
            
        },
        record:function(){
            
            
        },
        openSoundPool:function(){
            
            
        },
        addSound:function(){
            
            
        },
        playFromSoundPool:function(){
            
            
        },
        stopFromSoundPool:function(){
            
            
        },
        closeSoundPool:function(){
            
            
        }
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexBaiduMap百度地图接口
        create:2015.08.07
        update:______/___author___
    */
    window.uexBaiduMap = {
        currentInfo:{
            latitude:0,
            longitude:0,
            scale:1
        },
        open:function(x,y,width,height,longitute,latitute){
            var wx = window.top.wx;
            var that = this;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.openLocation({
                        latitude: parseFloat(latitute,10) || that.currentInfo.latitude, // 纬度，浮点数，范围为90 ~ -90
                        longitude: parseFloat(longitute,10) || that.currentInfo.longitude, // 经度，浮点数，范围为180 ~ -180。
                        name: '', // 位置名
                        address: '', // 地址详情说明
                        scale: that.currentInfo.scale || 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                        infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                    });
                });
            }
        },
        close:function(){
            
        },
        setMapType:function(){
            
            
        },
        setTrafficEnabled:function(){
            
            
        },
        setCenter:function(longitude,latitude){
            
            this.currentInfo.longitude = longitude;
            this.currentInfo.latitude = latitude;
            
        },
        setZoomLevel:function(level){
            
            this.currentInfo.scale = level;
            
        },
        zoomIn:function(){
            
            
        },
        zoomOut:function(){
            
            
        },
        rotate:function(){
            
            
        },
        overlook:function(){
            
            
        },
        setZoomEnable:function(){
            
            
        },
        setRotateEnable:function(){
            
            
        },
        setScrollEnable:function(){
            
            
        },
        setOverlookEnable:function(){
            
            
        },
        addMarkersOverlay:function(){
            
            
        },
        setMarkerOverlay:function(){
            
            
        },
        showBubble:function(){
            
            
        },
        hideBubble:function(){
            
            
        },
        addDotOverlay:function(){
            
            
        },
        addPolylineOverlay:function(){
            
            
        },
        addArcOverlay:function(){
            
            
        },
        addCircleOverlay:function(){
            
            
        },
        addPolygonOverlay:function(){
            
            
        },
        addGroundOverlay:function(){
            
            
        },
        addTextOverlay:function(){
            
            
        },
        removeMakersOverlay:function(){
            
            
        },
        poiSearchInCity:function(){
            
            
        },
        poiBoundSearch:function(){
            
            
        },
        busLineSearch:function(){
            
            
        },
        removeBusLine:function(){
            
            
        },
        perBusLineNode:function(){
            
            
        },
        nextBusLineNode:function(){
            
            
        },
        searchRoutePlan:function(){
            
            
        },
        removeRoutePlan:function(){
            
            
        },
        preRouteNode:function(){
            
            
        },
        nextRouteNode:function(){},
        geocode:function(){
            
            
        },
        reverseGeocode:function(){
            
            
        },
        getCurrentLocation:function(){
            var wx = window.top.wx;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.getLocation({
                        success: function (res) {
                            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            var speed = res.speed; // 速度，以米/每秒计
                            var accuracy = res.accuracy; // 位置精度
                            
                            uexBaiduMap.cbCurrentLocation && uexBaiduMap.cbCurrentLocation({
                                latitude:latitude,
                                longitude:longitude,
                                speed:speed,
                                accuracy:accuracy
                            });
                            
                        }
                    });
                });
                return;
            }
            
        },
        startLocation:function(){
            
            
        },
        stopLocation:function(){
            
            
        },
        setMyLocationEnable:function(){
            
            
        },
        setUserTrackingMode:function(){
            
            
        }
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexImageBrowser
        create:2015.08.07
        update:______/___author___

    */
    window.uexImageBrowser = {
        viewer:null,
        viewerScroller:null,
        open:function(imgList,index){
            var wx = window.top.wx;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.previewImage({
                        current: index || 0, // 当前显示的图片链接
                        urls: imgList|| [] // 需要预览的图片链接列表
                    });
                });
                return;
            }else{
                var that = this;
                var wt = window.innerWidth;
                //create image preview
                if(!this.viewer){
                    this.viewer = document.createElement('div');
                
                
                    this.viewer.innerHTML = '<div class="imagewidget_wraper">'+
                            '<div class="imagewidget-header">'+
                            '   <div class="imagewidget-header-close"></div>'+
                            '   <div class="imagewidget-header-index">'+
                            '       <span>0/0</span>'+
                            '   </div>'+
                            '</div>'+
                            '<div class="imagewidget-content-wrap">'+
                            '    <div class="imagewidget-content">'+
                            '    </div>'+
                            '</div>'+
                        '</div>';
                    
                    this.viewer.querySelector('.imagewidget-header-close').onclick = function(){
                        that.viewerScroller.destroy();
                        that.viewerScroller=null;
                        that.viewer.style.display = 'none';
                    };
                    
                }else{
                    that.viewer.style.display = 'block';
                } 
                var cwrap = this.viewer.querySelector('.imagewidget-content-wrap');
                var wcontent = this.viewer.querySelector('.imagewidget-content');
                var imgIndex = this.viewer.querySelector('.imagewidget-header-index > span');
                var tmpList = '';
                
                //reset
                imgIndex.innerHTML = '1/1';
                
                for(var i=0,len=imgList.length;i<len;i++){
                   
                    var imgUrl=null;
                    
                    //fixed web bug
                    if(typeof imgList[i] =='object' && imgList[i].name){
                        if(window.URL) {
                            imgUrl =  window.URL.createObjectURL(imgList[i]);
                        }else if(window.webkitURL) {
                            imgUrl =  window.webkitURL.createObjectUrl(imgList[i]);
                        }else{
                            
                        }
                    }else{
                        imgUrl = imgList[i];
                    }
                    tmpList += '<div style="width:'+wt+'px"><img style="width:100%;" src="'+imgUrl+'" /></div>';
                    
                }
                
                wcontent.innerHTML = tmpList;
                imgIndex.innerHTML = '1/'+imgList.length;
                
                wcontent.style.width = window.innerWidth * imgList.length+'px';
                cwrap.style.height = (window.innerHeight - 40 )+"px"
                
                this.viewer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:#FFF';
                
                
                
                document.body.appendChild(this.viewer);
                
                this.viewerScroller =  new IScroll('.imagewidget-content-wrap',{momentum:false,snap: true, scrollX: true, scrollY: false, mouseWheel: true});
                
                var viewerScroller = this.viewerScroller;
                
                this.viewerScroller.on('scrollEnd',function(e){
                    var curr = viewerScroller.currentPage;
                    imgIndex.innerHTML = (curr.pageX + 1)+'/'+imgList.length;
                });
                
            }
        },
        pick:function(){
            var wx = window.top.wx;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.chooseImage({
                        success: function (res) {
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            //调用uexImageBrowser cbpick
                            uexImageBrowser.cbPick && uexImageBrowser.cbPick(0,1,localIds);
                        },fail:function(res){
                            alert(JSON.stringify(res));
                        }
                    });
                });
                return;
            }else{
                
                //创建创建input
                var fileSelector = document.createElement('input');
                fileSelector.setAttribute('type','file');
                fileSelector.style.visibility = 'hidden';
                fileSelector.style.width = 0;
                fileSelector.style.height = 0;
                
                fileSelector.click();
                //fixed webkit webview bug
                 // setTimeout(function(){
                    // fileSelector.click();
                 // },0);
                fileSelector.onchange = function(){
                    
                    var localIds = Array.prototype.slice.call(this.files,0);
                    //调用uexImageBrowser cbpick
                    uexImageBrowser.cbPick && uexImageBrowser.cbPick(0,1,localIds);
                };
                document.body.appendChild(fileSelector);
            }
            
        },
        save:function(){
            
        },
        cleanCache:function(){
            
        },
        pickMulti:function(){
            var wx = window.top.wx;
            if(isWeiXin()){
                wx.ready(function(){
                    wx.chooseImage({
                        success: function (res) {
                            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                            //调用uexImageBrowser cbpick
                            uexImageBrowser.cbPick && uexImageBrowser.cbPick(0,1,localIds);
                        }
                    });
                });
                return;
            }else{
                //创建创建input
                var fileSelector = document.createElement('input');
                fileSelector.setAttribute('type','file');
                fileSelector.setAttribute('multiple','multiple');
                fileSelector.style.visibility = 'hidden';
                fileSelector.style.width = 0;
                fileSelector.style.height = 0;
                fileSelector.click();
                fileSelector.onchange = function(){
                    var localIds = Array.prototype.slice.call(this.files,0);
                    //调用uexImageBrowser cbpick
                    uexImageBrowser.cbPick && uexImageBrowser.cbPick(0,1,localIds);
                };
                document.body.appendChild(fileSelector);
            }
            
        }

    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexDevice
        create:2015.08.07
        update:______/___author___

    */
    window.uexDevice = {
        vibrate:function(){
            
            
        },
        cancelVibrate:function(){
            
            
            
        },
        getInfo:function(infoId){
            if(infoId == 13){
                if(isWeiXin()){
                    var wx = window.top.wx;
                    wx.ready(function(){
                        
                        wx.getNetworkType({
                            success: function (res) {
                                var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
                                var cbRes = -1;
                                if(networkType == 'wifi'){
                                    cbRes = 0;
                                }else if(networkType == '3g'){
                                    cbRes = 1;
                                }else if(networkType == '2g'){
                                    cbRes = 2;
                                }else if(networkType == '4g'){
                                    cbRes = 3;
                                }
                                uexDevice.cbGetInfo && uexDevice.cbGetInfo(0,1,{
                                    connectStatus:cbRes
                                });
                            }
                        });
                        
                    });
                }
                return;
            }
        }
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexScanner 微信二维码扫描接口
        create:2015.08.07
        update:______/___author___

    */
    window.uexScanner = {
        open:function(flag){
            var wx = window.top.wx;
            if(isWeiXin()){
                flag = flag === void 0 ? 1:0;
                wx.ready(function(){
                    wx.scanQRCode({
                        needResult: flag, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                        success: function (res) {
                            var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                            uexScanner.cbOpen && uexScanner.cbOpen(0,1,{
                                type:'',
                                code:result
                            });
                        }
                    });
                });
                return;
            }
        }
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexActionSheet
        create:2015.08.07
        update:______/___author___

    */
    window.uexActionSheet = {

    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexButton
        create:2015.08.07
        update:______/___author___

    */
    window.uexButton = {
        
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexVideo
        create:2015.08.07
        update:______/___author___

    */
    window.uexVideo= {

    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexWidget
        create:2015.08.07
        update:______/___author___

    */
    window.uexWidget = {
        
        
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexWidgetOne
        create:2015.08.07
        update:______/___author___

    */
    window.uexWidgetOne = {
        getPlatform:function(){}
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexXmlHttpMgr
        create:2015.08.07
        update:______/___author___
    */
    // window.uexXmlHttpMgr = {
        
    // }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexLog
        create:2015.08.07
        update:______/___author___

    */
    window.uexLog = {
        
        
    }
    
    /*
        author:jiaobingqian
        email:bingqian.jiao@3g2win.com
        description:uexListView
        create:2015.08.07
        update:______/___author___

    */
    window.uexListView = {

    }
    window.uexCall = {

    }
    window.uexCamera = {

    }
    window.uexClipboard = {

    }
    window.uexContact = {

    }
    window.uexControl = {

    }
    window.uexDataBaseMgr = {

    }
    window.uexDocumentReader = {

    }
    window.uexEmail = {

    }
    window.uexFileMgr = {

    }
    window.uexLocalNotification = {

    }
    window.uexLocation = {

    }
    window.uexMMS = {

    }
    window.uexSensor = {

    }
    window.uexSMS = {

    }
    window.uexZip = {

    }
    window.uexCreditCardRec = {

    }
    window.uexPDFReader = {

    }
    window.uexBrokenLine = {
        setData:function(obj){
            
        },
        open:function(x,y,width,height,id){
            
        }

    }
    window.uexCoverFlow2 = {

    }
    window.uexEditDialog = {

    }
    window.uexHexagonal = {

    }
    window.uexIndexBar = {

    }
    window.uexPie = {

    }
    window.uexPieChart = {

    }
    window.uexSlidePager = {

    }
    window.uexTimeMachine = {

    }
    window.uexWheel = {

    }
    window.uexCityListView = {

    }
    window.uexDataAnalysis = {

    }
    window.uexDownloaderMgr = {

    }
    window.uexSocketMgr = {

    }
    window.uexUploaderMgr = {

    }
    window.uexAliPay = {

    }
    window.uexSina = {

    }
    window.uexWeixin = {

    }
    window.uexTent = {

    }
    window.uexQQ = {

    }
    window.uexTestinCrash = {

    }
    window.uexGaodeMap = {

    }
    window.uexJPush = {

    }
    window.uexScrollPicture = {

    }
    window.uexEasemob = {

    }
    window.uexGetui = {

    }
    window.uexXGPush = {

    }
    window.uexMeChat = {

    }
    window.uexPingpp = {

    }
    window.uexIFlytekMsc = {
        
    }
    window.uexHYFont = {
        
    }
    
    //web/微信版本入口
    //执行uexOnload方法
    //window.uexOnload && window.uexOnload(1);
    //window.uexOnload = null;
    
    if(isWebApp || isWeiXin()){
        window.uexWindow = uexWindow;
        window.uexWidgetOne = uexWidgetOne;
        window.uexWidget = uexWidget;
        window.uexImageBrowser = uexImageBrowser;
        window.uexAudio = uexAudio;
        window.uexDevice = uexDevice;
        window.uexBaiduMap = uexBaiduMap;
        
        window.uexScanner = uexScanner;
        window.uexButton = uexButton;
        window.uexActionSheet = uexActionSheet;
        window.uexListView = uexListView;
        window.uexLog = uexLog;
        window.uexVideo = uexVideo;
        //window.uexXmlHttpMgr = uexXmlHttpMgr;
        
        //执行uexOnload方法
        
        window.uexOnload && window.uexOnload(1);
        window.uexOnload = null;
        
        Zepto(document).ready(function(){
            var popParams = null;
            var pageHistory = null;
            var isBackPage = null;
            var curWindName = null;
            var lastPop = null;
            var popTabIndex = 0;
            var lastPopInfo = null;
            if(self == top){
                pageHistory = sessionStorage.getItem('pageHistory');
                //isBackPage = getQueryString('isBack');
                isBackPage = window.location.hash;
                if(pageHistory && isBackPage && isBackPage =='#isBack'){
                    pageHistory = JSON.parse(pageHistory);
                    curWindName = pageHistory.curWind;
                    if(pageHistory['win_'+curWindName]){
                        lastPop = pageHistory['win_'+curWindName].lastPop;
                        lastPopInfo = pageHistory['win_'+curWindName][lastPop];
                        if(pageHistory['win_'+curWindName].lastPop != pageHistory['win_'+curWindName].firstPop){
                            uexWindow.openPopover(lastPopInfo);
                        }
                        popTabIndex = pageHistory[curWindName + "_" + lastPop +"_tabIndex"];
                    }
                    if(window.onUexWindowClose && typeof(window.onUexWindowClose) == 'function'){
                        window.onUexWindowClose({'tabIndex':popTabIndex});
                    }
                    window.location.hash = '';
                }else if(!pageHistory && !isBackPage){
                    pageHistory = {
                        'firstWind':'default',
                        'prevWind':'default',
                        'curWind':'default',
                        'windList':['default'], //递增序列
                        'win_default':{
                            'openArgs':{
                                'inWindName':'default',
                                'inData':window.location.href,
                                'inDataType':0,
                                'inAniID':0,
                                'inWidth':0,
                                'inHeight':0,
                                'inFlag':0
                            }
                        }
                    };
                    sessionStorage.setItem('pageHistory',JSON.stringify(pageHistory));
                }
            }else{
                //iframe加载完成
            }
            window.uexOnload && window.uexOnload(1);
            window.uexOnload =null;
        })
    }
    

})();