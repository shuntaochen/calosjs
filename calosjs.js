/*
* License Mit
* Author: Calos Chen
* github: github.com/shuntaochen
**/

//ExplosionJS/ FunctionJS framework!/CalosJs

var createConfig = function (url, success, data, method, isAsync) {
    return { method: method || 'get', url: url, request: data || {}, success: success, isAsync: isAsync || true };
}

function ajax(ajaxConfig, queafter) {
    var requestor = _createXmlHttp();
    requestor.onreadystatechange = function () {
        if (requestor.readyState === 4) {
            if (requestor.status === 200) {
                ajaxConfig.success(ajaxConfig.request, requestor.responseText);
            }
            if (queafter)
                queafter(ajaxConfig);
        }
    };
    var isPost = ajaxConfig.method.toLowerCase() === 'post';
    var params = param(ajaxConfig.request);
    requestor.open(ajaxConfig.method, isPost ? ajaxConfig.url : (ajaxConfig.url + '?' + params), ajaxConfig.isAsync);
    isPost ? requestor.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") : '';
    requestor.send(isPost ? params : null);
    function _createXmlHttp() {
        var xmlHttp;
        try {
            xmlHttp = new XMLHttpRequest();
        }
        catch (e) {
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    alert("Your browser does not support AJAX！");
                    return false;
                }
            }
        }
        return xmlHttp;
    }
}
function ajaxQueue(config) {
    ajaxQueue.queue = ajaxQueue.queue || [];
    ajaxQueue.queue.push(config);
    var ajaxConfig = ajaxQueue.queue[ajaxQueue.queue.length - 1];
    if (!ajaxQueue.requesting && ajaxConfig)
        _performAjaxQueueRequest(ajaxConfig);
    function _performAjaxQueueRequest(ajaxConfig) {
        if (ajaxQueue.queue.length === 0 || ajaxConfig === undefined) {
            ajaxQueue.requesting = false;
            return;
        }
        ajaxQueue.requesting = true;
        ajax(ajaxConfig, function (ajaxConfig) {
            var i = ajaxQueue.queue.indexOf(ajaxConfig);
            _performAjaxQueueRequest(ajaxQueue.queue[i + 1]);
            ajaxQueue.queue.splice(i, 1);
        });
    }

}
//ajaxQueue(createConfig('http://localhost:8080/cors.php', function (request, response) {
//    alert(response);
//}));

//for (var i = 0; i < 6; i++) {
//    ajaxQueue(createConfig('http://localhost:8080/cors.php', function (request, response) {
//        alert(request.i + response);
//    }, { i: i }));
//}

setTimeout(function () {
    for (var i = 0; i < 6; i++) {
        //ajaxQueue(createConfig('jsons/json.json', function (request, response) {
        //    alert(request.i + response);
        //}, { i: i }));
    }
}, 0);


//browser comptibility section
function newguid() {
    return Math.random().toString().replace('.', '');
}
function isIE() {
    return window.ActiveXObject !== undefined;
}
var isDOM = (typeof HTMLElement === 'object') ?
               function (obj) {
                   return obj instanceof HTMLElement;
               } :
               function (obj) {
                   return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
               }
//section object extensions
function contains(nodeorarray, el) {
    if (nodeorarray instanceof Array)
        return nodeorarray.indexOf(el) > -1;
    else {
        if (nodeorarray === el) return true;
        if (isDOM(nodeorarray) && isDOM(el)) {
            var ret = false;
            while (el.parentNode) {
                if (el === nodeorarray) {
                    ret = true;
                    break;
                }
                el = el.parentNode;
            }
            return ret;
        }
    }
    return false;
}
function freeze(objects, queparent) {
    parent = queparent ? queparent : this;
    if (typeof objects === 'string') Object.freeze(parent[objects]);
    else {
        for (var i in objects) freeze(objects[i]);
    }
}
function extend(rawObject, objectToExtend) {
    for (var i in objectToExtend) {
        rawObject[i] = objectToExtend[i];
    }
    return rawObject;
}
function clone(rawObject) {
    rawObject = (typeof rawObject === 'string' ? find(rawObject) : rawObject);
    if (isDOM(rawObject))
        return rawObject.cloneNode(true);
    else {
        return extend({}, rawObject);
    }
}
function map(rawObject, mapping) {
    if (rawObject instanceof Array) return _maparray(rawObject, mapping);
    else {
        for (var i in rawObject) {
            rawObject[i] = mapping(i, rawObject[i]);
        }
        return rawObject;
    }
}
function _maparray(array, mapping) {
    var ret = [];
    for (var i in array) {
        ret.push(mapping(i, array[i]));
    }
    return ret;
}
function grep(element, reg, quetransform) {
    if (element instanceof Array)
        return _greparray(element, reg, quetransform);
    return _grepobject(element, reg, quetransform);

}
function _greparray(array, reg, transform) {
    var ret = [];
    for (var i in array) {
        if (reg.test(array[i])) {
            if (transform) array[i] = transform(i, array[i])
            ret.push(array[i]);
        }
    }
    return ret;

}
function _grepobject(object, reg, transfrom) {
    var ret = {}, first, counter = 0;
    for (var i in object) {
        if (reg.test(i)) {
            ++counter;
            if (counter === 1) first = object[i];
            ret[i] = (transfrom ? transfrom(i, object[i]) : object[i]);
        }
    }
    return counter === 1 ? first : ret;
}
//section pravate methods
function _id(id) {
    return document.getElementById(id);
}
function _transfromarray(nodelist) {
    var arr = [];
    for (var i = 0; i < nodelist.length; i++) {
        arr.push(nodelist[i]);
    }
    return arr;
}
function findall(expressionorid, contextbehalf) {
    var array = [];
    try {
        var context = typeof contextbehalf === 'undefined' ? document : ((typeof contextbehalf.nodeName === 'string') ? contextbehalf : (document.querySelector(contextbehalf) || _id(contextbehalf)));
        if (!context) return array;
        if (typeof expressionorid === 'string') {
            var nodelist = (contextbehalf === undefined ? (_id(expressionorid) || context.querySelectorAll(expressionorid)) : context.querySelectorAll(/^\w/.test(expressionorid) ? ('#' + expressionorid) : expressionorid));
            if (nodelist.length === undefined) array.push(nodelist);
            else {
                for (var i = 0; i < nodelist.length; i++) {
                    array.push(nodelist[i]);
                }
            }
        }
        else { array.push(expressionorid); }
    } catch (e) { }
    return array;
}
function find(expressionorid, context) {
    return typeof expressionorid !== 'string' ? expressionorid : findall(expressionorid, context)[0];
}
function data(element, quename, quevalue) {
    var el = find(element);
    var data = el.dataset;
    if (data === undefined) {
        data = el;
        quename = 'data-' + quename;
    }
    if (quename !== undefined) {
        if (quevalue !== undefined) {
            data[quename] = quevalue;
            return el;
        } else {
            return data[quename];
        }
    } else {
        return data;
    }
}
function foreach(arrayorobject, handle) {
    for (var i = 0; i < arrayorobject.length; i++) {
        handle(i, arrayorobject[i]);
    }
}
function foreacho(object, handle) {
    for (var i in arrayorobject) {
        handle(i, arrayorobject[i]);
    }
}
function drag() {
    drag.curobj = {};
}
//event handle section
function _addeventhandler(oTarget, sEventType, fnHandler) {
    if (typeof oTarget === 'string') oTarget = find(oTarget);
    oTarget.eventHandlers = oTarget.eventHandlers || {};
    oTarget.eventHandlers[sEventType] = oTarget.eventHandlers[sEventType] || [];
    oTarget.eventHandlers[sEventType].push(fnHandler);
    if (oTarget.addEventListener) {
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
    return oTarget;
}
function _removeeventhandler(oTarget, sEventType, fnHandler) {
    if (typeof oTarget === 'string') oTarget = find(oTarget);
    oTarget.eventHandlers = oTarget.eventHandlers || {};
    oTarget.eventHandlers[sEventType] = oTarget.eventHandlers[sEventType] || [];
    oTarget.eventHandlers[sEventType].splice(oTarget.eventHandlers[sEventType].indexOf(fnHandler), 1);
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = null;
    }
    return oTarget;
}
function eventhandlers(oTarget) {
    return find(oTarget).eventHandlers;
}
function dieevent(oTarget, sEventType) {
    oTarget = find(oTarget);
    var handlers = oTarget.eventHandlers[sEventType];
    for (var i in handlers) {
        _removeeventhandler(oTarget, sEventType, handlers[i]);
    }
    return oTarget;
}
function eventhandle(oTarget, sEventType, fnHandle) {
    return _addeventhandler(oTarget, sEventType, function () {
        fnHandle.apply(find(oTarget), arguments);
    })
}
function eventclick(context, selector, fnHandler) {
    var oTarget = find(context);
    var hasselector = true;
    if (typeof selector === 'function') { fnHandler = selector; hasselector = false; }
    return eventhandle(oTarget, 'click', function (e) {
        var event = e || window.event;
        var args = arguments;
        var obj = event.target || event.srcElement;
        var later = (hasselector ? findall(selector, context) : findall(context));
        if (contains(later, obj)) {
            foreach(later, function (i, e) {
                fnHandler.apply(e, args);
            })
        }
        //event.stopPropagation();
        //event.preventDefault();
    });
}
function eventblur(oTarget, fnHandler) {
    return eventhandle(oTarget, 'blur', fnHandler);
}
function eventchange(oTarget, fnHandler) {
    return eventhandle(oTarget, 'change', fnHandler);
}
//browser effects section
function position(expressionOrId) {
    var pos = { x: 0, y: 0 };
    var el = find(expressionOrId);
    while (el.offsetParent) {
        pos.x += el.offsetLeft;
        pos.y += el.offsetTop;
        el = el.offsetParent;
    }
    return pos;
}
function pageX(elem) {
    var p = 0;
    while (elem.offsetParent) {
        p += elem.offsetLeft;
        elem = elem.offsetParent;
    }
    return p;
}
function pageY(elem) {
    var p = 0;
    while (elem.offsetParent) {
        p += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return p;
}
function parentX(elem) {
    return elem.parentNode == elem.offsetParent ?
        elem.offsetLeft :
        pageX(elem) - pageX(elem.parentNode);
}
function parentY(elem) {
    return elem.parentNode == elem.offsetParent ?
        elem.offsetTop :
        pageY(elem) - pageY(elem.parentNode);
}

function wizardMachine() {

}
function dialog() {

}
function overlay() {

}
function loading() {

}
function tree() {

}
function router() {
    router.domUrl = location.href;
    router.queryString = location.search;
}
function sort(array, sorter) {
    return array.sort(function (prev, next) {
        return sorter(prev, next);
    })
}
function groups() {

}
function table() {

}
function caching(name, value) {
    var id = global.id();
    caching[id] = caching[id] || {};
    if (!value) return caching[id][name];
    if (caching[id][name]) console.log('Caching value overridden. name:' + name + ';value from:' + caching[id][name] + ';to:' + value);
    caching[id][name] = value;
}
var _formUtil = {
    getRadioValue: function (elements) {
        var value = null;
        if (elements.value != undefined && elements.value != '') {
            value = elements.value;
        } else {
            for (var i = 0, len = elements.length; i < len; i++) {
                if (elements[i].checked) {
                    value = elements[i].value;
                    break;
                }
            }
        }
        return value;
    },
    getCheckboxValue: function (elements) {
        var arr = new Array();
        for (var i = 0, len = elements.length; i < len; i++) {
            if (elements[i].checked) {
                arr.push(elements[i].value);
            }
        }
        if (arr.length > 0) {
            return arr.join(',');
        } else {
            return null;
        }
    },
    getSelectValue: function (element) {
        if (element.selectedIndex == -1) {
            return null;
        };
        if (element.multiple) {
            var arr = new Array(), options = element.options;
            for (var i = 0, len = options.length; i < len; i++) {
                if (options[i].selected) {
                    arr.push(options[i].value);
                }
            }
            return arr.join(",");
        } else {
            return element.options[element.selectedIndex].value;
        }
    },
    serialize: function (form) {
        var arr = new Array(),
        elements = form.elements,
        checkboxName = null;
        for (var i = 0, len = elements.length; i < len; i++) {
            field = elements[i];
            if (field.disabled) {
                continue;
            }
            switch (field.type) {
                case "select-one":
                case "select-multiple":
                    arr.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(this.getSelectValue(field)));
                    break;
                case undefined:
                case "button":
                case "submit":
                case "reset":
                case "file":
                    break;
                case "checkbox":
                    if (checkboxName == null) {
                        checkboxName = field.name;
                        arr.push(encodeURIComponent(checkboxName) + "=" + encodeURIComponent(this.getCheckboxValue(form.elements[checkboxName])));
                    }
                    break;
                case "radio":
                    if (!field.checked) {
                        break;
                    }
                default:
                    if (field.name.length > 0) {
                        arr.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                    }
            }
        }
        return arr.join("&");
    }
};
function global() {
    global.ie = isIE();
    global.ids = global.ids || [];
    global.newid = function () {
        var i = newguid();
        global.ids.push(i);
        return i;
    }
    global.id = function () {
        return global.ids[global.ids.length - 1];
    }
    global.newid();
}
function calendar() {

}
//section css related
function css(element, attr, quevalue) {
    var obj = find(element);
    switch (arguments.length) {
        case 2:
            if (typeof arguments[1] === "object") {
                for (var i in attr) i === "opacity" ? (obj.style["filter"] = "alpha(opacity=" + attr[i] + ")", obj.style[i] = attr[i] / 100) : obj.style[i] = attr[i];
                return obj;
            } else {
                return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
            }
            break;
        case 3:
            attr === "opacity" ? (obj.style["filter"] = "alpha(opacity=" + quevalue + ")", obj.style[attr] = quevalue / 100) : obj.style[attr] = quevalue;
            break;
    }
    return obj;
};
//will affect width or height change
function animate(el, endCssObject, time, callBack) {
    var endCss = endCssObject;
    el = find(el);
    var FPS = 60;
    var everyStep = {}, currStyle = {};
    for (var i in endCss) {
        var currValue = parseInt(this.css(el, i));
        currStyle[i] = currValue;

        everyStep[i] = parseInt(parseInt(endCss[i]) - currValue) / time;
    }
    var frame = 0, timer;
    function step() {
        frame++;
        var t = frame / FPS * 1000;
        var t0 = t / time;
        var f = function (x, p0, p1, p2, p3) {
            //二次贝塞尔曲线
            //return Math.pow((1 - x), 2) * p0 + (2 * x) * (1 - x) * p1 + x * x * p2; 
            //基于三次贝塞尔曲线 
            return p0 * Math.pow((1 - x), 3) + 3 * p1 * x * Math.pow((1 - x), 2) + 3 * p2 * x * x * (1 - x) + p3 * Math.pow(x, 3);
        }
        //对时间进行三次贝塞尔变换 输出时间
        var t1 = f(t0, 0.3, 0.82, 1.0, 1.0) * time;
        for (var i in everyStep) {
            if (i == "opacity") el.style[i] = (currStyle[i] + everyStep[i] * t1);
            else el.style[i] = (currStyle[i] + everyStep[i] * t1) + "px";
        }
        if (frame == time / 1000 * FPS) {
            clearInterval(timer);
            callBack && callBack();
        }
    }
    timer = setInterval(step, 1000 / FPS);
    return {
        stop: function () {
            clearInterval(timer);
        }
    };

};
function height(element, quevalue) {
    if (quevalue === undefined) return parseInt(css(element, 'height'));
    else return css(element, 'height', quevalue);
}
function width(element, quevalue) {
    if (quevalue === undefined) return parseInt(css(element, 'width'));
    else return css(element, 'width', quevalue);
}
function scrollleft(element, quevalue) {
    element = find(element);
    return quevalue === undefined ? element.scrollLeft : function () { element.scrollLeft = quevalue; return element; }();
}
function scrolltop(element, quevalue) {
    element = find(element);
    return quevalue === undefined ? element.scrollLeft : function () { element.scrollTop = quevalue; return element; }();
}
function addclass(idorexpression, classname) {
    var element = find(idorexpression);
    element.className = element.className + (element.className.split(' ').indexOf(classname) === -1 ? (' ' + classname) : '');
    return element;
}
function removeclass(idorexpression, classname) {
    var element = find(idorexpression);
    var classlist = element.classList || element.className.split(' ');
    classlist.splice(classlist.indexOf(classname), 1)
    element.className = classlist.join(' ');
    return element;
}


//dom creation section
function create(domstring) {
    if (!/^</.test(domstring)) {
        domstring = '<' + domstring + '>';
    }
    var objE = document.createElement("div");
    objE.innerHTML = domstring;
    return objE.childNodes.length === 1 ? objE.childNodes[0] : objE.childNodes;
}
function closest(element, idorexpression) {
    var matches = findall(idorexpression);
    if (typeof element === 'string') element = find(element);
    element = element.parentNode;
    while (element) {
        if (matches.indexOf(element) !== -1 && element) {
            return element;
        }
        element = element.parentNode;
    }
}
function text(element, quetext) {
    var el = find(element);
    if (!quetext) return el.innerText;
    el.innerText = quetext;
    return el;
}
function html(element, quehtml) {
    var el = find(element);
    if (!quehtml)
        return el.innerHTML;
    el.innerHTML = quehtml;
    return el;
}
function outerhtml(element, quehtml) {
    var el = find(element);
    if (!quehtml)
        return el.outerHTML;
    el.outerHTML = quehtml;
}
function attr(element, atname, atvalue) {
    var el = find(element);
    if (atvalue === undefined) return el.getAttribute(atname);
    el.setAttribute(atname, atvalue);
    return el;
}
function append(container, elementorstring) {
    container = find(container);
    var element = find(elementorstring) ? find(elementorstring) : (typeof elementorstring === 'string' ? create(elementorstring) : elementorstring);
    if (element.length === undefined) container.appendChild(element);
    else {
        var arr = _transfromarray(element);
        for (var i = 0; i < arr.length; i++) {
            append(container, arr[i]);
        }
    }
    return container;
}
function before(target, elementorstring) {
    target = find(target);
    var element = find(elementorstring) ? find(elementorstring) : (typeof elementorstring === 'string' ? create(elementorstring) : elementorstring);
    var parent = target.parentNode;
    parent.insertBefore(element, target);
    return element;

}
function after(target, elementorstring) {
    target = find(target);
    var element = find(elementorstring) ? find(elementorstring) : (typeof elementorstring === 'string' ? create(elementorstring) : elementorstring);
    var parent = target.parentNode;
    if (parent.lastChild == target) {
        parent.appendChild(element);
    } else {
        parent.insertBefore(element, target.nextSibling);
    }
    return element;
}
function remove(target, quecontext) {
    var el = findall(target, quecontext);
    var parent;
    if (el.length === 1) parent = el[0].parentNode;
    for (var i = 0; i < el.length; i++) {
        var father = el[i].parentNode;
        if (father)
            father.removeChild(el[i]);
    }
    return parent;
}
function show(element, contextorduration, doshow) {
    if (typeof contextorduration === 'boolean') {
        doshow = contextorduration;
        contextorduration = 0;
    }
    var isDuration = (typeof contextorduration === 'number');
    var el = (isDuration ? findall(element) : findall(element, contextorduration));
    doshow = (typeof doshow === 'undefined' ? true : doshow);
    setTimeout(function () {
        for (var i in el) {
            css(el[i], 'display', doshow ? '' : 'none');
        }
    }, (isDuration ? contextorduration : 0));

    return el;
}
function hide(element, contextorduration) {
    return show(element, contextorduration, false);
}
function val(element, queval) {
    var el = find(element);
    switch (el.tagName) {
        case 'SELECT':
            return _formUtil.getSelectValue(el);
        case 'RADIO':
            return _formUtil.getRadioValue(el);
        case 'CHECKBOX':
            return _formUtil.getCheckboxValue(el);
        default:
            break;
    }

}
//url handle section
function urlobject(url) {
    url = url ? url : location.href;
    var reg_url = /^[^\?]+\?([\w\W]+)$/,
         reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
         arr_url = reg_url.exec(url),
         ret = {};
    if (arr_url && arr_url[1]) {
        var str_para = arr_url[1], result;
        while ((result = reg_para.exec(str_para)) != null) {
            ret[result[1]] = result[2];
        }
    }
    return ret;
}
function urlparam(name) {
    return urlobject()[name];
}
function _serializeobject(rawobject) {
    if (typeof rawobject === 'string') return encodeURIComponent(rawobject);
    var arr = [];
    for (var name in rawobject) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(rawobject[name]));
    }
    return arr.join('&');
}
function _serializeform(formelement) {
    return _formUtil.serialize(find(formelement));
}
function serialize(formorobject) {
    formorobject = find(formorobject);
    if (isDOM(formorobject)) return _serializeform(formorobject);
    return _serializeobject(formorobject);

}
function param(data) {
    var ret = serialize(data);
    ret = ret ? (ret + '&v=' + newguid()) : '';
    return ret;
}
function redirect(url) {
    location.href = url;
}
//section conversant data manipulation
function paged(dataArray, pageindex, pagesize) {
    var arr = [];
    for (var start = (pageindex - 1) * pagesize; start < pageindex * pagesize; start++) {
        arr.push(dataArray[start]);
    }
    return arr;
}
function first(array) {
    return array[0];
}
function last(array) {
    return array[array.length - 1];
}
//cookie section
function _getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    }
    else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    }
    else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}
function setcookie(name, value, time) {
    var strsec = _getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function getcookie(name) { var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"); if (arr = document.cookie.match(reg)) return unescape(arr[2]); else return null; }
function delcookie(name) { var exp = new Date(); exp.setTime(exp.getTime() - 1); var cval = getcookie(name); if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString(); }
//last section
(function (M) {
    /**
     * 通过模板字符串生成HTML
     * @param {String} tmplStr  模板字符串
     * @param {Object} data 模板数据
     *
     * @兼容性： PC: IE 6+ & Mobile All
     * 
     * @依赖： 无
     *
     * @备注： 模板以<? ?>分隔JS代码如  模板内容中暂时无法使用单引号（双引替代）模板如
     *  <h2 class="<?=className?>"></h2><? alert("OK"); ?>
     */
    var getTmpl = function (tmplStr, data) {
        var result;

        var varHtml = "";
        for (var i in data) {
            varHtml += "var " + i + " = data." + i + ";";
        }

        tmplStr = tmplStr.replace(/\s+/g, " ");
        tmplStr = varHtml + "var __result = ''; ?>" + tmplStr + "<?";
        tmplStr += " return __result;";
        tmplStr = tmplStr.replace(/<\?=([^\?]+)\?>/g, "' + $1 + '").replace(/<\?/gi, "';").replace(/\?>/g, "__result += '");

        var str = new Function("data", tmplStr);
        result = str(data);

        return result;
    };

    /**
     * 渲染HTML中的模板标签
     * @param {String} 模板标签的id
     * @param {Object} 模板数据
     * @param {boolean} 下次渲染是否以追加的方式渲染 默认为非
     *
     * @兼容性 PC: IE 9+ & Mobile All
     * @依赖 getTmpl
     *
     * @备注： 模板如
     * <div>
     *  <script type='text/plain' id='list'>
     *      <? for(var i = 0; i < 10; i ++){
     *      ?>
     *
     *      <h1><?=i?></h1>
     *
     *      <? } ?>
     *  </script>
     *  </div>
     *
     *  调用如：  Util.renderTmpl('list', {});//会在div下直接生成模板HTML输出
     */
    //保留上次的el地址，便于清除
    var lastRenderEls = {};
    var renderTmpl = function (id, data, isAppend) {
        var tmplNode = document.getElementById(id);
        var tmplString = tmplNode.innerHTML;
        var result = getTmpl(tmplString, data);

        if (!lastRenderEls[id]) lastRenderEls[id] = [];

        if (!isAppend) {
            //清除上次的渲染
            for (var i = 0; i < lastRenderEls[id].length; i++) {
                var lastItem = lastRenderEls[id][i];

                lastItem.parentNode.removeChild(lastItem);
            }
        }

        lastRenderEls[id] = [];


        var div = document.createElement("div");
        div.innerHTML = result;

        var divChildren = div.childNodes;

        while (divChildren.length > 0) {
            lastRenderEls[id].push(divChildren[0]);

            tmplNode.parentNode.insertBefore(divChildren[0], tmplNode);
        }
    };

    var getParentData = function (node, dataName) {
        var parentNode = node;

        while (parentNode) {
            if (parentNode.dataset[dataName]) {
                return parentNode.dataset[dataName];
            }

            parentNode = parentNode.parentNode;
        }

    };

    var util = {
        getTmpl: getTmpl,
        renderTmpl: renderTmpl,
        getParentData: getParentData
    };

    window.Util = util;
})();

(function (w) {
    String.prototype.format = function () {
        return (function (a, b) {
            for (var f in b) {
                (function (c) {
                    a = a.replace(new RegExp('\\{' + c + '}', 'gm'), b[c]);
                })(f);
            }
            return a;
        })(this, typeof arguments[0] !== 'object' ? arguments : arguments[0]);
    };
    w.on = eventhandle;
    w.die = dieevent;
    w.click = eventclick;
    w.handle = eventhandle;
    global();
    freeze(['global']);
    caching();
}(this));

//php cors: header('Access-Control-Allow-Origin:*');
//http://localhost:8080/cors.php
//test field

var array = ['a', 'bbd3', 'dfwf'];
var a = 'hello';
var b = { a: 1, b22: 3, cc: 5, ee22: 56 };
var c = { c: 4 };
var a = find('d1'), b = find('d2');


//compatibility issues:
//#region #queryselector region
if (!document.querySelectorAll) {
    document.querySelectorAll = function (selectors) {
        var style = document.createElement('style'), elements = [], element;
        document.documentElement.firstChild.appendChild(style);
        document._qsa = [];

        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
        window.scrollBy(0, 0);
        style.parentNode.removeChild(style);

        while (document._qsa.length) {
            element = document._qsa.shift();
            element.style.removeAttribute('x-qsa');
            elements.push(element);
        }
        document._qsa = null;
        return elements;
    };
}

if (!document.querySelector) {
    document.querySelector = function (selectors) {
        var elements = document.querySelectorAll(selectors);
        return (elements.length) ? elements[0] : null;
    };
}
// IE6,IE7，Element.querySelectorAll support
var qsaWorker = (function () {
    var idAllocator = 10000;

    function qsaWorkerShim(element, selector) {
        var needsID = element.id === "";
        if (needsID) {
            ++idAllocator;
            element.id = "__qsa" + idAllocator;
        }
        try {
            return document.querySelectorAll("#" + element.id + " " + selector);
        }
        finally {
            if (needsID) {
                element.id = "";
            }
        }
    }

    function qsaWorkerWrap(element, selector) {
        return element.querySelectorAll(selector);
    }

    // Return the one this browser wants to use
    return document.createElement('div').querySelectorAll ? qsaWorkerWrap : qsaWorkerShim;
})();
//#endregion #queryselector

//section objects island.js must be put in DOM body 
/** 
 * island.js: portable functions for querying window and document Island 
 * 
 * This module defines functions for querying window and document Island. 
 * 
 * WindowX/Y( ): return the position of the window on the screen 
 * ViewportWidth/Height( ): return the size of the browser viewport area 
 * DocumentWidth/Height( ): return the size of the document 
 * HorizontalScroll( ): return the position of the horizontal scrollbar 
 * VerticalScroll( ): return the position of the vertical scrollbar 
 * 
 * Note that there is no portable way to query the overall size of the 
 * browser window, so there are no getWindowWidth/Height( ) functions. 
 * 
 * IMPORTANT: This module must be included in the <body> of a document 
 *            instead of the <head> of the document. 
 */
var island = Island = {};

if (window.screenLeft) { // IE and others  
    Island.windowx = function () { return window.screenLeft; };
    Island.windowy = function () { return window.screenTop; };
}
else if (window.screenX) { // Firefox and others  
    Island.windowx = function () { return window.screenX; };
    Island.windowy = function () { return window.screenY; };
}

if (window.innerWidth) { // All browsers but IE  
    Island.viewportwidth = function () { return window.innerWidth; };
    Island.viewportheight = function () { return window.innerHeight; };
    Island.scrollhorizental = function () { return window.pageXOffset; };
    Island.scrollvertical = function () { return window.pageYOffset; };
}
else if (document.documentElement && document.documentElement.clientWidth) {
    // These functions are for IE 6 when there is a DOCTYPE  
    Island.viewportwidth =
        function () { return document.documentElement.clientWidth; };
    Island.viewportheight =
        function () { return document.documentElement.clientHeight; };
    Island.scrollhorizental =
        function () { return document.documentElement.scrollLeft; };
    Island.scrollvertical =
        function () { return document.documentElement.scrollTop; };
}
else if (document.body.clientWidth) {
    // These are for IE4, IE5, and IE6 without a DOCTYPE  
    Island.viewportwidth =
        function () { return document.body.clientWidth; };
    Island.viewportheight =
        function () { return document.body.clientHeight; };
    Island.scrollhorizental =
        function () { return document.body.scrollLeft; };
    Island.scrollvertical =
        function () { return document.body.scrollTop; };
}

// These functions return the size of the document. They are not window  
// related, but they are useful to have here anyway.  
if (document.documentElement && document.documentElement.scrollWidth) {
    Island.documentwidth =
        function () { return document.documentElement.scrollWidth; };
    Island.documentheight =
        function () { return document.documentElement.scrollHeight; };
}
else if (document.body.scrollWidth) {
    Island.documentwidth =
        function () { return document.body.scrollWidth; };
    Island.documentheight =
        function () { return document.body.scrollHeight; };
}