/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_src_mocks_browser_js";
exports.ids = ["_ssr_src_mocks_browser_js"];
exports.modules = {

/***/ "?c886":
/*!**************************!*\
  !*** encoding (ignored) ***!
  \**************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "(ssr)/./src/mocks/browser.js":
/*!******************************!*\
  !*** ./src/mocks/browser.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   worker: () => (/* binding */ worker)\n/* harmony export */ });\n/* harmony import */ var msw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! msw */ \"(ssr)/../../node_modules/msw/lib/index.js\");\n/* harmony import */ var msw__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(msw__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _handlers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handlers */ \"(ssr)/./src/mocks/handlers.js\");\n\n\nconst worker = (0,msw__WEBPACK_IMPORTED_MODULE_1__.setupWorker)(..._handlers__WEBPACK_IMPORTED_MODULE_0__.handlers);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvbW9ja3MvYnJvd3Nlci5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQWlDO0FBQ0k7QUFFOUIsTUFBTUUsU0FBU0YsZ0RBQVdBLElBQUlDLCtDQUFRQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGVsaW9zaGFzaC13ZWIvLi9zcmMvbW9ja3MvYnJvd3Nlci5qcz84NThkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNldHVwV29ya2VyIH0gZnJvbSAnbXN3J1xuaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tICcuL2hhbmRsZXJzJ1xuXG5leHBvcnQgY29uc3Qgd29ya2VyID0gc2V0dXBXb3JrZXIoLi4uaGFuZGxlcnMpXG4iXSwibmFtZXMiOlsic2V0dXBXb3JrZXIiLCJoYW5kbGVycyIsIndvcmtlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./src/mocks/browser.js\n");

/***/ }),

/***/ "(ssr)/./src/mocks/handlers.js":
/*!*******************************!*\
  !*** ./src/mocks/handlers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handlers: () => (/* binding */ handlers)\n/* harmony export */ });\n/* harmony import */ var msw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! msw */ \"(ssr)/../../node_modules/msw/lib/index.js\");\n/* harmony import */ var msw__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(msw__WEBPACK_IMPORTED_MODULE_0__);\n\nconst handlers = [\n    // Add your mock API handlers here\n    msw__WEBPACK_IMPORTED_MODULE_0__.http.get(\"/api/auth/user\", ()=>{\n        return msw__WEBPACK_IMPORTED_MODULE_0__.HttpResponse.json({\n            id: 1,\n            name: \"Demo User\",\n            email: \"demo@helioshash.org\"\n        });\n    }),\n    msw__WEBPACK_IMPORTED_MODULE_0__.http.post(\"/api/auth/login\", ()=>{\n        return msw__WEBPACK_IMPORTED_MODULE_0__.HttpResponse.json({\n            success: true,\n            token: \"demo-token-12345\"\n        });\n    })\n];\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvbW9ja3MvaGFuZGxlcnMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXdDO0FBRWpDLE1BQU1FLFdBQVc7SUFDdEIsa0NBQWtDO0lBQ2xDRixxQ0FBSUEsQ0FBQ0csR0FBRyxDQUFDLGtCQUFrQjtRQUN6QixPQUFPRiw2Q0FBWUEsQ0FBQ0csSUFBSSxDQUFDO1lBQ3ZCQyxJQUFJO1lBQ0pDLE1BQU07WUFDTkMsT0FBTztRQUNUO0lBQ0Y7SUFFQVAscUNBQUlBLENBQUNRLElBQUksQ0FBQyxtQkFBbUI7UUFDM0IsT0FBT1AsNkNBQVlBLENBQUNHLElBQUksQ0FBQztZQUN2QkssU0FBUztZQUNUQyxPQUFPO1FBQ1Q7SUFDRjtDQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGVsaW9zaGFzaC13ZWIvLi9zcmMvbW9ja3MvaGFuZGxlcnMuanM/ZTU0MSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBodHRwLCBIdHRwUmVzcG9uc2UgfSBmcm9tICdtc3cnXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVycyA9IFtcbiAgLy8gQWRkIHlvdXIgbW9jayBBUEkgaGFuZGxlcnMgaGVyZVxuICBodHRwLmdldCgnL2FwaS9hdXRoL3VzZXInLCAoKSA9PiB7XG4gICAgcmV0dXJuIEh0dHBSZXNwb25zZS5qc29uKHtcbiAgICAgIGlkOiAxLFxuICAgICAgbmFtZTogJ0RlbW8gVXNlcicsXG4gICAgICBlbWFpbDogJ2RlbW9AaGVsaW9zaGFzaC5vcmcnXG4gICAgfSlcbiAgfSksXG4gIFxuICBodHRwLnBvc3QoJy9hcGkvYXV0aC9sb2dpbicsICgpID0+IHtcbiAgICByZXR1cm4gSHR0cFJlc3BvbnNlLmpzb24oe1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHRva2VuOiAnZGVtby10b2tlbi0xMjM0NSdcbiAgICB9KVxuICB9KVxuXVxuIl0sIm5hbWVzIjpbImh0dHAiLCJIdHRwUmVzcG9uc2UiLCJoYW5kbGVycyIsImdldCIsImpzb24iLCJpZCIsIm5hbWUiLCJlbWFpbCIsInBvc3QiLCJzdWNjZXNzIiwidG9rZW4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./src/mocks/handlers.js\n");

/***/ })

};
;