"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@open-draft";
exports.ids = ["vendor-chunks/@open-draft"];
exports.modules = {

/***/ "(ssr)/../../node_modules/@open-draft/until/lib/index.js":
/*!*********************************************************!*\
  !*** ../../node_modules/@open-draft/until/lib/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar until_1 = __webpack_require__(/*! ./until */ \"(ssr)/../../node_modules/@open-draft/until/lib/until.js\");\nexports.until = until_1.until;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL0BvcGVuLWRyYWZ0L3VudGlsL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxjQUFjLG1CQUFPLENBQUMsd0VBQVM7QUFDL0IsYUFBYSIsInNvdXJjZXMiOlsid2VicGFjazovL2hlbGlvc2hhc2gtd2ViLy4uLy4uL25vZGVfbW9kdWxlcy9Ab3Blbi1kcmFmdC91bnRpbC9saWIvaW5kZXguanM/ZWEwYyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1bnRpbF8xID0gcmVxdWlyZShcIi4vdW50aWxcIik7XG5leHBvcnRzLnVudGlsID0gdW50aWxfMS51bnRpbDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/@open-draft/until/lib/index.js\n");

/***/ }),

/***/ "(ssr)/../../node_modules/@open-draft/until/lib/until.js":
/*!*********************************************************!*\
  !*** ../../node_modules/@open-draft/until/lib/until.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n/**\n * Gracefully handles a given Promise factory.\n * @example\n * cosnt [error, data] = await until(() => asyncAction())\n */\nexports.until = async (promise) => {\n    try {\n        const data = await promise().catch((error) => {\n            throw error;\n        });\n        return [null, data];\n    }\n    catch (error) {\n        return [error, null];\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzL0BvcGVuLWRyYWZ0L3VudGlsL2xpYi91bnRpbC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxpb3NoYXNoLXdlYi8uLi8uLi9ub2RlX21vZHVsZXMvQG9wZW4tZHJhZnQvdW50aWwvbGliL3VudGlsLmpzPzA3ZDMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIEdyYWNlZnVsbHkgaGFuZGxlcyBhIGdpdmVuIFByb21pc2UgZmFjdG9yeS5cbiAqIEBleGFtcGxlXG4gKiBjb3NudCBbZXJyb3IsIGRhdGFdID0gYXdhaXQgdW50aWwoKCkgPT4gYXN5bmNBY3Rpb24oKSlcbiAqL1xuZXhwb3J0cy51bnRpbCA9IGFzeW5jIChwcm9taXNlKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHByb21pc2UoKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFtudWxsLCBkYXRhXTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBbZXJyb3IsIG51bGxdO1xuICAgIH1cbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/@open-draft/until/lib/until.js\n");

/***/ })

};
;