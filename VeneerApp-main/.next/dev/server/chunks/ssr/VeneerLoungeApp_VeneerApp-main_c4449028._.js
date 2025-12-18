module.exports = [
"[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VeneerShadeSelector",
    ()=>VeneerShadeSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const shades = [
    {
        id: "natural_white",
        name: "Natural White",
        color: "#F8F6F0",
        description: "Subtle, natural-looking white"
    },
    {
        id: "hollywood_white",
        name: "Hollywood White",
        color: "#FFFFFF",
        description: "Bright, dazzling white"
    },
    {
        id: "warm_ivory",
        name: "Warm Ivory",
        color: "#FFF8E7",
        description: "Soft warm tone"
    },
    {
        id: "pearl_white",
        name: "Pearl White",
        color: "#FAF9F6",
        description: "Elegant pearl finish"
    },
    {
        id: "ultra_white",
        name: "Ultra White",
        color: "#FAFAFA",
        description: "Maximum brightness"
    }
];
function VeneerShadeSelector({ onShadeSelect, selectedShade }) {
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(selectedShade || "natural_white");
    const handleSelect = (shadeId)=>{
        setSelected(shadeId);
        onShadeSelect(shadeId);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mb-2 text-lg font-semibold",
                        children: "Select Veneer Shade"
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Choose the shade that matches your desired look"
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-3 sm:grid-cols-2",
                children: shades.map((shade)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleSelect(shade.id),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("glass relative flex items-center gap-4 rounded-xl p-4 text-left transition-all hover:border-primary/50", selected === shade.id ? "border-2 border-primary" : "border border-border"),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-border",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full w-full",
                                    style: {
                                        backgroundColor: shade.color
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-medium",
                                        children: shade.name
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                                        lineNumber: 50,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-muted-foreground",
                                        children: shade.description
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                                        lineNumber: 51,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                                lineNumber: 49,
                                columnNumber: 13
                            }, this),
                            selected === shade.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-6 w-6 items-center justify-center rounded-full bg-primary",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    className: "h-4 w-4 text-primary-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                                    lineNumber: 56,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                                lineNumber: 55,
                                columnNumber: 15
                            }, this)
                        ]
                    }, shade.id, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SimulationLoading",
    ()=>SimulationLoading
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
"use client";
;
;
function SimulationLoading() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass flex min-h-[400px] flex-col items-center justify-center rounded-2xl p-12 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 animate-ping rounded-full bg-primary/20"
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                        lineNumber: 9,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                            className: "h-10 w-10 text-primary animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mb-2 text-2xl font-bold",
                children: "Creating Your Perfect Smile"
            }, void 0, false, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-6 max-w-md text-muted-foreground",
                children: "Our AI is analyzing your photo and applying the veneer simulation. This may take 30-60 seconds."
            }, void 0, false, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-4 w-4 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Processing..."
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 grid w-full max-w-md grid-cols-3 gap-4 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass rounded-lg p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-1 h-1.5 w-full overflow-hidden rounded-full bg-muted",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full w-full animate-pulse bg-primary"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                lineNumber: 27,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-muted-foreground",
                                children: "Analyzing teeth"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                lineNumber: 30,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass rounded-lg p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-1 h-1.5 w-full overflow-hidden rounded-full bg-muted",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full w-2/3 animate-pulse bg-primary animation-delay-200"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                    lineNumber: 34,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-muted-foreground",
                                children: "Applying veneers"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                lineNumber: 36,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                        lineNumber: 32,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass rounded-lg p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-1 h-1.5 w-full overflow-hidden rounded-full bg-muted",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full w-1/3 animate-pulse bg-primary animation-delay-400"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-muted-foreground",
                                children: "Rendering"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/ui/button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/@radix-ui/react-slot/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/lib/utils.ts [app-ssr] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SimulationResult",
    ()=>SimulationResult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/share-2.js [app-ssr] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/button.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function SimulationResult({ originalImage, simulatedImages, shade, onDownload, onGenerateReport }) {
    const handleDownload = (imageUrl, index)=>{
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `veneer-simulation-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mb-2 text-3xl font-bold",
                        children: "Your Veneer Simulation"
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Compare your original smile with the AI-generated results"
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-6 md:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass overflow-hidden rounded-2xl p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-3 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-block rounded-full bg-muted px-3 py-1 text-sm font-medium",
                                    children: "Original"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                    lineNumber: 42,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative aspect-[4/3] overflow-hidden rounded-xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: originalImage || "/placeholder.svg",
                                    alt: "Original smile",
                                    className: "h-full w-full object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    simulatedImages.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass relative overflow-hidden rounded-2xl p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-3 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "inline-block rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary",
                                            children: [
                                                "With Veneers - ",
                                                shade
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                            size: "sm",
                                            variant: "ghost",
                                            className: "h-8 w-8 p-0",
                                            onClick: ()=>handleDownload(image, index),
                                            "aria-label": "Download image",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                            lineNumber: 60,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative aspect-[4/3] overflow-hidden rounded-xl",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: image || "/placeholder.svg",
                                        alt: `Simulated smile ${index + 1}`,
                                        className: "h-full w-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, index, true, {
                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: onDownload,
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            "Download All Results"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: onGenerateReport,
                        variant: "outline",
                        className: "flex-1 bg-transparent",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            "Generate PDF Report"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        className: "bg-transparent",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            "Share Results"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/ui/input.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/ui/label.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/@radix-ui/react-label/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function Label({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/ui/label.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/ui/textarea.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/ui/checkbox.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Checkbox({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "checkbox",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "checkbox-indicator",
            className: "flex items-center justify-center text-current transition-none",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                className: "size-3.5"
            }, void 0, false, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/ui/checkbox.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/ui/checkbox.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/ui/checkbox.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LeadCaptureForm",
    ()=>LeadCaptureForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/checkbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/phone.js [app-ssr] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/user.js [app-ssr] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/hooks/use-toast.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
function LeadCaptureForm({ onSubmit, isDentistMode = false }) {
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        email: "",
        phone: "",
        dentistName: "",
        dentistPractice: "",
        notes: "",
        marketingConsent: false
    });
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }
        setIsSubmitting(true);
        try {
            // Submit lead data
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error("Failed to submit");
            toast({
                title: "Success!",
                description: "Your information has been saved."
            });
            onSubmit(formData);
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: "Failed to save your information. Please try again.",
                variant: "destructive"
            });
        } finally{
            setIsSubmitting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "name",
                                children: [
                                    "Full Name ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-destructive",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 89,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "name",
                                        placeholder: "John Smith",
                                        value: formData.name,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                name: e.target.value
                                            }),
                                        className: "pl-10 bg-background/50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "email",
                                children: [
                                    "Email Address ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-destructive",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 107,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                        className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 110,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "email",
                                        type: "email",
                                        placeholder: "john@example.com",
                                        value: formData.email,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                email: e.target.value
                                            }),
                                        className: "pl-10 bg-background/50",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "phone",
                                children: "Phone Number"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                        className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "phone",
                                        type: "tel",
                                        placeholder: "(555) 123-4567",
                                        value: formData.phone,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                phone: e.target.value
                                            }),
                                        className: "pl-10 bg-background/50"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 128,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    !isDentistMode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "dentistName",
                                        children: "Your Dentist's Name (Optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "dentistName",
                                        placeholder: "Dr. Sarah Johnson",
                                        value: formData.dentistName,
                                        onChange: (e)=>setFormData({
                                                ...formData,
                                                dentistName: e.target.value
                                            }),
                                        className: "bg-background/50"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "dentistPractice",
                                        children: "Dental Practice Name (Optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                className: "absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                                            }, void 0, false, {
                                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                id: "dentistPractice",
                                                placeholder: "Smile Dental Care",
                                                value: formData.dentistPractice,
                                                onChange: (e)=>setFormData({
                                                        ...formData,
                                                        dentistPractice: e.target.value
                                                    }),
                                                className: "pl-10 bg-background/50"
                                            }, void 0, false, {
                                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                                lineNumber: 157,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "notes",
                                children: "Additional Notes (Optional)"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                id: "notes",
                                placeholder: "Any questions or special requirements...",
                                value: formData.notes,
                                onChange: (e)=>setFormData({
                                        ...formData,
                                        notes: e.target.value
                                    }),
                                className: "min-h-[100px] bg-background/50"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                                id: "consent",
                                checked: formData.marketingConsent,
                                onCheckedChange: (checked)=>setFormData({
                                        ...formData,
                                        marketingConsent: checked
                                    })
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 183,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "consent",
                                className: "cursor-pointer text-sm leading-relaxed",
                                children: "I agree to receive updates about my simulation results and occasional marketing communications from VeneerVision AI. You can unsubscribe at any time."
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                        lineNumber: 182,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                type: "submit",
                className: "w-full",
                size: "lg",
                disabled: isSubmitting,
                children: isSubmitting ? "Saving..." : "Continue to Results"
            }, void 0, false, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
}),
"[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PDFReportGenerator",
    ()=>PDFReportGenerator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/hooks/use-toast.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function PDFReportGenerator({ patientInfo, simulationData }) {
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const handleGeneratePDF = async ()=>{
        setIsGenerating(true);
        try {
            const response = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    patientInfo,
                    simulationData,
                    images: [
                        simulationData.originalImage,
                        ...simulationData.simulatedImages
                    ]
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "PDF generation failed");
            }
            toast({
                title: "PDF Report Generated!",
                description: "Your report is ready for download."
            });
        // In a real app, trigger download
        // window.open(data.pdf.url, '_blank')
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to generate PDF report.",
                variant: "destructive"
            });
        } finally{
            setIsGenerating(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass space-y-4 rounded-2xl p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: "h-6 w-6 text-primary"
                        }, void 0, false, {
                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "mb-1 text-lg font-semibold",
                                children: "Professional PDF Report"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "Generate a comprehensive PDF report with before/after comparisons, recommended shade details, and professional notes."
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                lineNumber: 71,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2 rounded-lg border border-border/50 bg-muted/30 p-4 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "font-medium",
                        children: "Report includes:"
                    }, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-1 text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1 w-1 rounded-full bg-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 82,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Before & After comparison images"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 83,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1 w-1 rounded-full bg-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 86,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Veneer shade specifications"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 87,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1 w-1 rounded-full bg-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 90,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Patient information and notes"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 91,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-1 w-1 rounded-full bg-primary"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "VeneerVision AI branding"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                onClick: handleGeneratePDF,
                disabled: isGenerating,
                className: "w-full",
                size: "lg",
                children: isGenerating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "mr-2 h-4 w-4 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this),
                        "Generating PDF..."
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this),
                        "Generate PDF Report"
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
}),
"[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SimulationPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$veneer$2d$shade$2d$selector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/veneer-shade-selector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$simulation$2d$loading$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-loading.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$simulation$2d$result$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/simulation-result.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$lead$2d$capture$2d$form$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/lead-capture-form.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$pdf$2d$report$2d$generator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/pdf-report-generator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/VeneerLoungeApp/VeneerApp-main/hooks/use-toast.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
function SimulationPage() {
    const [selectedShade, setSelectedShade] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("natural_white");
    const [isGenerating, setIsGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [simulatedImages, setSimulatedImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showLeadCapture, setShowLeadCapture] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [leadData, setLeadData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    const [originalImage, setOriginalImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("/placeholder.svg?height=600&width=800");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const stored = localStorage.getItem('uploadedPatientImage');
        console.log('DEBUG Frontend: stored image from localStorage:', stored?.substring(0, 100));
        if (stored) {
            setOriginalImage(stored);
        }
    }, []);
    const handleGenerate = async ()=>{
        if (!originalImage || originalImage.startsWith('/placeholder')) {
            alert('Please upload or capture an image first!');
            return;
        }
        if (!originalImage.startsWith('data:image/')) {
            alert('Invalid image format. Please upload a valid image.');
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch("/api/simulate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    image: originalImage,
                    shade: selectedShade,
                    numOutputs: 1
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Simulation failed");
            }
            setSimulatedImages(Array.isArray(data.output) ? data.output : [
                data.output
            ]);
            setShowLeadCapture(true);
            toast({
                title: "Success!",
                description: "Your veneer simulation is ready."
            });
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to generate simulation. Please try again.",
                variant: "destructive"
            });
        } finally{
            setIsGenerating(false);
        }
    };
    const handleLeadSubmit = (data)=>{
        setLeadData(data);
        setShowLeadCapture(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "border-b border-border/50 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "text-xl font-bold",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
                                children: "VeneerVision AI"
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-2 w-2 rounded-full bg-primary"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-muted-foreground",
                                    children: "Patient Mode"
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8",
                children: [
                    showLeadCapture && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mb-2 text-3xl font-bold",
                                        children: "Save Your Results"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground",
                                        children: "Enter your information to download your simulation and receive your PDF report"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass mx-auto max-w-2xl rounded-2xl p-6 sm:p-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$lead$2d$capture$2d$form$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LeadCaptureForm"], {
                                    onSubmit: handleLeadSubmit
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 111,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    !isGenerating && simulatedImages.length === 0 && !showLeadCapture && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "mb-3 text-4xl font-bold",
                                        children: "Customize Your Simulation"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-muted-foreground",
                                        children: "Select your preferred veneer shade and generate your preview"
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass rounded-2xl p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$veneer$2d$shade$2d$selector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VeneerShadeSelector"], {
                                    onShadeSelect: setSelectedShade,
                                    selectedShade: selectedShade
                                }, void 0, false, {
                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                    lineNumber: 126,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        className: "flex-1 bg-transparent",
                                        asChild: true,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/patient",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, this),
                                                "Back"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        className: "flex-1",
                                        onClick: handleGenerate,
                                        children: [
                                            "Generate Simulation",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "ml-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                        lineNumber: 136,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                        lineNumber: 119,
                        columnNumber: 11
                    }, this),
                    isGenerating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$simulation$2d$loading$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimulationLoading"], {}, void 0, false, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                        lineNumber: 144,
                        columnNumber: 26
                    }, this),
                    !isGenerating && simulatedImages.length > 0 && !showLeadCapture && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$simulation$2d$result$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimulationResult"], {
                                originalImage: originalImage,
                                simulatedImages: simulatedImages,
                                shade: selectedShade,
                                onDownload: ()=>{
                                    simulatedImages.forEach((img, i)=>{
                                        const link = document.createElement("a");
                                        link.href = img;
                                        link.download = `veneer-simulation-${i + 1}.jpg`;
                                        link.click();
                                    });
                                }
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            leadData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$VeneerLoungeApp$2f$VeneerApp$2d$main$2f$components$2f$pdf$2d$report$2d$generator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PDFReportGenerator"], {
                                patientInfo: leadData,
                                simulationData: {
                                    shade: selectedShade,
                                    originalImage,
                                    simulatedImages
                                }
                            }, void 0, false, {
                                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                                lineNumber: 164,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                        lineNumber: 148,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/VeneerLoungeApp/VeneerApp-main/app/patient/simulation/page.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=VeneerLoungeApp_VeneerApp-main_c4449028._.js.map