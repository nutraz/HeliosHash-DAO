"use strict";
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

/***/ "(ssr)/./src/mocks/browser.js":
/*!******************************!*\
  !*** ./src/mocks/browser.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getWorker: () => (/* binding */ getWorker)\n/* harmony export */ });\n// Export a factory that creates the MSW worker using dynamic import.\n// This prevents the bundler from trying to resolve 'msw' at build time\n// when mocks are not installed or not intended for production builds.\nasync function getWorker() {\n    const [{ setupWorker }, { handlers }] = await Promise.all([\n        Promise.all(/*! import() */[__webpack_require__.e(\"vendor-chunks/tldts\"), __webpack_require__.e(\"vendor-chunks/msw\"), __webpack_require__.e(\"vendor-chunks/tough-cookie\"), __webpack_require__.e(\"vendor-chunks/headers-polyfill\"), __webpack_require__.e(\"vendor-chunks/path-to-regexp\"), __webpack_require__.e(\"vendor-chunks/@mswjs\"), __webpack_require__.e(\"vendor-chunks/@open-draft\"), __webpack_require__.e(\"vendor-chunks/strict-event-emitter\"), __webpack_require__.e(\"vendor-chunks/outvariant\"), __webpack_require__.e(\"vendor-chunks/is-node-process\"), __webpack_require__.e(\"vendor-chunks/until-async\")]).then(__webpack_require__.bind(__webpack_require__, /*! msw */ \"(ssr)/./node_modules/msw/lib/core/index.mjs\")),\n        Promise.all(/*! import() */[__webpack_require__.e(\"vendor-chunks/tldts\"), __webpack_require__.e(\"vendor-chunks/msw\"), __webpack_require__.e(\"vendor-chunks/tough-cookie\"), __webpack_require__.e(\"vendor-chunks/headers-polyfill\"), __webpack_require__.e(\"vendor-chunks/path-to-regexp\"), __webpack_require__.e(\"vendor-chunks/@mswjs\"), __webpack_require__.e(\"vendor-chunks/@open-draft\"), __webpack_require__.e(\"vendor-chunks/strict-event-emitter\"), __webpack_require__.e(\"vendor-chunks/outvariant\"), __webpack_require__.e(\"vendor-chunks/is-node-process\"), __webpack_require__.e(\"_ssr_src_mocks_handlers_js\")]).then(__webpack_require__.bind(__webpack_require__, /*! ./handlers */ \"(ssr)/./src/mocks/handlers.js\"))\n    ]);\n    return setupWorker(...handlers);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvbW9ja3MvYnJvd3Nlci5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUEscUVBQXFFO0FBQ3JFLHVFQUF1RTtBQUN2RSxzRUFBc0U7QUFDL0QsZUFBZUE7SUFDckIsTUFBTSxDQUFDLEVBQUVDLFdBQVcsRUFBRSxFQUFFLEVBQUVDLFFBQVEsRUFBRSxDQUFDLEdBQUcsTUFBTUMsUUFBUUMsR0FBRyxDQUFDO1FBQ3pELHdzQkFBTztRQUNQLGtzQkFBTztLQUNQO0lBRUQsT0FBT0gsZUFBZUM7QUFDdkIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oZWxpb3NoYXNoLWRhby13ZWIvLi9zcmMvbW9ja3MvYnJvd3Nlci5qcz84NThkIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEV4cG9ydCBhIGZhY3RvcnkgdGhhdCBjcmVhdGVzIHRoZSBNU1cgd29ya2VyIHVzaW5nIGR5bmFtaWMgaW1wb3J0LlxuLy8gVGhpcyBwcmV2ZW50cyB0aGUgYnVuZGxlciBmcm9tIHRyeWluZyB0byByZXNvbHZlICdtc3cnIGF0IGJ1aWxkIHRpbWVcbi8vIHdoZW4gbW9ja3MgYXJlIG5vdCBpbnN0YWxsZWQgb3Igbm90IGludGVuZGVkIGZvciBwcm9kdWN0aW9uIGJ1aWxkcy5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRXb3JrZXIoKSB7XG5cdGNvbnN0IFt7IHNldHVwV29ya2VyIH0sIHsgaGFuZGxlcnMgfV0gPSBhd2FpdCBQcm9taXNlLmFsbChbXG5cdFx0aW1wb3J0KCdtc3cnKSxcblx0XHRpbXBvcnQoJy4vaGFuZGxlcnMnKVxuXHRdKVxuXG5cdHJldHVybiBzZXR1cFdvcmtlciguLi5oYW5kbGVycylcbn1cbiJdLCJuYW1lcyI6WyJnZXRXb3JrZXIiLCJzZXR1cFdvcmtlciIsImhhbmRsZXJzIiwiUHJvbWlzZSIsImFsbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./src/mocks/browser.js\n");

/***/ })

};
;