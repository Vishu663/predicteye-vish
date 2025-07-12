module.exports = {

"[project]/src/lib/constants.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ApplicationEnvironment": ()=>ApplicationEnvironment,
    "FURNITURE_SERVICE": ()=>FURNITURE_SERVICE,
    "JEWELRY_SERVICE": ()=>JEWELRY_SERVICE,
    "SERVICES": ()=>SERVICES
});
const FURNITURE_SERVICE = {
    name: "Furniture Resale Prediction",
    description: "Get an accurate resale prediction for your furniture items",
    icon: "🪑",
    questionnaire: [
        {
            name: "photo",
            label: "Upload a photo of the furniture",
            type: "file",
            required: true
        },
        {
            name: "itemType",
            label: "What type of furniture is it?",
            type: "dropdown",
            required: true,
            options: [
                "Chair",
                "Table",
                "Sofa",
                "Bed",
                "Dresser",
                "Desk",
                "Bookshelf",
                "Cabinet",
                "Other"
            ]
        },
        {
            name: "material",
            label: "What is the primary material?",
            type: "dropdown",
            required: true,
            options: [
                "Wood",
                "Metal",
                "Glass",
                "Plastic",
                "Leather",
                "Fabric",
                "Stone",
                "Composite",
                "Other"
            ]
        },
        {
            name: "age",
            label: "When was the item purchased?",
            type: "date",
            required: true
        },
        {
            name: "condition",
            label: "What condition is the item in?",
            type: "dropdown",
            required: true,
            options: [
                "Brand New",
                "Excellent",
                "Good",
                "Fair",
                "Poor",
                "Needs Restoration"
            ]
        },
        {
            name: "brand",
            label: "What is the brand or manufacturer (if known)?",
            type: "text",
            required: false
        },
        {
            name: "original_price",
            label: "Original Purchase Price ($)",
            type: "number",
            required: true
        },
        {
            name: "planned_resale_year",
            label: "In which year are you planning to sell this item?",
            type: "dropdown",
            required: true,
            options: [
                "2025",
                "2026",
                "2027",
                "2028",
                "2029",
                "2030",
                "Later"
            ]
        },
        {
            name: "description",
            label: "Please provide any additional details about the item",
            type: "textarea",
            required: false
        }
    ]
};
const JEWELRY_SERVICE = {
    name: "Jewelry Resale Prediction",
    description: "Get accurate resale value predictions for your jewelry items",
    icon: "💍",
    questionnaire: [
        {
            name: "photo",
            label: "Upload a photo of the jewelry",
            type: "file",
            required: true
        },
        {
            name: "jewelry_type",
            label: "What type of jewelry is it?",
            type: "dropdown",
            required: true,
            options: [
                "Ring",
                "Necklace",
                "Bracelet",
                "Earrings",
                "Watch",
                "Other"
            ]
        },
        {
            name: "brand",
            label: "What is the brand or manufacturer (if known)?",
            type: "text",
            required: false
        },
        {
            name: "metal_type",
            label: "What is the primary metal type?",
            type: "dropdown",
            required: true,
            options: [
                "Gold",
                "Silver",
                "Platinum",
                "White Gold",
                "Rose Gold",
                "Stainless Steel",
                "Other"
            ]
        },
        {
            name: "metal_weight",
            label: "What is the approximate weight of the jewelry (in grams)?",
            type: "number",
            required: true
        },
        {
            name: "age",
            label: "When was the item purchased?",
            type: "date",
            required: true
        },
        {
            name: "condition",
            label: "What condition is the item in?",
            type: "dropdown",
            required: true,
            options: [
                "Brand New",
                "Excellent",
                "Good",
                "Fair",
                "Poor"
            ]
        },
        {
            name: "original_price",
            label: "Original Purchase Price ($)",
            type: "number",
            required: true,
            hint: "Note: Resale value may depend on the current market price of gold."
        },
        {
            name: "planned_resale_year",
            label: "In which year are you planning to sell this item?",
            type: "dropdown",
            required: true,
            options: [
                "2025",
                "2026",
                "2027",
                "2028",
                "2029",
                "2030",
                "Later"
            ]
        },
        {
            name: "description",
            label: "Please provide any additional details about the item",
            type: "textarea",
            required: false
        }
    ]
};
const SERVICES = [
    FURNITURE_SERVICE,
    JEWELRY_SERVICE
];
let ApplicationEnvironment;
(function(ApplicationEnvironment) {
    ApplicationEnvironment["DEVELOPMENT"] = "development";
    ApplicationEnvironment["PRODUCTION"] = "production";
})(ApplicationEnvironment || (ApplicationEnvironment = {}));

})()),
"[project]/src/lib/env.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "env": ()=>env
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@t3-oss/env-nextjs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_import__("[project]/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
const env = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$t3$2d$oss$2f$env$2d$nextjs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createEnv"])({
    server: {
        NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "development",
            "production"
        ]),
        NEXTAUTH_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        APP_BASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
        MONGODB_URI: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
        GOOGLE_CLIENT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        GOOGLE_CLIENT_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        GEMINI_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        CLOUDINARY_CLOUD_NAME: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        CLOUDINARY_API_KEY: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        CLOUDINARY_API_SECRET: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
        NEXTAUTH_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url(),
        DATABASE_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url()
    },
    client: {
        NEXT_PUBLIC_NODE_ENV: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
            "development",
            "production"
        ]),
        NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url()
    },
    runtimeEnv: {
        NODE_ENV: ("TURBOPACK compile-time value", "development"),
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        APP_BASE_URL: process.env.APP_BASE_URL,
        MONGODB_URI: process.env.MONGODB_URI,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        NEXT_PUBLIC_NODE_ENV: ("TURBOPACK compile-time value", "development"),
        NEXT_PUBLIC_APP_URL: ("TURBOPACK compile-time value", "http://localhost:3000"),
        DATABASE_URL: process.env.DATABASE_URL
    }
});

})()),
"[project]/src/lib/config/logger.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$colorette$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/colorette/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$source$2d$map$2d$support$2f$source$2d$map$2d$support$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/source-map-support/source-map-support.js [app-route] (ecmascript)");
var __TURBOPACK__commonjs__external__util__ = __turbopack_external_require__("util", true);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/winston/lib/winston.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$mongodb$2f$lib$2f$winston$2d$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/winston-mongodb/lib/winston-mongodb.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/constants.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/env.ts [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
;
;
;
// Linking Trace Support
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$source$2d$map$2d$support$2f$source$2d$map$2d$support$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.install();
const colorizeLevel = (level)=>{
    switch(level){
        case "ERROR":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$colorette$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["red"])(level);
        case "INFO":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$colorette$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["blue"])(level);
        case "WARN":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$colorette$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["yellow"])(level);
        default:
            return level;
    }
};
const consoleLogFormat = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["format"].printf((info)=>{
    const { level, message, timestamp, meta = {} } = info;
    const customLevel = colorizeLevel(level.toUpperCase());
    const customTimestamp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$colorette$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["green"])(timestamp);
    const line = "----------------";
    const customMessage = message;
    const customMeta = __TURBOPACK__commonjs__external__util__["default"].inspect(meta, {
        showHidden: false,
        depth: null,
        colors: true
    });
    const customLog = `${line}\n${customLevel} [${customTimestamp}] ${customMessage}\n${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$colorette$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["magenta"])("META")} ${customMeta}\n${line}`;
    return customLog;
});
const consoleTransport = ()=>{
    if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NODE_ENV === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApplicationEnvironment"].DEVELOPMENT) {
        return [
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transports"].Console({
                level: "info",
                format: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["format"].combine(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["format"].timestamp(), consoleLogFormat)
            })
        ];
    }
    return [];
};
const getCollectionName = (level)=>{
    switch(level){
        case "info":
            return "app-info";
        case "error":
            return "app-error";
        case "warn":
            return "app-warn";
        default:
            return "app-logs";
    }
};
const mongodbTransport = ()=>{
    return [
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$mongodb$2f$lib$2f$winston$2d$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MongoDB"]({
            level: "info",
            db: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].DATABASE_URL,
            metaKey: "meta",
            expireAfterSeconds: 3600 * 24 * 30,
            collection: getCollectionName("info")
        }),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$mongodb$2f$lib$2f$winston$2d$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MongoDB"]({
            level: "error",
            db: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].DATABASE_URL,
            metaKey: "meta",
            expireAfterSeconds: 3600 * 24 * 30,
            collection: getCollectionName("error")
        }),
        new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2d$mongodb$2f$lib$2f$winston$2d$mongodb$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MongoDB"]({
            level: "warn",
            db: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].DATABASE_URL,
            metaKey: "meta",
            expireAfterSeconds: 3600 * 24 * 30,
            collection: getCollectionName("warn")
        })
    ];
};
const logger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createLogger({
    level: "info",
    format: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.combine(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.timestamp(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$winston$2f$lib$2f$winston$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].format.json()),
    defaultMeta: {
        service: "predictye-ai"
    },
    transports: [
        ...consoleTransport(),
        ...mongodbTransport()
    ]
});
const __TURBOPACK__default__export__ = logger;

})()),
"[project]/src/lib/config/prisma.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__commonjs__external__$40$prisma$2f$client__ = __turbopack_external_require__("@prisma/client", true);
"__TURBOPACK__ecmascript__hoisting__location__";
;
const prisma = new __TURBOPACK__commonjs__external__$40$prisma$2f$client__["PrismaClient"]();
const __TURBOPACK__default__export__ = prisma;

})()),
"[project]/src/lib/helpers/auth-options.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "authOptions": ()=>authOptions
});
var __TURBOPACK__commonjs__external__$40$prisma$2f$client__ = __turbopack_external_require__("@prisma/client", true);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next-auth/providers/google.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/config/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/env.ts [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
;
;
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            clientId: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GOOGLE_CLIENT_ID,
            clientSecret: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].GOOGLE_CLIENT_SECRET
        }),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user || !user.password) {
                    return null;
                }
                const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role
                };
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60
    },
    callbacks: {
        async jwt ({ token, user, account }) {
            if (user) {
                // Find the user in the database
                let dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.findUnique({
                    where: {
                        email: user.email
                    }
                });
                if (!dbUser) {
                    // Create a new user if it doesn't exist
                    dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image || "/placeholder.svg?height=50&width=50",
                            provider: account?.provider === "google" ? __TURBOPACK__commonjs__external__$40$prisma$2f$client__["AuthProvider"].Google : __TURBOPACK__commonjs__external__$40$prisma$2f$client__["AuthProvider"].Local
                        }
                    });
                } else {
                    // Update the provider if the user signs in with a different method
                    const newProvider = account?.provider === "google" ? __TURBOPACK__commonjs__external__$40$prisma$2f$client__["AuthProvider"].Google : __TURBOPACK__commonjs__external__$40$prisma$2f$client__["AuthProvider"].Local;
                    if (dbUser.provider !== newProvider) {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].user.update({
                            where: {
                                id: dbUser.id
                            },
                            data: {
                                provider: newProvider
                            }
                        });
                    }
                }
                // Add user details to the token
                token = {
                    ...token,
                    id: dbUser.id,
                    role: dbUser.role
                };
            }
            return token;
        },
        async session ({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    role: token.role
                }
            };
        }
    },
    secret: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NEXTAUTH_SECRET
};

})()),
"[project]/src/lib/helpers/errors/server.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/config/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/constants.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/env.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/server.js [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
const ServerSideErrorHandler = (error)=>{
    // Log the error for debugging purposes
    if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NODE_ENV === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApplicationEnvironment"].DEVELOPMENT) {
        console.log("Server-side error:", error);
    } else {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error(error);
    }
    if (error instanceof Error && error.message.includes("prisma")) {
        // Handle Prisma-related errors
        const prismaError = error; // Cast to any to access meta fields if available
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "Database Error",
            trace: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$env$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["env"].NODE_ENV === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApplicationEnvironment"].DEVELOPMENT ? prismaError.stack : null
        }, {
            status: 400
        });
    }
    if (error instanceof Error) {
        // Handle other types of Error objects
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error.message || "An unexpected error occurred"
        }, {
            status: 500
        });
    } else if (typeof error === "string") {
        // Handle simple string errors
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: error
        }, {
            status: 500
        });
    } else {
        // Fallback for any other types of errors
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            message: "An unexpected error occurred"
        }, {
            status: 500
        });
    }
};
const __TURBOPACK__default__export__ = ServerSideErrorHandler;

})()),
"[project]/src/app/api/chats/[chatId]/route.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "GET": ()=>GET,
    "PATCH": ()=>PATCH
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/config/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/config/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$helpers$2f$auth$2d$options$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/helpers/auth-options.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$helpers$2f$errors$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/lib/helpers/errors/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next-auth/next/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/server.js [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
;
;
async function GET(request, { params }) {
    try {
        const { chatId } = await params;
        // Get user session
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$helpers$2f$auth$2d$options$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        const userId = session?.user?.id;
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "User not authenticated"
            }, {
                status: 401
            });
        }
        // Fetch chat with blocks
        const chat = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].chat.findUnique({
            where: {
                id: chatId
            },
            include: {
                service: true,
                blocks: {
                    include: {
                        messages: {
                            include: {
                                fileData: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });
        if (!chat) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error(`Chat not found: ${chatId}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Chat not found"
            }, {
                status: 404
            });
        }
        // Check if user has access to this chat if chat.userId is defined
        if (chat.userId && chat.userId.toString() !== userId && !session?.user?.id) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].warn(`Unauthorized access attempt to chat: ${chatId} by user: ${userId}`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized"
            }, {
                status: 403
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info(`Chat fetched: ${chatId} by user: ${userId}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            chat
        });
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$helpers$2f$errors$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(error);
    }
}
async function PATCH(request, { params }) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$next$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$helpers$2f$auth$2d$options$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        // Check if user is authenticated
        if (!session?.user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Unauthorized"
            }, {
                status: 401
            });
        }
        const { chatId } = await params;
        const { title } = await request.json();
        // Validate input
        if (!title || typeof title !== "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Invalid title"
            }, {
                status: 400
            });
        }
        // Find the chat and verify ownership
        const chat = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].chat.findUnique({
            where: {
                id: chatId
            },
            select: {
                userId: true
            }
        });
        if (!chat) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Chat not found"
            }, {
                status: 404
            });
        }
        // Verify the user owns this chat
        if (chat.userId !== session.user.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                message: "Forbidden"
            }, {
                status: 403
            });
        }
        // Update the chat title
        const updatedChat = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].chat.update({
            where: {
                id: chatId
            },
            data: {
                title
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedChat);
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$helpers$2f$errors$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(error);
    }
}

})()),

};

//# sourceMappingURL=src_65cfe4._.js.map