var DataGrid =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./view/index.jsonApiClient.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/snabbdom/es/h.js":
/*!***************************************!*\
  !*** ./node_modules/snabbdom/es/h.js ***!
  \***************************************/
/*! exports provided: h, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"h\", function() { return h; });\n/* harmony import */ var _vnode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vnode */ \"./node_modules/snabbdom/es/vnode.js\");\n/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./is */ \"./node_modules/snabbdom/es/is.js\");\n\n\nfunction addNS(data, children, sel) {\n    data.ns = 'http://www.w3.org/2000/svg';\n    if (sel !== 'foreignObject' && children !== undefined) {\n        for (var i = 0; i < children.length; ++i) {\n            var childData = children[i].data;\n            if (childData !== undefined) {\n                addNS(childData, children[i].children, children[i].sel);\n            }\n        }\n    }\n}\nfunction h(sel, b, c) {\n    var data = {}, children, text, i;\n    if (c !== undefined) {\n        data = b;\n        if (_is__WEBPACK_IMPORTED_MODULE_1__[\"array\"](c)) {\n            children = c;\n        }\n        else if (_is__WEBPACK_IMPORTED_MODULE_1__[\"primitive\"](c)) {\n            text = c;\n        }\n        else if (c && c.sel) {\n            children = [c];\n        }\n    }\n    else if (b !== undefined) {\n        if (_is__WEBPACK_IMPORTED_MODULE_1__[\"array\"](b)) {\n            children = b;\n        }\n        else if (_is__WEBPACK_IMPORTED_MODULE_1__[\"primitive\"](b)) {\n            text = b;\n        }\n        else if (b && b.sel) {\n            children = [b];\n        }\n        else {\n            data = b;\n        }\n    }\n    if (children !== undefined) {\n        for (i = 0; i < children.length; ++i) {\n            if (_is__WEBPACK_IMPORTED_MODULE_1__[\"primitive\"](children[i]))\n                children[i] = Object(_vnode__WEBPACK_IMPORTED_MODULE_0__[\"vnode\"])(undefined, undefined, undefined, children[i], undefined);\n        }\n    }\n    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&\n        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {\n        addNS(data, children, sel);\n    }\n    return Object(_vnode__WEBPACK_IMPORTED_MODULE_0__[\"vnode\"])(sel, data, children, text, undefined);\n}\n;\n/* harmony default export */ __webpack_exports__[\"default\"] = (h);\n//# sourceMappingURL=h.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/es/h.js?");

/***/ }),

/***/ "./node_modules/snabbdom/es/htmldomapi.js":
/*!************************************************!*\
  !*** ./node_modules/snabbdom/es/htmldomapi.js ***!
  \************************************************/
/*! exports provided: htmlDomApi, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"htmlDomApi\", function() { return htmlDomApi; });\nfunction createElement(tagName) {\n    return document.createElement(tagName);\n}\nfunction createElementNS(namespaceURI, qualifiedName) {\n    return document.createElementNS(namespaceURI, qualifiedName);\n}\nfunction createTextNode(text) {\n    return document.createTextNode(text);\n}\nfunction createComment(text) {\n    return document.createComment(text);\n}\nfunction insertBefore(parentNode, newNode, referenceNode) {\n    parentNode.insertBefore(newNode, referenceNode);\n}\nfunction removeChild(node, child) {\n    node.removeChild(child);\n}\nfunction appendChild(node, child) {\n    node.appendChild(child);\n}\nfunction parentNode(node) {\n    return node.parentNode;\n}\nfunction nextSibling(node) {\n    return node.nextSibling;\n}\nfunction tagName(elm) {\n    return elm.tagName;\n}\nfunction setTextContent(node, text) {\n    node.textContent = text;\n}\nfunction getTextContent(node) {\n    return node.textContent;\n}\nfunction isElement(node) {\n    return node.nodeType === 1;\n}\nfunction isText(node) {\n    return node.nodeType === 3;\n}\nfunction isComment(node) {\n    return node.nodeType === 8;\n}\nvar htmlDomApi = {\n    createElement: createElement,\n    createElementNS: createElementNS,\n    createTextNode: createTextNode,\n    createComment: createComment,\n    insertBefore: insertBefore,\n    removeChild: removeChild,\n    appendChild: appendChild,\n    parentNode: parentNode,\n    nextSibling: nextSibling,\n    tagName: tagName,\n    setTextContent: setTextContent,\n    getTextContent: getTextContent,\n    isElement: isElement,\n    isText: isText,\n    isComment: isComment,\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (htmlDomApi);\n//# sourceMappingURL=htmldomapi.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/es/htmldomapi.js?");

/***/ }),

/***/ "./node_modules/snabbdom/es/is.js":
/*!****************************************!*\
  !*** ./node_modules/snabbdom/es/is.js ***!
  \****************************************/
/*! exports provided: array, primitive */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"array\", function() { return array; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"primitive\", function() { return primitive; });\nvar array = Array.isArray;\nfunction primitive(s) {\n    return typeof s === 'string' || typeof s === 'number';\n}\n//# sourceMappingURL=is.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/es/is.js?");

/***/ }),

/***/ "./node_modules/snabbdom/es/snabbdom.js":
/*!**********************************************!*\
  !*** ./node_modules/snabbdom/es/snabbdom.js ***!
  \**********************************************/
/*! exports provided: h, thunk, init */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"init\", function() { return init; });\n/* harmony import */ var _vnode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vnode */ \"./node_modules/snabbdom/es/vnode.js\");\n/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./is */ \"./node_modules/snabbdom/es/is.js\");\n/* harmony import */ var _htmldomapi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./htmldomapi */ \"./node_modules/snabbdom/es/htmldomapi.js\");\n/* harmony import */ var _h__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./h */ \"./node_modules/snabbdom/es/h.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"h\", function() { return _h__WEBPACK_IMPORTED_MODULE_3__[\"h\"]; });\n\n/* harmony import */ var _thunk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./thunk */ \"./node_modules/snabbdom/es/thunk.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"thunk\", function() { return _thunk__WEBPACK_IMPORTED_MODULE_4__[\"thunk\"]; });\n\n\n\n\nfunction isUndef(s) { return s === undefined; }\nfunction isDef(s) { return s !== undefined; }\nvar emptyNode = Object(_vnode__WEBPACK_IMPORTED_MODULE_0__[\"default\"])('', {}, [], undefined, undefined);\nfunction sameVnode(vnode1, vnode2) {\n    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;\n}\nfunction isVnode(vnode) {\n    return vnode.sel !== undefined;\n}\nfunction createKeyToOldIdx(children, beginIdx, endIdx) {\n    var i, map = {}, key, ch;\n    for (i = beginIdx; i <= endIdx; ++i) {\n        ch = children[i];\n        if (ch != null) {\n            key = ch.key;\n            if (key !== undefined)\n                map[key] = i;\n        }\n    }\n    return map;\n}\nvar hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];\n\n\nfunction init(modules, domApi) {\n    var i, j, cbs = {};\n    var api = domApi !== undefined ? domApi : _htmldomapi__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\n    for (i = 0; i < hooks.length; ++i) {\n        cbs[hooks[i]] = [];\n        for (j = 0; j < modules.length; ++j) {\n            var hook = modules[j][hooks[i]];\n            if (hook !== undefined) {\n                cbs[hooks[i]].push(hook);\n            }\n        }\n    }\n    function emptyNodeAt(elm) {\n        var id = elm.id ? '#' + elm.id : '';\n        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';\n        return Object(_vnode__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);\n    }\n    function createRmCb(childElm, listeners) {\n        return function rmCb() {\n            if (--listeners === 0) {\n                var parent_1 = api.parentNode(childElm);\n                api.removeChild(parent_1, childElm);\n            }\n        };\n    }\n    function createElm(vnode, insertedVnodeQueue) {\n        var i, data = vnode.data;\n        if (data !== undefined) {\n            if (isDef(i = data.hook) && isDef(i = i.init)) {\n                i(vnode);\n                data = vnode.data;\n            }\n        }\n        var children = vnode.children, sel = vnode.sel;\n        if (sel === '!') {\n            if (isUndef(vnode.text)) {\n                vnode.text = '';\n            }\n            vnode.elm = api.createComment(vnode.text);\n        }\n        else if (sel !== undefined) {\n            // Parse selector\n            var hashIdx = sel.indexOf('#');\n            var dotIdx = sel.indexOf('.', hashIdx);\n            var hash = hashIdx > 0 ? hashIdx : sel.length;\n            var dot = dotIdx > 0 ? dotIdx : sel.length;\n            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;\n            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)\n                : api.createElement(tag);\n            if (hash < dot)\n                elm.setAttribute('id', sel.slice(hash + 1, dot));\n            if (dotIdx > 0)\n                elm.setAttribute('class', sel.slice(dot + 1).replace(/\\./g, ' '));\n            for (i = 0; i < cbs.create.length; ++i)\n                cbs.create[i](emptyNode, vnode);\n            if (_is__WEBPACK_IMPORTED_MODULE_1__[\"array\"](children)) {\n                for (i = 0; i < children.length; ++i) {\n                    var ch = children[i];\n                    if (ch != null) {\n                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));\n                    }\n                }\n            }\n            else if (_is__WEBPACK_IMPORTED_MODULE_1__[\"primitive\"](vnode.text)) {\n                api.appendChild(elm, api.createTextNode(vnode.text));\n            }\n            i = vnode.data.hook; // Reuse variable\n            if (isDef(i)) {\n                if (i.create)\n                    i.create(emptyNode, vnode);\n                if (i.insert)\n                    insertedVnodeQueue.push(vnode);\n            }\n        }\n        else {\n            vnode.elm = api.createTextNode(vnode.text);\n        }\n        return vnode.elm;\n    }\n    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {\n        for (; startIdx <= endIdx; ++startIdx) {\n            var ch = vnodes[startIdx];\n            if (ch != null) {\n                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);\n            }\n        }\n    }\n    function invokeDestroyHook(vnode) {\n        var i, j, data = vnode.data;\n        if (data !== undefined) {\n            if (isDef(i = data.hook) && isDef(i = i.destroy))\n                i(vnode);\n            for (i = 0; i < cbs.destroy.length; ++i)\n                cbs.destroy[i](vnode);\n            if (vnode.children !== undefined) {\n                for (j = 0; j < vnode.children.length; ++j) {\n                    i = vnode.children[j];\n                    if (i != null && typeof i !== \"string\") {\n                        invokeDestroyHook(i);\n                    }\n                }\n            }\n        }\n    }\n    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {\n        for (; startIdx <= endIdx; ++startIdx) {\n            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];\n            if (ch != null) {\n                if (isDef(ch.sel)) {\n                    invokeDestroyHook(ch);\n                    listeners = cbs.remove.length + 1;\n                    rm = createRmCb(ch.elm, listeners);\n                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)\n                        cbs.remove[i_1](ch, rm);\n                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {\n                        i_1(ch, rm);\n                    }\n                    else {\n                        rm();\n                    }\n                }\n                else { // Text node\n                    api.removeChild(parentElm, ch.elm);\n                }\n            }\n        }\n    }\n    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {\n        var oldStartIdx = 0, newStartIdx = 0;\n        var oldEndIdx = oldCh.length - 1;\n        var oldStartVnode = oldCh[0];\n        var oldEndVnode = oldCh[oldEndIdx];\n        var newEndIdx = newCh.length - 1;\n        var newStartVnode = newCh[0];\n        var newEndVnode = newCh[newEndIdx];\n        var oldKeyToIdx;\n        var idxInOld;\n        var elmToMove;\n        var before;\n        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {\n            if (oldStartVnode == null) {\n                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left\n            }\n            else if (oldEndVnode == null) {\n                oldEndVnode = oldCh[--oldEndIdx];\n            }\n            else if (newStartVnode == null) {\n                newStartVnode = newCh[++newStartIdx];\n            }\n            else if (newEndVnode == null) {\n                newEndVnode = newCh[--newEndIdx];\n            }\n            else if (sameVnode(oldStartVnode, newStartVnode)) {\n                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);\n                oldStartVnode = oldCh[++oldStartIdx];\n                newStartVnode = newCh[++newStartIdx];\n            }\n            else if (sameVnode(oldEndVnode, newEndVnode)) {\n                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);\n                oldEndVnode = oldCh[--oldEndIdx];\n                newEndVnode = newCh[--newEndIdx];\n            }\n            else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right\n                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);\n                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));\n                oldStartVnode = oldCh[++oldStartIdx];\n                newEndVnode = newCh[--newEndIdx];\n            }\n            else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left\n                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);\n                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);\n                oldEndVnode = oldCh[--oldEndIdx];\n                newStartVnode = newCh[++newStartIdx];\n            }\n            else {\n                if (oldKeyToIdx === undefined) {\n                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);\n                }\n                idxInOld = oldKeyToIdx[newStartVnode.key];\n                if (isUndef(idxInOld)) { // New element\n                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);\n                    newStartVnode = newCh[++newStartIdx];\n                }\n                else {\n                    elmToMove = oldCh[idxInOld];\n                    if (elmToMove.sel !== newStartVnode.sel) {\n                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);\n                    }\n                    else {\n                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);\n                        oldCh[idxInOld] = undefined;\n                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);\n                    }\n                    newStartVnode = newCh[++newStartIdx];\n                }\n            }\n        }\n        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {\n            if (oldStartIdx > oldEndIdx) {\n                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;\n                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);\n            }\n            else {\n                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);\n            }\n        }\n    }\n    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {\n        var i, hook;\n        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {\n            i(oldVnode, vnode);\n        }\n        var elm = vnode.elm = oldVnode.elm;\n        var oldCh = oldVnode.children;\n        var ch = vnode.children;\n        if (oldVnode === vnode)\n            return;\n        if (vnode.data !== undefined) {\n            for (i = 0; i < cbs.update.length; ++i)\n                cbs.update[i](oldVnode, vnode);\n            i = vnode.data.hook;\n            if (isDef(i) && isDef(i = i.update))\n                i(oldVnode, vnode);\n        }\n        if (isUndef(vnode.text)) {\n            if (isDef(oldCh) && isDef(ch)) {\n                if (oldCh !== ch)\n                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);\n            }\n            else if (isDef(ch)) {\n                if (isDef(oldVnode.text))\n                    api.setTextContent(elm, '');\n                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);\n            }\n            else if (isDef(oldCh)) {\n                removeVnodes(elm, oldCh, 0, oldCh.length - 1);\n            }\n            else if (isDef(oldVnode.text)) {\n                api.setTextContent(elm, '');\n            }\n        }\n        else if (oldVnode.text !== vnode.text) {\n            if (isDef(oldCh)) {\n                removeVnodes(elm, oldCh, 0, oldCh.length - 1);\n            }\n            api.setTextContent(elm, vnode.text);\n        }\n        if (isDef(hook) && isDef(i = hook.postpatch)) {\n            i(oldVnode, vnode);\n        }\n    }\n    return function patch(oldVnode, vnode) {\n        var i, elm, parent;\n        var insertedVnodeQueue = [];\n        for (i = 0; i < cbs.pre.length; ++i)\n            cbs.pre[i]();\n        if (!isVnode(oldVnode)) {\n            oldVnode = emptyNodeAt(oldVnode);\n        }\n        if (sameVnode(oldVnode, vnode)) {\n            patchVnode(oldVnode, vnode, insertedVnodeQueue);\n        }\n        else {\n            elm = oldVnode.elm;\n            parent = api.parentNode(elm);\n            createElm(vnode, insertedVnodeQueue);\n            if (parent !== null) {\n                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));\n                removeVnodes(parent, [oldVnode], 0, 0);\n            }\n        }\n        for (i = 0; i < insertedVnodeQueue.length; ++i) {\n            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);\n        }\n        for (i = 0; i < cbs.post.length; ++i)\n            cbs.post[i]();\n        return vnode;\n    };\n}\n//# sourceMappingURL=snabbdom.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/es/snabbdom.js?");

/***/ }),

/***/ "./node_modules/snabbdom/es/thunk.js":
/*!*******************************************!*\
  !*** ./node_modules/snabbdom/es/thunk.js ***!
  \*******************************************/
/*! exports provided: thunk, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"thunk\", function() { return thunk; });\n/* harmony import */ var _h__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./h */ \"./node_modules/snabbdom/es/h.js\");\n\nfunction copyToThunk(vnode, thunk) {\n    thunk.elm = vnode.elm;\n    vnode.data.fn = thunk.data.fn;\n    vnode.data.args = thunk.data.args;\n    thunk.data = vnode.data;\n    thunk.children = vnode.children;\n    thunk.text = vnode.text;\n    thunk.elm = vnode.elm;\n}\nfunction init(thunk) {\n    var cur = thunk.data;\n    var vnode = cur.fn.apply(undefined, cur.args);\n    copyToThunk(vnode, thunk);\n}\nfunction prepatch(oldVnode, thunk) {\n    var i, old = oldVnode.data, cur = thunk.data;\n    var oldArgs = old.args, args = cur.args;\n    if (old.fn !== cur.fn || oldArgs.length !== args.length) {\n        copyToThunk(cur.fn.apply(undefined, args), thunk);\n        return;\n    }\n    for (i = 0; i < args.length; ++i) {\n        if (oldArgs[i] !== args[i]) {\n            copyToThunk(cur.fn.apply(undefined, args), thunk);\n            return;\n        }\n    }\n    copyToThunk(oldVnode, thunk);\n}\nvar thunk = function thunk(sel, key, fn, args) {\n    if (args === undefined) {\n        args = fn;\n        fn = key;\n        key = undefined;\n    }\n    return Object(_h__WEBPACK_IMPORTED_MODULE_0__[\"h\"])(sel, {\n        key: key,\n        hook: { init: init, prepatch: prepatch },\n        fn: fn,\n        args: args\n    });\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (thunk);\n//# sourceMappingURL=thunk.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/es/thunk.js?");

/***/ }),

/***/ "./node_modules/snabbdom/es/vnode.js":
/*!*******************************************!*\
  !*** ./node_modules/snabbdom/es/vnode.js ***!
  \*******************************************/
/*! exports provided: vnode, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"vnode\", function() { return vnode; });\nfunction vnode(sel, data, children, text, elm) {\n    var key = data === undefined ? undefined : data.key;\n    return { sel: sel, data: data, children: children, text: text, elm: elm, key: key };\n}\n/* harmony default export */ __webpack_exports__[\"default\"] = (vnode);\n//# sourceMappingURL=vnode.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/es/vnode.js?");

/***/ }),

/***/ "./node_modules/snabbdom/h.js":
/*!************************************!*\
  !*** ./node_modules/snabbdom/h.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar vnode_1 = __webpack_require__(/*! ./vnode */ \"./node_modules/snabbdom/vnode.js\");\nvar is = __webpack_require__(/*! ./is */ \"./node_modules/snabbdom/is.js\");\nfunction addNS(data, children, sel) {\n    data.ns = 'http://www.w3.org/2000/svg';\n    if (sel !== 'foreignObject' && children !== undefined) {\n        for (var i = 0; i < children.length; ++i) {\n            var childData = children[i].data;\n            if (childData !== undefined) {\n                addNS(childData, children[i].children, children[i].sel);\n            }\n        }\n    }\n}\nfunction h(sel, b, c) {\n    var data = {}, children, text, i;\n    if (c !== undefined) {\n        data = b;\n        if (is.array(c)) {\n            children = c;\n        }\n        else if (is.primitive(c)) {\n            text = c;\n        }\n        else if (c && c.sel) {\n            children = [c];\n        }\n    }\n    else if (b !== undefined) {\n        if (is.array(b)) {\n            children = b;\n        }\n        else if (is.primitive(b)) {\n            text = b;\n        }\n        else if (b && b.sel) {\n            children = [b];\n        }\n        else {\n            data = b;\n        }\n    }\n    if (children !== undefined) {\n        for (i = 0; i < children.length; ++i) {\n            if (is.primitive(children[i]))\n                children[i] = vnode_1.vnode(undefined, undefined, undefined, children[i], undefined);\n        }\n    }\n    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&\n        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {\n        addNS(data, children, sel);\n    }\n    return vnode_1.vnode(sel, data, children, text, undefined);\n}\nexports.h = h;\n;\nexports.default = h;\n//# sourceMappingURL=h.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/h.js?");

/***/ }),

/***/ "./node_modules/snabbdom/is.js":
/*!*************************************!*\
  !*** ./node_modules/snabbdom/is.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.array = Array.isArray;\nfunction primitive(s) {\n    return typeof s === 'string' || typeof s === 'number';\n}\nexports.primitive = primitive;\n//# sourceMappingURL=is.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/is.js?");

/***/ }),

/***/ "./node_modules/snabbdom/modules/attributes.js":
/*!*****************************************************!*\
  !*** ./node_modules/snabbdom/modules/attributes.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar xlinkNS = 'http://www.w3.org/1999/xlink';\nvar xmlNS = 'http://www.w3.org/XML/1998/namespace';\nvar colonChar = 58;\nvar xChar = 120;\nfunction updateAttrs(oldVnode, vnode) {\n    var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;\n    if (!oldAttrs && !attrs)\n        return;\n    if (oldAttrs === attrs)\n        return;\n    oldAttrs = oldAttrs || {};\n    attrs = attrs || {};\n    // update modified attributes, add new attributes\n    for (key in attrs) {\n        var cur = attrs[key];\n        var old = oldAttrs[key];\n        if (old !== cur) {\n            if (cur === true) {\n                elm.setAttribute(key, \"\");\n            }\n            else if (cur === false) {\n                elm.removeAttribute(key);\n            }\n            else {\n                if (key.charCodeAt(0) !== xChar) {\n                    elm.setAttribute(key, cur);\n                }\n                else if (key.charCodeAt(3) === colonChar) {\n                    // Assume xml namespace\n                    elm.setAttributeNS(xmlNS, key, cur);\n                }\n                else if (key.charCodeAt(5) === colonChar) {\n                    // Assume xlink namespace\n                    elm.setAttributeNS(xlinkNS, key, cur);\n                }\n                else {\n                    elm.setAttribute(key, cur);\n                }\n            }\n        }\n    }\n    // remove removed attributes\n    // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)\n    // the other option is to remove all attributes with value == undefined\n    for (key in oldAttrs) {\n        if (!(key in attrs)) {\n            elm.removeAttribute(key);\n        }\n    }\n}\nexports.attributesModule = { create: updateAttrs, update: updateAttrs };\nexports.default = exports.attributesModule;\n//# sourceMappingURL=attributes.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/modules/attributes.js?");

/***/ }),

/***/ "./node_modules/snabbdom/modules/class.js":
/*!************************************************!*\
  !*** ./node_modules/snabbdom/modules/class.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction updateClass(oldVnode, vnode) {\n    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;\n    if (!oldClass && !klass)\n        return;\n    if (oldClass === klass)\n        return;\n    oldClass = oldClass || {};\n    klass = klass || {};\n    for (name in oldClass) {\n        if (!klass[name]) {\n            elm.classList.remove(name);\n        }\n    }\n    for (name in klass) {\n        cur = klass[name];\n        if (cur !== oldClass[name]) {\n            elm.classList[cur ? 'add' : 'remove'](name);\n        }\n    }\n}\nexports.classModule = { create: updateClass, update: updateClass };\nexports.default = exports.classModule;\n//# sourceMappingURL=class.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/modules/class.js?");

/***/ }),

/***/ "./node_modules/snabbdom/modules/eventlisteners.js":
/*!*********************************************************!*\
  !*** ./node_modules/snabbdom/modules/eventlisteners.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction invokeHandler(handler, vnode, event) {\n    if (typeof handler === \"function\") {\n        // call function handler\n        handler.call(vnode, event, vnode);\n    }\n    else if (typeof handler === \"object\") {\n        // call handler with arguments\n        if (typeof handler[0] === \"function\") {\n            // special case for single argument for performance\n            if (handler.length === 2) {\n                handler[0].call(vnode, handler[1], event, vnode);\n            }\n            else {\n                var args = handler.slice(1);\n                args.push(event);\n                args.push(vnode);\n                handler[0].apply(vnode, args);\n            }\n        }\n        else {\n            // call multiple handlers\n            for (var i = 0; i < handler.length; i++) {\n                invokeHandler(handler[i], vnode, event);\n            }\n        }\n    }\n}\nfunction handleEvent(event, vnode) {\n    var name = event.type, on = vnode.data.on;\n    // call event handler(s) if exists\n    if (on && on[name]) {\n        invokeHandler(on[name], vnode, event);\n    }\n}\nfunction createListener() {\n    return function handler(event) {\n        handleEvent(event, handler.vnode);\n    };\n}\nfunction updateEventListeners(oldVnode, vnode) {\n    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;\n    // optimization for reused immutable handlers\n    if (oldOn === on) {\n        return;\n    }\n    // remove existing listeners which no longer used\n    if (oldOn && oldListener) {\n        // if element changed or deleted we remove all existing listeners unconditionally\n        if (!on) {\n            for (name in oldOn) {\n                // remove listener if element was changed or existing listeners removed\n                oldElm.removeEventListener(name, oldListener, false);\n            }\n        }\n        else {\n            for (name in oldOn) {\n                // remove listener if existing listener removed\n                if (!on[name]) {\n                    oldElm.removeEventListener(name, oldListener, false);\n                }\n            }\n        }\n    }\n    // add new listeners which has not already attached\n    if (on) {\n        // reuse existing listener or create new\n        var listener = vnode.listener = oldVnode.listener || createListener();\n        // update vnode for listener\n        listener.vnode = vnode;\n        // if element changed or added we add all needed listeners unconditionally\n        if (!oldOn) {\n            for (name in on) {\n                // add listener if element was changed or new listeners added\n                elm.addEventListener(name, listener, false);\n            }\n        }\n        else {\n            for (name in on) {\n                // add listener if new listener added\n                if (!oldOn[name]) {\n                    elm.addEventListener(name, listener, false);\n                }\n            }\n        }\n    }\n}\nexports.eventListenersModule = {\n    create: updateEventListeners,\n    update: updateEventListeners,\n    destroy: updateEventListeners\n};\nexports.default = exports.eventListenersModule;\n//# sourceMappingURL=eventlisteners.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/modules/eventlisteners.js?");

/***/ }),

/***/ "./node_modules/snabbdom/modules/props.js":
/*!************************************************!*\
  !*** ./node_modules/snabbdom/modules/props.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction updateProps(oldVnode, vnode) {\n    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;\n    if (!oldProps && !props)\n        return;\n    if (oldProps === props)\n        return;\n    oldProps = oldProps || {};\n    props = props || {};\n    for (key in oldProps) {\n        if (!props[key]) {\n            delete elm[key];\n        }\n    }\n    for (key in props) {\n        cur = props[key];\n        old = oldProps[key];\n        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {\n            elm[key] = cur;\n        }\n    }\n}\nexports.propsModule = { create: updateProps, update: updateProps };\nexports.default = exports.propsModule;\n//# sourceMappingURL=props.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/modules/props.js?");

/***/ }),

/***/ "./node_modules/snabbdom/modules/style.js":
/*!************************************************!*\
  !*** ./node_modules/snabbdom/modules/style.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n// Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.\nvar raf = (typeof window !== 'undefined' && (window.requestAnimationFrame).bind(window)) || setTimeout;\nvar nextFrame = function (fn) { raf(function () { raf(fn); }); };\nvar reflowForced = false;\nfunction setNextFrame(obj, prop, val) {\n    nextFrame(function () { obj[prop] = val; });\n}\nfunction updateStyle(oldVnode, vnode) {\n    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;\n    if (!oldStyle && !style)\n        return;\n    if (oldStyle === style)\n        return;\n    oldStyle = oldStyle || {};\n    style = style || {};\n    var oldHasDel = 'delayed' in oldStyle;\n    for (name in oldStyle) {\n        if (!style[name]) {\n            if (name[0] === '-' && name[1] === '-') {\n                elm.style.removeProperty(name);\n            }\n            else {\n                elm.style[name] = '';\n            }\n        }\n    }\n    for (name in style) {\n        cur = style[name];\n        if (name === 'delayed' && style.delayed) {\n            for (var name2 in style.delayed) {\n                cur = style.delayed[name2];\n                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {\n                    setNextFrame(elm.style, name2, cur);\n                }\n            }\n        }\n        else if (name !== 'remove' && cur !== oldStyle[name]) {\n            if (name[0] === '-' && name[1] === '-') {\n                elm.style.setProperty(name, cur);\n            }\n            else {\n                elm.style[name] = cur;\n            }\n        }\n    }\n}\nfunction applyDestroyStyle(vnode) {\n    var style, name, elm = vnode.elm, s = vnode.data.style;\n    if (!s || !(style = s.destroy))\n        return;\n    for (name in style) {\n        elm.style[name] = style[name];\n    }\n}\nfunction applyRemoveStyle(vnode, rm) {\n    var s = vnode.data.style;\n    if (!s || !s.remove) {\n        rm();\n        return;\n    }\n    if (!reflowForced) {\n        vnode.elm.offsetLeft;\n        reflowForced = true;\n    }\n    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];\n    for (name in style) {\n        applied.push(name);\n        elm.style[name] = style[name];\n    }\n    compStyle = getComputedStyle(elm);\n    var props = compStyle['transition-property'].split(', ');\n    for (; i < props.length; ++i) {\n        if (applied.indexOf(props[i]) !== -1)\n            amount++;\n    }\n    elm.addEventListener('transitionend', function (ev) {\n        if (ev.target === elm)\n            --amount;\n        if (amount === 0)\n            rm();\n    });\n}\nfunction forceReflow() {\n    reflowForced = false;\n}\nexports.styleModule = {\n    pre: forceReflow,\n    create: updateStyle,\n    update: updateStyle,\n    destroy: applyDestroyStyle,\n    remove: applyRemoveStyle\n};\nexports.default = exports.styleModule;\n//# sourceMappingURL=style.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/modules/style.js?");

/***/ }),

/***/ "./node_modules/snabbdom/vnode.js":
/*!****************************************!*\
  !*** ./node_modules/snabbdom/vnode.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nfunction vnode(sel, data, children, text, elm) {\n    var key = data === undefined ? undefined : data.key;\n    return { sel: sel, data: data, children: children, text: text, elm: elm, key: key };\n}\nexports.vnode = vnode;\nexports.default = vnode;\n//# sourceMappingURL=vnode.js.map\n\n//# sourceURL=webpack://DataGrid/./node_modules/snabbdom/vnode.js?");

/***/ }),

/***/ "./src/htmlHelpers.js":
/*!****************************!*\
  !*** ./src/htmlHelpers.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function toCssClassName(string) {\r\n    const noSpaces = string.replace(/\\s|-/g, '_');\r\n    return 'c' + noSpaces.replace(/[\\W]/g, '');\r\n}\r\n\r\nmodule.exports = {\r\n    toCssClassName\r\n};\n\n//# sourceURL=webpack://DataGrid/./src/htmlHelpers.js?");

/***/ }),

/***/ "./view/index.jsonApiClient.js":
/*!*************************************!*\
  !*** ./view/index.jsonApiClient.js ***!
  \*************************************/
/*! exports provided: initGrid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initGrid\", function() { return initGrid; });\n/* harmony import */ var _src_JsonApiActionDispatcher__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/JsonApiActionDispatcher */ \"./view/src/JsonApiActionDispatcher.js\");\n/* harmony import */ var _src_DataGridView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/DataGridView */ \"./view/src/DataGridView.js\");\n\r\n\r\n\r\nfunction initGrid(selector, actionUrl) {\r\n    const apiActionDispatcher = Object(_src_JsonApiActionDispatcher__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(actionUrl);\r\n    console.log('json api client app loaded');\r\n    const el = document.querySelector(selector);\r\n\r\n    console.log('init on element ' + selector, el);\r\n    Object(_src_DataGridView__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(el, apiActionDispatcher);\r\n}\n\n//# sourceURL=webpack://DataGrid/./view/index.jsonApiClient.js?");

/***/ }),

/***/ "./view/src/DataGridView.js":
/*!**********************************!*\
  !*** ./view/src/DataGridView.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return DataGridView; });\n/* harmony import */ var _documentReady__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./documentReady */ \"./view/src/documentReady.js\");\n/* harmony import */ var _Grid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Grid */ \"./view/src/Grid.js\");\n/**\r\n * The \"main\" module that will set up a DataGrid, initialize the view, and coordinate message passing and rendering\r\n */\r\n\r\n\r\nconst snabbdom = __webpack_require__(/*! snabbdom */ \"./node_modules/snabbdom/es/snabbdom.js\");\r\nconst patch = snabbdom.init([ // Init patch function with chosen modules\r\n    __webpack_require__(/*! snabbdom/modules/attributes */ \"./node_modules/snabbdom/modules/attributes.js\").default,\r\n    __webpack_require__(/*! snabbdom/modules/class */ \"./node_modules/snabbdom/modules/class.js\").default,\r\n    __webpack_require__(/*! snabbdom/modules/props */ \"./node_modules/snabbdom/modules/props.js\").default,\r\n    __webpack_require__(/*! snabbdom/modules/style */ \"./node_modules/snabbdom/modules/style.js\").default,\r\n    __webpack_require__(/*! snabbdom/modules/eventlisteners */ \"./node_modules/snabbdom/modules/eventlisteners.js\").default\r\n]);\r\n\r\n\r\n\r\n/**\r\n * vNode - root virtual node that the render function hooks into\r\n * actionDispatcher - the module that will send actions and notify the subscribed callback of new states\r\n */\r\nfunction DataGridView(vNode, actionDispatcher) {\r\n    let vnode = vNode;\r\n    window.action = actionDispatcher.send; //use global to avoid passing this down to every last component\r\n    actionDispatcher.subscribe(render);\r\n\r\n    Object(_documentReady__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(document)\r\n        .then(initializeAppLevelEvents)\r\n        .then(actionDispatcher.send({action: 'refresh'}));\r\n\r\n    function render(nextState) {\r\n        console.log('Got new state from action module', nextState);\r\n        const nextView = Object(_Grid__WEBPACK_IMPORTED_MODULE_1__[\"Grid\"])(nextState);\r\n        vnode = patch(vnode, nextView);\r\n    }\r\n}\r\n\r\nfunction initializeAppLevelEvents() {\r\n    const body = document.querySelector('body');\r\n    body.addEventListener('keyup', e => {\r\n        let key = e.key;\r\n\r\n        if (e.ctrlKey)\r\n            key = `ctrl+${key}`;\r\n\r\n        switch (key) {\r\n            case \"ctrl+z\":\r\n                undo();\r\n                break;\r\n            case \"ctrl+Z\":\r\n                redo();\r\n                break;\r\n        }\r\n    });\r\n\r\n    window.addEventListener('beforeunload', (event) => {\r\n        event.preventDefault();\r\n        event.returnValue = 'Rate and Rank';\r\n    });\r\n}\r\n\r\nfunction undo() {\r\n    action({action: 'undo'});\r\n}\r\n\r\nfunction redo() {\r\n    action({action: 'redo'});\r\n}\r\n\n\n//# sourceURL=webpack://DataGrid/./view/src/DataGridView.js?");

/***/ }),

/***/ "./view/src/Grid.js":
/*!**************************!*\
  !*** ./view/src/Grid.js ***!
  \**************************/
/*! exports provided: Grid */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Grid\", function() { return Grid; });\n/* harmony import */ var _viewHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewHelpers */ \"./view/src/viewHelpers.js\");\n/* harmony import */ var _Row__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Row */ \"./view/src/Row.js\");\n//The component view for a DataGrid\r\n\r\n\r\n\r\nconst h = __webpack_require__(/*! snabbdom/h */ \"./node_modules/snabbdom/h.js\").default;\r\n\r\nfunction Grid(state) {\r\n    const columns = state.config.columns;\r\n\r\n    const data = {\r\n        on: {\r\n            dragenter: allowAndIgnoreDrops,\r\n            dragover: allowAndIgnoreDrops,\r\n            drop: allowAndIgnoreDrops\r\n        },\r\n        style: {\r\n            'min-height': '100vh'\r\n        }\r\n    };\r\n\r\n    const headerRow = getColumnHeaders(columns);\r\n    const rows = state.rows.map((row, i) => Object(_Row__WEBPACK_IMPORTED_MODULE_1__[\"Row\"])(row, i, columns));\r\n\r\n    return h('div.grid', data, [headerRow].concat(rows));\r\n\r\n\r\n    function getColumnHeaders(columns) {\r\n        const style = Object(_viewHelpers__WEBPACK_IMPORTED_MODULE_0__[\"getGridRowStyles\"])(columns.length);\r\n\r\n        const rankHeader = gridColumnHeader({name: 'Rank', type: 'number'});\r\n        const headerItems = [rankHeader].concat(columns.map(gridColumnHeader));\r\n\r\n        return h('div.column-header-row', {style}, headerItems);\r\n    }\r\n\r\n    function gridColumnHeader(column) {\r\n        return h('div.grid-column-header', column.name);\r\n    }\r\n}\r\n\r\n/**\r\n * This indicates that dropping is allowed anywhere in the grid.\r\n * We use this to capture image drops from outside the browser\r\n * that go astray and don't land on an image drop target because\r\n * otherwise those cause the tab to load the image and replace the page.\r\n * (I couldn't find any info about how to prevent that and all of my\r\n * event experiments failed to have any effect). I do have a warning\r\n * before page onload at least.\r\n * Note that this has a side effect of also allowing pretty much\r\n * anything to be dropped on rows, so we needed to add a little bit\r\n * of extra validation in the Row drop event handler to make sure it\r\n * only handles valid row drops.\r\n */\r\nfunction allowAndIgnoreDrops(e) {\r\n    e.preventDefault();\r\n    e.stopPropagation();\r\n}\n\n//# sourceURL=webpack://DataGrid/./view/src/Grid.js?");

/***/ }),

/***/ "./view/src/GridCell.js":
/*!******************************!*\
  !*** ./view/src/GridCell.js ***!
  \******************************/
/*! exports provided: GridCell */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GridCell\", function() { return GridCell; });\n/* harmony import */ var _viewHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewHelpers */ \"./view/src/viewHelpers.js\");\n\r\n\r\nconst h = __webpack_require__(/*! snabbdom/h */ \"./node_modules/snabbdom/h.js\").default;\r\n\r\nfunction GridCell(column, rawContent, rowIndex) {\r\n    const data = {\r\n        on: {\r\n            click: makeEditable(column, rowIndex)\r\n        }\r\n    };\r\n    const className = Object(_viewHelpers__WEBPACK_IMPORTED_MODULE_0__[\"getGridCellClassName\"])(column.name, rowIndex);\r\n    data['class'] = {[className]: true};\r\n\r\n    const content = cellContent(column.type);\r\n\r\n    return h('div.grid-cell', data, content);\r\n\r\n\r\n    function cellContent(columnType) {\r\n        if (columnType === 'image') {\r\n            return makeImageCellContent(rawContent);\r\n        }\r\n        else\r\n            return rawContent;\r\n    }\r\n\r\n    function makeImageCellContent(imgSrc) {\r\n        const children = [];\r\n\r\n        if (isValid(imgSrc)) {\r\n            const imgData = {\r\n                attrs: {\r\n                    src: imgSrc,\r\n                }\r\n                //TODO: try using snabbdom hooks to check for load error and modify the element\r\n            };\r\n            const img = h('img', imgData);\r\n            children.push(img);\r\n        }\r\n        else {\r\n            const dropTargetData = {\r\n                on: {\r\n                    click: showFileChooser,\r\n                    dragenter: allowImageDrops,\r\n                    dragover: allowImageDrops,\r\n                    dragleave: unHighlight,\r\n                    drop: [handleImageDrop, rowIndex, column.name]\r\n                    //paste: [handleImagePaste, rowIndex, column.name]\r\n                }\r\n            };\r\n            const dropTarget = h('div.image-drop-target', dropTargetData, 'Drop Image or Click Here');\r\n            children.push(dropTarget);\r\n        }\r\n\r\n        const uploaderData = {\r\n            attrs: {\r\n                type: 'file',\r\n                accept: 'image/*'\r\n            },\r\n            style: {\r\n                display: 'none'\r\n            },\r\n            on: {\r\n                change: [fileChosen, rowIndex, column.name]\r\n            }\r\n        };\r\n        const uploader = h('input', uploaderData);\r\n        children.push(uploader);\r\n\r\n        return children;\r\n    }\r\n}\r\n\r\n//TODO: could improve this. Add check for \"data:image/...\" or \"http://\" at beginning\r\nfunction isValid(string) {\r\n    return string && string.length;\r\n}\r\n\r\nfunction showFileChooser(e) {\r\n    const parent = e.target.parentElement;\r\n    const fileChooser = parent.querySelector('input[type=\"file\"]');\r\n    fileChooser.click();\r\n}\r\n\r\nfunction allowImageDrops(event) {\r\n    if (couldDropHere(event.dataTransfer)) {\r\n        event.preventDefault();\r\n        event.currentTarget.classList.add('drophighlight');\r\n    }\r\n}\r\n\r\nfunction couldDropHere(dt) {\r\n    return dt.types.includes('Files');\r\n}\r\n\r\nfunction unHighlight(e) {\r\n    e.currentTarget.classList.remove('drophighlight');\r\n}\r\n\r\nfunction handleImageDrop(rowIndex, columnName, e) {\r\n    e.preventDefault();\r\n    unHighlight(e);\r\n    processDataTransfer(e.dataTransfer)\r\n        .then(imageData => saveImageData(rowIndex, columnName, imageData));\r\n}\r\n\r\nfunction handleImagePaste(rowIndex, columnName, e) {\r\n    console.log('paste');\r\n    processDataTransfer(e.clipboardData)\r\n        .then(imageData => saveImageData(rowIndex, columnName, imageData));\r\n}\r\n\r\nfunction processDataTransfer(dataTransfer) {\r\n    const types = [...dataTransfer.types];\r\n\r\n    const hasFile = types.includes('Files');\r\n    const hasLink = types.includes('text/uri-list');\r\n    const hasText = types.includes('text/plain');\r\n\r\n    if (hasFile) {\r\n        const files = [...dataTransfer.files];\r\n        return saveImageDataFromFile(files[0]);\r\n    }\r\n    else if (hasLink) {\r\n        const link = dataTransfer.getData('text/uri-list');\r\n        return saveImageDataFromLink(link);\r\n    }\r\n    else if (hasText) {\r\n        const text = dataTransfer.getData('text/plain');\r\n        return saveImageDataFromLink(text);\r\n    }\r\n    else {\r\n        console.log('No data found in dropped item');\r\n    }\r\n}\r\n\r\nfunction fileChosen(rowIndex, columnName, e) {\r\n    const file = e.target.files[0];\r\n    return saveImageDataFromFile(file)\r\n        .then(imageData => saveImageData(rowIndex, columnName, imageData));\r\n}\r\n\r\nfunction saveImageDataFromFile(file) {\r\n    return new Promise(resolve => {\r\n        let reader = new FileReader()\r\n        reader.readAsDataURL(file);\r\n        reader.addEventListener('load', e => resolve(reader.result));\r\n    });\r\n}\r\n\r\nfunction saveImageDataFromLink(url) {\r\n    return new Promise(resolve => {\r\n        const image = new Image();\r\n        image.crossOrigin = \"anonymous\";\r\n\r\n        image.onload = function () {\r\n            const canvas = document.createElement('canvas');\r\n            canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size\r\n            canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size\r\n            canvas.getContext('2d').drawImage(this, 0, 0);\r\n\r\n            resolve(canvas.toDataURL('image/png'));\r\n        };\r\n        image.src = url;\r\n    });\r\n}\r\n\r\nfunction saveImageData(rowIndex, columnName, value) {\r\n    window.action({action: 'setField', rowIndex, columnName, value});\r\n}\r\n\r\nfunction makeEditable(columnDef, rowIndex) {\r\n    if (columnDef.type === 'image') {\r\n        console.log('cell clicked');\r\n        return; //TODO: implement\r\n    }\r\n\r\n    let inputType = 'text';\r\n    if (columnDef.type === 'number')\r\n        inputType = 'number';\r\n\r\n    return function (event) {\r\n        const gridCell = event.target;\r\n        const originalValue = gridCell.textContent;\r\n        const input = document.createElement('input');\r\n        input.type = inputType;\r\n        input.value = originalValue;\r\n\r\n        const action = 'setField';\r\n        const actionData = {\r\n            action,\r\n            rowIndex,\r\n            columnName: columnDef.name\r\n        }\r\n\r\n        function submit() {\r\n            actionData.value = input.value;\r\n            //input.blur();\r\n            window.action(actionData);\r\n        }\r\n\r\n        function cancel() {\r\n            input.remove();\r\n            gridCell.innerHTML = originalValue;\r\n        }\r\n\r\n        //render()\r\n        gridCell.innerHTML = '';\r\n        gridCell.append(input);\r\n        input.select();\r\n\r\n        input.addEventListener('blur', cancel);\r\n        input.addEventListener('keydown', _viewHelpers__WEBPACK_IMPORTED_MODULE_0__[\"preventTab\"]);\r\n        input.addEventListener('keyup', e => {\r\n            switch (e.key) {\r\n                case \"Enter\":\r\n                    submit();\r\n                    break;\r\n                case \"Esc\":\r\n                case \"Escape\":\r\n                    input.blur();\r\n                    break;\r\n                case \"Tab\":\r\n                    submit();\r\n                    Object(_viewHelpers__WEBPACK_IMPORTED_MODULE_0__[\"tabToNextCell\"])(gridCell, e.shiftKey);\r\n                    break;\r\n                default:\r\n                    return;\r\n            }\r\n        });\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://DataGrid/./view/src/GridCell.js?");

/***/ }),

/***/ "./view/src/JsonApiActionDispatcher.js":
/*!*********************************************!*\
  !*** ./view/src/JsonApiActionDispatcher.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\r\n * This module is used to send grid actions to a JSON API to a remote DataGrid and\r\n * get state back as a JSON object. This is intended to be used in a browser environment\r\n * where fetch() is available.\r\n *\r\n * Initialized with the URL to send actions to, including the gridId.\r\n *\r\n * The send() method returns a promise that will resolve to the new state.\r\n *\r\n * Returns an object that can send actions to that URL and will accept subscribers\r\n * to be notified when the action completes. These subscribers are intended to be\r\n * functions which will be passed the current state after the action complete. If\r\n * you pass an object with a function property named 'update' that will be called.\r\n */\r\nfunction JsonApiActionDispatcher(url) {\r\n    const subscribers = new Set();\r\n\r\n    function send(action) {\r\n        const body = JSON.stringify({action});\r\n\r\n        console.log('send ' + body);\r\n        const options = {\r\n            method: 'PUT',\r\n            credentials: 'same-origin',\r\n            headers: {\r\n                'Accept': 'application/json',\r\n                'Content-Type': 'application/json'\r\n            },\r\n            body\r\n        };\r\n\r\n        return fetch(url, options)\r\n            .then(res => res.json())\r\n            .then(result => {\r\n                //TODO: check for error status\r\n                notifySubscribers(result);\r\n                return result;\r\n            })\r\n            .catch(err => {\r\n                console.log('Network Error', err);\r\n            });\r\n    }\r\n\r\n    function subscribe(listener) {\r\n        subscribers.add(listener);\r\n    }\r\n\r\n    return {\r\n        send,\r\n        subscribe\r\n    }\r\n\r\n    function notifySubscribers(newState) {\r\n        subscribers.forEach(s => {\r\n            if (typeof s === 'function')\r\n                s(newState);\r\n            else if (typeof s.update === 'function')\r\n                s.update(newState);\r\n        });\r\n    }\r\n}\r\n\r\n/* harmony default export */ __webpack_exports__[\"default\"] = (JsonApiActionDispatcher);\r\n\n\n//# sourceURL=webpack://DataGrid/./view/src/JsonApiActionDispatcher.js?");

/***/ }),

/***/ "./view/src/RankCell.js":
/*!******************************!*\
  !*** ./view/src/RankCell.js ***!
  \******************************/
/*! exports provided: RankCell */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RankCell\", function() { return RankCell; });\n/* harmony import */ var _viewHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./viewHelpers */ \"./view/src/viewHelpers.js\");\n\r\n\r\nconst h = __webpack_require__(/*! snabbdom/h */ \"./node_modules/snabbdom/h.js\").default;\r\n\r\nconst column = {\r\n    name: '__rank_column',\r\n    type: 'number',\r\n    isRankColumn: true\r\n}\r\n\r\nfunction RankCell(rowIndex) {\r\n    const data = {\r\n        on: {\r\n            click: makeEditable(column, rowIndex)\r\n        }\r\n    };\r\n    const className = Object(_viewHelpers__WEBPACK_IMPORTED_MODULE_0__[\"getGridCellClassName\"])('__rank-column', rowIndex);\r\n    data['class'] = {[className]: true};\r\n\r\n    return h('div.grid-cell', data, rowIndex + 1);\r\n}\r\n\r\n\r\nfunction makeEditable(column, rowIndex) {\r\n    return function (event) {\r\n        editRank(event.target, rowIndex);\r\n    }\r\n}\r\n\r\n\r\nfunction editRank(gridCell, rowIndex) {\r\n    const originalValue = gridCell.textContent;\r\n    const input = document.createElement('input');\r\n    input.type = 'number';\r\n    input.min = 1;\r\n    input.value = originalValue;\r\n\r\n    const action = 'moveRow';\r\n    const actionData = {\r\n        action,\r\n        rowIndex\r\n    }\r\n\r\n    function submit() {\r\n        actionData.newIndex = input.value - 1;\r\n        input.blur();\r\n        window.action(actionData);\r\n    }\r\n\r\n    function cancel() {\r\n        input.remove();\r\n        gridCell.innerHTML = originalValue;\r\n    }\r\n\r\n    //render()\r\n    gridCell.innerHTML = '';\r\n    gridCell.append(input);\r\n    input.select();\r\n\r\n    input.addEventListener('blur', cancel);\r\n    input.addEventListener('keydown', _viewHelpers__WEBPACK_IMPORTED_MODULE_0__[\"preventTab\"]);\r\n    input.addEventListener('keyup', e => {\r\n        switch (e.key) {\r\n            case \"Enter\":\r\n                submit();\r\n                break;\r\n            case \"Esc\":\r\n            case \"Escape\":\r\n                input.blur();\r\n                break;\r\n            case \"Tab\":\r\n                submit();\r\n                Object(_viewHelpers__WEBPACK_IMPORTED_MODULE_0__[\"tabToNextCell\"])(gridCell, e.shiftKey);\r\n                break;\r\n            default:\r\n                return;\r\n        }\r\n    });\r\n}\n\n//# sourceURL=webpack://DataGrid/./view/src/RankCell.js?");

/***/ }),

/***/ "./view/src/Row.js":
/*!*************************!*\
  !*** ./view/src/Row.js ***!
  \*************************/
/*! exports provided: Row */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Row\", function() { return Row; });\n/* harmony import */ var _RankCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RankCell */ \"./view/src/RankCell.js\");\n/* harmony import */ var _GridCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GridCell */ \"./view/src/GridCell.js\");\n/* harmony import */ var _viewHelpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./viewHelpers */ \"./view/src/viewHelpers.js\");\n\r\n\r\nconst h = __webpack_require__(/*! snabbdom/h */ \"./node_modules/snabbdom/h.js\").default;\r\n\r\n\r\n\r\nconst rowDataType = 'text/actionjson';\r\n\r\nfunction Row(rowValues, rowIndex, columns) {\r\n    const rankCell = Object(_RankCell__WEBPACK_IMPORTED_MODULE_0__[\"RankCell\"])(rowIndex);\r\n    const rowCells = columns.map(column => Object(_GridCell__WEBPACK_IMPORTED_MODULE_1__[\"GridCell\"])(column, rowValues[column.name], rowIndex));\r\n\r\n    const data = {\r\n        attrs: {\r\n            draggable: \"true\"\r\n        },\r\n        on: {\r\n            dragstart: initializeDragRow,\r\n            dragenter: allowRowDrops,\r\n            dragover: allowRowDrops,\r\n            dragleave: dragLeave,\r\n            drop: rowDropped\r\n        },\r\n        style: Object(_viewHelpers__WEBPACK_IMPORTED_MODULE_2__[\"getGridRowStyles\"])(columns.length)\r\n    };\r\n\r\n    return h('div.row', data, [rankCell].concat(rowCells));\r\n\r\n\r\n    function initializeDragRow(event) {\r\n        const dt = event.dataTransfer;\r\n        const rowData = JSON.stringify({action: 'moveRow', rowIndex});\r\n\r\n        event.currentTarget.classList.add('dragging');\r\n\r\n        dt.setData(rowDataType, rowData);\r\n        dt.effectAllowed = 'move';\r\n    }\r\n\r\n    function allowRowDrops(event) {\r\n        if (couldDropHere(event.dataTransfer)) {\r\n            event.preventDefault();\r\n            event.currentTarget.classList.add('drophighlight');\r\n        }\r\n    }\r\n\r\n    function couldDropHere(dt) {\r\n        return (dt.effectAllowed === 'move' && dt.types.includes(rowDataType));\r\n    }\r\n\r\n    function dragLeave(event) {\r\n        event.currentTarget.classList.remove('drophighlight');\r\n    }\r\n\r\n    function rowDropped(event) {\r\n        event.preventDefault();\r\n\r\n        event.currentTarget.classList.remove('drophighlight');\r\n        const moveRow = getDraggingRowFromData(event);\r\n\r\n        if (moveRow.action === 'moveRow') {\r\n            moveRow.newIndex = rowIndex;\r\n\r\n            window.action(moveRow);\r\n        }\r\n    }\r\n\r\n    function getDraggingRowFromData(event) {\r\n        const dataString = event.dataTransfer.getData(rowDataType);\r\n\r\n        if (dataString === '')\r\n            return {}; //ignore non-row drops\r\n\r\n        let moveRow = {};\r\n\r\n        try {\r\n            moveRow = JSON.parse(dataString);\r\n        } catch (err) {\r\n            console.log('Error processing row drop ' + err);\r\n        }\r\n\r\n        return moveRow;\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://DataGrid/./view/src/Row.js?");

/***/ }),

/***/ "./view/src/documentReady.js":
/*!***********************************!*\
  !*** ./view/src/documentReady.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return waitForDocumentReady; });\nfunction waitForDocumentReady(document) {\r\n    return new Promise((resolve, reject) => {\r\n        if (document.readyState === 'complete')\r\n            resolve('Document already ready');\r\n        else\r\n            document.addEventListener('readystatechange', event => {\r\n                if (document.readyState === 'complete')\r\n                    resolve('Document became ready');\r\n            });\r\n    });\r\n}\r\n\n\n//# sourceURL=webpack://DataGrid/./view/src/documentReady.js?");

/***/ }),

/***/ "./view/src/viewHelpers.js":
/*!*********************************!*\
  !*** ./view/src/viewHelpers.js ***!
  \*********************************/
/*! exports provided: getGridCellClassName, getGridRowStyles, preventTab, tabToNextCell */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getGridCellClassName\", function() { return getGridCellClassName; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getGridRowStyles\", function() { return getGridRowStyles; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"preventTab\", function() { return preventTab; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"tabToNextCell\", function() { return tabToNextCell; });\nconst htmlHelpers = __webpack_require__(/*! ../../src/htmlHelpers */ \"./src/htmlHelpers.js\");\r\n\r\nfunction getGridCellClassName(columnName, rowNumber) {\r\n    const name = htmlHelpers.toCssClassName(columnName);\r\n    return `${name}${rowNumber}`;\r\n}\r\n\r\nfunction getGridRowStyles(numberOfColumns) {\r\n    return {\r\n        'grid-template-columns': `repeat(${numberOfColumns + 1}, 1fr)`\r\n    }\r\n}\r\n\r\nfunction preventTab(e) {\r\n    if (e.key === \"Tab\")\r\n        e.preventDefault();\r\n}\r\n\r\n/**\r\n * This assumes the key event is coming from a grid cell\r\n * @param gridCell\r\n */\r\nfunction tabToNextCell(currentGridCell, reverse) {\r\n    let nextEl;\r\n    if (reverse)\r\n        nextEl = getPreviousGridCell(currentGridCell);\r\n    else\r\n        nextEl = getNextGridCell(currentGridCell);\r\n\r\n    //console.log('next cell ' + (!!nextEl), nextEl);\r\n\r\n    if (!!nextEl)\r\n        nextEl.click();\r\n}\r\n\r\nfunction getPreviousGridCell(el) {\r\n    let prevCell;\r\n\r\n    if (el.classList.contains('grid-cell')) {\r\n        prevCell = el.previousSibling;\r\n        console.log('previous cell', prevCell);\r\n\r\n        if (prevCell)\r\n            return prevCell\r\n        //else go up and back a row to find the last cell of the previous row\r\n        const row = el.parentElement;\r\n        const prevRow = row.previousSibling;\r\n\r\n        if (prevRow) {\r\n            const lastCell = prevRow.querySelector('.grid-cell:last-child');\r\n            if (lastCell)\r\n                return lastCell;\r\n        }\r\n    }\r\n}\r\n\r\nfunction getNextGridCell(el) {\r\n    let nextCell;\r\n\r\n    if (el.classList.contains('grid-cell')) {\r\n        nextCell = el.nextSibling;\r\n        console.log('next cell', nextCell);\r\n\r\n        if (nextCell)\r\n            return nextCell\r\n        //else go up and over a row to find the first cell of the next row\r\n        const row = el.parentElement;\r\n        const nextRow = row.nextSibling;\r\n\r\n        if (nextRow) {\r\n            const firstCell = nextRow.querySelector('.grid-cell');\r\n            if (firstCell)\r\n                return firstCell;\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://DataGrid/./view/src/viewHelpers.js?");

/***/ })

/******/ });