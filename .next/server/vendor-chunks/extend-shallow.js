"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/extend-shallow";
exports.ids = ["vendor-chunks/extend-shallow"];
exports.modules = {

/***/ "(rsc)/./node_modules/extend-shallow/index.js":
/*!**********************************************!*\
  !*** ./node_modules/extend-shallow/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nvar isObject = __webpack_require__(/*! is-extendable */ \"(rsc)/./node_modules/is-extendable/index.js\");\nmodule.exports = function extend(o /*, objects*/ ) {\n    if (!isObject(o)) {\n        o = {};\n    }\n    var len = arguments.length;\n    for(var i = 1; i < len; i++){\n        var obj = arguments[i];\n        if (isObject(obj)) {\n            assign(o, obj);\n        }\n    }\n    return o;\n};\nfunction assign(a, b) {\n    for(var key in b){\n        if (hasOwn(b, key)) {\n            a[key] = b[key];\n        }\n    }\n}\n/**\r\n * Returns true if the given `key` is an own property of `obj`.\r\n */ function hasOwn(obj, key) {\n    return Object.prototype.hasOwnProperty.call(obj, key);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvZXh0ZW5kLXNoYWxsb3cvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFFQSxJQUFJQSxXQUFXQyxtQkFBT0EsQ0FBQztBQUV2QkMsT0FBT0MsT0FBTyxHQUFHLFNBQVNDLE9BQU9DLEVBQUMsV0FBVyxHQUFYO0lBQ2hDLElBQUksQ0FBQ0wsU0FBU0ssSUFBSTtRQUFFQSxJQUFJLENBQUM7SUFBRztJQUU1QixJQUFJQyxNQUFNQyxVQUFVQyxNQUFNO0lBQzFCLElBQUssSUFBSUMsSUFBSSxHQUFHQSxJQUFJSCxLQUFLRyxJQUFLO1FBQzVCLElBQUlDLE1BQU1ILFNBQVMsQ0FBQ0UsRUFBRTtRQUV0QixJQUFJVCxTQUFTVSxNQUFNO1lBQ2pCQyxPQUFPTixHQUFHSztRQUNaO0lBQ0Y7SUFDQSxPQUFPTDtBQUNUO0FBRUEsU0FBU00sT0FBT0MsQ0FBQyxFQUFFQyxDQUFDO0lBQ2xCLElBQUssSUFBSUMsT0FBT0QsRUFBRztRQUNqQixJQUFJRSxPQUFPRixHQUFHQyxNQUFNO1lBQ2xCRixDQUFDLENBQUNFLElBQUksR0FBR0QsQ0FBQyxDQUFDQyxJQUFJO1FBQ2pCO0lBQ0Y7QUFDRjtBQUVBOztDQUVDLEdBRUQsU0FBU0MsT0FBT0wsR0FBRyxFQUFFSSxHQUFHO0lBQ3RCLE9BQU9FLE9BQU9DLFNBQVMsQ0FBQ0MsY0FBYyxDQUFDQyxJQUFJLENBQUNULEtBQUtJO0FBQ25EIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29yeS13b29kYWxsLXBvcnRmb2xpby8uL25vZGVfbW9kdWxlcy9leHRlbmQtc2hhbGxvdy9pbmRleC5qcz81Y2RjIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJ2lzLWV4dGVuZGFibGUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKG8vKiwgb2JqZWN0cyovKSB7XHJcbiAgaWYgKCFpc09iamVjdChvKSkgeyBvID0ge307IH1cclxuXHJcbiAgdmFyIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xyXG4gICAgdmFyIG9iaiA9IGFyZ3VtZW50c1tpXTtcclxuXHJcbiAgICBpZiAoaXNPYmplY3Qob2JqKSkge1xyXG4gICAgICBhc3NpZ24obywgb2JqKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG87XHJcbn07XHJcblxyXG5mdW5jdGlvbiBhc3NpZ24oYSwgYikge1xyXG4gIGZvciAodmFyIGtleSBpbiBiKSB7XHJcbiAgICBpZiAoaGFzT3duKGIsIGtleSkpIHtcclxuICAgICAgYVtrZXldID0gYltrZXldO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZ2l2ZW4gYGtleWAgaXMgYW4gb3duIHByb3BlcnR5IG9mIGBvYmpgLlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGhhc093bihvYmosIGtleSkge1xyXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJpc09iamVjdCIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZXh0ZW5kIiwibyIsImxlbiIsImFyZ3VtZW50cyIsImxlbmd0aCIsImkiLCJvYmoiLCJhc3NpZ24iLCJhIiwiYiIsImtleSIsImhhc093biIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/extend-shallow/index.js\n");

/***/ })

};
;