var Prototype = {
    Version: '1.6.0.2',
    Browser: {
        IE: !!(window.attachEvent && !window.opera),
        Opera: !!window.opera,
        WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
        MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
    },
    BrowserFeatures: {
        XPath: !!document.evaluate,
        ElementExtensions: !!window.HTMLElement,
        SpecificElementExtensions: document.createElement('div').__proto__ && document.createElement('div').__proto__ !== document.createElement('form').__proto__
    },
    ScriptFragment: '<script[^>]*>([\\S\\s]*?)<\/script>',
    JSONFilter: /^\/\*-secure-([\s\S]*)\*\/\s*$/,
    emptyFunction: function () {},
    K: function (x) {
        return x
    }
};
if (Prototype.Browser.MobileSafari) Prototype.BrowserFeatures.SpecificElementExtensions = false;
var Class = {
    create: function () {
        var a = null,
            properties = $A(arguments);
        if (Object.isFunction(properties[0])) a = properties.shift();

        function klass() {
            this.initialize.apply(this, arguments)
        }
        Object.extend(klass, Class.Methods);
        klass.superclass = a;
        klass.subclasses = [];
        if (a) {
            var b = function () {};
            b.prototype = a.prototype;
            klass.prototype = new b;
            a.subclasses.push(klass)
        }
        for (var i = 0; i < properties.length; i++) klass.addMethods(properties[i]);
        if (!klass.prototype.initialize) klass.prototype.initialize = Prototype.emptyFunction;
        klass.prototype.constructor = klass;
        return klass
    }
};
Class.Methods = {
    addMethods: function (a) {
        var b = this.superclass && this.superclass.prototype;
        var c = Object.keys(a);
        if (!Object.keys({
            toString: true
        }).length) c.push("toString", "valueOf");
        for (var i = 0, length = c.length; i < length; i++) {
            var d = c[i],
                value = a[d];
            if (b && Object.isFunction(value) && value.argumentNames().first() == "$super") {
                var e = value,
                    value = Object.extend((function (m) {
                        return function () {
                            return b[m].apply(this, arguments)
                        }
                    })(d).wrap(e), {
                        valueOf: function () {
                            return e
                        },
                        toString: function () {
                            return e.toString()
                        }
                    })
            }
            this.prototype[d] = value
        }
        return this
    }
};
var Abstract = {};
Object.extend = function (a, b) {
    for (var c in b) a[c] = b[c];
    return a
};
Object.extend(Object, {
    inspect: function (a) {
        try {
            if (Object.isUndefined(a)) return 'undefined';
            if (a === null) return 'null';
            return a.inspect ? a.inspect() : String(a)
        } catch (e) {
            if (e instanceof RangeError) return '...';
            throw e;
        }
    },
    toJSON: function (a) {
        var b = typeof a;
        switch (b) {
        case 'undefined':
        case 'function':
        case 'unknown':
            return;
        case 'boolean':
            return a.toString()
        }
        if (a === null) return 'null';
        if (a.toJSON) return a.toJSON();
        if (Object.isElement(a)) return;
        var c = [];
        for (var d in a) {
            var e = Object.toJSON(a[d]);
            if (!Object.isUndefined(e)) c.push(d.toJSON() + ': ' + e)
        }
        return '{' + c.join(', ') + '}'
    },
    toQueryString: function (a) {
        return $H(a).toQueryString()
    },
    toHTML: function (a) {
        return a && a.toHTML ? a.toHTML() : String.interpret(a)
    },
    keys: function (a) {
        var b = [];
        for (var c in a) b.push(c);
        return b
    },
    values: function (a) {
        var b = [];
        for (var c in a) b.push(a[c]);
        return b
    },
    clone: function (a) {
        return Object.extend({}, a)
    },
    isElement: function (a) {
        return a && a.nodeType == 1
    },
    isArray: function (a) {
        return a != null && typeof a == "object" && 'splice' in a && 'join' in a
    },
    isHash: function (a) {
        return a instanceof Hash
    },
    isFunction: function (a) {
        return typeof a == "function"
    },
    isString: function (a) {
        return typeof a == "string"
    },
    isNumber: function (a) {
        return typeof a == "number"
    },
    isUndefined: function (a) {
        return typeof a == "undefined"
    }
});
Object.extend(Function.prototype, {
    argumentNames: function () {
        var a = this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").invoke("strip");
        return a.length == 1 && !a[0] ? [] : a
    },
    bind: function () {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
        var a = this,
            args = $A(arguments),
            object = args.shift();
        return function () {
            return a.apply(object, args.concat($A(arguments)))
        }
    },
    bindAsEventListener: function () {
        var b = this,
            args = $A(arguments),
            object = args.shift();
        return function (a) {
            return b.apply(object, [a || window.event].concat(args))
        }
    },
    curry: function () {
        if (!arguments.length) return this;
        var a = this,
            args = $A(arguments);
        return function () {
            return a.apply(this, args.concat($A(arguments)))
        }
    },
    delay: function () {
        var a = this,
            args = $A(arguments),
            timeout = args.shift() * 1000;
        return window.setTimeout(function () {
            return a.apply(a, args)
        }, timeout)
    },
    wrap: function (a) {
        var b = this;
        return function () {
            return a.apply(this, [b.bind(this)].concat($A(arguments)))
        }
    },
    methodize: function () {
        if (this._methodized) return this._methodized;
        var a = this;
        return this._methodized = function () {
            return a.apply(null, [this].concat($A(arguments)))
        }
    }
});
Function.prototype.defer = Function.prototype.delay.curry(0.01);
Date.prototype.toJSON = function () {
    return '"' + this.getUTCFullYear() + '-' + (this.getUTCMonth() + 1).toPaddedString(2) + '-' + this.getUTCDate().toPaddedString(2) + 'T' + this.getUTCHours().toPaddedString(2) + ':' + this.getUTCMinutes().toPaddedString(2) + ':' + this.getUTCSeconds().toPaddedString(2) + 'Z"'
};
var Try = {
    these: function () {
        var a;
        for (var i = 0, length = arguments.length; i < length; i++) {
            var b = arguments[i];
            try {
                a = b();
                break
            } catch (e) {}
        }
        return a
    }
};
RegExp.prototype.match = RegExp.prototype.test;
RegExp.escape = function (a) {
    return String(a).replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')
};
var PeriodicalExecuter = Class.create({
    initialize: function (a, b) {
        this.callback = a;
        this.frequency = b;
        this.currentlyExecuting = false;
        this.registerCallback()
    },
    registerCallback: function () {
        this.timer = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000)
    },
    execute: function () {
        this.callback(this)
    },
    stop: function () {
        if (!this.timer) return;
        clearInterval(this.timer);
        this.timer = null
    },
    onTimerEvent: function () {
        if (!this.currentlyExecuting) {
            try {
                this.currentlyExecuting = true;
                this.execute()
            } finally {
                this.currentlyExecuting = false
            }
        }
    }
});
Object.extend(String, {
    interpret: function (a) {
        return a == null ? '' : String(a)
    },
    specialChar: {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '\\': '\\\\'
    }
});
Object.extend(String.prototype, {
    gsub: function (a, b) {
        var c = '',
            source = this,
            match;
        b = arguments.callee.prepareReplacement(b);
        while (source.length > 0) {
            if (match = source.match(a)) {
                c += source.slice(0, match.index);
                c += String.interpret(b(match));
                source = source.slice(match.index + match[0].length)
            } else {
                c += source, source = ''
            }
        }
        return c
    },
    sub: function (b, c, d) {
        c = this.gsub.prepareReplacement(c);
        d = Object.isUndefined(d) ? 1 : d;
        return this.gsub(b, function (a) {
            if (--d < 0) return a[0];
            return c(a)
        })
    },
    scan: function (a, b) {
        this.gsub(a, b);
        return String(this)
    },
    truncate: function (a, b) {
        a = a || 30;
        b = Object.isUndefined(b) ? '...' : b;
        return this.length > a ? this.slice(0, a - b.length) + b : String(this)
    },
    strip: function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '')
    },
    stripTags: function () {
        return this.replace(/<\/?[^>]+>/gi, '')
    },
    stripScripts: function () {
        return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '')
    },
    extractScripts: function () {
        var b = new RegExp(Prototype.ScriptFragment, 'img');
        var c = new RegExp(Prototype.ScriptFragment, 'im');
        return (this.match(b) || []).map(function (a) {
            return (a.match(c) || ['', ''])[1]
        })
    },
    evalScripts: function () {
        return this.extractScripts().map(function (a) {
            return eval(a)
        })
    },
    escapeHTML: function () {
        var a = arguments.callee;
        a.text.data = this;
        return a.div.innerHTML
    },
    unescapeHTML: function () {
        var c = new Element('div');
        c.innerHTML = this.stripTags();
        return c.childNodes[0] ? (c.childNodes.length > 1 ? $A(c.childNodes).inject('', function (a, b) {
            return a + b.nodeValue
        }) : c.childNodes[0].nodeValue) : ''
    },
    toQueryParams: function (e) {
        var f = this.strip().match(/([^?#]*)(#.*)?$/);
        if (!f) return {};
        return f[1].split(e || '&').inject({}, function (a, b) {
            if ((b = b.split('='))[0]) {
                var c = decodeURIComponent(b.shift());
                var d = b.length > 1 ? b.join('=') : b[0];
                if (d != undefined) d = decodeURIComponent(d);
                if (c in a) {
                    if (!Object.isArray(a[c])) a[c] = [a[c]];
                    a[c].push(d)
                } else a[c] = d
            }
            return a
        })
    },
    toArray: function () {
        return this.split('')
    },
    succ: function () {
        return this.slice(0, this.length - 1) + String.fromCharCode(this.charCodeAt(this.length - 1) + 1)
    },
    times: function (a) {
        return a < 1 ? '' : new Array(a + 1).join(this)
    },
    camelize: function () {
        var a = this.split('-'),
            len = a.length;
        if (len == 1) return a[0];
        var b = this.charAt(0) == '-' ? a[0].charAt(0).toUpperCase() + a[0].substring(1) : a[0];
        for (var i = 1; i < len; i++) b += a[i].charAt(0).toUpperCase() + a[i].substring(1);
        return b
    },
    capitalize: function () {
        return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase()
    },
    underscore: function () {
        return this.gsub(/::/, '/').gsub(/([A-Z]+)([A-Z][a-z])/, '#{1}_#{2}').gsub(/([a-z\d])([A-Z])/, '#{1}_#{2}').gsub(/-/, '_').toLowerCase()
    },
    dasherize: function () {
        return this.gsub(/_/, '-')
    },
    inspect: function (c) {
        var d = this.gsub(/[\x00-\x1f\\]/, function (a) {
            var b = String.specialChar[a[0]];
            return b ? b : '\\u00' + a[0].charCodeAt().toPaddedString(2, 16)
        });
        if (c) return '"' + d.replace(/"/g, '\\"') + '"';
        return "'" + d.replace(/'/g, '\\\'') + "'"
    },
    toJSON: function () {
        return this.inspect(true)
    },
    unfilterJSON: function (a) {
        return this.sub(a || Prototype.JSONFilter, '#{1}')
    },
    isJSON: function () {
        var a = this;
        if (a.blank()) return false;
        a = this.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
        return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(a)
    },
    evalJSON: function (a) {
        var b = this.unfilterJSON();
        try {
            if (!a || b.isJSON()) return eval('(' + b + ')')
        } catch (e) {}
        throw new SyntaxError('Badly formed JSON string: ' + this.inspect());
    },
    include: function (a) {
        return this.indexOf(a) > -1
    },
    startsWith: function (a) {
        return this.indexOf(a) === 0
    },
    endsWith: function (a) {
        var d = this.length - a.length;
        return d >= 0 && this.lastIndexOf(a) === d
    },
    empty: function () {
        return this == ''
    },
    blank: function () {
        return /^\s*$/.test(this)
    },
    interpolate: function (a, b) {
        return new Template(this, b).evaluate(a)
    }
});
if (Prototype.Browser.WebKit || Prototype.Browser.IE) Object.extend(String.prototype, {
    escapeHTML: function () {
        return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    },
    unescapeHTML: function () {
        return this.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    }
});
String.prototype.gsub.prepareReplacement = function (b) {
    if (Object.isFunction(b)) return b;
    var c = new Template(b);
    return function (a) {
        return c.evaluate(a)
    }
};
String.prototype.parseQuery = String.prototype.toQueryParams;
Object.extend(String.prototype.escapeHTML, {
    div: document.createElement('div'),
    text: document.createTextNode('')
});
with(String.prototype.escapeHTML) div.appendChild(text);
var Template = Class.create({
    initialize: function (a, b) {
        this.template = a.toString();
        this.pattern = b || Template.Pattern
    },
    evaluate: function (f) {
        if (Object.isFunction(f.toTemplateReplacements)) f = f.toTemplateReplacements();
        return this.template.gsub(this.pattern, function (a) {
            if (f == null) return '';
            var b = a[1] || '';
            if (b == '\\') return a[2];
            var c = f,
                expr = a[3];
            var d = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
            a = d.exec(expr);
            if (a == null) return b;
            while (a != null) {
                var e = a[1].startsWith('[') ? a[2].gsub('\\\\]', ']') : a[1];
                c = c[e];
                if (null == c || '' == a[3]) break;
                expr = expr.substring('[' == a[3] ? a[1].length : a[0].length);
                a = d.exec(expr)
            }
            return b + String.interpret(c)
        })
    }
});
Template.Pattern = /(^|.|\r|\n)(#\{(.*?)\})/;
var $break = {};
var Enumerable = {
    each: function (b, c) {
        var d = 0;
        b = b.bind(c);
        try {
            this._each(function (a) {
                b(a, d++)
            })
        } catch (e) {
            if (e != $break) throw e;
        }
        return this
    },
    eachSlice: function (a, b, c) {
        b = b ? b.bind(c) : Prototype.K;
        var d = -a,
            slices = [],
            array = this.toArray();
        while ((d += a) < array.length) slices.push(array.slice(d, d + a));
        return slices.collect(b, c)
    },
    all: function (c, d) {
        c = c ? c.bind(d) : Prototype.K;
        var e = true;
        this.each(function (a, b) {
            e = e && !!c(a, b);
            if (!e) throw $break;
        });
        return e
    },
    any: function (c, d) {
        c = c ? c.bind(d) : Prototype.K;
        var e = false;
        this.each(function (a, b) {
            if (e = !!c(a, b)) throw $break;
        });
        return e
    },
    collect: function (c, d) {
        c = c ? c.bind(d) : Prototype.K;
        var e = [];
        this.each(function (a, b) {
            e.push(c(a, b))
        });
        return e
    },
    detect: function (c, d) {
        c = c.bind(d);
        var e;
        this.each(function (a, b) {
            if (c(a, b)) {
                e = a;
                throw $break;
            }
        });
        return e
    },
    findAll: function (c, d) {
        c = c.bind(d);
        var e = [];
        this.each(function (a, b) {
            if (c(a, b)) e.push(a)
        });
        return e
    },
    grep: function (c, d, e) {
        d = d ? d.bind(e) : Prototype.K;
        var f = [];
        if (Object.isString(c)) c = new RegExp(c);
        this.each(function (a, b) {
            if (c.match(a)) f.push(d(a, b))
        });
        return f
    },
    include: function (b) {
        if (Object.isFunction(this.indexOf))
            if (this.indexOf(b) != -1) return true;
        var c = false;
        this.each(function (a) {
            if (a == b) {
                c = true;
                throw $break;
            }
        });
        return c
    },
    inGroupsOf: function (b, c) {
        c = Object.isUndefined(c) ? null : c;
        return this.eachSlice(b, function (a) {
            while (a.length < b) a.push(c);
            return a
        })
    },
    inject: function (c, d, e) {
        d = d.bind(e);
        this.each(function (a, b) {
            c = d(c, a, b)
        });
        return c
    },
    invoke: function (b) {
        var c = $A(arguments).slice(1);
        return this.map(function (a) {
            return a[b].apply(a, c)
        })
    },
    max: function (c, d) {
        c = c ? c.bind(d) : Prototype.K;
        var e;
        this.each(function (a, b) {
            a = c(a, b);
            if (e == null || a >= e) e = a
        });
        return e
    },
    min: function (c, d) {
        c = c ? c.bind(d) : Prototype.K;
        var e;
        this.each(function (a, b) {
            a = c(a, b);
            if (e == null || a < e) e = a
        });
        return e
    },
    partition: function (c, d) {
        c = c ? c.bind(d) : Prototype.K;
        var e = [],
            falses = [];
        this.each(function (a, b) {
            (c(a, b) ? e : falses).push(a)
        });
        return [e, falses]
    },
    pluck: function (b) {
        var c = [];
        this.each(function (a) {
            c.push(a[b])
        });
        return c
    },
    reject: function (c, d) {
        c = c.bind(d);
        var e = [];
        this.each(function (a, b) {
            if (!c(a, b)) e.push(a)
        });
        return e
    },
    sortBy: function (e, f) {
        e = e.bind(f);
        return this.map(function (a, b) {
            return {
                value: a,
                criteria: e(a, b)
            }
        }).sort(function (c, d) {
            var a = c.criteria,
                b = d.criteria;
            return a < b ? -1 : a > b ? 1 : 0
        }).pluck('value')
    },
    toArray: function () {
        return this.map()
    },
    zip: function () {
        var c = Prototype.K,
            args = $A(arguments);
        if (Object.isFunction(args.last())) c = args.pop();
        var d = [this].concat(args).map($A);
        return this.map(function (a, b) {
            return c(d.pluck(b))
        })
    },
    size: function () {
        return this.toArray().length
    },
    inspect: function () {
        return '#<Enumerable:' + this.toArray().inspect() + '>'
    }
};
Object.extend(Enumerable, {
    map: Enumerable.collect,
    find: Enumerable.detect,
    select: Enumerable.findAll,
    filter: Enumerable.findAll,
    member: Enumerable.include,
    entries: Enumerable.toArray,
    every: Enumerable.all,
    some: Enumerable.any
});

function $A(a) {
    if (!a) return [];
    if (a.toArray) return a.toArray();
    var b = a.length || 0,
        results = new Array(b);
    while (b--) results[b] = a[b];
    return results
}
if (Prototype.Browser.WebKit) {
    $A = function (a) {
        if (!a) return [];
        if (!(Object.isFunction(a) && a == '[object NodeList]') && a.toArray) return a.toArray();
        var b = a.length || 0,
            results = new Array(b);
        while (b--) results[b] = a[b];
        return results
    }
}
Array.from = $A;
Object.extend(Array.prototype, Enumerable);
if (!Array.prototype._reverse) Array.prototype._reverse = Array.prototype.reverse;
Object.extend(Array.prototype, {
    _each: function (a) {
        for (var i = 0, length = this.length; i < length; i++) a(this[i])
    },
    clear: function () {
        this.length = 0;
        return this
    },
    first: function () {
        return this[0]
    },
    last: function () {
        return this[this.length - 1]
    },
    compact: function () {
        return this.select(function (a) {
            return a != null
        })
    },
    flatten: function () {
        return this.inject([], function (a, b) {
            return a.concat(Object.isArray(b) ? b.flatten() : [b])
        })
    },
    without: function () {
        var b = $A(arguments);
        return this.select(function (a) {
            return !b.include(a)
        })
    },
    reverse: function (a) {
        return (a !== false ? this : this.toArray())._reverse()
    },
    reduce: function () {
        return this.length > 1 ? this : this[0]
    },
    uniq: function (d) {
        return this.inject([], function (a, b, c) {
            if (0 == c || (d ? a.last() != b : !a.include(b))) a.push(b);
            return a
        })
    },
    intersect: function (c) {
        return this.uniq().findAll(function (b) {
            return c.detect(function (a) {
                return b === a
            })
        })
    },
    clone: function () {
        return [].concat(this)
    },
    size: function () {
        return this.length
    },
    inspect: function () {
        return '[' + this.map(Object.inspect).join(', ') + ']'
    },
    toJSON: function () {
        var c = [];
        this.each(function (a) {
            var b = Object.toJSON(a);
            if (!Object.isUndefined(b)) c.push(b)
        });
        return '[' + c.join(', ') + ']'
    }
});
if (Object.isFunction(Array.prototype.forEach)) Array.prototype._each = Array.prototype.forEach;
if (!Array.prototype.indexOf) Array.prototype.indexOf = function (a, i) {
    i || (i = 0);
    var b = this.length;
    if (i < 0) i = b + i;
    for (; i < b; i++)
        if (this[i] === a) return i;
    return -1
};
if (!Array.prototype.lastIndexOf) Array.prototype.lastIndexOf = function (a, i) {
    i = isNaN(i) ? this.length : (i < 0 ? this.length + i : i) + 1;
    var n = this.slice(0, i).reverse().indexOf(a);
    return (n < 0) ? n : i - n - 1
};
Array.prototype.toArray = Array.prototype.clone;

function $w(a) {
    if (!Object.isString(a)) return [];
    a = a.strip();
    return a ? a.split(/\s+/) : []
}
if (Prototype.Browser.Opera) {
    Array.prototype.concat = function () {
        var a = [];
        for (var i = 0, length = this.length; i < length; i++) a.push(this[i]);
        for (var i = 0, length = arguments.length; i < length; i++) {
            if (Object.isArray(arguments[i])) {
                for (var j = 0, arrayLength = arguments[i].length; j < arrayLength; j++) a.push(arguments[i][j])
            } else {
                a.push(arguments[i])
            }
        }
        return a
    }
}
Object.extend(Number.prototype, {
    toColorPart: function () {
        return this.toPaddedString(2, 16)
    },
    succ: function () {
        return this + 1
    },
    times: function (a) {
        $R(0, this, true).each(a);
        return this
    },
    toPaddedString: function (a, b) {
        var c = this.toString(b || 10);
        return '0'.times(a - c.length) + c
    },
    toJSON: function () {
        return isFinite(this) ? this.toString() : 'null'
    }
});
$w('abs round ceil floor').each(function (a) {
    Number.prototype[a] = Math[a].methodize()
});

function $H(a) {
    return new Hash(a)
};
var Hash = Class.create(Enumerable, (function () {
    function toQueryPair(a, b) {
        if (Object.isUndefined(b)) return a;
        return a + '=' + encodeURIComponent(String.interpret(b))
    }
    return {
        initialize: function (a) {
            this._object = Object.isHash(a) ? a.toObject() : Object.clone(a)
        },
        _each: function (a) {
            for (var b in this._object) {
                var c = this._object[b],
                    pair = [b, c];
                pair.key = b;
                pair.value = c;
                a(pair)
            }
        },
        set: function (a, b) {
            return this._object[a] = b
        },
        get: function (a) {
            return this._object[a]
        },
        unset: function (a) {
            var b = this._object[a];
            delete this._object[a];
            return b
        },
        toObject: function () {
            return Object.clone(this._object)
        },
        keys: function () {
            return this.pluck('key')
        },
        values: function () {
            return this.pluck('value')
        },
        index: function (b) {
            var c = this.detect(function (a) {
                return a.value === b
            });
            return c && c.key
        },
        merge: function (a) {
            return this.clone().update(a)
        },
        update: function (c) {
            return new Hash(c).inject(this, function (a, b) {
                a.set(b.key, b.value);
                return a
            })
        },
        toQueryString: function () {
            return this.map(function (a) {
                var b = encodeURIComponent(a.key),
                    values = a.value;
                if (values && typeof values == 'object') {
                    if (Object.isArray(values)) return values.map(toQueryPair.curry(b)).join('&')
                }
                return toQueryPair(b, values)
            }).join('&')
        },
        inspect: function () {
            return '#<Hash:{' + this.map(function (a) {
                return a.map(Object.inspect).join(': ')
            }).join(', ') + '}>'
        },
        toJSON: function () {
            return Object.toJSON(this.toObject())
        },
        clone: function () {
            return new Hash(this)
        }
    }
})());
Hash.prototype.toTemplateReplacements = Hash.prototype.toObject;
Hash.from = $H;
var ObjectRange = Class.create(Enumerable, {
    initialize: function (a, b, c) {
        this.start = a;
        this.end = b;
        this.exclusive = c
    },
    _each: function (a) {
        var b = this.start;
        while (this.include(b)) {
            a(b);
            b = b.succ()
        }
    },
    include: function (a) {
        if (a < this.start) return false;
        if (this.exclusive) return a < this.end;
        return a <= this.end
    }
});
var $R = function (a, b, c) {
    return new ObjectRange(a, b, c)
};
var Ajax = {
    getTransport: function () {
        return Try.these(function () {
            return new XMLHttpRequest()
        }, function () {
            return new ActiveXObject('Msxml2.XMLHTTP')
        }, function () {
            return new ActiveXObject('Microsoft.XMLHTTP')
        }) || false
    },
    activeRequestCount: 0
};
Ajax.Responders = {
    responders: [],
    _each: function (a) {
        this.responders._each(a)
    },
    register: function (a) {
        if (!this.include(a)) this.responders.push(a)
    },
    unregister: function (a) {
        this.responders = this.responders.without(a)
    },
    dispatch: function (b, c, d, f) {
        this.each(function (a) {
            if (Object.isFunction(a[b])) {
                try {
                    a[b].apply(a, [c, d, f])
                } catch (e) {}
            }
        })
    }
};
Object.extend(Ajax.Responders, Enumerable);
Ajax.Responders.register({
    onCreate: function () {
        Ajax.activeRequestCount++
    },
    onComplete: function () {
        Ajax.activeRequestCount--
    }
});
Ajax.Base = Class.create({
    initialize: function (a) {
        this.options = {
            method: 'post',
            asynchronous: true,
            contentType: 'application/x-www-form-urlencoded',
            encoding: 'UTF-8',
            parameters: '',
            evalJSON: true,
            evalJS: true
        };
        Object.extend(this.options, a || {});
        this.options.method = this.options.method.toLowerCase();
        if (Object.isString(this.options.parameters)) this.options.parameters = this.options.parameters.toQueryParams();
        else if (Object.isHash(this.options.parameters)) this.options.parameters = this.options.parameters.toObject()
    }
});
Ajax.Request = Class.create(Ajax.Base, {
    _complete: false,
    initialize: function ($super, b, c) {
        $super(c);
        this.transport = Ajax.getTransport();
        this.request(b)
    },
    request: function (a) {
        this.url = a;
        this.method = this.options.method;
        var b = Object.clone(this.options.parameters);
        if (!['get', 'post'].include(this.method)) {
            b['_method'] = this.method;
            this.method = 'post'
        }
        this.parameters = b;
        if (b = Object.toQueryString(b)) {
            if (this.method == 'get') this.url += (this.url.include('?') ? '&' : '?') + b;
            else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) b += '&_='
        }
        try {
            var c = new Ajax.Response(this);
            if (this.options.onCreate) this.options.onCreate(c);
            Ajax.Responders.dispatch('onCreate', this, c);
            this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);
            if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);
            this.transport.onreadystatechange = this.onStateChange.bind(this);
            this.setRequestHeaders();
            this.body = this.method == 'post' ? (this.options.postBody || b) : null;
            this.transport.send(this.body);
            if (!this.options.asynchronous && this.transport.overrideMimeType) this.onStateChange()
        } catch (e) {
            this.dispatchException(e)
        }
    },
    onStateChange: function () {
        var a = this.transport.readyState;
        if (a > 1 && !((a == 4) && this._complete)) this.respondToReadyState(this.transport.readyState)
    },
    setRequestHeaders: function () {
        var b = {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Prototype-Version': Prototype.Version,
            'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
        };
        if (this.method == 'post') {
            b['Content-type'] = this.options.contentType + (this.options.encoding ? '; charset=' + this.options.encoding : '');
            if (this.transport.overrideMimeType && (navigator.userAgent.match(/Gecko\/(\d{4})/) || [0, 2005])[1] < 2005) b['Connection'] = 'close'
        }
        if (typeof this.options.requestHeaders == 'object') {
            var c = this.options.requestHeaders;
            if (Object.isFunction(c.push))
                for (var i = 0, length = c.length; i < length; i += 2) b[c[i]] = c[i + 1];
            else $H(c).each(function (a) {
                b[a.key] = a.value
            })
        }
        for (var d in b) this.transport.setRequestHeader(d, b[d])
    },
    success: function () {
        var a = this.getStatus();
        return !a || (a >= 200 && a < 300)
    },
    getStatus: function () {
        try {
            return this.transport.status || 0
        } catch (e) {
            return 0
        }
    },
    respondToReadyState: function (a) {
        var b = Ajax.Request.Events[a],
            response = new Ajax.Response(this);
        if (b == 'Complete') {
            try {
                this._complete = true;
                (this.options['on' + response.status] || this.options['on' + (this.success() ? 'Success' : 'Failure')] || Prototype.emptyFunction)(response, response.headerJSON)
            } catch (e) {
                this.dispatchException(e)
            }
            var c = response.getHeader('Content-type');
            if (this.options.evalJS == 'force' || (this.options.evalJS && this.isSameOrigin() && c && c.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i))) this.evalResponse()
        }
        try {
            (this.options['on' + b] || Prototype.emptyFunction)(response, response.headerJSON);
            Ajax.Responders.dispatch('on' + b, this, response, response.headerJSON)
        } catch (e) {
            this.dispatchException(e)
        }
        if (b == 'Complete') {
            this.transport.onreadystatechange = Prototype.emptyFunction
        }
    },
    isSameOrigin: function () {
        var m = this.url.match(/^\s*https?:\/\/[^\/]*/);
        return !m || (m[0] == '#{protocol}//#{domain}#{port}'.interpolate({
            protocol: location.protocol,
            domain: document.domain,
            port: location.port ? ':' + location.port : ''
        }))
    },
    getHeader: function (a) {
        try {
            return this.transport.getResponseHeader(a) || null
        } catch (e) {
            return null
        }
    },
    evalResponse: function () {
        try {
            return eval((this.transport.responseText || '').unfilterJSON())
        } catch (e) {
            this.dispatchException(e)
        }
    },
    dispatchException: function (a) {
        (this.options.onException || Prototype.emptyFunction)(this, a);
        Ajax.Responders.dispatch('onException', this, a)
    }
});
Ajax.Request.Events = ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];
Ajax.Response = Class.create({
    initialize: function (a) {
        this.request = a;
        var b = this.transport = a.transport,
            readyState = this.readyState = b.readyState;
        if ((readyState > 2 && !Prototype.Browser.IE) || readyState == 4) {
            this.status = this.getStatus();
            this.statusText = this.getStatusText();
            this.responseText = String.interpret(b.responseText);
            this.headerJSON = this._getHeaderJSON()
        }
        if (readyState == 4) {
            var c = b.responseXML;
            this.responseXML = Object.isUndefined(c) ? null : c;
            this.responseJSON = this._getResponseJSON()
        }
    },
    status: 0,
    statusText: '',
    getStatus: Ajax.Request.prototype.getStatus,
    getStatusText: function () {
        try {
            return this.transport.statusText || ''
        } catch (e) {
            return ''
        }
    },
    getHeader: Ajax.Request.prototype.getHeader,
    getAllHeaders: function () {
        try {
            return this.getAllResponseHeaders()
        } catch (e) {
            return null
        }
    },
    getResponseHeader: function (a) {
        return this.transport.getResponseHeader(a)
    },
    getAllResponseHeaders: function () {
        return this.transport.getAllResponseHeaders()
    },
    _getHeaderJSON: function () {
        var a = this.getHeader('X-JSON');
        if (!a) return null;
        a = decodeURIComponent(escape(a));
        try {
            return a.evalJSON(this.request.options.sanitizeJSON || !this.request.isSameOrigin())
        } catch (e) {
            this.request.dispatchException(e)
        }
    },
    _getResponseJSON: function () {
        var a = this.request.options;
        if (!a.evalJSON || (a.evalJSON != 'force' && !(this.getHeader('Content-type') || '').include('application/json')) || this.responseText.blank()) return null;
        try {
            return this.responseText.evalJSON(a.sanitizeJSON || !this.request.isSameOrigin())
        } catch (e) {
            this.request.dispatchException(e)
        }
    }
});
Ajax.Updater = Class.create(Ajax.Request, {
    initialize: function ($super, d, e, f) {
        this.container = {
            success: (d.success || d),
            failure: (d.failure || (d.success ? null : d))
        };
        f = Object.clone(f);
        var g = f.onComplete;
        f.onComplete = (function (a, b) {
            this.updateContent(a.responseText);
            if (Object.isFunction(g)) g(a, b)
        }).bind(this);
        $super(e, f)
    },
    updateContent: function (a) {
        var b = this.container[this.success() ? 'success' : 'failure'],
            options = this.options;
        if (!options.evalScripts) a = a.stripScripts();
        if (b = $(b)) {
            if (options.insertion) {
                if (Object.isString(options.insertion)) {
                    var c = {};
                    c[options.insertion] = a;
                    b.insert(c)
                } else options.insertion(b, a)
            } else b.update(a)
        }
    }
});
Ajax.PeriodicalUpdater = Class.create(Ajax.Base, {
    initialize: function ($super, b, c, d) {
        $super(d);
        this.onComplete = this.options.onComplete;
        this.frequency = (this.options.frequency || 2);
        this.decay = (this.options.decay || 1);
        this.updater = {};
        this.container = b;
        this.url = c;
        this.start()
    },
    start: function () {
        this.options.onComplete = this.updateComplete.bind(this);
        this.onTimerEvent()
    },
    stop: function () {
        this.updater.options.onComplete = undefined;
        clearTimeout(this.timer);
        (this.onComplete || Prototype.emptyFunction).apply(this, arguments)
    },
    updateComplete: function (a) {
        if (this.options.decay) {
            this.decay = (a.responseText == this.lastText ? this.decay * this.options.decay : 1);
            this.lastText = a.responseText
        }
        this.timer = this.onTimerEvent.bind(this).delay(this.decay * this.frequency)
    },
    onTimerEvent: function () {
        this.updater = new Ajax.Updater(this.container, this.url, this.options)
    }
});

function $(a) {
    if (arguments.length > 1) {
        for (var i = 0, elements = [], length = arguments.length; i < length; i++) elements.push($(arguments[i]));
        return elements
    }
    if (Object.isString(a)) a = document.getElementById(a);
    return Element.extend(a)
}
if (Prototype.BrowserFeatures.XPath) {
    document._getElementsByXPath = function (a, b) {
        var c = [];
        var d = document.evaluate(a, $(b) || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0, length = d.snapshotLength; i < length; i++) c.push(Element.extend(d.snapshotItem(i)));
        return c
    }
}
if (!window.Node) var Node = {};
if (!Node.ELEMENT_NODE) {
    Object.extend(Node, {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        ENTITY_REFERENCE_NODE: 5,
        ENTITY_NODE: 6,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11,
        NOTATION_NODE: 12
    })
}(function () {
    var d = this.Element;
    this.Element = function (a, b) {
        b = b || {};
        a = a.toLowerCase();
        var c = Element.cache;
        if (Prototype.Browser.IE && b.name) {
            a = '<' + a + ' name="' + b.name + '">';
            delete b.name;
            return Element.writeAttribute(document.createElement(a), b)
        }
        if (!c[a]) c[a] = Element.extend(document.createElement(a));
        return Element.writeAttribute(c[a].cloneNode(false), b)
    };
    Object.extend(this.Element, d || {})
}).call(window);
Element.cache = {};
Element.Methods = {
    visible: function (a) {
        return $(a).style.display != 'none'
    },
    toggle: function (a) {
        a = $(a);
        Element[Element.visible(a) ? 'hide' : 'show'](a);
        return a
    },
    hide: function (a) {
        $(a).style.display = 'none';
        return a
    },
    show: function (a) {
        $(a).style.display = '';
        return a
    },
    remove: function (a) {
        a = $(a);
        a.parentNode.removeChild(a);
        return a
    },
    update: function (a, b) {
        a = $(a);
        if (b && b.toElement) b = b.toElement();
        if (Object.isElement(b)) return a.update().insert(b);
        b = Object.toHTML(b);
        a.innerHTML = b.stripScripts();
        b.evalScripts.bind(b).defer();
        return a
    },
    replace: function (a, b) {
        a = $(a);
        if (b && b.toElement) b = b.toElement();
        else if (!Object.isElement(b)) {
            b = Object.toHTML(b);
            var c = a.ownerDocument.createRange();
            c.selectNode(a);
            b.evalScripts.bind(b).defer();
            b = c.createContextualFragment(b.stripScripts())
        }
        a.parentNode.replaceChild(b, a);
        return a
    },
    insert: function (a, b) {
        a = $(a);
        if (Object.isString(b) || Object.isNumber(b) || Object.isElement(b) || (b && (b.toElement || b.toHTML))) b = {
            bottom: b
        };
        var c, insert, tagName, childNodes;
        for (var d in b) {
            c = b[d];
            d = d.toLowerCase();
            insert = Element._insertionTranslations[d];
            if (c && c.toElement) c = c.toElement();
            if (Object.isElement(c)) {
                insert(a, c);
                continue
            }
            c = Object.toHTML(c);
            tagName = ((d == 'before' || d == 'after') ? a.parentNode : a).tagName.toUpperCase();
            childNodes = Element._getContentFromAnonymousElement(tagName, c.stripScripts());
            if (d == 'top' || d == 'after') childNodes.reverse();
            childNodes.each(insert.curry(a));
            c.evalScripts.bind(c).defer()
        }
        return a
    },
    wrap: function (a, b, c) {
        a = $(a);
        if (Object.isElement(b)) $(b).writeAttribute(c || {});
        else if (Object.isString(b)) b = new Element(b, c);
        else b = new Element('div', b); if (a.parentNode) a.parentNode.replaceChild(b, a);
        b.appendChild(a);
        return b
    },
    inspect: function (d) {
        d = $(d);
        var e = '<' + d.tagName.toLowerCase();
        $H({
            'id': 'id',
            'className': 'class'
        }).each(function (a) {
            var b = a.first(),
                attribute = a.last();
            var c = (d[b] || '').toString();
            if (c) e += ' ' + attribute + '=' + c.inspect(true)
        });
        return e + '>'
    },
    recursivelyCollect: function (a, b) {
        a = $(a);
        var c = [];
        while (a = a[b])
            if (a.nodeType == 1) c.push(Element.extend(a));
        return c
    },
    ancestors: function (a) {
        return $(a).recursivelyCollect('parentNode')
    },
    descendants: function (a) {
        return $(a).select("*")
    },
    firstDescendant: function (a) {
        a = $(a).firstChild;
        while (a && a.nodeType != 1) a = a.nextSibling;
        return $(a)
    },
    immediateDescendants: function (a) {
        if (!(a = $(a).firstChild)) return [];
        while (a && a.nodeType != 1) a = a.nextSibling;
        if (a) return [a].concat($(a).nextSiblings());
        return []
    },
    previousSiblings: function (a) {
        return $(a).recursivelyCollect('previousSibling')
    },
    nextSiblings: function (a) {
        return $(a).recursivelyCollect('nextSibling')
    },
    siblings: function (a) {
        a = $(a);
        return a.previousSiblings().reverse().concat(a.nextSiblings())
    },
    match: function (a, b) {
        if (Object.isString(b)) b = new Selector(b);
        return b.match($(a))
    },
    up: function (a, b, c) {
        a = $(a);
        if (arguments.length == 1) return $(a.parentNode);
        var d = a.ancestors();
        return Object.isNumber(b) ? d[b] : Selector.findElement(d, b, c)
    },
    down: function (a, b, c) {
        a = $(a);
        if (arguments.length == 1) return a.firstDescendant();
        return Object.isNumber(b) ? a.descendants()[b] : a.select(b)[c || 0]
    },
    previous: function (a, b, c) {
        a = $(a);
        if (arguments.length == 1) return $(Selector.handlers.previousElementSibling(a));
        var d = a.previousSiblings();
        return Object.isNumber(b) ? d[b] : Selector.findElement(d, b, c)
    },
    next: function (a, b, c) {
        a = $(a);
        if (arguments.length == 1) return $(Selector.handlers.nextElementSibling(a));
        var d = a.nextSiblings();
        return Object.isNumber(b) ? d[b] : Selector.findElement(d, b, c)
    },
    select: function () {
        var a = $A(arguments),
            element = $(a.shift());
        return Selector.findChildElements(element, a)
    },
    adjacent: function () {
        var a = $A(arguments),
            element = $(a.shift());
        return Selector.findChildElements(element.parentNode, a).without(element)
    },
    identify: function (a) {
        a = $(a);
        var b = a.readAttribute('id'),
            self = arguments.callee;
        if (b) return b;
        do {
            b = 'anonymous_element_' + self.counter++
        } while ($(b));
        a.writeAttribute('id', b);
        return b
    },
    readAttribute: function (a, b) {
        a = $(a);
        if (Prototype.Browser.IE) {
            var t = Element._attributeTranslations.read;
            if (t.values[b]) return t.values[b](a, b);
            if (t.names[b]) b = t.names[b];
            if (b.include(':')) {
                return (!a.attributes || !a.attributes[b]) ? null : a.attributes[b].value
            }
        }
        return a.getAttribute(b)
    },
    writeAttribute: function (a, b, c) {
        a = $(a);
        var d = {},
            t = Element._attributeTranslations.write;
        if (typeof b == 'object') d = b;
        else d[b] = Object.isUndefined(c) ? true : c;
        for (var e in d) {
            b = t.names[e] || e;
            c = d[e];
            if (t.values[e]) b = t.values[e](a, c);
            if (c === false || c === null) a.removeAttribute(b);
            else if (c === true) a.setAttribute(b, b);
            else a.setAttribute(b, c)
        }
        return a
    },
    getHeight: function (a) {
        return $(a).getDimensions().height
    },
    getWidth: function (a) {
        return $(a).getDimensions().width
    },
    classNames: function (a) {
        return new Element.ClassNames(a)
    },
    hasClassName: function (a, b) {
        if (!(a = $(a))) return;
        var c = a.className;
        return (c.length > 0 && (c == b || new RegExp("(^|\\s)" + b + "(\\s|$)").test(c)))
    },
    addClassName: function (a, b) {
        if (!(a = $(a))) return;
        if (!a.hasClassName(b)) a.className += (a.className ? ' ' : '') + b;
        return a
    },
    removeClassName: function (a, b) {
        if (!(a = $(a))) return;
        a.className = a.className.replace(new RegExp("(^|\\s+)" + b + "(\\s+|$)"), ' ').strip();
        return a
    },
    toggleClassName: function (a, b) {
        if (!(a = $(a))) return;
        return a[a.hasClassName(b) ? 'removeClassName' : 'addClassName'](b)
    },
    cleanWhitespace: function (a) {
        a = $(a);
        var b = a.firstChild;
        while (b) {
            var c = b.nextSibling;
            if (b.nodeType == 3 && !/\S/.test(b.nodeValue)) a.removeChild(b);
            b = c
        }
        return a
    },
    empty: function (a) {
        return $(a).innerHTML.blank()
    },
    descendantOf: function (b, c) {
        b = $(b), c = $(c);
        var d = c;
        if (b.compareDocumentPosition) return (b.compareDocumentPosition(c) & 8) === 8;
        if (b.sourceIndex && !Prototype.Browser.Opera) {
            var e = b.sourceIndex,
                a = c.sourceIndex,
                nextAncestor = c.nextSibling;
            if (!nextAncestor) {
                do {
                    c = c.parentNode
                } while (!(nextAncestor = c.nextSibling) && c.parentNode)
            }
            if (nextAncestor && nextAncestor.sourceIndex) return (e > a && e < nextAncestor.sourceIndex)
        }
        while (b = b.parentNode)
            if (b == d) return true;
        return false
    },
    scrollTo: function (a) {
        a = $(a);
        var b = a.cumulativeOffset();
        window.scrollTo(b[0], b[1]);
        return a
    },
    getStyle: function (a, b) {
        a = $(a);
        b = b == 'float' ? 'cssFloat' : b.camelize();
        var c = a.style[b];
        if (!c) {
            var d = document.defaultView.getComputedStyle(a, null);
            c = d ? d[b] : null
        }
        if (b == 'opacity') return c ? parseFloat(c) : 1.0;
        return c == 'auto' ? null : c
    },
    getOpacity: function (a) {
        return $(a).getStyle('opacity')
    },
    setStyle: function (a, b) {
        a = $(a);
        var c = a.style,
            match;
        if (Object.isString(b)) {
            a.style.cssText += ';' + b;
            return b.include('opacity') ? a.setOpacity(b.match(/opacity:\s*(\d?\.?\d*)/)[1]) : a
        }
        for (var d in b)
            if (d == 'opacity') a.setOpacity(b[d]);
            else c[(d == 'float' || d == 'cssFloat') ? (Object.isUndefined(c.styleFloat) ? 'cssFloat' : 'styleFloat') : d] = b[d];
        return a
    },
    setOpacity: function (a, b) {
        a = $(a);
        a.style.opacity = (b == 1 || b === '') ? '' : (b < 0.00001) ? 0 : b;
        return a
    },
    getDimensions: function (a) {
        a = $(a);
        var b = $(a).getStyle('display');
        if (b != 'none' && b != null) return {
            width: a.offsetWidth,
            height: a.offsetHeight
        };
        var c = a.style;
        var d = c.visibility;
        var e = c.position;
        var f = c.display;
        c.visibility = 'hidden';
        c.position = 'absolute';
        c.display = 'block';
        var g = a.clientWidth;
        var h = a.clientHeight;
        c.display = f;
        c.position = e;
        c.visibility = d;
        return {
            width: g,
            height: h
        }
    },
    makePositioned: function (a) {
        a = $(a);
        var b = Element.getStyle(a, 'position');
        if (b == 'static' || !b) {
            a._madePositioned = true;
            a.style.position = 'relative';
            if (window.opera) {
                a.style.top = 0;
                a.style.left = 0
            }
        }
        return a
    },
    undoPositioned: function (a) {
        a = $(a);
        if (a._madePositioned) {
            a._madePositioned = undefined;
            a.style.position = a.style.top = a.style.left = a.style.bottom = a.style.right = ''
        }
        return a
    },
    makeClipping: function (a) {
        a = $(a);
        if (a._overflow) return a;
        a._overflow = Element.getStyle(a, 'overflow') || 'auto';
        if (a._overflow !== 'hidden') a.style.overflow = 'hidden';
        return a
    },
    undoClipping: function (a) {
        a = $(a);
        if (!a._overflow) return a;
        a.style.overflow = a._overflow == 'auto' ? '' : a._overflow;
        a._overflow = null;
        return a
    },
    cumulativeOffset: function (a) {
        var b = 0,
            valueL = 0;
        do {
            b += a.offsetTop || 0;
            valueL += a.offsetLeft || 0;
            a = a.offsetParent
        } while (a);
        return Element._returnOffset(valueL, b)
    },
    positionedOffset: function (a) {
        var b = 0,
            valueL = 0;
        do {
            b += a.offsetTop || 0;
            valueL += a.offsetLeft || 0;
            a = a.offsetParent;
            if (a) {
                if (a.tagName == 'BODY') break;
                var p = Element.getStyle(a, 'position');
                if (p !== 'static') break
            }
        } while (a);
        return Element._returnOffset(valueL, b)
    },
    absolutize: function (a) {
        a = $(a);
        if (a.getStyle('position') == 'absolute') return;
        var b = a.positionedOffset();
        var c = b[1];
        var d = b[0];
        var e = a.clientWidth;
        var f = a.clientHeight;
        a._originalLeft = d - parseFloat(a.style.left || 0);
        a._originalTop = c - parseFloat(a.style.top || 0);
        a._originalWidth = a.style.width;
        a._originalHeight = a.style.height;
        a.style.position = 'absolute';
        a.style.top = c + 'px';
        a.style.left = d + 'px';
        a.style.width = e + 'px';
        a.style.height = f + 'px';
        return a
    },
    relativize: function (a) {
        a = $(a);
        if (a.getStyle('position') == 'relative') return;
        a.style.position = 'relative';
        var b = parseFloat(a.style.top || 0) - (a._originalTop || 0);
        var c = parseFloat(a.style.left || 0) - (a._originalLeft || 0);
        a.style.top = b + 'px';
        a.style.left = c + 'px';
        a.style.height = a._originalHeight;
        a.style.width = a._originalWidth;
        return a
    },
    cumulativeScrollOffset: function (a) {
        var b = 0,
            valueL = 0;
        do {
            b += a.scrollTop || 0;
            valueL += a.scrollLeft || 0;
            a = a.parentNode
        } while (a);
        return Element._returnOffset(valueL, b)
    },
    getOffsetParent: function (a) {
        if (a.offsetParent) return $(a.offsetParent);
        if (a == document.body) return $(a);
        while ((a = a.parentNode) && a != document.body)
            if (Element.getStyle(a, 'position') != 'static') return $(a);
        return $(document.body)
    },
    viewportOffset: function (a) {
        var b = 0,
            valueL = 0;
        var c = a;
        do {
            b += c.offsetTop || 0;
            valueL += c.offsetLeft || 0;
            if (c.offsetParent == document.body && Element.getStyle(c, 'position') == 'absolute') break
        } while (c = c.offsetParent);
        c = a;
        do {
            if (!Prototype.Browser.Opera || c.tagName == 'BODY') {
                b -= c.scrollTop || 0;
                valueL -= c.scrollLeft || 0
            }
        } while (c = c.parentNode);
        return Element._returnOffset(valueL, b)
    },
    clonePosition: function (a, b) {
        var c = Object.extend({
            setLeft: true,
            setTop: true,
            setWidth: true,
            setHeight: true,
            offsetTop: 0,
            offsetLeft: 0
        }, arguments[2] || {});
        b = $(b);
        var p = b.viewportOffset();
        a = $(a);
        var d = [0, 0];
        var e = null;
        if (Element.getStyle(a, 'position') == 'absolute') {
            e = a.getOffsetParent();
            d = e.viewportOffset()
        }
        if (e == document.body) {
            d[0] -= document.body.offsetLeft;
            d[1] -= document.body.offsetTop
        }
        if (c.setLeft) a.style.left = (p[0] - d[0] + c.offsetLeft) + 'px';
        if (c.setTop) a.style.top = (p[1] - d[1] + c.offsetTop) + 'px';
        if (c.setWidth) a.style.width = b.offsetWidth + 'px';
        if (c.setHeight) a.style.height = b.offsetHeight + 'px';
        return a
    }
};
Element.Methods.identify.counter = 1;
Object.extend(Element.Methods, {
    getElementsBySelector: Element.Methods.select,
    childElements: Element.Methods.immediateDescendants
});
Element._attributeTranslations = {
    write: {
        names: {
            className: 'class',
            htmlFor: 'for'
        },
        values: {}
    }
};
if (Prototype.Browser.Opera) {
    Element.Methods.getStyle = Element.Methods.getStyle.wrap(function (d, e, f) {
        switch (f) {
        case 'left':
        case 'top':
        case 'right':
        case 'bottom':
            if (d(e, 'position') === 'static') return null;
        case 'height':
        case 'width':
            if (!Element.visible(e)) return null;
            var g = parseInt(d(e, f), 10);
            if (g !== e['offset' + f.capitalize()]) return g + 'px';
            var h;
            if (f === 'height') {
                h = ['border-top-width', 'padding-top', 'padding-bottom', 'border-bottom-width']
            } else {
                h = ['border-left-width', 'padding-left', 'padding-right', 'border-right-width']
            }
            return h.inject(g, function (a, b) {
                var c = d(e, b);
                return c === null ? a : a - parseInt(c, 10)
            }) + 'px';
        default:
            return d(e, f)
        }
    });
    Element.Methods.readAttribute = Element.Methods.readAttribute.wrap(function (a, b, c) {
        if (c === 'title') return b.title;
        return a(b, c)
    })
} else if (Prototype.Browser.IE) {
    Element.Methods.getOffsetParent = Element.Methods.getOffsetParent.wrap(function (a, b) {
        b = $(b);
        var c = b.getStyle('position');
        if (c !== 'static') return a(b);
        b.setStyle({
            position: 'relative'
        });
        var d = a(b);
        b.setStyle({
            position: c
        });
        return d
    });
    $w('positionedOffset viewportOffset').each(function (f) {
        Element.Methods[f] = Element.Methods[f].wrap(function (a, b) {
            b = $(b);
            var c = b.getStyle('position');
            if (c !== 'static') return a(b);
            var d = b.getOffsetParent();
            if (d && d.getStyle('position') === 'fixed') d.setStyle({
                zoom: 1
            });
            b.setStyle({
                position: 'relative'
            });
            var e = a(b);
            b.setStyle({
                position: c
            });
            return e
        })
    });
    Element.Methods.getStyle = function (a, b) {
        a = $(a);
        b = (b == 'float' || b == 'cssFloat') ? 'styleFloat' : b.camelize();
        var c = a.style[b];
        if (!c && a.currentStyle) c = a.currentStyle[b];
        if (b == 'opacity') {
            if (c = (a.getStyle('filter') || '').match(/alpha\(opacity=(.*)\)/))
                if (c[1]) return parseFloat(c[1]) / 100;
            return 1.0
        }
        if (c == 'auto') {
            if ((b == 'width' || b == 'height') && (a.getStyle('display') != 'none')) return a['offset' + b.capitalize()] + 'px';
            return null
        }
        return c
    };
    Element.Methods.setOpacity = function (b, c) {
        function stripAlpha(a) {
            return a.replace(/alpha\([^\)]*\)/gi, '')
        }
        b = $(b);
        var d = b.currentStyle;
        if ((d && !d.hasLayout) || (!d && b.style.zoom == 'normal')) b.style.zoom = 1;
        var e = b.getStyle('filter'),
            style = b.style;
        if (c == 1 || c === '') {
            (e = stripAlpha(e)) ? style.filter = e : style.removeAttribute('filter');
            return b
        } else if (c < 0.00001) c = 0;
        style.filter = stripAlpha(e) + 'alpha(opacity=' + (c * 100) + ')';
        return b
    };
    Element._attributeTranslations = {
        read: {
            names: {
                'class': 'className',
                'for': 'htmlFor'
            },
            values: {
                _getAttr: function (a, b) {
                    return a.getAttribute(b, 2)
                },
                _getAttrNode: function (a, b) {
                    var c = a.getAttributeNode(b);
                    return c ? c.value : ""
                },
                _getEv: function (a, b) {
                    b = a.getAttribute(b);
                    return b ? b.toString().slice(23, -2) : null
                },
                _flag: function (a, b) {
                    return $(a).hasAttribute(b) ? b : null
                },
                style: function (a) {
                    return a.style.cssText.toLowerCase()
                },
                title: function (a) {
                    return a.title
                }
            }
        }
    };
    Element._attributeTranslations.write = {
        names: Object.extend({
            cellpadding: 'cellPadding',
            cellspacing: 'cellSpacing'
        }, Element._attributeTranslations.read.names),
        values: {
            checked: function (a, b) {
                a.checked = !!b
            },
            style: function (a, b) {
                a.style.cssText = b ? b : ''
            }
        }
    };
    Element._attributeTranslations.has = {};
    $w('colSpan rowSpan vAlign dateTime accessKey tabIndex ' + 'encType maxLength readOnly longDesc').each(function (a) {
        Element._attributeTranslations.write.names[a.toLowerCase()] = a;
        Element._attributeTranslations.has[a.toLowerCase()] = a
    });
    (function (v) {
        Object.extend(v, {
            href: v._getAttr,
            src: v._getAttr,
            type: v._getAttr,
            action: v._getAttrNode,
            disabled: v._flag,
            checked: v._flag,
            readonly: v._flag,
            multiple: v._flag,
            onload: v._getEv,
            onunload: v._getEv,
            onclick: v._getEv,
            ondblclick: v._getEv,
            onmousedown: v._getEv,
            onmouseup: v._getEv,
            onmouseover: v._getEv,
            onmousemove: v._getEv,
            onmouseout: v._getEv,
            onfocus: v._getEv,
            onblur: v._getEv,
            onkeypress: v._getEv,
            onkeydown: v._getEv,
            onkeyup: v._getEv,
            onsubmit: v._getEv,
            onreset: v._getEv,
            onselect: v._getEv,
            onchange: v._getEv
        })
    })(Element._attributeTranslations.read.values)
} else if (Prototype.Browser.Gecko && /rv:1\.8\.0/.test(navigator.userAgent)) {
    Element.Methods.setOpacity = function (a, b) {
        a = $(a);
        a.style.opacity = (b == 1) ? 0.999999 : (b === '') ? '' : (b < 0.00001) ? 0 : b;
        return a
    }
} else if (Prototype.Browser.WebKit) {
    Element.Methods.setOpacity = function (a, b) {
        a = $(a);
        a.style.opacity = (b == 1 || b === '') ? '' : (b < 0.00001) ? 0 : b;
        if (b == 1)
            if (a.tagName == 'IMG' && a.width) {
                a.width++;
                a.width--
            } else try {
                var n = document.createTextNode(' ');
                a.appendChild(n);
                a.removeChild(n)
            } catch (e) {}
            return a
    };
    Element.Methods.cumulativeOffset = function (a) {
        var b = 0,
            valueL = 0;
        do {
            b += a.offsetTop || 0;
            valueL += a.offsetLeft || 0;
            if (a.offsetParent == document.body)
                if (Element.getStyle(a, 'position') == 'absolute') break;
            a = a.offsetParent
        } while (a);
        return Element._returnOffset(valueL, b)
    }
}
if (Prototype.Browser.IE || Prototype.Browser.Opera) {
    Element.Methods.update = function (b, c) {
        b = $(b);
        if (c && c.toElement) c = c.toElement();
        if (Object.isElement(c)) return b.update().insert(c);
        c = Object.toHTML(c);
        var d = b.tagName.toUpperCase();
        if (d in Element._insertionTranslations.tags) {
            $A(b.childNodes).each(function (a) {
                b.removeChild(a)
            });
            Element._getContentFromAnonymousElement(d, c.stripScripts()).each(function (a) {
                b.appendChild(a)
            })
        } else b.innerHTML = c.stripScripts();
        c.evalScripts.bind(c).defer();
        return b
    }
}
if ('outerHTML' in document.createElement('div')) {
    Element.Methods.replace = function (b, c) {
        b = $(b);
        if (c && c.toElement) c = c.toElement();
        if (Object.isElement(c)) {
            b.parentNode.replaceChild(c, b);
            return b
        }
        c = Object.toHTML(c);
        var d = b.parentNode,
            tagName = d.tagName.toUpperCase();
        if (Element._insertionTranslations.tags[tagName]) {
            var e = b.next();
            var f = Element._getContentFromAnonymousElement(tagName, c.stripScripts());
            d.removeChild(b);
            if (e) f.each(function (a) {
                d.insertBefore(a, e)
            });
            else f.each(function (a) {
                d.appendChild(a)
            })
        } else b.outerHTML = c.stripScripts();
        c.evalScripts.bind(c).defer();
        return b
    }
}
Element._returnOffset = function (l, t) {
    var a = [l, t];
    a.left = l;
    a.top = t;
    return a
};
Element._getContentFromAnonymousElement = function (a, b) {
    var c = new Element('div'),
        t = Element._insertionTranslations.tags[a];
    if (t) {
        c.innerHTML = t[0] + b + t[1];
        t[2].times(function () {
            c = c.firstChild
        })
    } else c.innerHTML = b;
    return $A(c.childNodes)
};
Element._insertionTranslations = {
    before: function (a, b) {
        a.parentNode.insertBefore(b, a)
    },
    top: function (a, b) {
        a.insertBefore(b, a.firstChild)
    },
    bottom: function (a, b) {
        a.appendChild(b)
    },
    after: function (a, b) {
        a.parentNode.insertBefore(b, a.nextSibling)
    },
    tags: {
        TABLE: ['<table>', '</table>', 1],
        TBODY: ['<table><tbody>', '</tbody></table>', 2],
        TR: ['<table><tbody><tr>', '</tr></tbody></table>', 3],
        TD: ['<table><tbody><tr><td>', '</td></tr></tbody></table>', 4],
        SELECT: ['<select>', '</select>', 1]
    }
};
(function () {
    Object.extend(this.tags, {
        THEAD: this.tags.TBODY,
        TFOOT: this.tags.TBODY,
        TH: this.tags.TD
    })
}).call(Element._insertionTranslations);
Element.Methods.Simulated = {
    hasAttribute: function (a, b) {
        b = Element._attributeTranslations.has[b] || b;
        var c = $(a).getAttributeNode(b);
        return c && c.specified
    }
};
Element.Methods.ByTag = {};
Object.extend(Element, Element.Methods);
if (!Prototype.BrowserFeatures.ElementExtensions && document.createElement('div').__proto__) {
    window.HTMLElement = {};
    window.HTMLElement.prototype = document.createElement('div').__proto__;
    Prototype.BrowserFeatures.ElementExtensions = true
}
Element.extend = (function () {
    if (Prototype.BrowserFeatures.SpecificElementExtensions) return Prototype.K;
    var c = {},
        ByTag = Element.Methods.ByTag;
    var d = Object.extend(function (a) {
        if (!a || a._extendedByPrototype || a.nodeType != 1 || a == window) return a;
        var b = Object.clone(c),
            tagName = a.tagName,
            property, value;
        if (ByTag[tagName]) Object.extend(b, ByTag[tagName]);
        for (property in b) {
            value = b[property];
            if (Object.isFunction(value) && !(property in a)) a[property] = value.methodize()
        }
        a._extendedByPrototype = Prototype.emptyFunction;
        return a
    }, {
        refresh: function () {
            if (!Prototype.BrowserFeatures.ElementExtensions) {
                Object.extend(c, Element.Methods);
                Object.extend(c, Element.Methods.Simulated)
            }
        }
    });
    d.refresh();
    return d
})();
Element.hasAttribute = function (a, b) {
    if (a.hasAttribute) return a.hasAttribute(b);
    return Element.Methods.Simulated.hasAttribute(a, b)
};
Element.addMethods = function (f) {
    var F = Prototype.BrowserFeatures,
        T = Element.Methods.ByTag;
    if (!f) {
        Object.extend(Form, Form.Methods);
        Object.extend(Form.Element, Form.Element.Methods);
        Object.extend(Element.Methods.ByTag, {
            "FORM": Object.clone(Form.Methods),
            "INPUT": Object.clone(Form.Element.Methods),
            "SELECT": Object.clone(Form.Element.Methods),
            "TEXTAREA": Object.clone(Form.Element.Methods)
        })
    }
    if (arguments.length == 2) {
        var g = f;
        f = arguments[1]
    }
    if (!g) Object.extend(Element.Methods, f || {});
    else {
        if (Object.isArray(g)) g.each(extend);
        else extend(g)
    }

    function extend(a) {
        a = a.toUpperCase();
        if (!Element.Methods.ByTag[a]) Element.Methods.ByTag[a] = {};
        Object.extend(Element.Methods.ByTag[a], f)
    }

    function copy(a, b, c) {
        c = c || false;
        for (var d in a) {
            var e = a[d];
            if (!Object.isFunction(e)) continue;
            if (!c || !(d in b)) b[d] = e.methodize()
        }
    }

    function findDOMClass(a) {
        var b;
        var c = {
            "OPTGROUP": "OptGroup",
            "TEXTAREA": "TextArea",
            "P": "Paragraph",
            "FIELDSET": "FieldSet",
            "UL": "UList",
            "OL": "OList",
            "DL": "DList",
            "DIR": "Directory",
            "H1": "Heading",
            "H2": "Heading",
            "H3": "Heading",
            "H4": "Heading",
            "H5": "Heading",
            "H6": "Heading",
            "Q": "Quote",
            "INS": "Mod",
            "DEL": "Mod",
            "A": "Anchor",
            "IMG": "Image",
            "CAPTION": "TableCaption",
            "COL": "TableCol",
            "COLGROUP": "TableCol",
            "THEAD": "TableSection",
            "TFOOT": "TableSection",
            "TBODY": "TableSection",
            "TR": "TableRow",
            "TH": "TableCell",
            "TD": "TableCell",
            "FRAMESET": "FrameSet",
            "IFRAME": "IFrame"
        };
        if (c[a]) b = 'HTML' + c[a] + 'Element';
        if (window[b]) return window[b];
        b = 'HTML' + a + 'Element';
        if (window[b]) return window[b];
        b = 'HTML' + a.capitalize() + 'Element';
        if (window[b]) return window[b];
        window[b] = {};
        window[b].prototype = document.createElement(a).__proto__;
        return window[b]
    }
    if (F.ElementExtensions) {
        copy(Element.Methods, HTMLElement.prototype);
        copy(Element.Methods.Simulated, HTMLElement.prototype, true)
    }
    if (F.SpecificElementExtensions) {
        for (var h in Element.Methods.ByTag) {
            var i = findDOMClass(h);
            if (Object.isUndefined(i)) continue;
            copy(T[h], i.prototype)
        }
    }
    Object.extend(Element, Element.Methods);
    delete Element.ByTag;
    if (Element.extend.refresh) Element.extend.refresh();
    Element.cache = {}
};
document.viewport = {
    getDimensions: function () {
        var a = {};
        var B = Prototype.Browser;
        $w('width height').each(function (d) {
            var D = d.capitalize();
            a[d] = (B.WebKit && !document.evaluate) ? self['inner' + D] : (B.Opera) ? document.body['client' + D] : document.documentElement['client' + D]
        });
        return a
    },
    getWidth: function () {
        return this.getDimensions().width
    },
    getHeight: function () {
        return this.getDimensions().height
    },
    getScrollOffsets: function () {
        return Element._returnOffset(window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft, window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop)
    }
};
var Selector = Class.create({
    initialize: function (a) {
        this.expression = a.strip();
        this.compileMatcher()
    },
    shouldUseXPath: function () {
        if (!Prototype.BrowserFeatures.XPath) return false;
        var e = this.expression;
        if (Prototype.Browser.WebKit && (e.include("-of-type") || e.include(":empty"))) return false;
        if ((/(\[[\w-]*?:|:checked)/).test(this.expression)) return false;
        return true
    },
    compileMatcher: function () {
        if (this.shouldUseXPath()) return this.compileXPathMatcher();
        var e = this.expression,
            ps = Selector.patterns,
            h = Selector.handlers,
            c = Selector.criteria,
            le, p, m;
        if (Selector._cache[e]) {
            this.matcher = Selector._cache[e];
            return
        }
        this.matcher = ["this.matcher = function(root) {", "var r = root, h = Selector.handlers, c = false, n;"];
        while (e && le != e && (/\S/).test(e)) {
            le = e;
            for (var i in ps) {
                p = ps[i];
                if (m = e.match(p)) {
                    this.matcher.push(Object.isFunction(c[i]) ? c[i](m) : new Template(c[i]).evaluate(m));
                    e = e.replace(m[0], '');
                    break
                }
            }
        }
        this.matcher.push("return h.unique(n);\n}");
        eval(this.matcher.join('\n'));
        Selector._cache[this.expression] = this.matcher
    },
    compileXPathMatcher: function () {
        var e = this.expression,
            ps = Selector.patterns,
            x = Selector.xpath,
            le, m;
        if (Selector._cache[e]) {
            this.xpath = Selector._cache[e];
            return
        }
        this.matcher = ['.//*'];
        while (e && le != e && (/\S/).test(e)) {
            le = e;
            for (var i in ps) {
                if (m = e.match(ps[i])) {
                    this.matcher.push(Object.isFunction(x[i]) ? x[i](m) : new Template(x[i]).evaluate(m));
                    e = e.replace(m[0], '');
                    break
                }
            }
        }
        this.xpath = this.matcher.join('');
        Selector._cache[this.expression] = this.xpath
    },
    findElements: function (a) {
        a = a || document;
        if (this.xpath) return document._getElementsByXPath(this.xpath, a);
        return this.matcher(a)
    },
    match: function (a) {
        this.tokens = [];
        var e = this.expression,
            ps = Selector.patterns,
            as = Selector.assertions;
        var b, p, m;
        while (e && b !== e && (/\S/).test(e)) {
            b = e;
            for (var i in ps) {
                p = ps[i];
                if (m = e.match(p)) {
                    if (as[i]) {
                        this.tokens.push([i, Object.clone(m)]);
                        e = e.replace(m[0], '')
                    } else {
                        return this.findElements(document).include(a)
                    }
                }
            }
        }
        var c = true,
            name, matches;
        for (var i = 0, token; token = this.tokens[i]; i++) {
            name = token[0], matches = token[1];
            if (!Selector.assertions[name](a, matches)) {
                c = false;
                break
            }
        }
        return c
    },
    toString: function () {
        return this.expression
    },
    inspect: function () {
        return "#<Selector:" + this.expression.inspect() + ">"
    }
});
Object.extend(Selector, {
    _cache: {},
    xpath: {
        descendant: "//*",
        child: "/*",
        adjacent: "/following-sibling::*[1]",
        laterSibling: '/following-sibling::*',
        tagName: function (m) {
            if (m[1] == '*') return '';
            return "[local-name()='" + m[1].toLowerCase() + "' or local-name()='" + m[1].toUpperCase() + "']"
        },
        className: "[contains(concat(' ', @class, ' '), ' #{1} ')]",
        id: "[@id='#{1}']",
        attrPresence: function (m) {
            m[1] = m[1].toLowerCase();
            return new Template("[@#{1}]").evaluate(m)
        },
        attr: function (m) {
            m[1] = m[1].toLowerCase();
            m[3] = m[5] || m[6];
            return new Template(Selector.xpath.operators[m[2]]).evaluate(m)
        },
        pseudo: function (m) {
            var h = Selector.xpath.pseudos[m[1]];
            if (!h) return '';
            if (Object.isFunction(h)) return h(m);
            return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m)
        },
        operators: {
            '=': "[@#{1}='#{3}']",
            '!=': "[@#{1}!='#{3}']",
            '^=': "[starts-with(@#{1}, '#{3}')]",
            '$=': "[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",
            '*=': "[contains(@#{1}, '#{3}')]",
            '~=': "[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",
            '|=': "[contains(concat('-', @#{1}, '-'), '-#{3}-')]"
        },
        pseudos: {
            'first-child': '[not(preceding-sibling::*)]',
            'last-child': '[not(following-sibling::*)]',
            'only-child': '[not(preceding-sibling::* or following-sibling::*)]',
            'empty': "[count(*) = 0 and (count(text()) = 0 or translate(text(), ' \t\r\n', '') = '')]",
            'checked': "[@checked]",
            'disabled': "[@disabled]",
            'enabled': "[not(@disabled)]",
            'not': function (m) {
                var e = m[6],
                    p = Selector.patterns,
                    x = Selector.xpath,
                    le, v;
                var a = [];
                while (e && le != e && (/\S/).test(e)) {
                    le = e;
                    for (var i in p) {
                        if (m = e.match(p[i])) {
                            v = Object.isFunction(x[i]) ? x[i](m) : new Template(x[i]).evaluate(m);
                            a.push("(" + v.substring(1, v.length - 1) + ")");
                            e = e.replace(m[0], '');
                            break
                        }
                    }
                }
                return "[not(" + a.join(" and ") + ")]"
            },
            'nth-child': function (m) {
                return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ", m)
            },
            'nth-last-child': function (m) {
                return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ", m)
            },
            'nth-of-type': function (m) {
                return Selector.xpath.pseudos.nth("position() ", m)
            },
            'nth-last-of-type': function (m) {
                return Selector.xpath.pseudos.nth("(last() + 1 - position()) ", m)
            },
            'first-of-type': function (m) {
                m[6] = "1";
                return Selector.xpath.pseudos['nth-of-type'](m)
            },
            'last-of-type': function (m) {
                m[6] = "1";
                return Selector.xpath.pseudos['nth-last-of-type'](m)
            },
            'only-of-type': function (m) {
                var p = Selector.xpath.pseudos;
                return p['first-of-type'](m) + p['last-of-type'](m)
            },
            nth: function (c, m) {
                var d, formula = m[6],
                    predicate;
                if (formula == 'even') formula = '2n+0';
                if (formula == 'odd') formula = '2n+1';
                if (d = formula.match(/^(\d+)$/)) return '[' + c + "= " + d[1] + ']';
                if (d = formula.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                    if (d[1] == "-") d[1] = -1;
                    var a = d[1] ? Number(d[1]) : 1;
                    var b = d[2] ? Number(d[2]) : 0;
                    predicate = "[((#{fragment} - #{b}) mod #{a} = 0) and " + "((#{fragment} - #{b}) div #{a} >= 0)]";
                    return new Template(predicate).evaluate({
                        fragment: c,
                        a: a,
                        b: b
                    })
                }
            }
        }
    },
    criteria: {
        tagName: 'n = h.tagName(n, r, "#{1}", c);      c = false;',
        className: 'n = h.className(n, r, "#{1}", c);    c = false;',
        id: 'n = h.id(n, r, "#{1}", c);           c = false;',
        attrPresence: 'n = h.attrPresence(n, r, "#{1}", c); c = false;',
        attr: function (m) {
            m[3] = (m[5] || m[6]);
            return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m)
        },
        pseudo: function (m) {
            if (m[6]) m[6] = m[6].replace(/"/g, '\\"');
            return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m)
        },
        descendant: 'c = "descendant";',
        child: 'c = "child";',
        adjacent: 'c = "adjacent";',
        laterSibling: 'c = "laterSibling";'
    },
    patterns: {
        laterSibling: /^\s*~\s*/,
        child: /^\s*>\s*/,
        adjacent: /^\s*\+\s*/,
        descendant: /^\s/,
        tagName: /^\s*(\*|[\w\-]+)(\b|$)?/,
        id: /^#([\w\-\*]+)(\b|$)/,
        className: /^\.([\w\-\*]+)(\b|$)/,
        pseudo: /^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/,
        attrPresence: /^\[([\w]+)\]/,
        attr: /\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/
    },
    assertions: {
        tagName: function (a, b) {
            return b[1].toUpperCase() == a.tagName.toUpperCase()
        },
        className: function (a, b) {
            return Element.hasClassName(a, b[1])
        },
        id: function (a, b) {
            return a.id === b[1]
        },
        attrPresence: function (a, b) {
            return Element.hasAttribute(a, b[1])
        },
        attr: function (a, b) {
            var c = Element.readAttribute(a, b[1]);
            return c && Selector.operators[b[2]](c, b[5] || b[6])
        }
    },
    handlers: {
        concat: function (a, b) {
            for (var i = 0, node; node = b[i]; i++) a.push(node);
            return a
        },
        mark: function (a) {
            var b = Prototype.emptyFunction;
            for (var i = 0, node; node = a[i]; i++) node._countedByPrototype = b;
            return a
        },
        unmark: function (a) {
            for (var i = 0, node; node = a[i]; i++) node._countedByPrototype = undefined;
            return a
        },
        index: function (a, b, c) {
            a._countedByPrototype = Prototype.emptyFunction;
            if (b) {
                for (var d = a.childNodes, i = d.length - 1, j = 1; i >= 0; i--) {
                    var e = d[i];
                    if (e.nodeType == 1 && (!c || e._countedByPrototype)) e.nodeIndex = j++
                }
            } else {
                for (var i = 0, j = 1, d = a.childNodes; e = d[i]; i++)
                    if (e.nodeType == 1 && (!c || e._countedByPrototype)) e.nodeIndex = j++
            }
        },
        unique: function (a) {
            if (a.length == 0) return a;
            var b = [],
                n;
            for (var i = 0, l = a.length; i < l; i++)
                if (!(n = a[i])._countedByPrototype) {
                    n._countedByPrototype = Prototype.emptyFunction;
                    b.push(Element.extend(n))
                }
            return Selector.handlers.unmark(b)
        },
        descendant: function (a) {
            var h = Selector.handlers;
            for (var i = 0, results = [], node; node = a[i]; i++) h.concat(results, node.getElementsByTagName('*'));
            return results
        },
        child: function (a) {
            var h = Selector.handlers;
            for (var i = 0, results = [], node; node = a[i]; i++) {
                for (var j = 0, child; child = node.childNodes[j]; j++)
                    if (child.nodeType == 1 && child.tagName != '!') results.push(child)
            }
            return results
        },
        adjacent: function (a) {
            for (var i = 0, results = [], node; node = a[i]; i++) {
                var b = this.nextElementSibling(node);
                if (b) results.push(b)
            }
            return results
        },
        laterSibling: function (a) {
            var h = Selector.handlers;
            for (var i = 0, results = [], node; node = a[i]; i++) h.concat(results, Element.nextSiblings(node));
            return results
        },
        nextElementSibling: function (a) {
            while (a = a.nextSibling)
                if (a.nodeType == 1) return a;
            return null
        },
        previousElementSibling: function (a) {
            while (a = a.previousSibling)
                if (a.nodeType == 1) return a;
            return null
        },
        tagName: function (a, b, c, d) {
            var e = c.toUpperCase();
            var f = [],
                h = Selector.handlers;
            if (a) {
                if (d) {
                    if (d == "descendant") {
                        for (var i = 0, node; node = a[i]; i++) h.concat(f, node.getElementsByTagName(c));
                        return f
                    } else a = this[d](a); if (c == "*") return a
                }
                for (var i = 0, node; node = a[i]; i++)
                    if (node.tagName.toUpperCase() === e) f.push(node);
                return f
            } else return b.getElementsByTagName(c)
        },
        id: function (a, b, c, d) {
            var e = $(c),
                h = Selector.handlers;
            if (!e) return [];
            if (!a && b == document) return [e];
            if (a) {
                if (d) {
                    if (d == 'child') {
                        for (var i = 0, node; node = a[i]; i++)
                            if (e.parentNode == node) return [e]
                    } else if (d == 'descendant') {
                        for (var i = 0, node; node = a[i]; i++)
                            if (Element.descendantOf(e, node)) return [e]
                    } else if (d == 'adjacent') {
                        for (var i = 0, node; node = a[i]; i++)
                            if (Selector.handlers.previousElementSibling(e) == node) return [e]
                    } else a = h[d](a)
                }
                for (var i = 0, node; node = a[i]; i++)
                    if (node == e) return [e];
                return []
            }
            return (e && Element.descendantOf(e, b)) ? [e] : []
        },
        className: function (a, b, c, d) {
            if (a && d) a = this[d](a);
            return Selector.handlers.byClassName(a, b, c)
        },
        byClassName: function (a, b, c) {
            if (!a) a = Selector.handlers.descendant([b]);
            var d = ' ' + c + ' ';
            for (var i = 0, results = [], node, nodeClassName; node = a[i]; i++) {
                nodeClassName = node.className;
                if (nodeClassName.length == 0) continue;
                if (nodeClassName == c || (' ' + nodeClassName + ' ').include(d)) results.push(node)
            }
            return results
        },
        attrPresence: function (a, b, c, d) {
            if (!a) a = b.getElementsByTagName("*");
            if (a && d) a = this[d](a);
            var e = [];
            for (var i = 0, node; node = a[i]; i++)
                if (Element.hasAttribute(node, c)) e.push(node);
            return e
        },
        attr: function (a, b, c, d, e, f) {
            if (!a) a = b.getElementsByTagName("*");
            if (a && f) a = this[f](a);
            var g = Selector.operators[e],
                results = [];
            for (var i = 0, node; node = a[i]; i++) {
                var h = Element.readAttribute(node, c);
                if (h === null) continue;
                if (g(h, d)) results.push(node)
            }
            return results
        },
        pseudo: function (a, b, c, d, e) {
            if (a && e) a = this[e](a);
            if (!a) a = d.getElementsByTagName("*");
            return Selector.pseudos[b](a, c, d)
        }
    },
    pseudos: {
        'first-child': function (a, b, c) {
            for (var i = 0, results = [], node; node = a[i]; i++) {
                if (Selector.handlers.previousElementSibling(node)) continue;
                results.push(node)
            }
            return results
        },
        'last-child': function (a, b, c) {
            for (var i = 0, results = [], node; node = a[i]; i++) {
                if (Selector.handlers.nextElementSibling(node)) continue;
                results.push(node)
            }
            return results
        },
        'only-child': function (a, b, c) {
            var h = Selector.handlers;
            for (var i = 0, results = [], node; node = a[i]; i++)
                if (!h.previousElementSibling(node) && !h.nextElementSibling(node)) results.push(node);
            return results
        },
        'nth-child': function (a, b, c) {
            return Selector.pseudos.nth(a, b, c)
        },
        'nth-last-child': function (a, b, c) {
            return Selector.pseudos.nth(a, b, c, true)
        },
        'nth-of-type': function (a, b, c) {
            return Selector.pseudos.nth(a, b, c, false, true)
        },
        'nth-last-of-type': function (a, b, c) {
            return Selector.pseudos.nth(a, b, c, true, true)
        },
        'first-of-type': function (a, b, c) {
            return Selector.pseudos.nth(a, "1", c, false, true)
        },
        'last-of-type': function (a, b, c) {
            return Selector.pseudos.nth(a, "1", c, true, true)
        },
        'only-of-type': function (a, b, c) {
            var p = Selector.pseudos;
            return p['last-of-type'](p['first-of-type'](a, b, c), b, c)
        },
        getIndices: function (a, b, d) {
            if (a == 0) return b > 0 ? [b] : [];
            return $R(1, d).inject([], function (c, i) {
                if (0 == (i - b) % a && (i - b) / a >= 0) c.push(i);
                return c
            })
        },
        nth: function (c, d, e, f, g) {
            if (c.length == 0) return [];
            if (d == 'even') d = '2n+0';
            if (d == 'odd') d = '2n+1';
            var h = Selector.handlers,
                results = [],
                indexed = [],
                m;
            h.mark(c);
            for (var i = 0, node; node = c[i]; i++) {
                if (!node.parentNode._countedByPrototype) {
                    h.index(node.parentNode, f, g);
                    indexed.push(node.parentNode)
                }
            }
            if (d.match(/^\d+$/)) {
                d = Number(d);
                for (var i = 0, node; node = c[i]; i++)
                    if (node.nodeIndex == d) results.push(node)
            } else if (m = d.match(/^(-?\d*)?n(([+-])(\d+))?/)) {
                if (m[1] == "-") m[1] = -1;
                var a = m[1] ? Number(m[1]) : 1;
                var b = m[2] ? Number(m[2]) : 0;
                var k = Selector.pseudos.getIndices(a, b, c.length);
                for (var i = 0, node, l = k.length; node = c[i]; i++) {
                    for (var j = 0; j < l; j++)
                        if (node.nodeIndex == k[j]) results.push(node)
                }
            }
            h.unmark(c);
            h.unmark(indexed);
            return results
        },
        'empty': function (a, b, c) {
            for (var i = 0, results = [], node; node = a[i]; i++) {
                if (node.tagName == '!' || (node.firstChild && !node.innerHTML.match(/^\s*$/))) continue;
                results.push(node)
            }
            return results
        },
        'not': function (a, b, c) {
            var h = Selector.handlers,
                selectorType, m;
            var d = new Selector(b).findElements(c);
            h.mark(d);
            for (var i = 0, results = [], node; node = a[i]; i++)
                if (!node._countedByPrototype) results.push(node);
            h.unmark(d);
            return results
        },
        'enabled': function (a, b, c) {
            for (var i = 0, results = [], node; node = a[i]; i++)
                if (!node.disabled) results.push(node);
            return results
        },
        'disabled': function (a, b, c) {
            for (var i = 0, results = [], node; node = a[i]; i++)
                if (node.disabled) results.push(node);
            return results
        },
        'checked': function (a, b, c) {
            for (var i = 0, results = [], node; node = a[i]; i++)
                if (node.checked) results.push(node);
            return results
        }
    },
    operators: {
        '=': function (a, v) {
            return a == v
        },
        '!=': function (a, v) {
            return a != v
        },
        '^=': function (a, v) {
            return a.startsWith(v)
        },
        '$=': function (a, v) {
            return a.endsWith(v)
        },
        '*=': function (a, v) {
            return a.include(v)
        },
        '~=': function (a, v) {
            return (' ' + a + ' ').include(' ' + v + ' ')
        },
        '|=': function (a, v) {
            return ('-' + a.toUpperCase() + '-').include('-' + v.toUpperCase() + '-')
        }
    },
    split: function (a) {
        var b = [];
        a.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/, function (m) {
            b.push(m[1].strip())
        });
        return b
    },
    matchElements: function (a, b) {
        var c = $$(b),
            h = Selector.handlers;
        h.mark(c);
        for (var i = 0, results = [], element; element = a[i]; i++)
            if (element._countedByPrototype) results.push(element);
        h.unmark(c);
        return results
    },
    findElement: function (a, b, c) {
        if (Object.isNumber(b)) {
            c = b;
            b = false
        }
        return Selector.matchElements(a, b || '*')[c || 0]
    },
    findChildElements: function (a, b) {
        b = Selector.split(b.join(','));
        var c = [],
            h = Selector.handlers;
        for (var i = 0, l = b.length, selector; i < l; i++) {
            selector = new Selector(b[i].strip());
            h.concat(c, selector.findElements(a))
        }
        return (l > 1) ? h.unique(c) : c
    }
});
if (Prototype.Browser.IE) {
    Object.extend(Selector.handlers, {
        concat: function (a, b) {
            for (var i = 0, node; node = b[i]; i++)
                if (node.tagName !== "!") a.push(node);
            return a
        },
        unmark: function (a) {
            for (var i = 0, node; node = a[i]; i++) node.removeAttribute('_countedByPrototype');
            return a
        }
    })
}

function $$() {
    return Selector.findChildElements(document, $A(arguments))
}
var Form = {
    reset: function (a) {
        $(a).reset();
        return a
    },
    serializeElements: function (c, d) {
        if (typeof d != 'object') d = {
            hash: !!d
        };
        else if (Object.isUndefined(d.hash)) d.hash = true;
        var e, value, submitted = false,
            submit = d.submit;
        var f = c.inject({}, function (a, b) {
            if (!b.disabled && b.name) {
                e = b.name;
                value = $(b).getValue();
                if (value != null && (b.type != 'submit' || (!submitted && submit !== false && (!submit || e == submit) && (submitted = true)))) {
                    if (e in a) {
                        if (!Object.isArray(a[e])) a[e] = [a[e]];
                        a[e].push(value)
                    } else a[e] = value
                }
            }
            return a
        });
        return d.hash ? f : Object.toQueryString(f)
    }
};
Form.Methods = {
    serialize: function (a, b) {
        return Form.serializeElements(Form.getElements(a), b)
    },
    getElements: function (c) {
        return $A($(c).getElementsByTagName('*')).inject([], function (a, b) {
            if (Form.Element.Serializers[b.tagName.toLowerCase()]) a.push(Element.extend(b));
            return a
        })
    },
    getInputs: function (a, b, c) {
        a = $(a);
        var d = a.getElementsByTagName('input');
        if (!b && !c) return $A(d).map(Element.extend);
        for (var i = 0, matchingInputs = [], length = d.length; i < length; i++) {
            var e = d[i];
            if ((b && e.type != b) || (c && e.name != c)) continue;
            matchingInputs.push(Element.extend(e))
        }
        return matchingInputs
    },
    disable: function (a) {
        a = $(a);
        Form.getElements(a).invoke('disable');
        return a
    },
    enable: function (a) {
        a = $(a);
        Form.getElements(a).invoke('enable');
        return a
    },
    findFirstElement: function (b) {
        var c = $(b).getElements().findAll(function (a) {
            return 'hidden' != a.type && !a.disabled
        });
        var d = c.findAll(function (a) {
            return a.hasAttribute('tabIndex') && a.tabIndex >= 0
        }).sortBy(function (a) {
            return a.tabIndex
        }).first();
        return d ? d : c.find(function (a) {
            return ['input', 'select', 'textarea'].include(a.tagName.toLowerCase())
        })
    },
    focusFirstElement: function (a) {
        a = $(a);
        a.findFirstElement().activate();
        return a
    },
    request: function (a, b) {
        a = $(a), b = Object.clone(b || {});
        var c = b.parameters,
            action = a.readAttribute('action') || '';
        if (action.blank()) action = window.location.href;
        b.parameters = a.serialize(true);
        if (c) {
            if (Object.isString(c)) c = c.toQueryParams();
            Object.extend(b.parameters, c)
        }
        if (a.hasAttribute('method') && !b.method) b.method = a.method;
        return new Ajax.Request(action, b)
    }
};
Form.Element = {
    focus: function (a) {
        $(a).focus();
        return a
    },
    select: function (a) {
        $(a).select();
        return a
    }
};
Form.Element.Methods = {
    serialize: function (a) {
        a = $(a);
        if (!a.disabled && a.name) {
            var b = a.getValue();
            if (b != undefined) {
                var c = {};
                c[a.name] = b;
                return Object.toQueryString(c)
            }
        }
        return ''
    },
    getValue: function (a) {
        a = $(a);
        var b = a.tagName.toLowerCase();
        return Form.Element.Serializers[b](a)
    },
    setValue: function (a, b) {
        a = $(a);
        var c = a.tagName.toLowerCase();
        Form.Element.Serializers[c](a, b);
        return a
    },
    clear: function (a) {
        $(a).value = '';
        return a
    },
    present: function (a) {
        return $(a).value != ''
    },
    activate: function (a) {
        a = $(a);
        try {
            a.focus();
            if (a.select && (a.tagName.toLowerCase() != 'input' || !['button', 'reset', 'submit'].include(a.type))) a.select()
        } catch (e) {}
        return a
    },
    disable: function (a) {
        a = $(a);
        a.blur();
        a.disabled = true;
        return a
    },
    enable: function (a) {
        a = $(a);
        a.disabled = false;
        return a
    }
};
var Field = Form.Element;
var $F = Form.Element.Methods.getValue;
Form.Element.Serializers = {
    input: function (a, b) {
        switch (a.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
            return Form.Element.Serializers.inputSelector(a, b);
        default:
            return Form.Element.Serializers.textarea(a, b)
        }
    },
    inputSelector: function (a, b) {
        if (Object.isUndefined(b)) return a.checked ? a.value : null;
        else a.checked = !!b
    },
    textarea: function (a, b) {
        if (Object.isUndefined(b)) return a.value;
        else a.value = b
    },
    select: function (a, b) {
        if (Object.isUndefined(b)) return this[a.type == 'select-one' ? 'selectOne' : 'selectMany'](a);
        else {
            var c, value, single = !Object.isArray(b);
            for (var i = 0, length = a.length; i < length; i++) {
                c = a.options[i];
                value = this.optionValue(c);
                if (single) {
                    if (value == b) {
                        c.selected = true;
                        return
                    }
                } else c.selected = b.include(value)
            }
        }
    },
    selectOne: function (a) {
        var b = a.selectedIndex;
        return b >= 0 ? this.optionValue(a.options[b]) : null
    },
    selectMany: function (a) {
        var b, length = a.length;
        if (!length) return null;
        for (var i = 0, b = []; i < length; i++) {
            var c = a.options[i];
            if (c.selected) b.push(this.optionValue(c))
        }
        return b
    },
    optionValue: function (a) {
        return Element.extend(a).hasAttribute('value') ? a.value : a.text
    }
};
Abstract.TimedObserver = Class.create(PeriodicalExecuter, {
    initialize: function ($super, b, c, d) {
        $super(d, c);
        this.element = $(b);
        this.lastValue = this.getValue()
    },
    execute: function () {
        var a = this.getValue();
        if (Object.isString(this.lastValue) && Object.isString(a) ? this.lastValue != a : String(this.lastValue) != String(a)) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    }
});
Form.Element.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element)
    }
});
Form.Observer = Class.create(Abstract.TimedObserver, {
    getValue: function () {
        return Form.serialize(this.element)
    }
});
Abstract.EventObserver = Class.create({
    initialize: function (a, b) {
        this.element = $(a);
        this.callback = b;
        this.lastValue = this.getValue();
        if (this.element.tagName.toLowerCase() == 'form') this.registerFormCallbacks();
        else this.registerCallback(this.element)
    },
    onElementEvent: function () {
        var a = this.getValue();
        if (this.lastValue != a) {
            this.callback(this.element, a);
            this.lastValue = a
        }
    },
    registerFormCallbacks: function () {
        Form.getElements(this.element).each(this.registerCallback, this)
    },
    registerCallback: function (a) {
        if (a.type) {
            switch (a.type.toLowerCase()) {
            case 'checkbox':
            case 'radio':
                Event.observe(a, 'click', this.onElementEvent.bind(this));
                break;
            default:
                Event.observe(a, 'change', this.onElementEvent.bind(this));
                break
            }
        }
    }
});
Form.Element.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.Element.getValue(this.element)
    }
});
Form.EventObserver = Class.create(Abstract.EventObserver, {
    getValue: function () {
        return Form.serialize(this.element)
    }
});
if (!window.Event) var Event = {};
Object.extend(Event, {
    KEY_BACKSPACE: 8,
    KEY_TAB: 9,
    KEY_RETURN: 13,
    KEY_ESC: 27,
    KEY_LEFT: 37,
    KEY_UP: 38,
    KEY_RIGHT: 39,
    KEY_DOWN: 40,
    KEY_DELETE: 46,
    KEY_HOME: 36,
    KEY_END: 35,
    KEY_PAGEUP: 33,
    KEY_PAGEDOWN: 34,
    KEY_INSERT: 45,
    cache: {},
    relatedTarget: function (a) {
        var b;
        switch (a.type) {
        case 'mouseover':
            b = a.fromElement;
            break;
        case 'mouseout':
            b = a.toElement;
            break;
        default:
            return null
        }
        return Element.extend(b)
    }
});
Event.Methods = (function () {
    var e;
    if (Prototype.Browser.IE) {
        var f = {
            0: 1,
            1: 4,
            2: 2
        };
        e = function (a, b) {
            return a.button == f[b]
        }
    } else if (Prototype.Browser.WebKit) {
        e = function (a, b) {
            switch (b) {
            case 0:
                return a.which == 1 && !a.metaKey;
            case 1:
                return a.which == 1 && a.metaKey;
            default:
                return false
            }
        }
    } else {
        e = function (a, b) {
            return a.which ? (a.which === b + 1) : (a.button === b)
        }
    }
    return {
        isLeftClick: function (a) {
            return e(a, 0)
        },
        isMiddleClick: function (a) {
            return e(a, 1)
        },
        isRightClick: function (a) {
            return e(a, 2)
        },
        element: function (a) {
            var b = Event.extend(a).target;
            return Element.extend(b.nodeType == Node.TEXT_NODE ? b.parentNode : b)
        },
        findElement: function (a, b) {
            var c = Event.element(a);
            if (!b) return c;
            var d = [c].concat(c.ancestors());
            return Selector.findElement(d, b, 0)
        },
        pointer: function (a) {
            return {
                x: a.pageX || (a.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)),
                y: a.pageY || (a.clientY + (document.documentElement.scrollTop || document.body.scrollTop))
            }
        },
        pointerX: function (a) {
            return Event.pointer(a).x
        },
        pointerY: function (a) {
            return Event.pointer(a).y
        },
        stop: function (a) {
            Event.extend(a);
            a.preventDefault();
            a.stopPropagation();
            a.stopped = true
        }
    }
})();
Event.extend = (function () {
    var c = Object.keys(Event.Methods).inject({}, function (m, a) {
        m[a] = Event.Methods[a].methodize();
        return m
    });
    if (Prototype.Browser.IE) {
        Object.extend(c, {
            stopPropagation: function () {
                this.cancelBubble = true
            },
            preventDefault: function () {
                this.returnValue = false
            },
            inspect: function () {
                return "[object Event]"
            }
        });
        return function (a) {
            if (!a) return false;
            if (a._extendedByPrototype) return a;
            a._extendedByPrototype = Prototype.emptyFunction;
            var b = Event.pointer(a);
            Object.extend(a, {
                target: a.srcElement,
                relatedTarget: Event.relatedTarget(a),
                pageX: b.x,
                pageY: b.y
            });
            return Object.extend(a, c)
        }
    } else {
        Event.prototype = Event.prototype || document.createEvent("HTMLEvents").__proto__;
        Object.extend(Event.prototype, c);
        return Prototype.K
    }
})();
Object.extend(Event, (function () {
    var h = Event.cache;

    function getEventID(a) {
        if (a._prototypeEventID) return a._prototypeEventID[0];
        arguments.callee.id = arguments.callee.id || 1;
        return a._prototypeEventID = [++arguments.callee.id]
    }

    function getDOMEventName(a) {
        if (a && a.include(':')) return "dataavailable";
        return a
    }

    function getCacheForID(a) {
        return h[a] = h[a] || {}
    }

    function getWrappersForEventName(a, b) {
        var c = getCacheForID(a);
        return c[b] = c[b] || []
    }

    function createWrapper(b, d, e) {
        var f = getEventID(b);
        var c = getWrappersForEventName(f, d);
        if (c.pluck("handler").include(e)) return false;
        var g = function (a) {
            if (!Event || !Event.extend || (a.eventName && a.eventName != d)) return false;
            Event.extend(a);
            e.call(b, a)
        };
        g.handler = e;
        c.push(g);
        return g
    }

    function findWrapper(b, d, e) {
        var c = getWrappersForEventName(b, d);
        return c.find(function (a) {
            return a.handler == e
        })
    }

    function destroyWrapper(a, b, d) {
        var c = getCacheForID(a);
        if (!c[b]) return false;
        c[b] = c[b].without(findWrapper(a, b, d))
    }

    function destroyCache() {
        for (var a in h)
            for (var b in h[a]) h[a][b] = null
    }
    if (window.attachEvent) {
        window.attachEvent("onunload", destroyCache)
    }
    return {
        observe: function (a, b, c) {
            a = $(a);
            var d = getDOMEventName(b);
            var e = createWrapper(a, b, c);
            if (!e) return a;
            if (a.addEventListener) {
                a.addEventListener(d, e, false)
            } else {
                a.attachEvent("on" + d, e)
            }
            return a
        },
        stopObserving: function (b, c, d) {
            b = $(b);
            var e = getEventID(b),
                name = getDOMEventName(c);
            if (!d && c) {
                getWrappersForEventName(e, c).each(function (a) {
                    b.stopObserving(c, a.handler)
                });
                return b
            } else if (!c) {
                Object.keys(getCacheForID(e)).each(function (a) {
                    b.stopObserving(a)
                });
                return b
            }
            var f = findWrapper(e, c, d);
            if (!f) return b;
            if (b.removeEventListener) {
                b.removeEventListener(name, f, false)
            } else {
                b.detachEvent("on" + name, f)
            }
            destroyWrapper(e, c, d);
            return b
        },
        fire: function (a, b, c) {
            a = $(a);
            if (a == document && document.createEvent && !a.dispatchEvent) a = document.documentElement;
            var d;
            if (document.createEvent) {
                d = document.createEvent("HTMLEvents");
                d.initEvent("dataavailable", true, true)
            } else {
                d = document.createEventObject();
                d.eventType = "ondataavailable"
            }
            d.eventName = b;
            d.memo = c || {};
            if (document.createEvent) {
                a.dispatchEvent(d)
            } else {
                a.fireEvent(d.eventType, d)
            }
            return Event.extend(d)
        }
    }
})());
Object.extend(Event, Event.Methods);
Element.addMethods({
    fire: Event.fire,
    observe: Event.observe,
    stopObserving: Event.stopObserving
});
Object.extend(document, {
    fire: Element.Methods.fire.methodize(),
    observe: Element.Methods.observe.methodize(),
    stopObserving: Element.Methods.stopObserving.methodize(),
    loaded: false
});
(function () {
    var a;

    function fireContentLoadedEvent() {
        if (document.loaded) return;
        if (a) window.clearInterval(a);
        document.fire("dom:loaded");
        document.loaded = true
    }
    if (document.addEventListener) {
        if (Prototype.Browser.WebKit) {
            a = window.setInterval(function () {
                if (/loaded|complete/.test(document.readyState)) fireContentLoadedEvent()
            }, 0);
            Event.observe(window, "load", fireContentLoadedEvent)
        } else {
            document.addEventListener("DOMContentLoaded", fireContentLoadedEvent, false)
        }
    } else {
        document.write("<script id=__onDOMContentLoaded defer src=//:><\/script>");
        $("__onDOMContentLoaded").onreadystatechange = function () {
            if (this.readyState == "complete") {
                this.onreadystatechange = null;
                fireContentLoadedEvent()
            }
        }
    }
})();
Hash.toQueryString = Object.toQueryString;
var Toggle = {
    display: Element.toggle
};
Element.Methods.childOf = Element.Methods.descendantOf;
var Insertion = {
    Before: function (a, b) {
        return Element.insert(a, {
            before: b
        })
    },
    Top: function (a, b) {
        return Element.insert(a, {
            top: b
        })
    },
    Bottom: function (a, b) {
        return Element.insert(a, {
            bottom: b
        })
    },
    After: function (a, b) {
        return Element.insert(a, {
            after: b
        })
    }
};
var $continue = new Error('"throw $continue" is deprecated, use "return" instead');
var Position = {
    includeScrollOffsets: false,
    prepare: function () {
        this.deltaX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        this.deltaY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    },
    within: function (a, x, y) {
        if (this.includeScrollOffsets) return this.withinIncludingScrolloffsets(a, x, y);
        this.xcomp = x;
        this.ycomp = y;
        this.offset = Element.cumulativeOffset(a);
        return (y >= this.offset[1] && y < this.offset[1] + a.offsetHeight && x >= this.offset[0] && x < this.offset[0] + a.offsetWidth)
    },
    withinIncludingScrolloffsets: function (a, x, y) {
        var b = Element.cumulativeScrollOffset(a);
        this.xcomp = x + b[0] - this.deltaX;
        this.ycomp = y + b[1] - this.deltaY;
        this.offset = Element.cumulativeOffset(a);
        return (this.ycomp >= this.offset[1] && this.ycomp < this.offset[1] + a.offsetHeight && this.xcomp >= this.offset[0] && this.xcomp < this.offset[0] + a.offsetWidth)
    },
    overlap: function (a, b) {
        if (!a) return 0;
        if (a == 'vertical') return ((this.offset[1] + b.offsetHeight) - this.ycomp) / b.offsetHeight;
        if (a == 'horizontal') return ((this.offset[0] + b.offsetWidth) - this.xcomp) / b.offsetWidth
    },
    cumulativeOffset: Element.Methods.cumulativeOffset,
    positionedOffset: Element.Methods.positionedOffset,
    absolutize: function (a) {
        Position.prepare();
        return Element.absolutize(a)
    },
    relativize: function (a) {
        Position.prepare();
        return Element.relativize(a)
    },
    realOffset: Element.Methods.cumulativeScrollOffset,
    offsetParent: Element.Methods.getOffsetParent,
    page: Element.Methods.viewportOffset,
    clone: function (a, b, c) {
        c = c || {};
        return Element.clonePosition(b, a, c)
    }
};
if (!document.getElementsByClassName) document.getElementsByClassName = function (f) {
    function iter(a) {
        return a.blank() ? null : "[contains(concat(' ', @class, ' '), ' " + a + " ')]"
    }
    f.getElementsByClassName = Prototype.BrowserFeatures.XPath ? function (a, b) {
        b = b.toString().strip();
        var c = /\s/.test(b) ? $w(b).map(iter).join('') : iter(b);
        return c ? document._getElementsByXPath('.//*' + c, a) : []
    } : function (b, c) {
        c = c.toString().strip();
        var d = [],
            classNames = (/\s/.test(c) ? $w(c) : null);
        if (!classNames && !c) return d;
        var e = $(b).getElementsByTagName('*');
        c = ' ' + c + ' ';
        for (var i = 0, child, cn; child = e[i]; i++) {
            if (child.className && (cn = ' ' + child.className + ' ') && (cn.include(c) || (classNames && classNames.all(function (a) {
                return !a.toString().blank() && cn.include(' ' + a + ' ')
            })))) d.push(Element.extend(child))
        }
        return d
    };
    return function (a, b) {
        return $(b || document.body).getElementsByClassName(a)
    }
}(Element.Methods);
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
    initialize: function (a) {
        this.element = $(a)
    },
    _each: function (b) {
        this.element.className.split(/\s+/).select(function (a) {
            return a.length > 0
        })._each(b)
    },
    set: function (a) {
        this.element.className = a
    },
    add: function (a) {
        if (this.include(a)) return;
        this.set($A(this).concat(a).join(' '))
    },
    remove: function (a) {
        if (!this.include(a)) return;
        this.set($A(this).without(a).join(' '))
    },
    toString: function () {
        return $A(this).join(' ')
    }
};
Object.extend(Element.ClassNames.prototype, Enumerable);
Element.addMethods();
var Scriptaculous = {
    Version: '1.8.1',
    require: function (a) {
        document.write('<script type="text/javascript" src="' + a + '"><\/script>')
    },
    REQUIRED_PROTOTYPE: '1.6.0',
    load: function () {
        function convertVersionString(a) {
            var r = a.split('.');
            return parseInt(r[0]) * 100000 + parseInt(r[1]) * 1000 + parseInt(r[2])
        }
        if ((typeof Prototype == 'undefined') || (typeof Element == 'undefined') || (typeof Element.Methods == 'undefined') || (convertVersionString(Prototype.Version) < convertVersionString(Scriptaculous.REQUIRED_PROTOTYPE))) throw ("script.aculo.us requires the Prototype JavaScript framework >= " + Scriptaculous.REQUIRED_PROTOTYPE);
        var d = /(proto|scripta)culous[a-z0-9._-]*\.js(\?.*)?$/;
        $A(document.getElementsByTagName("script")).findAll(function (s) {
            return (s.src && s.src.match(d))
        }).each(function (s) {
            var b = s.src.replace(d, '');
            var c = (s.src.match(/\?.*load=([a-z,]*)/) || [, ''])[1];
            c.split(',').without('').each(function (a) {
                Scriptaculous.require(b + a + '.js')
            })
        })
    }
};
var Builder = {
    NODEMAP: {
        AREA: 'map',
        CAPTION: 'table',
        COL: 'table',
        COLGROUP: 'table',
        LEGEND: 'fieldset',
        OPTGROUP: 'select',
        OPTION: 'select',
        PARAM: 'object',
        TBODY: 'table',
        TD: 'table',
        TFOOT: 'table',
        TH: 'table',
        THEAD: 'table',
        TR: 'table'
    },
    node: function (a) {
        a = a.toUpperCase();
        var b = this.NODEMAP[a] || 'div';
        var c = document.createElement(b);
        try {
            c.innerHTML = "<" + a + "></" + a + ">"
        } catch (e) {}
        var d = c.firstChild || null;
        if (d && (d.tagName.toUpperCase() != a)) d = d.getElementsByTagName(a)[0];
        if (!d) d = document.createElement(a);
        if (!d) return;
        if (arguments[1])
            if (this._isStringOrNumber(arguments[1]) || (arguments[1] instanceof Array) || arguments[1].tagName) {
                this._children(d, arguments[1])
            } else {
                var f = this._attributes(arguments[1]);
                if (f.length) {
                    try {
                        c.innerHTML = "<" + a + " " + f + "></" + a + ">"
                    } catch (e) {}
                    d = c.firstChild || null;
                    if (!d) {
                        d = document.createElement(a);
                        for (attr in arguments[1]) d[attr == 'class' ? 'className' : attr] = arguments[1][attr]
                    }
                    if (d.tagName.toUpperCase() != a) d = c.getElementsByTagName(a)[0]
                }
            }
        if (arguments[2]) this._children(d, arguments[2]);
        return d
    },
    _text: function (a) {
        return document.createTextNode(a)
    },
    ATTR_MAP: {
        'className': 'class',
        'htmlFor': 'for'
    },
    _attributes: function (a) {
        var b = [];
        for (attribute in a) b.push((attribute in this.ATTR_MAP ? this.ATTR_MAP[attribute] : attribute) + '="' + a[attribute].toString().escapeHTML().gsub(/"/, '&quot;') + '"');
        return b.join(" ")
    },
    _children: function (a, b) {
        if (b.tagName) {
            a.appendChild(b);
            return
        }
        if (typeof b == 'object') {
            b.flatten().each(function (e) {
                if (typeof e == 'object') a.appendChild(e);
                else if (Builder._isStringOrNumber(e)) a.appendChild(Builder._text(e))
            })
        } else if (Builder._isStringOrNumber(b)) a.appendChild(Builder._text(b))
    },
    _isStringOrNumber: function (a) {
        return (typeof a == 'string' || typeof a == 'number')
    },
    build: function (a) {
        var b = this.node('div');
        $(b).update(a.strip());
        return b.down()
    },
    dump: function (b) {
        if (typeof b != 'object' && typeof b != 'function') b = window;
        var c = ("A ABBR ACRONYM ADDRESS APPLET AREA B BASE BASEFONT BDO BIG BLOCKQUOTE BODY " + "BR BUTTON CAPTION CENTER CITE CODE COL COLGROUP DD DEL DFN DIR DIV DL DT EM FIELDSET " + "FONT FORM FRAME FRAMESET H1 H2 H3 H4 H5 H6 HEAD HR HTML I IFRAME IMG INPUT INS ISINDEX " + "KBD LABEL LEGEND LI LINK MAP MENU META NOFRAMES NOSCRIPT OBJECT OL OPTGROUP OPTION P " + "PARAM PRE Q S SAMP SCRIPT SELECT SMALL SPAN STRIKE STRONG STYLE SUB SUP TABLE TBODY TD " + "TEXTAREA TFOOT TH THEAD TITLE TR TT U UL VAR").split(/\s+/);
        c.each(function (a) {
            b[a] = function () {
                return Builder.node.apply(Builder, [a].concat($A(arguments)))
            }
        })
    }
};
String.prototype.parseColor = function () {
    var a = '#';
    if (this.slice(0, 4) == 'rgb(') {
        var b = this.slice(4, this.length - 1).split(',');
        var i = 0;
        do {
            a += parseInt(b[i]).toColorPart()
        } while (++i < 3)
    } else {
        if (this.slice(0, 1) == '#') {
            if (this.length == 4)
                for (var i = 1; i < 4; i++) a += (this.charAt(i) + this.charAt(i)).toLowerCase();
            if (this.length == 7) a = this.toLowerCase()
        }
    }
    return (a.length == 7 ? a : (arguments[0] || this))
};
Element.collectTextNodes = function (b) {
    return $A($(b).childNodes).collect(function (a) {
        return (a.nodeType == 3 ? a.nodeValue : (a.hasChildNodes() ? Element.collectTextNodes(a) : ''))
    }).flatten().join('')
};
Element.collectTextNodesIgnoreClass = function (b, c) {
    return $A($(b).childNodes).collect(function (a) {
        return (a.nodeType == 3 ? a.nodeValue : ((a.hasChildNodes() && !Element.hasClassName(a, c)) ? Element.collectTextNodesIgnoreClass(a, c) : ''))
    }).flatten().join('')
};
Element.setContentZoom = function (a, b) {
    a = $(a);
    a.setStyle({
        fontSize: (b / 100) + 'em'
    });
    if (Prototype.Browser.WebKit) window.scrollBy(0, 0);
    return a
};
Element.getInlineOpacity = function (a) {
    return $(a).style.opacity || ''
};
Element.forceRerendering = function (a) {
    try {
        a = $(a);
        var n = document.createTextNode(' ');
        a.appendChild(n);
        a.removeChild(n)
    } catch (e) {}
};
var Effect = {
    _elementDoesNotExistError: {
        name: 'ElementDoesNotExistError',
        message: 'The specified DOM element does not exist, but is required for this effect to operate'
    },
    Transitions: {
        linear: Prototype.K,
        sinoidal: function (a) {
            return (-Math.cos(a * Math.PI) / 2) + 0.5
        },
        reverse: function (a) {
            return 1 - a
        },
        flicker: function (a) {
            var a = ((-Math.cos(a * Math.PI) / 4) + 0.75) + Math.random() / 4;
            return a > 1 ? 1 : a
        },
        wobble: function (a) {
            return (-Math.cos(a * Math.PI * (9 * a)) / 2) + 0.5
        },
        pulse: function (a, b) {
            b = b || 5;
            return (((a % (1 / b)) * b).round() == 0 ? ((a * b * 2) - (a * b * 2).floor()) : 1 - ((a * b * 2) - (a * b * 2).floor()))
        },
        spring: function (a) {
            return 1 - (Math.cos(a * 4.5 * Math.PI) * Math.exp(-a * 6))
        },
        none: function (a) {
            return 0
        },
        full: function (a) {
            return 1
        }
    },
    DefaultOptions: {
        duration: 1.0,
        fps: 100,
        sync: false,
        from: 0.0,
        to: 1.0,
        delay: 0.0,
        queue: 'parallel'
    },
    tagifyText: function (c) {
        var d = 'position:relative';
        if (Prototype.Browser.IE) d += ';zoom:1';
        c = $(c);
        $A(c.childNodes).each(function (b) {
            if (b.nodeType == 3) {
                b.nodeValue.toArray().each(function (a) {
                    c.insertBefore(new Element('span', {
                        style: d
                    }).update(a == ' ' ? String.fromCharCode(160) : a), b)
                });
                Element.remove(b)
            }
        })
    },
    multiple: function (c, d) {
        var e;
        if (((typeof c == 'object') || Object.isFunction(c)) && (c.length)) e = c;
        else e = $(c).childNodes;
        var f = Object.extend({
            speed: 0.1,
            delay: 0.0
        }, arguments[2] || {});
        var g = f.delay;
        $A(e).each(function (a, b) {
            new d(a, Object.extend(f, {
                delay: b * f.speed + g
            }))
        })
    },
    PAIRS: {
        'slide': ['SlideDown', 'SlideUp'],
        'blind': ['BlindDown', 'BlindUp'],
        'appear': ['Appear', 'Fade']
    },
    toggle: function (a, b) {
        a = $(a);
        b = (b || 'appear').toLowerCase();
        var c = Object.extend({
            queue: {
                position: 'end',
                scope: (a.id || 'global'),
                limit: 1
            }
        }, arguments[2] || {});
        Effect[a.visible() ? Effect.PAIRS[b][1] : Effect.PAIRS[b][0]](a, c)
    }
};
Effect.DefaultOptions.transition = Effect.Transitions.sinoidal;
Effect.ScopedQueue = Class.create(Enumerable, {
    initialize: function () {
        this.effects = [];
        this.interval = null
    },
    _each: function (a) {
        this.effects._each(a)
    },
    add: function (a) {
        var b = new Date().getTime();
        var c = Object.isString(a.options.queue) ? a.options.queue : a.options.queue.position;
        switch (c) {
        case 'front':
            this.effects.findAll(function (e) {
                return e.state == 'idle'
            }).each(function (e) {
                e.startOn += a.finishOn;
                e.finishOn += a.finishOn
            });
            break;
        case 'with-last':
            b = this.effects.pluck('startOn').max() || b;
            break;
        case 'end':
            b = this.effects.pluck('finishOn').max() || b;
            break
        }
        a.startOn += b;
        a.finishOn += b;
        if (!a.options.queue.limit || (this.effects.length < a.options.queue.limit)) this.effects.push(a);
        if (!this.interval) this.interval = setInterval(this.loop.bind(this), 15)
    },
    remove: function (a) {
        this.effects = this.effects.reject(function (e) {
            return e == a
        });
        if (this.effects.length == 0) {
            clearInterval(this.interval);
            this.interval = null
        }
    },
    loop: function () {
        var a = new Date().getTime();
        for (var i = 0, len = this.effects.length; i < len; i++) this.effects[i] && this.effects[i].loop(a)
    }
});
Effect.Queues = {
    instances: $H(),
    get: function (a) {
        if (!Object.isString(a)) return a;
        return this.instances.get(a) || this.instances.set(a, new Effect.ScopedQueue())
    }
};
Effect.Queue = Effect.Queues.get('global');
Effect.Base = Class.create({
    position: null,
    start: function (c) {
        function codeForEvent(a, b) {
            return ((a[b + 'Internal'] ? 'this.options.' + b + 'Internal(this);' : '') + (a[b] ? 'this.options.' + b + '(this);' : ''))
        }
        if (c && c.transition === false) c.transition = Effect.Transitions.linear;
        this.options = Object.extend(Object.extend({}, Effect.DefaultOptions), c || {});
        this.currentFrame = 0;
        this.state = 'idle';
        this.startOn = this.options.delay * 1000;
        this.finishOn = this.startOn + (this.options.duration * 1000);
        this.fromToDelta = this.options.to - this.options.from;
        this.totalTime = this.finishOn - this.startOn;
        this.totalFrames = this.options.fps * this.options.duration;
        eval('this.render = function(pos){ ' + 'if (this.state=="idle"){this.state="running";' + codeForEvent(this.options, 'beforeSetup') + (this.setup ? 'this.setup();' : '') + codeForEvent(this.options, 'afterSetup') + '};if (this.state=="running"){' + 'pos=this.options.transition(pos)*' + this.fromToDelta + '+' + this.options.from + ';' + 'this.position=pos;' + codeForEvent(this.options, 'beforeUpdate') + (this.update ? 'this.update(pos);' : '') + codeForEvent(this.options, 'afterUpdate') + '}}');
        this.event('beforeStart');
        if (!this.options.sync) Effect.Queues.get(Object.isString(this.options.queue) ? 'global' : this.options.queue.scope).add(this)
    },
    loop: function (a) {
        if (a >= this.startOn) {
            if (a >= this.finishOn) {
                this.render(1.0);
                this.cancel();
                this.event('beforeFinish');
                if (this.finish) this.finish();
                this.event('afterFinish');
                return
            }
            var b = (a - this.startOn) / this.totalTime,
                frame = (b * this.totalFrames).round();
            if (frame > this.currentFrame) {
                this.render(b);
                this.currentFrame = frame
            }
        }
    },
    cancel: function () {
        if (!this.options.sync) Effect.Queues.get(Object.isString(this.options.queue) ? 'global' : this.options.queue.scope).remove(this);
        this.state = 'finished'
    },
    event: function (a) {
        if (this.options[a + 'Internal']) this.options[a + 'Internal'](this);
        if (this.options[a]) this.options[a](this)
    },
    inspect: function () {
        var a = $H();
        for (property in this)
            if (!Object.isFunction(this[property])) a.set(property, this[property]);
        return '#<Effect:' + a.inspect() + ',options:' + $H(this.options).inspect() + '>'
    }
});
Effect.Parallel = Class.create(Effect.Base, {
    initialize: function (a) {
        this.effects = a || [];
        this.start(arguments[1])
    },
    update: function (a) {
        this.effects.invoke('render', a)
    },
    finish: function (b) {
        this.effects.each(function (a) {
            a.render(1.0);
            a.cancel();
            a.event('beforeFinish');
            if (a.finish) a.finish(b);
            a.event('afterFinish')
        })
    }
});
Effect.Tween = Class.create(Effect.Base, {
    initialize: function (b, c, d) {
        b = Object.isString(b) ? $(b) : b;
        var e = $A(arguments),
            method = e.last(),
            options = e.length == 5 ? e[3] : null;
        this.method = Object.isFunction(method) ? method.bind(b) : Object.isFunction(b[method]) ? b[method].bind(b) : function (a) {
            b[method] = a
        };
        this.start(Object.extend({
            from: c,
            to: d
        }, options || {}))
    },
    update: function (a) {
        this.method(a)
    }
});
Effect.Event = Class.create(Effect.Base, {
    initialize: function () {
        this.start(Object.extend({
            duration: 0
        }, arguments[0] || {}))
    },
    update: Prototype.emptyFunction
});
Effect.Opacity = Class.create(Effect.Base, {
    initialize: function (a) {
        this.element = $(a);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) this.element.setStyle({
            zoom: 1
        });
        var b = Object.extend({
            from: this.element.getOpacity() || 0.0,
            to: 1.0
        }, arguments[1] || {});
        this.start(b)
    },
    update: function (a) {
        this.element.setOpacity(a)
    }
});
Effect.Move = Class.create(Effect.Base, {
    initialize: function (a) {
        this.element = $(a);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var b = Object.extend({
            x: 0,
            y: 0,
            mode: 'relative'
        }, arguments[1] || {});
        this.start(b)
    },
    setup: function () {
        this.element.makePositioned();
        this.originalLeft = parseFloat(this.element.getStyle('left') || '0');
        this.originalTop = parseFloat(this.element.getStyle('top') || '0');
        if (this.options.mode == 'absolute') {
            this.options.x = this.options.x - this.originalLeft;
            this.options.y = this.options.y - this.originalTop
        }
    },
    update: function (a) {
        this.element.setStyle({
            left: (this.options.x * a + this.originalLeft).round() + 'px',
            top: (this.options.y * a + this.originalTop).round() + 'px'
        })
    }
});
Effect.MoveBy = function (a, b, c) {
    return new Effect.Move(a, Object.extend({
        x: c,
        y: b
    }, arguments[3] || {}))
};
Effect.Scale = Class.create(Effect.Base, {
    initialize: function (a, b) {
        this.element = $(a);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var c = Object.extend({
            scaleX: true,
            scaleY: true,
            scaleContent: true,
            scaleFromCenter: false,
            scaleMode: 'box',
            scaleFrom: 100.0,
            scaleTo: b
        }, arguments[2] || {});
        this.start(c)
    },
    setup: function () {
        this.restoreAfterFinish = this.options.restoreAfterFinish || false;
        this.elementPositioning = this.element.getStyle('position');
        this.originalStyle = {};
        ['top', 'left', 'width', 'height', 'fontSize'].each(function (k) {
            this.originalStyle[k] = this.element.style[k]
        }.bind(this));
        this.originalTop = this.element.offsetTop;
        this.originalLeft = this.element.offsetLeft;
        var b = this.element.getStyle('font-size') || '100%';
        ['em', 'px', '%', 'pt'].each(function (a) {
            if (b.indexOf(a) > 0) {
                this.fontSize = parseFloat(b);
                this.fontSizeType = a
            }
        }.bind(this));
        this.factor = (this.options.scaleTo - this.options.scaleFrom) / 100;
        this.dims = null;
        if (this.options.scaleMode == 'box') this.dims = [this.element.offsetHeight, this.element.offsetWidth];
        if (/^content/.test(this.options.scaleMode)) this.dims = [this.element.scrollHeight, this.element.scrollWidth];
        if (!this.dims) this.dims = [this.options.scaleMode.originalHeight, this.options.scaleMode.originalWidth]
    },
    update: function (a) {
        var b = (this.options.scaleFrom / 100.0) + (this.factor * a);
        if (this.options.scaleContent && this.fontSize) this.element.setStyle({
            fontSize: this.fontSize * b + this.fontSizeType
        });
        this.setDimensions(this.dims[0] * b, this.dims[1] * b)
    },
    finish: function (a) {
        if (this.restoreAfterFinish) this.element.setStyle(this.originalStyle)
    },
    setDimensions: function (a, b) {
        var d = {};
        if (this.options.scaleX) d.width = b.round() + 'px';
        if (this.options.scaleY) d.height = a.round() + 'px';
        if (this.options.scaleFromCenter) {
            var c = (a - this.dims[0]) / 2;
            var e = (b - this.dims[1]) / 2;
            if (this.elementPositioning == 'absolute') {
                if (this.options.scaleY) d.top = this.originalTop - c + 'px';
                if (this.options.scaleX) d.left = this.originalLeft - e + 'px'
            } else {
                if (this.options.scaleY) d.top = -c + 'px';
                if (this.options.scaleX) d.left = -e + 'px'
            }
        }
        this.element.setStyle(d)
    }
});
Effect.Highlight = Class.create(Effect.Base, {
    initialize: function (a) {
        this.element = $(a);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var b = Object.extend({
            startcolor: '#ffff99'
        }, arguments[1] || {});
        this.start(b)
    },
    setup: function () {
        if (this.element.getStyle('display') == 'none') {
            this.cancel();
            return
        }
        this.oldStyle = {};
        if (!this.options.keepBackgroundImage) {
            this.oldStyle.backgroundImage = this.element.getStyle('background-image');
            this.element.setStyle({
                backgroundImage: 'none'
            })
        }
        if (!this.options.endcolor) this.options.endcolor = this.element.getStyle('background-color').parseColor('#ffffff');
        if (!this.options.restorecolor) this.options.restorecolor = this.element.getStyle('background-color');
        this._base = $R(0, 2).map(function (i) {
            return parseInt(this.options.startcolor.slice(i * 2 + 1, i * 2 + 3), 16)
        }.bind(this));
        this._delta = $R(0, 2).map(function (i) {
            return parseInt(this.options.endcolor.slice(i * 2 + 1, i * 2 + 3), 16) - this._base[i]
        }.bind(this))
    },
    update: function (a) {
        this.element.setStyle({
            backgroundColor: $R(0, 2).inject('#', function (m, v, i) {
                return m + ((this._base[i] + (this._delta[i] * a)).round().toColorPart())
            }.bind(this))
        })
    },
    finish: function () {
        this.element.setStyle(Object.extend(this.oldStyle, {
            backgroundColor: this.options.restorecolor
        }))
    }
});
Effect.ScrollTo = function (a) {
    var b = arguments[1] || {},
        scrollOffsets = document.viewport.getScrollOffsets(),
        elementOffsets = $(a).cumulativeOffset(),
        max = document.viewport.getScrollOffsets[0] - document.viewport.getHeight();
    if (b.offset) elementOffsets[1] += b.offset;
    return new Effect.Tween(null, scrollOffsets.top, elementOffsets[1] > max ? max : elementOffsets[1], b, function (p) {
        scrollTo(scrollOffsets.left, p.round())
    })
};
Effect.Fade = function (b) {
    b = $(b);
    var c = b.getInlineOpacity();
    var d = Object.extend({
        from: b.getOpacity() || 1.0,
        to: 0.0,
        afterFinishInternal: function (a) {
            if (a.options.to != 0) return;
            a.element.hide().setStyle({
                opacity: c
            })
        }
    }, arguments[1] || {});
    return new Effect.Opacity(b, d)
};
Effect.Appear = function (b) {
    b = $(b);
    var c = Object.extend({
        from: (b.getStyle('display') == 'none' ? 0.0 : b.getOpacity() || 0.0),
        to: 1.0,
        afterFinishInternal: function (a) {
            a.element.forceRerendering()
        },
        beforeSetup: function (a) {
            a.element.setOpacity(a.options.from).show()
        }
    }, arguments[1] || {});
    return new Effect.Opacity(b, c)
};
Effect.Puff = function (b) {
    b = $(b);
    var c = {
        opacity: b.getInlineOpacity(),
        position: b.getStyle('position'),
        top: b.style.top,
        left: b.style.left,
        width: b.style.width,
        height: b.style.height
    };
    return new Effect.Parallel([new Effect.Scale(b, 200, {
        sync: true,
        scaleFromCenter: true,
        scaleContent: true,
        restoreAfterFinish: true
    }), new Effect.Opacity(b, {
        sync: true,
        to: 0.0
    })], Object.extend({
        duration: 1.0,
        beforeSetupInternal: function (a) {
            Position.absolutize(a.effects[0].element)
        },
        afterFinishInternal: function (a) {
            a.effects[0].element.hide().setStyle(c)
        }
    }, arguments[1] || {}))
};
Effect.BlindUp = function (b) {
    b = $(b);
    b.makeClipping();
    return new Effect.Scale(b, 0, Object.extend({
        scaleContent: false,
        scaleX: false,
        restoreAfterFinish: true,
        afterFinishInternal: function (a) {
            a.element.hide().undoClipping()
        }
    }, arguments[1] || {}))
};
Effect.BlindDown = function (b) {
    b = $(b);
    var c = b.getDimensions();
    return new Effect.Scale(b, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: 0,
        scaleMode: {
            originalHeight: c.height,
            originalWidth: c.width
        },
        restoreAfterFinish: true,
        afterSetup: function (a) {
            a.element.makeClipping().setStyle({
                height: '0px'
            }).show()
        },
        afterFinishInternal: function (a) {
            a.element.undoClipping()
        }
    }, arguments[1] || {}))
};
Effect.SwitchOff = function (c) {
    c = $(c);
    var d = c.getInlineOpacity();
    return new Effect.Appear(c, Object.extend({
        duration: 0.4,
        from: 0,
        transition: Effect.Transitions.flicker,
        afterFinishInternal: function (b) {
            new Effect.Scale(b.element, 1, {
                duration: 0.3,
                scaleFromCenter: true,
                scaleX: false,
                scaleContent: false,
                restoreAfterFinish: true,
                beforeSetup: function (a) {
                    a.element.makePositioned().makeClipping()
                },
                afterFinishInternal: function (a) {
                    a.element.hide().undoClipping().undoPositioned().setStyle({
                        opacity: d
                    })
                }
            })
        }
    }, arguments[1] || {}))
};
Effect.DropOut = function (b) {
    b = $(b);
    var c = {
        top: b.getStyle('top'),
        left: b.getStyle('left'),
        opacity: b.getInlineOpacity()
    };
    return new Effect.Parallel([new Effect.Move(b, {
        x: 0,
        y: 100,
        sync: true
    }), new Effect.Opacity(b, {
        sync: true,
        to: 0.0
    })], Object.extend({
        duration: 0.5,
        beforeSetup: function (a) {
            a.effects[0].element.makePositioned()
        },
        afterFinishInternal: function (a) {
            a.effects[0].element.hide().undoPositioned().setStyle(c)
        }
    }, arguments[1] || {}))
};
Effect.Shake = function (g) {
    g = $(g);
    var h = Object.extend({
        distance: 20,
        duration: 0.5
    }, arguments[1] || {});
    var i = parseFloat(h.distance);
    var j = parseFloat(h.duration) / 10.0;
    var k = {
        top: g.getStyle('top'),
        left: g.getStyle('left')
    };
    return new Effect.Move(g, {
        x: i,
        y: 0,
        duration: j,
        afterFinishInternal: function (f) {
            new Effect.Move(f.element, {
                x: -i * 2,
                y: 0,
                duration: j * 2,
                afterFinishInternal: function (e) {
                    new Effect.Move(e.element, {
                        x: i * 2,
                        y: 0,
                        duration: j * 2,
                        afterFinishInternal: function (d) {
                            new Effect.Move(d.element, {
                                x: -i * 2,
                                y: 0,
                                duration: j * 2,
                                afterFinishInternal: function (c) {
                                    new Effect.Move(c.element, {
                                        x: i * 2,
                                        y: 0,
                                        duration: j * 2,
                                        afterFinishInternal: function (b) {
                                            new Effect.Move(b.element, {
                                                x: -i,
                                                y: 0,
                                                duration: j,
                                                afterFinishInternal: function (a) {
                                                    a.element.undoPositioned().setStyle(k)
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
};
Effect.SlideDown = function (b) {
    b = $(b).cleanWhitespace();
    var c = b.down().getStyle('bottom');
    var d = b.getDimensions();
    return new Effect.Scale(b, 100, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleFrom: window.opera ? 0 : 1,
        scaleMode: {
            originalHeight: d.height,
            originalWidth: d.width
        },
        restoreAfterFinish: true,
        afterSetup: function (a) {
            a.element.makePositioned();
            a.element.down().makePositioned();
            if (window.opera) a.element.setStyle({
                top: ''
            });
            a.element.makeClipping().setStyle({
                height: '0px'
            }).show()
        },
        afterUpdateInternal: function (a) {
            a.element.down().setStyle({
                bottom: (a.dims[0] - a.element.clientHeight) + 'px'
            })
        },
        afterFinishInternal: function (a) {
            a.element.undoClipping().undoPositioned();
            a.element.down().undoPositioned().setStyle({
                bottom: c
            })
        }
    }, arguments[1] || {}))
};
Effect.SlideUp = function (b) {
    b = $(b).cleanWhitespace();
    var c = b.down().getStyle('bottom');
    var d = b.getDimensions();
    return new Effect.Scale(b, window.opera ? 0 : 1, Object.extend({
        scaleContent: false,
        scaleX: false,
        scaleMode: 'box',
        scaleFrom: 100,
        scaleMode: {
            originalHeight: d.height,
            originalWidth: d.width
        },
        restoreAfterFinish: true,
        afterSetup: function (a) {
            a.element.makePositioned();
            a.element.down().makePositioned();
            if (window.opera) a.element.setStyle({
                top: ''
            });
            a.element.makeClipping().show()
        },
        afterUpdateInternal: function (a) {
            a.element.down().setStyle({
                bottom: (a.dims[0] - a.element.clientHeight) + 'px'
            })
        },
        afterFinishInternal: function (a) {
            a.element.hide().undoClipping().undoPositioned();
            a.element.down().undoPositioned().setStyle({
                bottom: c
            })
        }
    }, arguments[1] || {}))
};
Effect.Squish = function (b) {
    return new Effect.Scale(b, window.opera ? 1 : 0, {
        restoreAfterFinish: true,
        beforeSetup: function (a) {
            a.element.makeClipping()
        },
        afterFinishInternal: function (a) {
            a.element.hide().undoClipping()
        }
    })
};
Effect.Grow = function (c) {
    c = $(c);
    var d = Object.extend({
        direction: 'center',
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.full
    }, arguments[1] || {});
    var e = {
        top: c.style.top,
        left: c.style.left,
        height: c.style.height,
        width: c.style.width,
        opacity: c.getInlineOpacity()
    };
    var f = c.getDimensions();
    var g, initialMoveY;
    var h, moveY;
    switch (d.direction) {
    case 'top-left':
        g = initialMoveY = h = moveY = 0;
        break;
    case 'top-right':
        g = f.width;
        initialMoveY = moveY = 0;
        h = -f.width;
        break;
    case 'bottom-left':
        g = h = 0;
        initialMoveY = f.height;
        moveY = -f.height;
        break;
    case 'bottom-right':
        g = f.width;
        initialMoveY = f.height;
        h = -f.width;
        moveY = -f.height;
        break;
    case 'center':
        g = f.width / 2;
        initialMoveY = f.height / 2;
        h = -f.width / 2;
        moveY = -f.height / 2;
        break
    }
    return new Effect.Move(c, {
        x: g,
        y: initialMoveY,
        duration: 0.01,
        beforeSetup: function (a) {
            a.element.hide().makeClipping().makePositioned()
        },
        afterFinishInternal: function (b) {
            new Effect.Parallel([new Effect.Opacity(b.element, {
                sync: true,
                to: 1.0,
                from: 0.0,
                transition: d.opacityTransition
            }), new Effect.Move(b.element, {
                x: h,
                y: moveY,
                sync: true,
                transition: d.moveTransition
            }), new Effect.Scale(b.element, 100, {
                scaleMode: {
                    originalHeight: f.height,
                    originalWidth: f.width
                },
                sync: true,
                scaleFrom: window.opera ? 1 : 0,
                transition: d.scaleTransition,
                restoreAfterFinish: true
            })], Object.extend({
                beforeSetup: function (a) {
                    a.effects[0].element.setStyle({
                        height: '0px'
                    }).show()
                },
                afterFinishInternal: function (a) {
                    a.effects[0].element.undoClipping().undoPositioned().setStyle(e)
                }
            }, d))
        }
    })
};
Effect.Shrink = function (b) {
    b = $(b);
    var c = Object.extend({
        direction: 'center',
        moveTransition: Effect.Transitions.sinoidal,
        scaleTransition: Effect.Transitions.sinoidal,
        opacityTransition: Effect.Transitions.none
    }, arguments[1] || {});
    var d = {
        top: b.style.top,
        left: b.style.left,
        height: b.style.height,
        width: b.style.width,
        opacity: b.getInlineOpacity()
    };
    var e = b.getDimensions();
    var f, moveY;
    switch (c.direction) {
    case 'top-left':
        f = moveY = 0;
        break;
    case 'top-right':
        f = e.width;
        moveY = 0;
        break;
    case 'bottom-left':
        f = 0;
        moveY = e.height;
        break;
    case 'bottom-right':
        f = e.width;
        moveY = e.height;
        break;
    case 'center':
        f = e.width / 2;
        moveY = e.height / 2;
        break
    }
    return new Effect.Parallel([new Effect.Opacity(b, {
        sync: true,
        to: 0.0,
        from: 1.0,
        transition: c.opacityTransition
    }), new Effect.Scale(b, window.opera ? 1 : 0, {
        sync: true,
        transition: c.scaleTransition,
        restoreAfterFinish: true
    }), new Effect.Move(b, {
        x: f,
        y: moveY,
        sync: true,
        transition: c.moveTransition
    })], Object.extend({
        beforeStartInternal: function (a) {
            a.effects[0].element.makePositioned().makeClipping()
        },
        afterFinishInternal: function (a) {
            a.effects[0].element.hide().undoClipping().undoPositioned().setStyle(d)
        }
    }, c))
};
Effect.Pulsate = function (b) {
    b = $(b);
    var c = arguments[1] || {};
    var d = b.getInlineOpacity();
    var e = c.transition || Effect.Transitions.sinoidal;
    var f = function (a) {
        return e(1 - Effect.Transitions.pulse(a, c.pulses))
    };
    f.bind(e);
    return new Effect.Opacity(b, Object.extend(Object.extend({
        duration: 2.0,
        from: 0,
        afterFinishInternal: function (a) {
            a.element.setStyle({
                opacity: d
            })
        }
    }, c), {
        transition: f
    }))
};
Effect.Fold = function (c) {
    c = $(c);
    var d = {
        top: c.style.top,
        left: c.style.left,
        width: c.style.width,
        height: c.style.height
    };
    c.makeClipping();
    return new Effect.Scale(c, 5, Object.extend({
        scaleContent: false,
        scaleX: false,
        afterFinishInternal: function (b) {
            new Effect.Scale(c, 1, {
                scaleContent: false,
                scaleY: false,
                afterFinishInternal: function (a) {
                    a.element.hide().undoClipping().setStyle(d)
                }
            })
        }
    }, arguments[1] || {}))
};
Effect.Morph = Class.create(Effect.Base, {
    initialize: function (c) {
        this.element = $(c);
        if (!this.element) throw (Effect._elementDoesNotExistError);
        var d = Object.extend({
            style: {}
        }, arguments[1] || {});
        if (!Object.isString(d.style)) this.style = $H(d.style);
        else {
            if (d.style.include(':')) this.style = d.style.parseStyle();
            else {
                this.element.addClassName(d.style);
                this.style = $H(this.element.getStyles());
                this.element.removeClassName(d.style);
                var e = this.element.getStyles();
                this.style = this.style.reject(function (a) {
                    return a.value == e[a.key]
                });
                d.afterFinishInternal = function (b) {
                    b.element.addClassName(b.options.style);
                    b.transforms.each(function (a) {
                        b.element.style[a.style] = ''
                    })
                }
            }
        }
        this.start(d)
    },
    setup: function () {
        function parseColor(a) {
            if (!a || ['rgba(0, 0, 0, 0)', 'transparent'].include(a)) a = '#ffffff';
            a = a.parseColor();
            return $R(0, 2).map(function (i) {
                return parseInt(a.slice(i * 2 + 1, i * 2 + 3), 16)
            })
        }
        this.transforms = this.style.map(function (a) {
            var b = a[0],
                value = a[1],
                unit = null;
            if (value.parseColor('#zzzzzz') != '#zzzzzz') {
                value = value.parseColor();
                unit = 'color'
            } else if (b == 'opacity') {
                value = parseFloat(value);
                if (Prototype.Browser.IE && (!this.element.currentStyle.hasLayout)) this.element.setStyle({
                    zoom: 1
                })
            } else if (Element.CSS_LENGTH.test(value)) {
                var c = value.match(/^([\+\-]?[0-9\.]+)(.*)$/);
                value = parseFloat(c[1]);
                unit = (c.length == 3) ? c[2] : null
            }
            var d = this.element.getStyle(b);
            return {
                style: b.camelize(),
                originalValue: unit == 'color' ? parseColor(d) : parseFloat(d || 0),
                targetValue: unit == 'color' ? parseColor(value) : value,
                unit: unit
            }
        }.bind(this)).reject(function (a) {
            return ((a.originalValue == a.targetValue) || (a.unit != 'color' && (isNaN(a.originalValue) || isNaN(a.targetValue))))
        })
    },
    update: function (a) {
        var b = {},
            transform, i = this.transforms.length;
        while (i--) b[(transform = this.transforms[i]).style] = transform.unit == 'color' ? '#' + (Math.round(transform.originalValue[0] + (transform.targetValue[0] - transform.originalValue[0]) * a)).toColorPart() + (Math.round(transform.originalValue[1] + (transform.targetValue[1] - transform.originalValue[1]) * a)).toColorPart() + (Math.round(transform.originalValue[2] + (transform.targetValue[2] - transform.originalValue[2]) * a)).toColorPart() : (transform.originalValue + (transform.targetValue - transform.originalValue) * a).toFixed(3) + (transform.unit === null ? '' : transform.unit);
        this.element.setStyle(b, true)
    }
});
Effect.Transform = Class.create({
    initialize: function (a) {
        this.tracks = [];
        this.options = arguments[1] || {};
        this.addTracks(a)
    },
    addTracks: function (c) {
        c.each(function (a) {
            a = $H(a);
            var b = a.values().first();
            this.tracks.push($H({
                ids: a.keys().first(),
                effect: Effect.Morph,
                options: {
                    style: b
                }
            }))
        }.bind(this));
        return this
    },
    play: function () {
        return new Effect.Parallel(this.tracks.map(function (a) {
            var b = a.get('ids'),
                effect = a.get('effect'),
                options = a.get('options');
            var c = [$(b) || $$(b)].flatten();
            return c.map(function (e) {
                return new effect(e, Object.extend({
                    sync: true
                }, options))
            })
        }).flatten(), this.options)
    }
});
Element.CSS_PROPERTIES = $w('backgroundColor backgroundPosition borderBottomColor borderBottomStyle ' + 'borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth ' + 'borderRightColor borderRightStyle borderRightWidth borderSpacing ' + 'borderTopColor borderTopStyle borderTopWidth bottom clip color ' + 'fontSize fontWeight height left letterSpacing lineHeight ' + 'marginBottom marginLeft marginRight marginTop markerOffset maxHeight ' + 'maxWidth minHeight minWidth opacity outlineColor outlineOffset ' + 'outlineWidth paddingBottom paddingLeft paddingRight paddingTop ' + 'right textIndent top width wordSpacing zIndex');
Element.CSS_LENGTH = /^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;
String.__parseStyleElement = document.createElement('div');
String.prototype.parseStyle = function () {
    var b, styleRules = $H();
    if (Prototype.Browser.WebKit) b = new Element('div', {
        style: this
    }).style;
    else {
        String.__parseStyleElement.innerHTML = '<div style="' + this + '"></div>';
        b = String.__parseStyleElement.childNodes[0].style
    }
    Element.CSS_PROPERTIES.each(function (a) {
        if (b[a]) styleRules.set(a, b[a])
    });
    if (Prototype.Browser.IE && this.include('opacity')) styleRules.set('opacity', this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]);
    return styleRules
};
if (document.defaultView && document.defaultView.getComputedStyle) {
    Element.getStyles = function (c) {
        var d = document.defaultView.getComputedStyle($(c), null);
        return Element.CSS_PROPERTIES.inject({}, function (a, b) {
            a[b] = d[b];
            return a
        })
    }
} else {
    Element.getStyles = function (c) {
        c = $(c);
        var d = c.currentStyle,
            styles;
        styles = Element.CSS_PROPERTIES.inject({}, function (a, b) {
            a[b] = d[b];
            return a
        });
        if (!styles.opacity) styles.opacity = c.getOpacity();
        return styles
    }
}
Effect.Methods = {
    morph: function (a, b) {
        a = $(a);
        new Effect.Morph(a, Object.extend({
            style: b
        }, arguments[2] || {}));
        return a
    },
    visualEffect: function (a, b, c) {
        a = $(a);
        var s = b.dasherize().camelize(),
            klass = s.charAt(0).toUpperCase() + s.substring(1);
        new Effect[klass](a, c);
        return a
    },
    highlight: function (a, b) {
        a = $(a);
        new Effect.Highlight(a, b);
        return a
    }
};
$w('fade appear grow shrink fold blindUp blindDown slideUp slideDown ' + 'pulsate shake puff squish switchOff dropOut').each(function (c) {
    Effect.Methods[c] = function (a, b) {
        a = $(a);
        Effect[c.charAt(0).toUpperCase() + c.substring(1)](a, b);
        return a
    }
});
$w('getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles').each(function (f) {
    Effect.Methods[f] = Element[f]
});
Element.addMethods(Effect.Methods);
if (Object.isUndefined(Effect)) throw ("dragdrop.js requires including script.aculo.us' effects.js library");
var Droppables = {
    drops: [],
    remove: function (a) {
        this.drops = this.drops.reject(function (d) {
            return d.element == $(a)
        })
    },
    add: function (a) {
        a = $(a);
        var b = Object.extend({
            greedy: true,
            hoverclass: null,
            tree: false
        }, arguments[1] || {});
        if (b.containment) {
            b._containers = [];
            var d = b.containment;
            if (Object.isArray(d)) {
                d.each(function (c) {
                    b._containers.push($(c))
                })
            } else {
                b._containers.push($(d))
            }
        }
        if (b.accept) b.accept = [b.accept].flatten();
        Element.makePositioned(a);
        b.element = a;
        this.drops.push(b)
    },
    findDeepestChild: function (a) {
        deepest = a[0];
        for (i = 1; i < a.length; ++i)
            if (Element.isParent(a[i].element, deepest.element)) deepest = a[i];
        return deepest
    },
    isContained: function (a, b) {
        var d;
        if (b.tree) {
            d = a.treeNode
        } else {
            d = a.parentNode
        }
        return b._containers.detect(function (c) {
            return d == c
        })
    },
    isAffected: function (a, b, c) {
        return ((c.element != b) && ((!c._containers) || this.isContained(b, c)) && ((!c.accept) || (Element.classNames(b).detect(function (v) {
            return c.accept.include(v)
        }))) && Position.within(c.element, a[0], a[1]))
    },
    deactivate: function (a) {
        if (a.hoverclass) Element.removeClassName(a.element, a.hoverclass);
        this.last_active = null
    },
    activate: function (a) {
        if (a.hoverclass) Element.addClassName(a.element, a.hoverclass);
        this.last_active = a
    },
    show: function (b, c) {
        if (!this.drops.length) return;
        var d, affected = [];
        this.drops.each(function (a) {
            if (Droppables.isAffected(b, c, a)) affected.push(a)
        });
        if (affected.length > 0) d = Droppables.findDeepestChild(affected);
        if (this.last_active && this.last_active != d) this.deactivate(this.last_active);
        if (d) {
            Position.within(d.element, b[0], b[1]);
            if (d.onHover) d.onHover(c, d.element, Position.overlap(d.overlap, d.element));
            if (d != this.last_active) Droppables.activate(d)
        }
    },
    fire: function (a, b) {
        if (!this.last_active) return;
        Position.prepare();
        if (this.isAffected([Event.pointerX(a), Event.pointerY(a)], b, this.last_active))
            if (this.last_active.onDrop) {
                this.last_active.onDrop(b, this.last_active.element, a);
                return true
            }
    },
    reset: function () {
        if (this.last_active) this.deactivate(this.last_active)
    }
};
var Draggables = {
    drags: [],
    observers: [],
    register: function (a) {
        if (this.drags.length == 0) {
            this.eventMouseUp = this.endDrag.bindAsEventListener(this);
            this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
            this.eventKeypress = this.keyPress.bindAsEventListener(this);
            Event.observe(document, "mouseup", this.eventMouseUp);
            Event.observe(document, "mousemove", this.eventMouseMove);
            Event.observe(document, "keypress", this.eventKeypress)
        }
        this.drags.push(a)
    },
    unregister: function (a) {
        this.drags = this.drags.reject(function (d) {
            return d == a
        });
        if (this.drags.length == 0) {
            Event.stopObserving(document, "mouseup", this.eventMouseUp);
            Event.stopObserving(document, "mousemove", this.eventMouseMove);
            Event.stopObserving(document, "keypress", this.eventKeypress)
        }
    },
    activate: function (a) {
        if (a.options.delay) {
            this._timeout = setTimeout(function () {
                Draggables._timeout = null;
                window.focus();
                Draggables.activeDraggable = a
            }.bind(this), a.options.delay)
        } else {
            window.focus();
            this.activeDraggable = a
        }
    },
    deactivate: function () {
        this.activeDraggable = null
    },
    updateDrag: function (a) {
        if (!this.activeDraggable) return;
        var b = [Event.pointerX(a), Event.pointerY(a)];
        if (this._lastPointer && (this._lastPointer.inspect() == b.inspect())) return;
        this._lastPointer = b;
        this.activeDraggable.updateDrag(a, b)
    },
    endDrag: function (a) {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null
        }
        if (!this.activeDraggable) return;
        this._lastPointer = null;
        this.activeDraggable.endDrag(a);
        this.activeDraggable = null
    },
    keyPress: function (a) {
        if (this.activeDraggable) this.activeDraggable.keyPress(a)
    },
    addObserver: function (a) {
        this.observers.push(a);
        this._cacheObserverCallbacks()
    },
    removeObserver: function (a) {
        this.observers = this.observers.reject(function (o) {
            return o.element == a
        });
        this._cacheObserverCallbacks()
    },
    notify: function (a, b, c) {
        if (this[a + 'Count'] > 0) this.observers.each(function (o) {
            if (o[a]) o[a](a, b, c)
        });
        if (b.options[a]) b.options[a](b, c)
    },
    _cacheObserverCallbacks: function () {
        ['onStart', 'onEnd', 'onDrag'].each(function (a) {
            Draggables[a + 'Count'] = Draggables.observers.select(function (o) {
                return o[a]
            }).length
        })
    }
};
var Draggable = Class.create({
    initialize: function (e) {
        var f = {
            handle: false,
            reverteffect: function (a, b, c) {
                var d = Math.sqrt(Math.abs(b ^ 2) + Math.abs(c ^ 2)) * 0.02;
                new Effect.Move(a, {
                    x: -c,
                    y: -b,
                    duration: d,
                    queue: {
                        scope: '_draggable',
                        position: 'end'
                    }
                })
            },
            endeffect: function (a) {
                var b = Object.isNumber(a._opacity) ? a._opacity : 1.0;
                new Effect.Opacity(a, {
                    duration: 0.2,
                    from: 0.7,
                    to: b,
                    queue: {
                        scope: '_draggable',
                        position: 'end'
                    },
                    afterFinish: function () {
                        Draggable._dragging[a] = false
                    }
                })
            },
            zindex: 1000,
            revert: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            snap: false,
            delay: 0
        };
        if (!arguments[1] || Object.isUndefined(arguments[1].endeffect)) Object.extend(f, {
            starteffect: function (a) {
                a._opacity = Element.getOpacity(a);
                Draggable._dragging[a] = true;
                new Effect.Opacity(a, {
                    duration: 0.2,
                    from: a._opacity,
                    to: 0.7
                })
            }
        });
        var g = Object.extend(f, arguments[1] || {});
        this.element = $(e);
        if (g.handle && Object.isString(g.handle)) this.handle = this.element.down('.' + g.handle, 0);
        if (!this.handle) this.handle = $(g.handle);
        if (!this.handle) this.handle = this.element;
        if (g.scroll && !g.scroll.scrollTo && !g.scroll.outerHTML) {
            g.scroll = $(g.scroll);
            this._isScrollChild = Element.childOf(this.element, g.scroll)
        }
        Element.makePositioned(this.element);
        this.options = g;
        this.dragging = false;
        this.eventMouseDown = this.initDrag.bindAsEventListener(this);
        Event.observe(this.handle, "mousedown", this.eventMouseDown);
        Draggables.register(this)
    },
    destroy: function () {
        Event.stopObserving(this.handle, "mousedown", this.eventMouseDown);
        Draggables.unregister(this)
    },
    currentDelta: function () {
        return ([parseInt(Element.getStyle(this.element, 'left') || '0'), parseInt(Element.getStyle(this.element, 'top') || '0')])
    },
    initDrag: function (a) {
        if (!Object.isUndefined(Draggable._dragging[this.element]) && Draggable._dragging[this.element]) return;
        if (Event.isLeftClick(a)) {
            var b = Event.element(a);
            if ((tag_name = b.tagName.toUpperCase()) && (tag_name == 'INPUT' || tag_name == 'SELECT' || tag_name == 'OPTION' || tag_name == 'BUTTON' || tag_name == 'TEXTAREA')) return;
            var c = [Event.pointerX(a), Event.pointerY(a)];
            var d = Position.cumulativeOffset(this.element);
            this.offset = [0, 1].map(function (i) {
                return (c[i] - d[i])
            });
            Draggables.activate(this);
            Event.stop(a)
        }
    },
    startDrag: function (a) {
        this.dragging = true;
        if (!this.delta) this.delta = this.currentDelta();
        if (this.options.zindex) {
            this.originalZ = parseInt(Element.getStyle(this.element, 'z-index') || 0);
            this.element.style.zIndex = this.options.zindex
        }
        if (this.options.ghosting) {
            this._clone = this.element.cloneNode(true);
            this._originallyAbsolute = (this.element.getStyle('position') == 'absolute');
            if (!this._originallyAbsolute) Position.absolutize(this.element);
            this.element.parentNode.insertBefore(this._clone, this.element)
        }
        if (this.options.scroll) {
            if (this.options.scroll == window) {
                var b = this._getWindowScroll(this.options.scroll);
                this.originalScrollLeft = b.left;
                this.originalScrollTop = b.top
            } else {
                this.originalScrollLeft = this.options.scroll.scrollLeft;
                this.originalScrollTop = this.options.scroll.scrollTop
            }
        }
        Draggables.notify('onStart', this, a);
        if (this.options.starteffect) this.options.starteffect(this.element)
    },
    updateDrag: function (a, b) {
        if (!this.dragging) this.startDrag(a);
        if (!this.options.quiet) {
            Position.prepare();
            Droppables.show(b, this.element)
        }
        Draggables.notify('onDrag', this, a);
        this.draw(b);
        if (this.options.change) this.options.change(this);
        if (this.options.scroll) {
            this.stopScrolling();
            var p;
            if (this.options.scroll == window) {
                with(this._getWindowScroll(this.options.scroll)) {
                    p = [left, top, left + width, top + height]
                }
            } else {
                p = Position.page(this.options.scroll);
                p[0] += this.options.scroll.scrollLeft + Position.deltaX;
                p[1] += this.options.scroll.scrollTop + Position.deltaY;
                p.push(p[0] + this.options.scroll.offsetWidth);
                p.push(p[1] + this.options.scroll.offsetHeight)
            }
            var c = [0, 0];
            if (b[0] < (p[0] + this.options.scrollSensitivity)) c[0] = b[0] - (p[0] + this.options.scrollSensitivity);
            if (b[1] < (p[1] + this.options.scrollSensitivity)) c[1] = b[1] - (p[1] + this.options.scrollSensitivity);
            if (b[0] > (p[2] - this.options.scrollSensitivity)) c[0] = b[0] - (p[2] - this.options.scrollSensitivity);
            if (b[1] > (p[3] - this.options.scrollSensitivity)) c[1] = b[1] - (p[3] - this.options.scrollSensitivity);
            this.startScrolling(c)
        }
        if (Prototype.Browser.WebKit) window.scrollBy(0, 0);
        Event.stop(a)
    },
    finishDrag: function (a, b) {
        this.dragging = false;
        if (this.options.quiet) {
            Position.prepare();
            var c = [Event.pointerX(a), Event.pointerY(a)];
            Droppables.show(c, this.element)
        }
        if (this.options.ghosting) {
            if (!this._originallyAbsolute) Position.relativize(this.element);
            delete this._originallyAbsolute;
            Element.remove(this._clone);
            this._clone = null
        }
        var e = false;
        if (b) {
            e = Droppables.fire(a, this.element);
            if (!e) e = false
        }
        if (e && this.options.onDropped) this.options.onDropped(this.element);
        Draggables.notify('onEnd', this, a);
        var f = this.options.revert;
        if (f && Object.isFunction(f)) f = f(this.element);
        var d = this.currentDelta();
        if (f && this.options.reverteffect) {
            if (e == 0 || f != 'failure') this.options.reverteffect(this.element, d[1] - this.delta[1], d[0] - this.delta[0])
        } else {
            this.delta = d
        } if (this.options.zindex) this.element.style.zIndex = this.originalZ;
        if (this.options.endeffect) this.options.endeffect(this.element);
        Draggables.deactivate(this);
        Droppables.reset()
    },
    keyPress: function (a) {
        if (a.keyCode != Event.KEY_ESC) return;
        this.finishDrag(a, false);
        Event.stop(a)
    },
    endDrag: function (a) {
        if (!this.dragging) return;
        this.stopScrolling();
        this.finishDrag(a, true);
        Event.stop(a)
    },
    draw: function (a) {
        var b = Position.cumulativeOffset(this.element);
        if (this.options.ghosting) {
            var r = Position.realOffset(this.element);
            b[0] += r[0] - Position.deltaX;
            b[1] += r[1] - Position.deltaY
        }
        var d = this.currentDelta();
        b[0] -= d[0];
        b[1] -= d[1];
        if (this.options.scroll && (this.options.scroll != window && this._isScrollChild)) {
            b[0] -= this.options.scroll.scrollLeft - this.originalScrollLeft;
            b[1] -= this.options.scroll.scrollTop - this.originalScrollTop
        }
        var p = [0, 1].map(function (i) {
            return (a[i] - b[i] - this.offset[i])
        }.bind(this));
        if (this.options.snap) {
            if (Object.isFunction(this.options.snap)) {
                p = this.options.snap(p[0], p[1], this)
            } else {
                if (Object.isArray(this.options.snap)) {
                    p = p.map(function (v, i) {
                        return (v / this.options.snap[i]).round() * this.options.snap[i]
                    }.bind(this))
                } else {
                    p = p.map(function (v) {
                        return (v / this.options.snap).round() * this.options.snap
                    }.bind(this))
                }
            }
        }
        var c = this.element.style;
        if ((!this.options.constraint) || (this.options.constraint == 'horizontal')) c.left = p[0] + "px";
        if ((!this.options.constraint) || (this.options.constraint == 'vertical')) c.top = p[1] + "px";
        if (c.visibility == "hidden") c.visibility = ""
    },
    stopScrolling: function () {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
            Draggables._lastScrollPointer = null
        }
    },
    startScrolling: function (a) {
        if (!(a[0] || a[1])) return;
        this.scrollSpeed = [a[0] * this.options.scrollSpeed, a[1] * this.options.scrollSpeed];
        this.lastScrolled = new Date();
        this.scrollInterval = setInterval(this.scroll.bind(this), 10)
    },
    scroll: function () {
        var a = new Date();
        var b = a - this.lastScrolled;
        this.lastScrolled = a;
        if (this.options.scroll == window) {
            with(this._getWindowScroll(this.options.scroll)) {
                if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
                    var d = b / 1000;
                    this.options.scroll.scrollTo(left + d * this.scrollSpeed[0], top + d * this.scrollSpeed[1])
                }
            }
        } else {
            this.options.scroll.scrollLeft += this.scrollSpeed[0] * b / 1000;
            this.options.scroll.scrollTop += this.scrollSpeed[1] * b / 1000
        }
        Position.prepare();
        Droppables.show(Draggables._lastPointer, this.element);
        Draggables.notify('onDrag', this);
        if (this._isScrollChild) {
            Draggables._lastScrollPointer = Draggables._lastScrollPointer || $A(Draggables._lastPointer);
            Draggables._lastScrollPointer[0] += this.scrollSpeed[0] * b / 1000;
            Draggables._lastScrollPointer[1] += this.scrollSpeed[1] * b / 1000;
            if (Draggables._lastScrollPointer[0] < 0) Draggables._lastScrollPointer[0] = 0;
            if (Draggables._lastScrollPointer[1] < 0) Draggables._lastScrollPointer[1] = 0;
            this.draw(Draggables._lastScrollPointer)
        }
        if (this.options.change) this.options.change(this)
    },
    _getWindowScroll: function (w) {
        var T, L, W, H;
        with(w.document) {
            if (w.document.documentElement && documentElement.scrollTop) {
                T = documentElement.scrollTop;
                L = documentElement.scrollLeft
            } else if (w.document.body) {
                T = body.scrollTop;
                L = body.scrollLeft
            }
            if (w.innerWidth) {
                W = w.innerWidth;
                H = w.innerHeight
            } else if (w.document.documentElement && documentElement.clientWidth) {
                W = documentElement.clientWidth;
                H = documentElement.clientHeight
            } else {
                W = body.offsetWidth;
                H = body.offsetHeight
            }
        }
        return {
            top: T,
            left: L,
            width: W,
            height: H
        }
    }
});
Draggable._dragging = {};
var SortableObserver = Class.create({
    initialize: function (a, b) {
        this.element = $(a);
        this.observer = b;
        this.lastValue = Sortable.serialize(this.element)
    },
    onStart: function () {
        this.lastValue = Sortable.serialize(this.element)
    },
    onEnd: function () {
        Sortable.unmark();
        if (this.lastValue != Sortable.serialize(this.element)) this.observer(this.element)
    }
});
var Sortable = {
    SERIALIZE_RULE: /^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,
    sortables: {},
    _findRootElement: function (a) {
        while (a.tagName.toUpperCase() != "BODY") {
            if (a.id && Sortable.sortables[a.id]) return a;
            a = a.parentNode
        }
    },
    options: function (a) {
        a = Sortable._findRootElement($(a));
        if (!a) return;
        return Sortable.sortables[a.id]
    },
    destroy: function (a) {
        var s = Sortable.options(a);
        if (s) {
            Draggables.removeObserver(s.element);
            s.droppables.each(function (d) {
                Droppables.remove(d)
            });
            s.draggables.invoke('destroy');
            delete Sortable.sortables[s.element.id]
        }
    },
    create: function (b) {
        b = $(b);
        var c = Object.extend({
            element: b,
            tag: 'li',
            dropOnEmpty: false,
            tree: false,
            treeTag: 'ul',
            overlap: 'vertical',
            constraint: 'vertical',
            containment: b,
            handle: false,
            only: false,
            delay: 0,
            hoverclass: null,
            ghosting: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            format: this.SERIALIZE_RULE,
            elements: false,
            handles: false,
            onChange: Prototype.emptyFunction,
            onUpdate: Prototype.emptyFunction
        }, arguments[1] || {});
        this.destroy(b);
        var d = {
            revert: true,
            quiet: c.quiet,
            scroll: c.scroll,
            scrollSpeed: c.scrollSpeed,
            scrollSensitivity: c.scrollSensitivity,
            delay: c.delay,
            ghosting: c.ghosting,
            constraint: c.constraint,
            handle: c.handle
        };
        if (c.starteffect) d.starteffect = c.starteffect;
        if (c.reverteffect) d.reverteffect = c.reverteffect;
        else if (c.ghosting) d.reverteffect = function (a) {
            a.style.top = 0;
            a.style.left = 0
        };
        if (c.endeffect) d.endeffect = c.endeffect;
        if (c.zindex) d.zindex = c.zindex;
        var f = {
            overlap: c.overlap,
            containment: c.containment,
            tree: c.tree,
            hoverclass: c.hoverclass,
            onHover: Sortable.onHover
        };
        var g = {
            onHover: Sortable.onEmptyHover,
            overlap: c.overlap,
            containment: c.containment,
            hoverclass: c.hoverclass
        };
        Element.cleanWhitespace(b);
        c.draggables = [];
        c.droppables = [];
        if (c.dropOnEmpty || c.tree) {
            Droppables.add(b, g);
            c.droppables.push(b)
        }(c.elements || this.findElements(b, c) || []).each(function (e, i) {
            var a = c.handles ? $(c.handles[i]) : (c.handle ? $(e).select('.' + c.handle)[0] : e);
            c.draggables.push(new Draggable(e, Object.extend(d, {
                handle: a
            })));
            Droppables.add(e, f);
            if (c.tree) e.treeNode = b;
            c.droppables.push(e)
        });
        if (c.tree) {
            (Sortable.findTreeElements(b, c) || []).each(function (e) {
                Droppables.add(e, g);
                e.treeNode = b;
                c.droppables.push(e)
            })
        }
        this.sortables[b.id] = c;
        Draggables.addObserver(new SortableObserver(b, c.onUpdate))
    },
    findElements: function (a, b) {
        return Element.findChildren(a, b.only, b.tree ? true : false, b.tag)
    },
    findTreeElements: function (a, b) {
        return Element.findChildren(a, b.only, b.tree ? true : false, b.treeTag)
    },
    onHover: function (a, b, c) {
        if (Element.isParent(b, a)) return;
        if (c > .33 && c < .66 && Sortable.options(b).tree) {
            return
        } else if (c > 0.5) {
            Sortable.mark(b, 'before');
            if (b.previousSibling != a) {
                var d = a.parentNode;
                a.style.visibility = "hidden";
                b.parentNode.insertBefore(a, b);
                if (b.parentNode != d) Sortable.options(d).onChange(a);
                Sortable.options(b.parentNode).onChange(a)
            }
        } else {
            Sortable.mark(b, 'after');
            var e = b.nextSibling || null;
            if (e != a) {
                var d = a.parentNode;
                a.style.visibility = "hidden";
                b.parentNode.insertBefore(a, e);
                if (b.parentNode != d) Sortable.options(d).onChange(a);
                Sortable.options(b.parentNode).onChange(a)
            }
        }
    },
    onEmptyHover: function (a, b, c) {
        var d = a.parentNode;
        var e = Sortable.options(b);
        if (!Element.isParent(b, a)) {
            var f;
            var g = Sortable.findElements(b, {
                tag: e.tag,
                only: e.only
            });
            var h = null;
            if (g) {
                var i = Element.offsetSize(b, e.overlap) * (1.0 - c);
                for (f = 0; f < g.length; f += 1) {
                    if (i - Element.offsetSize(g[f], e.overlap) >= 0) {
                        i -= Element.offsetSize(g[f], e.overlap)
                    } else if (i - (Element.offsetSize(g[f], e.overlap) / 2) >= 0) {
                        h = f + 1 < g.length ? g[f + 1] : null;
                        break
                    } else {
                        h = g[f];
                        break
                    }
                }
            }
            b.insertBefore(a, h);
            Sortable.options(d).onChange(a);
            e.onChange(a)
        }
    },
    unmark: function () {
        if (Sortable._marker) Sortable._marker.hide()
    },
    mark: function (a, b) {
        var c = Sortable.options(a.parentNode);
        if (c && !c.ghosting) return;
        if (!Sortable._marker) {
            Sortable._marker = ($('dropmarker') || Element.extend(document.createElement('DIV'))).hide().addClassName('dropmarker').setStyle({
                position: 'absolute'
            });
            document.getElementsByTagName("body").item(0).appendChild(Sortable._marker)
        }
        var d = Position.cumulativeOffset(a);
        Sortable._marker.setStyle({
            left: d[0] + 'px',
            top: d[1] + 'px'
        });
        if (b == 'after')
            if (c.overlap == 'horizontal') Sortable._marker.setStyle({
                left: (d[0] + a.clientWidth) + 'px'
            });
            else Sortable._marker.setStyle({
                top: (d[1] + a.clientHeight) + 'px'
            });
        Sortable._marker.show()
    },
    _tree: function (a, b, c) {
        var d = Sortable.findElements(a, b) || [];
        for (var i = 0; i < d.length; ++i) {
            var e = d[i].id.match(b.format);
            if (!e) continue;
            var f = {
                id: encodeURIComponent(e ? e[1] : null),
                element: a,
                parent: c,
                children: [],
                position: c.children.length,
                container: $(d[i]).down(b.treeTag)
            };
            if (f.container) this._tree(f.container, b, f);
            c.children.push(f)
        }
        return c
    },
    tree: function (a) {
        a = $(a);
        var b = this.options(a);
        var c = Object.extend({
            tag: b.tag,
            treeTag: b.treeTag,
            only: b.only,
            name: a.id,
            format: b.format
        }, arguments[1] || {});
        var d = {
            id: null,
            parent: null,
            children: [],
            container: a,
            position: 0
        };
        return Sortable._tree(a, c, d)
    },
    _constructIndex: function (a) {
        var b = '';
        do {
            if (a.id) b = '[' + a.position + ']' + b
        } while ((a = a.parent) != null);
        return b
    },
    sequence: function (b) {
        b = $(b);
        var c = Object.extend(this.options(b), arguments[1] || {});
        return $(this.findElements(b, c) || []).map(function (a) {
            return a.id.match(c.format) ? a.id.match(c.format)[1] : ''
        })
    },
    setSequence: function (b, c) {
        b = $(b);
        var d = Object.extend(this.options(b), arguments[2] || {});
        var e = {};
        this.findElements(b, d).each(function (n) {
            if (n.id.match(d.format)) e[n.id.match(d.format)[1]] = [n, n.parentNode];
            n.parentNode.removeChild(n)
        });
        c.each(function (a) {
            var n = e[a];
            if (n) {
                n[1].appendChild(n[0]);
                delete e[a]
            }
        })
    },
    serialize: function (b) {
        b = $(b);
        var c = Object.extend(Sortable.options(b), arguments[1] || {});
        var d = encodeURIComponent((arguments[1] && arguments[1].name) ? arguments[1].name : b.id);
        if (c.tree) {
            return Sortable.tree(b, arguments[1]).children.map(function (a) {
                return [d + Sortable._constructIndex(a) + "[id]=" + encodeURIComponent(a.id)].concat(a.children.map(arguments.callee))
            }).flatten().join('&')
        } else {
            return Sortable.sequence(b, arguments[1]).map(function (a) {
                return d + "[]=" + encodeURIComponent(a)
            }).join('&')
        }
    }
};
Element.isParent = function (a, b) {
    if (!a.parentNode || a == b) return false;
    if (a.parentNode == b) return true;
    return Element.isParent(a.parentNode, b)
};
Element.findChildren = function (b, c, d, f) {
    if (!b.hasChildNodes()) return null;
    f = f.toUpperCase();
    if (c) c = [c].flatten();
    var g = [];
    $A(b.childNodes).each(function (e) {
        if (e.tagName && e.tagName.toUpperCase() == f && (!c || (Element.classNames(e).detect(function (v) {
            return c.include(v)
        })))) g.push(e);
        if (d) {
            var a = Element.findChildren(e, c, d, f);
            if (a) g.push(a)
        }
    });
    return (g.length > 0 ? g.flatten() : [])
};
Element.offsetSize = function (a, b) {
    return a['offset' + ((b == 'vertical' || b == 'height') ? 'Height' : 'Width')]
};
if (typeof Effect == 'undefined') throw ("controls.js requires including script.aculo.us' effects.js library");
var Autocompleter = {};
Autocompleter.Base = Class.create({
    baseInitialize: function (c, d, e) {
        c = $(c);
        this.element = c;
        this.update = $(d);
        this.hasFocus = false;
        this.changed = false;
        this.active = false;
        this.index = 0;
        this.entryCount = 0;
        this.oldElementValue = this.element.value;
        if (this.setOptions) this.setOptions(e);
        else this.options = e || {};
        this.options.paramName = this.options.paramName || this.element.name;
        this.options.tokens = this.options.tokens || [];
        this.options.frequency = this.options.frequency || 0.4;
        this.options.minChars = this.options.minChars || 1;
        this.options.onShow = this.options.onShow || function (a, b) {
            if (!b.style.position || b.style.position == 'absolute') {
                b.style.position = 'absolute';
                Position.clone(a, b, {
                    setHeight: false,
                    offsetTop: a.offsetHeight
                })
            }
            Effect.Appear(b, {
                duration: 0.15
            })
        };
        this.options.onHide = this.options.onHide || function (a, b) {
            new Effect.Fade(b, {
                duration: 0.15
            })
        };
        if (typeof (this.options.tokens) == 'string') this.options.tokens = new Array(this.options.tokens);
        if (!this.options.tokens.include('\n')) this.options.tokens.push('\n');
        this.observer = null;
        this.element.setAttribute('autocomplete', 'off');
        Element.hide(this.update);
        Event.observe(this.element, 'blur', this.onBlur.bindAsEventListener(this));
        Event.observe(this.element, 'keydown', this.onKeyPress.bindAsEventListener(this))
    },
    show: function () {
        if (Element.getStyle(this.update, 'display') == 'none') this.options.onShow(this.element, this.update);
        if (!this.iefix && (Prototype.Browser.IE) && (Element.getStyle(this.update, 'position') == 'absolute')) {
            new Insertion.After(this.update, '<iframe id="' + this.update.id + '_iefix" ' + 'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" ' + 'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
            this.iefix = $(this.update.id + '_iefix')
        }
        if (this.iefix) setTimeout(this.fixIEOverlapping.bind(this), 50)
    },
    fixIEOverlapping: function () {
        Position.clone(this.update, this.iefix, {
            setTop: (!this.update.style.height)
        });
        this.iefix.style.zIndex = 1;
        this.update.style.zIndex = 2;
        Element.show(this.iefix)
    },
    hide: function () {
        this.stopIndicator();
        if (Element.getStyle(this.update, 'display') != 'none') this.options.onHide(this.element, this.update);
        if (this.iefix) Element.hide(this.iefix)
    },
    startIndicator: function () {
        if (this.options.indicator) Element.show(this.options.indicator)
    },
    stopIndicator: function () {
        if (this.options.indicator) Element.hide(this.options.indicator)
    },
    onKeyPress: function (a) {
        if (this.active) switch (a.keyCode) {
        case Event.KEY_TAB:
        case Event.KEY_RETURN:
            this.selectEntry();
            Event.stop(a);
        case Event.KEY_ESC:
            this.hide();
            this.active = false;
            Event.stop(a);
            return;
        case Event.KEY_LEFT:
        case Event.KEY_RIGHT:
            return;
        case Event.KEY_UP:
            this.markPrevious();
            this.render();
            Event.stop(a);
            return;
        case Event.KEY_DOWN:
            this.markNext();
            this.render();
            Event.stop(a);
            return
        } else if (a.keyCode == Event.KEY_TAB || a.keyCode == Event.KEY_RETURN || (Prototype.Browser.WebKit > 0 && a.keyCode == 0)) return;
        this.changed = true;
        this.hasFocus = true;
        if (this.observer) clearTimeout(this.observer);
        this.observer = setTimeout(this.onObserverEvent.bind(this), this.options.frequency * 1000)
    },
    activate: function () {
        this.changed = false;
        this.hasFocus = true;
        this.getUpdatedChoices()
    },
    onHover: function (a) {
        var b = Event.findElement(a, 'LI');
        if (this.index != b.autocompleteIndex) {
            this.index = b.autocompleteIndex;
            this.render()
        }
        Event.stop(a)
    },
    onClick: function (a) {
        var b = Event.findElement(a, 'LI');
        this.index = b.autocompleteIndex;
        this.selectEntry();
        this.hide()
    },
    onBlur: function (a) {
        setTimeout(this.hide.bind(this), 250);
        this.hasFocus = false;
        this.active = false
    },
    render: function () {
        if (this.entryCount > 0) {
            for (var i = 0; i < this.entryCount; i++) this.index == i ? Element.addClassName(this.getEntry(i), "selected") : Element.removeClassName(this.getEntry(i), "selected");
            if (this.hasFocus) {
                this.show();
                this.active = true
            }
        } else {
            this.active = false;
            this.hide()
        }
    },
    markPrevious: function () {
        if (this.index > 0) this.index--;
        else this.index = this.entryCount - 1;
        this.getEntry(this.index).scrollIntoView(true)
    },
    markNext: function () {
        if (this.index < this.entryCount - 1) this.index++;
        else this.index = 0;
        this.getEntry(this.index).scrollIntoView(false)
    },
    getEntry: function (a) {
        return this.update.firstChild.childNodes[a]
    },
    getCurrentEntry: function () {
        return this.getEntry(this.index)
    },
    selectEntry: function () {
        this.active = false;
        this.updateElement(this.getCurrentEntry())
    },
    updateElement: function (a) {
        if (this.options.updateElement) {
            this.options.updateElement(a);
            return
        }
        var b = '';
        if (this.options.select) {
            var c = $(a).select('.' + this.options.select) || [];
            if (c.length > 0) b = Element.collectTextNodes(c[0], this.options.select)
        } else b = Element.collectTextNodesIgnoreClass(a, 'informal');
        var d = this.getTokenBounds();
        if (d[0] != -1) {
            var e = this.element.value.substr(0, d[0]);
            var f = this.element.value.substr(d[0]).match(/^\s+/);
            if (f) e += f[0];
            this.element.value = e + b + this.element.value.substr(d[1])
        } else {
            this.element.value = b
        }
        this.oldElementValue = this.element.value;
        this.element.focus();
        if (this.options.afterUpdateElement) this.options.afterUpdateElement(this.element, a)
    },
    updateChoices: function (a) {
        if (!this.changed && this.hasFocus) {
            this.update.innerHTML = a;
            Element.cleanWhitespace(this.update);
            Element.cleanWhitespace(this.update.down());
            if (this.update.firstChild && this.update.down().childNodes) {
                this.entryCount = this.update.down().childNodes.length;
                for (var i = 0; i < this.entryCount; i++) {
                    var b = this.getEntry(i);
                    b.autocompleteIndex = i;
                    this.addObservers(b)
                }
            } else {
                this.entryCount = 0
            }
            this.stopIndicator();
            this.index = 0;
            if (this.entryCount == 1 && this.options.autoSelect) {
                this.selectEntry();
                this.hide()
            } else {
                this.render()
            }
        }
    },
    addObservers: function (a) {
        Event.observe(a, "mouseover", this.onHover.bindAsEventListener(this));
        Event.observe(a, "click", this.onClick.bindAsEventListener(this))
    },
    onObserverEvent: function () {
        this.changed = false;
        this.tokenBounds = null;
        if (this.getToken().length >= this.options.minChars) {
            this.getUpdatedChoices()
        } else {
            this.active = false;
            this.hide()
        }
        this.oldElementValue = this.element.value
    },
    getToken: function () {
        var a = this.getTokenBounds();
        return this.element.value.substring(a[0], a[1]).strip()
    },
    getTokenBounds: function () {
        if (null != this.tokenBounds) return this.tokenBounds;
        var a = this.element.value;
        if (a.strip().empty()) return [-1, 0];
        var b = arguments.callee.getFirstDifferencePos(a, this.oldElementValue);
        var c = (b == this.oldElementValue.length ? 1 : 0);
        var d = -1,
            nextTokenPos = a.length;
        var e;
        for (var f = 0, l = this.options.tokens.length; f < l; ++f) {
            e = a.lastIndexOf(this.options.tokens[f], b + c - 1);
            if (e > d) d = e;
            e = a.indexOf(this.options.tokens[f], b + c);
            if (-1 != e && e < nextTokenPos) nextTokenPos = e
        }
        return (this.tokenBounds = [d + 1, nextTokenPos])
    }
});
Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos = function (a, b) {
    var c = Math.min(a.length, b.length);
    for (var d = 0; d < c; ++d)
        if (a[d] != b[d]) return d;
    return c
};
Ajax.Autocompleter = Class.create(Autocompleter.Base, {
    initialize: function (a, b, c, d) {
        this.baseInitialize(a, b, d);
        this.options.asynchronous = true;
        this.options.onComplete = this.onComplete.bind(this);
        this.options.defaultParams = this.options.parameters || null;
        this.url = c
    },
    getUpdatedChoices: function () {
        this.startIndicator();
        var a = encodeURIComponent(this.options.paramName) + '=' + encodeURIComponent(this.getToken());
        this.options.parameters = this.options.callback ? this.options.callback(this.element, a) : a;
        if (this.options.defaultParams) this.options.parameters += '&' + this.options.defaultParams;
        new Ajax.Request(this.url, this.options)
    },
    onComplete: function (a) {
        this.updateChoices(a.responseText)
    }
});
Autocompleter.Local = Class.create(Autocompleter.Base, {
    initialize: function (a, b, c, d) {
        this.baseInitialize(a, b, d);
        this.options.array = c
    },
    getUpdatedChoices: function () {
        this.updateChoices(this.options.selector(this))
    },
    setOptions: function (h) {
        this.options = Object.extend({
            choices: 10,
            partialSearch: true,
            partialChars: 2,
            ignoreCase: true,
            fullSearch: false,
            selector: function (a) {
                var b = [];
                var c = [];
                var d = a.getToken();
                var e = 0;
                for (var i = 0; i < a.options.array.length && b.length < a.options.choices; i++) {
                    var f = a.options.array[i];
                    var g = a.options.ignoreCase ? f.toLowerCase().indexOf(d.toLowerCase()) : f.indexOf(d);
                    while (g != -1) {
                        if (g == 0 && f.length != d.length) {
                            b.push("<li><strong>" + f.substr(0, d.length) + "</strong>" + f.substr(d.length) + "</li>");
                            break
                        } else if (d.length >= a.options.partialChars && a.options.partialSearch && g != -1) {
                            if (a.options.fullSearch || /\s/.test(f.substr(g - 1, 1))) {
                                c.push("<li>" + f.substr(0, g) + "<strong>" + f.substr(g, d.length) + "</strong>" + f.substr(g + d.length) + "</li>");
                                break
                            }
                        }
                        g = a.options.ignoreCase ? f.toLowerCase().indexOf(d.toLowerCase(), g + 1) : f.indexOf(d, g + 1)
                    }
                }
                if (c.length) b = b.concat(c.slice(0, a.options.choices - b.length));
                return "<ul>" + b.join('') + "</ul>"
            }
        }, h || {})
    }
});
Field.scrollFreeActivate = function (a) {
    setTimeout(function () {
        Field.activate(a)
    }, 1)
};
Ajax.InPlaceEditor = Class.create({
    initialize: function (a, b, c) {
        this.url = b;
        this.element = a = $(a);
        this.prepareOptions();
        this._controls = {};
        arguments.callee.dealWithDeprecatedOptions(c);
        Object.extend(this.options, c || {});
        if (!this.options.formId && this.element.id) {
            this.options.formId = this.element.id + '-inplaceeditor';
            if ($(this.options.formId)) this.options.formId = ''
        }
        if (this.options.externalControl) this.options.externalControl = $(this.options.externalControl);
        if (!this.options.externalControl) this.options.externalControlOnly = false;
        this._originalBackground = this.element.getStyle('background-color') || 'transparent';
        this.element.title = this.options.clickToEditText;
        this._boundCancelHandler = this.handleFormCancellation.bind(this);
        this._boundComplete = (this.options.onComplete || Prototype.emptyFunction).bind(this);
        this._boundFailureHandler = this.handleAJAXFailure.bind(this);
        this._boundSubmitHandler = this.handleFormSubmission.bind(this);
        this._boundWrapperHandler = this.wrapUp.bind(this);
        this.registerListeners()
    },
    checkForEscapeOrReturn: function (e) {
        if (!this._editing || e.ctrlKey || e.altKey || e.shiftKey) return;
        if (Event.KEY_ESC == e.keyCode) this.handleFormCancellation(e);
        else if (Event.KEY_RETURN == e.keyCode) this.handleFormSubmission(e)
    },
    createControl: function (a, b, c) {
        var d = this.options[a + 'Control'];
        var e = this.options[a + 'Text'];
        if ('button' == d) {
            var f = document.createElement('input');
            f.type = 'submit';
            f.value = e;
            f.className = 'editor_' + a + '_button';
            if ('cancel' == a) f.onclick = this._boundCancelHandler;
            this._form.appendChild(f);
            this._controls[a] = f
        } else if ('link' == d) {
            var g = document.createElement('a');
            g.href = '#';
            g.appendChild(document.createTextNode(e));
            g.onclick = 'cancel' == a ? this._boundCancelHandler : this._boundSubmitHandler;
            g.className = 'editor_' + a + '_link';
            if (c) g.className += ' ' + c;
            this._form.appendChild(g);
            this._controls[a] = g
        }
    },
    createEditField: function () {
        var a = (this.options.loadTextURL ? this.options.loadingText : this.getText());
        var b;
        if (1 >= this.options.rows && !/\r|\n/.test(this.getText())) {
            b = document.createElement('input');
            b.type = 'text';
            var c = this.options.size || this.options.cols || 0;
            if (0 < c) b.size = c
        } else {
            b = document.createElement('textarea');
            b.rows = (1 >= this.options.rows ? this.options.autoRows : this.options.rows);
            b.cols = this.options.cols || 40
        }
        b.name = this.options.paramName;
        b.value = a;
        b.className = 'editor_field';
        if (this.options.submitOnBlur) b.onblur = this._boundSubmitHandler;
        this._controls.editor = b;
        if (this.options.loadTextURL) this.loadExternalText();
        this._form.appendChild(this._controls.editor)
    },
    createForm: function () {
        var d = this;

        function addText(a, b) {
            var c = d.options['text' + a + 'Controls'];
            if (!c || b === false) return;
            d._form.appendChild(document.createTextNode(c))
        };
        this._form = $(document.createElement('form'));
        this._form.id = this.options.formId;
        this._form.addClassName(this.options.formClassName);
        this._form.onsubmit = this._boundSubmitHandler;
        this.createEditField();
        if ('textarea' == this._controls.editor.tagName.toLowerCase()) this._form.appendChild(document.createElement('br'));
        if (this.options.onFormCustomization) this.options.onFormCustomization(this, this._form);
        addText('Before', this.options.okControl || this.options.cancelControl);
        this.createControl('ok', this._boundSubmitHandler);
        addText('Between', this.options.okControl && this.options.cancelControl);
        this.createControl('cancel', this._boundCancelHandler, 'editor_cancel');
        addText('After', this.options.okControl || this.options.cancelControl)
    },
    destroy: function () {
        if (this._oldInnerHTML) this.element.innerHTML = this._oldInnerHTML;
        this.leaveEditMode();
        this.unregisterListeners()
    },
    enterEditMode: function (e) {
        if (this._saving || this._editing) return;
        this._editing = true;
        this.triggerCallback('onEnterEditMode');
        if (this.options.externalControl) this.options.externalControl.hide();
        this.element.hide();
        this.createForm();
        this.element.parentNode.insertBefore(this._form, this.element);
        if (!this.options.loadTextURL) this.postProcessEditField();
        if (e) Event.stop(e)
    },
    enterHover: function (e) {
        if (this.options.hoverClassName) this.element.addClassName(this.options.hoverClassName);
        if (this._saving) return;
        this.triggerCallback('onEnterHover')
    },
    getText: function () {
        return this.element.innerHTML
    },
    handleAJAXFailure: function (a) {
        this.triggerCallback('onFailure', a);
        if (this._oldInnerHTML) {
            this.element.innerHTML = this._oldInnerHTML;
            this._oldInnerHTML = null
        }
    },
    handleFormCancellation: function (e) {
        this.wrapUp();
        if (e) Event.stop(e)
    },
    handleFormSubmission: function (e) {
        var a = this._form;
        var b = $F(this._controls.editor);
        this.prepareSubmission();
        var c = this.options.callback(a, b) || '';
        if (Object.isString(c)) c = c.toQueryParams();
        c.editorId = this.element.id;
        if (this.options.htmlResponse) {
            var d = Object.extend({
                evalScripts: true
            }, this.options.ajaxOptions);
            Object.extend(d, {
                parameters: c,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            new Ajax.Updater({
                success: this.element
            }, this.url, d)
        } else {
            var d = Object.extend({
                method: 'get'
            }, this.options.ajaxOptions);
            Object.extend(d, {
                parameters: c,
                onComplete: this._boundWrapperHandler,
                onFailure: this._boundFailureHandler
            });
            new Ajax.Request(this.url, d)
        } if (e) Event.stop(e)
    },
    leaveEditMode: function () {
        this.element.removeClassName(this.options.savingClassName);
        this.removeForm();
        this.leaveHover();
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show();
        if (this.options.externalControl) this.options.externalControl.show();
        this._saving = false;
        this._editing = false;
        this._oldInnerHTML = null;
        this.triggerCallback('onLeaveEditMode')
    },
    leaveHover: function (e) {
        if (this.options.hoverClassName) this.element.removeClassName(this.options.hoverClassName);
        if (this._saving) return;
        this.triggerCallback('onLeaveHover')
    },
    loadExternalText: function () {
        this._form.addClassName(this.options.loadingClassName);
        this._controls.editor.disabled = true;
        var c = Object.extend({
            method: 'get'
        }, this.options.ajaxOptions);
        Object.extend(c, {
            parameters: 'editorId=' + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (a) {
                this._form.removeClassName(this.options.loadingClassName);
                var b = a.responseText;
                if (this.options.stripLoadedTextTags) b = b.stripTags();
                this._controls.editor.value = b;
                this._controls.editor.disabled = false;
                this.postProcessEditField()
            }.bind(this),
            onFailure: this._boundFailureHandler
        });
        new Ajax.Request(this.options.loadTextURL, c)
    },
    postProcessEditField: function () {
        var a = this.options.fieldPostCreation;
        if (a) $(this._controls.editor)['focus' == a ? 'focus' : 'activate']()
    },
    prepareOptions: function () {
        this.options = Object.clone(Ajax.InPlaceEditor.DefaultOptions);
        Object.extend(this.options, Ajax.InPlaceEditor.DefaultCallbacks);
        [this._extraDefaultOptions].flatten().compact().each(function (a) {
            Object.extend(this.options, a)
        }.bind(this))
    },
    prepareSubmission: function () {
        this._saving = true;
        this.removeForm();
        this.leaveHover();
        this.showSaving()
    },
    registerListeners: function () {
        this._listeners = {};
        var b;
        $H(Ajax.InPlaceEditor.Listeners).each(function (a) {
            b = this[a.value].bind(this);
            this._listeners[a.key] = b;
            if (!this.options.externalControlOnly) this.element.observe(a.key, b);
            if (this.options.externalControl) this.options.externalControl.observe(a.key, b)
        }.bind(this))
    },
    removeForm: function () {
        if (!this._form) return;
        this._form.remove();
        this._form = null;
        this._controls = {}
    },
    showSaving: function () {
        this._oldInnerHTML = this.element.innerHTML;
        this.element.innerHTML = this.options.savingText;
        this.element.addClassName(this.options.savingClassName);
        this.element.style.backgroundColor = this._originalBackground;
        this.element.show()
    },
    triggerCallback: function (a, b) {
        if ('function' == typeof this.options[a]) {
            this.options[a](this, b)
        }
    },
    unregisterListeners: function () {
        $H(this._listeners).each(function (a) {
            if (!this.options.externalControlOnly) this.element.stopObserving(a.key, a.value);
            if (this.options.externalControl) this.options.externalControl.stopObserving(a.key, a.value)
        }.bind(this))
    },
    wrapUp: function (a) {
        this.leaveEditMode();
        this._boundComplete(a, this.element)
    }
});
Object.extend(Ajax.InPlaceEditor.prototype, {
    dispose: Ajax.InPlaceEditor.prototype.destroy
});
Ajax.InPlaceCollectionEditor = Class.create(Ajax.InPlaceEditor, {
    initialize: function ($super, b, c, d) {
        this._extraDefaultOptions = Ajax.InPlaceCollectionEditor.DefaultOptions;
        $super(b, c, d)
    },
    createEditField: function () {
        var a = document.createElement('select');
        a.name = this.options.paramName;
        a.size = 1;
        this._controls.editor = a;
        this._collection = this.options.collection || [];
        if (this.options.loadCollectionURL) this.loadCollection();
        else this.checkForExternalText();
        this._form.appendChild(this._controls.editor)
    },
    loadCollection: function () {
        this._form.addClassName(this.options.loadingClassName);
        this.showLoadingText(this.options.loadingCollectionText);
        var c = Object.extend({
            method: 'get'
        }, this.options.ajaxOptions);
        Object.extend(c, {
            parameters: 'editorId=' + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (a) {
                var b = a.responseText.strip();
                if (!/^\[.*\]$/.test(b)) throw ('Server returned an invalid collection representation.');
                this._collection = eval(b);
                this.checkForExternalText()
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadCollectionURL, c)
    },
    showLoadingText: function (a) {
        this._controls.editor.disabled = true;
        var b = this._controls.editor.firstChild;
        if (!b) {
            b = document.createElement('option');
            b.value = '';
            this._controls.editor.appendChild(b);
            b.selected = true
        }
        b.update((a || '').stripScripts().stripTags())
    },
    checkForExternalText: function () {
        this._text = this.getText();
        if (this.options.loadTextURL) this.loadExternalText();
        else this.buildOptionList()
    },
    loadExternalText: function () {
        this.showLoadingText(this.options.loadingText);
        var b = Object.extend({
            method: 'get'
        }, this.options.ajaxOptions);
        Object.extend(b, {
            parameters: 'editorId=' + encodeURIComponent(this.element.id),
            onComplete: Prototype.emptyFunction,
            onSuccess: function (a) {
                this._text = a.responseText.strip();
                this.buildOptionList()
            }.bind(this),
            onFailure: this.onFailure
        });
        new Ajax.Request(this.options.loadTextURL, b)
    },
    buildOptionList: function () {
        this._form.removeClassName(this.options.loadingClassName);
        this._collection = this._collection.map(function (a) {
            return 2 === a.length ? a : [a, a].flatten()
        });
        var c = ('value' in this.options) ? this.options.value : this._text;
        var d = this._collection.any(function (a) {
            return a[0] == c
        }.bind(this));
        this._controls.editor.update('');
        var e;
        this._collection.each(function (a, b) {
            e = document.createElement('option');
            e.value = a[0];
            e.selected = d ? a[0] == c : 0 == b;
            e.appendChild(document.createTextNode(a[1]));
            this._controls.editor.appendChild(e)
        }.bind(this));
        this._controls.editor.disabled = false;
        Field.scrollFreeActivate(this._controls.editor)
    }
});
Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions = function (c) {
    if (!c) return;

    function fallback(a, b) {
        if (a in c || b === undefined) return;
        c[a] = b
    };
    fallback('cancelControl', (c.cancelLink ? 'link' : (c.cancelButton ? 'button' : c.cancelLink == c.cancelButton == false ? false : undefined)));
    fallback('okControl', (c.okLink ? 'link' : (c.okButton ? 'button' : c.okLink == c.okButton == false ? false : undefined)));
    fallback('highlightColor', c.highlightcolor);
    fallback('highlightEndColor', c.highlightendcolor)
};
Object.extend(Ajax.InPlaceEditor, {
    DefaultOptions: {
        ajaxOptions: {},
        autoRows: 3,
        cancelControl: 'link',
        cancelText: 'cancel',
        clickToEditText: 'Click to edit',
        externalControl: null,
        externalControlOnly: false,
        fieldPostCreation: 'activate',
        formClassName: 'inplaceeditor-form',
        formId: null,
        highlightColor: '#ffff99',
        highlightEndColor: '#ffffff',
        hoverClassName: '',
        htmlResponse: true,
        loadingClassName: 'inplaceeditor-loading',
        loadingText: 'Loading...',
        okControl: 'button',
        okText: 'ok',
        paramName: 'value',
        rows: 1,
        savingClassName: 'inplaceeditor-saving',
        savingText: 'Saving...',
        size: 0,
        stripLoadedTextTags: false,
        submitOnBlur: false,
        textAfterControls: '',
        textBeforeControls: '',
        textBetweenControls: ''
    },
    DefaultCallbacks: {
        callback: function (a) {
            return Form.serialize(a)
        },
        onComplete: function (a, b) {
            new Effect.Highlight(b, {
                startcolor: this.options.highlightColor,
                keepBackgroundImage: true
            })
        },
        onEnterEditMode: null,
        onEnterHover: function (a) {
            a.element.style.backgroundColor = a.options.highlightColor;
            if (a._effect) a._effect.cancel()
        },
        onFailure: function (a, b) {
            alert('Error communication with the server: ' + a.responseText.stripTags())
        },
        onFormCustomization: null,
        onLeaveEditMode: null,
        onLeaveHover: function (a) {
            a._effect = new Effect.Highlight(a.element, {
                startcolor: a.options.highlightColor,
                endcolor: a.options.highlightEndColor,
                restorecolor: a._originalBackground,
                keepBackgroundImage: true
            })
        }
    },
    Listeners: {
        click: 'enterEditMode',
        keydown: 'checkForEscapeOrReturn',
        mouseover: 'enterHover',
        mouseout: 'leaveHover'
    }
});
Ajax.InPlaceCollectionEditor.DefaultOptions = {
    loadingCollectionText: 'Loading options...'
};
Form.Element.DelayedObserver = Class.create({
    initialize: function (a, b, c) {
        this.delay = b || 0.5;
        this.element = $(a);
        this.callback = c;
        this.timer = null;
        this.lastValue = $F(this.element);
        Event.observe(this.element, 'keyup', this.delayedListener.bindAsEventListener(this))
    },
    delayedListener: function (a) {
        if (this.lastValue == $F(this.element)) return;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(this.onTimerEvent.bind(this), this.delay * 1000);
        this.lastValue = $F(this.element)
    },
    onTimerEvent: function () {
        this.timer = null;
        this.callback(this.element, $F(this.element))
    }
});
if (!Control) var Control = {};
Control.Slider = Class.create({
    initialize: function (a, b, c) {
        var d = this;
        if (Object.isArray(a)) {
            this.handles = a.collect(function (e) {
                return $(e)
            })
        } else {
            this.handles = [$(a)]
        }
        this.track = $(b);
        this.options = c || {};
        this.axis = this.options.axis || 'horizontal';
        this.increment = this.options.increment || 1;
        this.step = parseInt(this.options.step || '1');
        this.range = this.options.range || $R(0, 1);
        this.value = 0;
        this.values = this.handles.map(function () {
            return 0
        });
        this.spans = this.options.spans ? this.options.spans.map(function (s) {
            return $(s)
        }) : false;
        this.options.startSpan = $(this.options.startSpan || null);
        this.options.endSpan = $(this.options.endSpan || null);
        this.restricted = this.options.restricted || false;
        this.maximum = this.options.maximum || this.range.end;
        this.minimum = this.options.minimum || this.range.start;
        this.alignX = parseInt(this.options.alignX || '0');
        this.alignY = parseInt(this.options.alignY || '0');
        this.trackLength = this.maximumOffset() - this.minimumOffset();
        this.handleLength = this.isVertical() ? (this.handles[0].offsetHeight != 0 ? this.handles[0].offsetHeight : this.handles[0].style.height.replace(/px$/, "")) : (this.handles[0].offsetWidth != 0 ? this.handles[0].offsetWidth : this.handles[0].style.width.replace(/px$/, ""));
        this.active = false;
        this.dragging = false;
        this.disabled = false;
        if (this.options.disabled) this.setDisabled();
        this.allowedValues = this.options.values ? this.options.values.sortBy(Prototype.K) : false;
        if (this.allowedValues) {
            this.minimum = this.allowedValues.min();
            this.maximum = this.allowedValues.max()
        }
        this.eventMouseDown = this.startDrag.bindAsEventListener(this);
        this.eventMouseUp = this.endDrag.bindAsEventListener(this);
        this.eventMouseMove = this.update.bindAsEventListener(this);
        this.handles.each(function (h, i) {
            i = d.handles.length - 1 - i;
            d.setValue(parseFloat((Object.isArray(d.options.sliderValue) ? d.options.sliderValue[i] : d.options.sliderValue) || d.range.start), i);
            h.makePositioned().observe("mousedown", d.eventMouseDown)
        });
        this.track.observe("mousedown", this.eventMouseDown);
        document.observe("mouseup", this.eventMouseUp);
        document.observe("mousemove", this.eventMouseMove);
        this.initialized = true
    },
    dispose: function () {
        var a = this;
        Event.stopObserving(this.track, "mousedown", this.eventMouseDown);
        Event.stopObserving(document, "mouseup", this.eventMouseUp);
        Event.stopObserving(document, "mousemove", this.eventMouseMove);
        this.handles.each(function (h) {
            Event.stopObserving(h, "mousedown", a.eventMouseDown)
        })
    },
    setDisabled: function () {
        this.disabled = true
    },
    setEnabled: function () {
        this.disabled = false
    },
    getNearestValue: function (b) {
        if (this.allowedValues) {
            if (b >= this.allowedValues.max()) return (this.allowedValues.max());
            if (b <= this.allowedValues.min()) return (this.allowedValues.min());
            var c = Math.abs(this.allowedValues[0] - b);
            var d = this.allowedValues[0];
            this.allowedValues.each(function (v) {
                var a = Math.abs(v - b);
                if (a <= c) {
                    d = v;
                    c = a
                }
            });
            return d
        }
        if (b > this.range.end) return this.range.end;
        if (b < this.range.start) return this.range.start;
        return b
    },
    setValue: function (a, b) {
        if (!this.active) {
            this.activeHandleIdx = b || 0;
            this.activeHandle = this.handles[this.activeHandleIdx];
            this.updateStyles()
        }
        b = b || this.activeHandleIdx || 0;
        if (this.initialized && this.restricted) {
            if ((b > 0) && (a < this.values[b - 1])) a = this.values[b - 1];
            if ((b < (this.handles.length - 1)) && (a > this.values[b + 1])) a = this.values[b + 1]
        }
        a = this.getNearestValue(a);
        this.values[b] = a;
        this.value = this.values[0];
        this.handles[b].style[this.isVertical() ? 'top' : 'left'] = this.translateToPx(a);
        this.drawSpans();
        if (!this.dragging || !this.event) this.updateFinished()
    },
    setValueBy: function (a, b) {
        this.setValue(this.values[b || this.activeHandleIdx || 0] + a, b || this.activeHandleIdx || 0)
    },
    translateToPx: function (a) {
        return Math.round(((this.trackLength - this.handleLength) / (this.range.end - this.range.start)) * (a - this.range.start)) + "px"
    },
    translateToValue: function (a) {
        return ((a / (this.trackLength - this.handleLength) * (this.range.end - this.range.start)) + this.range.start)
    },
    getRange: function (a) {
        var v = this.values.sortBy(Prototype.K);
        a = a || 0;
        return $R(v[a], v[a + 1])
    },
    minimumOffset: function () {
        return (this.isVertical() ? this.alignY : this.alignX)
    },
    maximumOffset: function () {
        return (this.isVertical() ? (this.track.offsetHeight != 0 ? this.track.offsetHeight : this.track.style.height.replace(/px$/, "")) - this.alignY : (this.track.offsetWidth != 0 ? this.track.offsetWidth : this.track.style.width.replace(/px$/, "")) - this.alignX)
    },
    isVertical: function () {
        return (this.axis == 'vertical')
    },
    drawSpans: function () {
        var a = this;
        if (this.spans) $R(0, this.spans.length - 1).each(function (r) {
            a.setSpan(a.spans[r], a.getRange(r))
        });
        if (this.options.startSpan) this.setSpan(this.options.startSpan, $R(0, this.values.length > 1 ? this.getRange(0).min() : this.value));
        if (this.options.endSpan) this.setSpan(this.options.endSpan, $R(this.values.length > 1 ? this.getRange(this.spans.length - 1).max() : this.value, this.maximum))
    },
    setSpan: function (a, b) {
        if (this.isVertical()) {
            a.style.top = this.translateToPx(b.start);
            a.style.height = this.translateToPx(b.end - b.start + this.range.start)
        } else {
            a.style.left = this.translateToPx(b.start);
            a.style.width = this.translateToPx(b.end - b.start + this.range.start)
        }
    },
    updateStyles: function () {
        this.handles.each(function (h) {
            Element.removeClassName(h, 'selected')
        });
        Element.addClassName(this.activeHandle, 'selected')
    },
    startDrag: function (a) {
        if (Event.isLeftClick(a)) {
            if (!this.disabled) {
                this.active = true;
                var b = Event.element(a);
                var c = [Event.pointerX(a), Event.pointerY(a)];
                var d = b;
                if (d == this.track) {
                    var e = Position.cumulativeOffset(this.track);
                    this.event = a;
                    this.setValue(this.translateToValue((this.isVertical() ? c[1] - e[1] : c[0] - e[0]) - (this.handleLength / 2)));
                    var e = Position.cumulativeOffset(this.activeHandle);
                    this.offsetX = (c[0] - e[0]);
                    this.offsetY = (c[1] - e[1])
                } else {
                    while ((this.handles.indexOf(b) == -1) && b.parentNode) b = b.parentNode;
                    if (this.handles.indexOf(b) != -1) {
                        this.activeHandle = b;
                        this.activeHandleIdx = this.handles.indexOf(this.activeHandle);
                        this.updateStyles();
                        var e = Position.cumulativeOffset(this.activeHandle);
                        this.offsetX = (c[0] - e[0]);
                        this.offsetY = (c[1] - e[1])
                    }
                }
            }
            Event.stop(a)
        }
    },
    update: function (a) {
        if (this.active) {
            if (!this.dragging) this.dragging = true;
            this.draw(a);
            if (Prototype.Browser.WebKit) window.scrollBy(0, 0);
            Event.stop(a)
        }
    },
    draw: function (a) {
        var b = [Event.pointerX(a), Event.pointerY(a)];
        var c = Position.cumulativeOffset(this.track);
        b[0] -= this.offsetX + c[0];
        b[1] -= this.offsetY + c[1];
        this.event = a;
        this.setValue(this.translateToValue(this.isVertical() ? b[1] : b[0]));
        if (this.initialized && this.options.onSlide) this.options.onSlide(this.values.length > 1 ? this.values : this.value, this)
    },
    endDrag: function (a) {
        if (this.active && this.dragging) {
            this.finishDrag(a, true);
            Event.stop(a)
        }
        this.active = false;
        this.dragging = false
    },
    finishDrag: function (a, b) {
        this.active = false;
        this.dragging = false;
        this.updateFinished()
    },
    updateFinished: function () {
        if (this.initialized && this.options.onChange) this.options.onChange(this.values.length > 1 ? this.values : this.value, this);
        this.event = null
    }
});
Sound = {
    tracks: {},
    _enabled: true,
    template: new Template('<embed style="height:0" id="sound_#{track}_#{id}" src="#{url}" loop="false" autostart="true" hidden="true"/>'),
    enable: function () {
        Sound._enabled = true
    },
    disable: function () {
        Sound._enabled = false
    },
    play: function (c) {
        if (!Sound._enabled) return;
        var d = Object.extend({
            track: 'global',
            url: c,
            replace: false
        }, arguments[1] || {});
        if (d.replace && this.tracks[d.track]) {
            $R(0, this.tracks[d.track].id).each(function (a) {
                var b = $('sound_' + d.track + '_' + a);
                b.Stop && b.Stop();
                b.remove()
            });
            this.tracks[d.track] = null
        }
        if (!this.tracks[d.track]) this.tracks[d.track] = {
            id: 0
        };
        else this.tracks[d.track].id++;
        d.id = this.tracks[d.track].id;
        $$('body')[0].insert(Prototype.Browser.IE ? new Element('bgsound', {
            id: 'sound_' + d.track + '_' + d.id,
            src: d.url,
            loop: 1,
            autostart: true
        }) : Sound.template.evaluate(d))
    }
};
if (Prototype.Browser.Gecko && navigator.userAgent.indexOf("Win") > 0) {
    if (navigator.plugins && $A(navigator.plugins).detect(function (p) {
        return p.name.indexOf('QuickTime') != -1
    })) Sound.template = new Template('<object id="sound_#{track}_#{id}" width="0" height="0" type="audio/mpeg" data="#{url}"/>');
    else Sound.play = function () {}
}
Scriptaculous.load();