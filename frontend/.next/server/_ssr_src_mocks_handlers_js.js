"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_src_mocks_handlers_js";
exports.ids = ["_ssr_src_mocks_handlers_js"];
exports.modules = {

/***/ "(ssr)/./src/mocks/handlers.js":
/*!*******************************!*\
  !*** ./src/mocks/handlers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handlers: () => (/* binding */ handlers)\n/* harmony export */ });\n/* harmony import */ var msw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! msw */ \"(ssr)/./node_modules/msw/lib/core/http.mjs\");\n/* harmony import */ var msw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! msw */ \"(ssr)/./node_modules/msw/lib/core/HttpResponse.mjs\");\n\nconst handlers = [\n    // Add your mock API handlers here\n    msw__WEBPACK_IMPORTED_MODULE_0__.http.get(\"/api/auth/user\", ()=>{\n        return msw__WEBPACK_IMPORTED_MODULE_1__.HttpResponse.json({\n            id: 1,\n            name: \"Demo User\",\n            email: \"demo@helioshash.org\"\n        });\n    }),\n    msw__WEBPACK_IMPORTED_MODULE_0__.http.post(\"/api/auth/login\", ()=>{\n        return msw__WEBPACK_IMPORTED_MODULE_1__.HttpResponse.json({\n            success: true,\n            token: \"demo-token-12345\"\n        });\n    })\n];\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9zcmMvbW9ja3MvaGFuZGxlcnMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXdDO0FBRWpDLE1BQU1FLFdBQVc7SUFDdEIsa0NBQWtDO0lBQ2xDRixxQ0FBSUEsQ0FBQ0csR0FBRyxDQUFDLGtCQUFrQjtRQUN6QixPQUFPRiw2Q0FBWUEsQ0FBQ0csSUFBSSxDQUFDO1lBQ3ZCQyxJQUFJO1lBQ0pDLE1BQU07WUFDTkMsT0FBTztRQUNUO0lBQ0Y7SUFFQVAscUNBQUlBLENBQUNRLElBQUksQ0FBQyxtQkFBbUI7UUFDM0IsT0FBT1AsNkNBQVlBLENBQUNHLElBQUksQ0FBQztZQUN2QkssU0FBUztZQUNUQyxPQUFPO1FBQ1Q7SUFDRjtDQUNEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGVsaW9zaGFzaC1kYW8td2ViLy4vc3JjL21vY2tzL2hhbmRsZXJzLmpzP2U1NDEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaHR0cCwgSHR0cFJlc3BvbnNlIH0gZnJvbSAnbXN3J1xuXG5leHBvcnQgY29uc3QgaGFuZGxlcnMgPSBbXG4gIC8vIEFkZCB5b3VyIG1vY2sgQVBJIGhhbmRsZXJzIGhlcmVcbiAgaHR0cC5nZXQoJy9hcGkvYXV0aC91c2VyJywgKCkgPT4ge1xuICAgIHJldHVybiBIdHRwUmVzcG9uc2UuanNvbih7XG4gICAgICBpZDogMSxcbiAgICAgIG5hbWU6ICdEZW1vIFVzZXInLFxuICAgICAgZW1haWw6ICdkZW1vQGhlbGlvc2hhc2gub3JnJ1xuICAgIH0pXG4gIH0pLFxuICBcbiAgaHR0cC5wb3N0KCcvYXBpL2F1dGgvbG9naW4nLCAoKSA9PiB7XG4gICAgcmV0dXJuIEh0dHBSZXNwb25zZS5qc29uKHtcbiAgICAgIHN1Y2Nlc3M6IHRydWUsXG4gICAgICB0b2tlbjogJ2RlbW8tdG9rZW4tMTIzNDUnXG4gICAgfSlcbiAgfSlcbl1cbiJdLCJuYW1lcyI6WyJodHRwIiwiSHR0cFJlc3BvbnNlIiwiaGFuZGxlcnMiLCJnZXQiLCJqc29uIiwiaWQiLCJuYW1lIiwiZW1haWwiLCJwb3N0Iiwic3VjY2VzcyIsInRva2VuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./src/mocks/handlers.js\n");

/***/ })

};
;