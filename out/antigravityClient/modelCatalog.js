"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER = void 0;
exports.getModelQuotaBucket = getModelQuotaBucket;
exports.normalizeModelQuotaBucket = normalizeModelQuotaBucket;
exports.normalizeModelQuotaBucketOrder = normalizeModelQuotaBucketOrder;
exports.formatModelQuotaBucketOrder = formatModelQuotaBucketOrder;
exports.formatModelFallbackSelections = formatModelFallbackSelections;
exports.getFallbackBucketOrderForPrimary = getFallbackBucketOrderForPrimary;
exports.getAvailableQuotaBuckets = getAvailableQuotaBuckets;
exports.getCachedDiscoveredModels = getCachedDiscoveredModels;
exports.getModelsForBucket = getModelsForBucket;
exports.getDefaultModelForBucket = getDefaultModelForBucket;
exports.getPreferredModelForBucket = getPreferredModelForBucket;
exports.normalizeModelFallbackSelections = normalizeModelFallbackSelections;
exports.buildModelFallbackSelections = buildModelFallbackSelections;
exports.getFallbackSelectionsForPrimary = getFallbackSelectionsForPrimary;
exports.discoverModelsForWorkspace = discoverModelsForWorkspace;
exports.prewarmDiscoveredModels = prewarmDiscoveredModels;
const vscode = __importStar(require("vscode"));
const state = __importStar(require("../state"));
const factory_1 = require("./factory");
exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER = [
    "Gemini Flash",
    "Anthropic/OpenAI",
    "Gemini Pro",
];
const DEFAULT_BUCKET_MODELS = {
    "Gemini Flash": [{ name: "Gemini 3 Flash", modelId: 1018 }],
    "Gemini Pro": [
        { name: "Gemini 3 Pro (High)", modelId: 1008 },
        { name: "Gemini 3 Pro (Low)", modelId: 1007 },
    ],
    "Anthropic/OpenAI": [
        { name: "Claude Sonnet 4.5", modelId: 333 },
        { name: "Claude Sonnet 4.5 (Thinking)", modelId: 334 },
        { name: "Claude Opus 4.5 (Thinking)", modelId: 1012 },
        { name: "GPT-OSS-120B (Medium)", modelId: 342 },
    ],
};
const BUCKET_MODEL_PATTERNS = {
    "Gemini Flash": [/\bGemini\b.*\bFlash\b/i],
    "Gemini Pro": [/\bGemini\b.*\bPro\b/i],
    "Anthropic/OpenAI": [/^Claude /i, /^GPT-OSS/i, /^GPT[- ]/i, /^OpenAI /i],
};
let cachedModelDiscovery;
let inFlightModelDiscovery;
function getModelQuotaBucket(modelName) {
    for (const bucket of exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER) {
        if (matchesModelToBucket(modelName, bucket)) {
            return bucket;
        }
    }
    return "Anthropic/OpenAI";
}
function matchesModelToBucket(modelName, bucket) {
    return BUCKET_MODEL_PATTERNS[bucket].some((pattern) => pattern.test(modelName));
}
function normalizeModelQuotaBucket(bucket) {
    if (bucket === "Other") {
        return "Anthropic/OpenAI";
    }
    if (bucket === "Gemini") {
        return "Gemini Flash";
    }
    return bucket;
}
function normalizeModelQuotaBucketOrder(buckets) {
    return buckets
        .flatMap((bucket) => bucket === "Gemini"
        ? ["Gemini Flash", "Gemini Pro"]
        : [normalizeModelQuotaBucket(bucket)])
        .filter((bucket, index, normalizedBuckets) => normalizedBuckets.indexOf(bucket) === index);
}
function formatModelQuotaBucketOrder(buckets) {
    return buckets.join(" -> ");
}
function formatModelFallbackSelections(selections) {
    return selections
        .map((selection) => `${selection.bucket}: ${selection.modelName}`)
        .join(" -> ");
}
function getFallbackBucketOrderForPrimary(bucketOrder, primaryBucket, availableBuckets) {
    const allowedBuckets = (availableBuckets ??
        exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER).filter((bucket) => bucket !== primaryBucket);
    return [
        ...bucketOrder.filter((bucket) => allowedBuckets.includes(bucket)),
        ...exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER.filter((bucket) => allowedBuckets.includes(bucket) && !bucketOrder.includes(bucket)),
    ];
}
function getAvailableQuotaBuckets(models) {
    return exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER.filter((bucket) => getBucketModelsFromSource(bucket, models).length > 0);
}
function getCachedDiscoveredModels(workspacePath) {
    if (cachedModelDiscovery?.workspacePath !== workspacePath) {
        return undefined;
    }
    return cachedModelDiscovery?.models;
}
function getBucketModelsFromSource(bucket, sourceModels) {
    const models = sourceModels ?? DEFAULT_BUCKET_MODELS[bucket];
    const defaults = DEFAULT_BUCKET_MODELS[bucket];
    const defaultOrder = new Map(defaults.map((model, index) => [model.name, index]));
    return models
        .filter((model) => matchesModelToBucket(model.name, bucket))
        .sort((left, right) => {
        const leftIndex = defaultOrder.get(left.name) ?? Number.MAX_SAFE_INTEGER;
        const rightIndex = defaultOrder.get(right.name) ?? Number.MAX_SAFE_INTEGER;
        if (leftIndex !== rightIndex) {
            return leftIndex - rightIndex;
        }
        return left.name.localeCompare(right.name);
    });
}
function getModelsForBucket(bucket, workspacePath, sourceModels) {
    return getBucketModelsFromSource(bucket, sourceModels ?? getCachedDiscoveredModels(workspacePath));
}
function getDefaultModelForBucket(bucket, workspacePath, sourceModels) {
    return (getModelsForBucket(bucket, workspacePath, sourceModels)[0] ??
        DEFAULT_BUCKET_MODELS[bucket][0]);
}
function getPreferredModelForBucket(bucket, workspacePath) {
    return getDefaultModelForBucket(bucket, workspacePath);
}
function normalizeModelFallbackSelections(selections) {
    const normalizedSelections = [];
    const seenBuckets = new Set();
    for (const selection of selections) {
        if (!selection?.bucket ||
            !selection.modelName ||
            typeof selection.modelId !== "number") {
            continue;
        }
        const bucket = selection.bucket === "Gemini"
            ? getModelQuotaBucket(selection.modelName)
            : normalizeModelQuotaBucket(selection.bucket);
        if (seenBuckets.has(bucket)) {
            continue;
        }
        normalizedSelections.push({
            bucket,
            modelName: selection.modelName,
            modelId: selection.modelId,
        });
        seenBuckets.add(bucket);
    }
    return normalizedSelections;
}
function buildModelFallbackSelections(bucketOrder, storedSelections, workspacePath, sourceModels) {
    const normalizedOrder = normalizeModelQuotaBucketOrder(bucketOrder).length > 0
        ? normalizeModelQuotaBucketOrder(bucketOrder)
        : exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER;
    const normalizedSelections = normalizeModelFallbackSelections(storedSelections);
    const selectionByBucket = new Map(normalizedSelections.map((selection) => [selection.bucket, selection]));
    return normalizedOrder.map((bucket) => {
        const storedSelection = selectionByBucket.get(bucket);
        if (storedSelection) {
            return storedSelection;
        }
        const model = getDefaultModelForBucket(bucket, workspacePath, sourceModels);
        return {
            bucket,
            modelName: model.name,
            modelId: model.modelId,
        };
    });
}
function getFallbackSelectionsForPrimary(selections, primaryBucket, availableBuckets, workspacePath, sourceModels) {
    const allowedBuckets = (availableBuckets ??
        exports.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER).filter((bucket) => bucket !== primaryBucket);
    const visibleSelections = selections.filter((selection) => allowedBuckets.includes(selection.bucket));
    const seenBuckets = new Set(visibleSelections.map((selection) => selection.bucket));
    for (const bucket of allowedBuckets) {
        if (seenBuckets.has(bucket)) {
            continue;
        }
        const model = getDefaultModelForBucket(bucket, workspacePath, sourceModels);
        visibleSelections.push({
            bucket,
            modelName: model.name,
            modelId: model.modelId,
        });
    }
    return visibleSelections;
}
async function discoverModelsForWorkspace(workspacePath) {
    if (cachedModelDiscovery &&
        cachedModelDiscovery.workspacePath === workspacePath) {
        return cachedModelDiscovery.models;
    }
    if (inFlightModelDiscovery &&
        inFlightModelDiscovery.workspacePath === workspacePath) {
        return inFlightModelDiscovery.promise;
    }
    const discoveryPromise = (async () => {
        let tempClient;
        try {
            tempClient = await (0, factory_1.createAntigravityClient)(state.outputChannel, undefined, workspacePath);
            const models = await tempClient.discoverModels();
            cachedModelDiscovery = {
                workspacePath,
                models,
            };
            return models;
        }
        finally {
            tempClient?.disconnect();
        }
    })();
    inFlightModelDiscovery = {
        workspacePath,
        promise: discoveryPromise,
    };
    try {
        return await discoveryPromise;
    }
    finally {
        if (inFlightModelDiscovery?.promise === discoveryPromise) {
            inFlightModelDiscovery = undefined;
        }
    }
}
async function prewarmDiscoveredModels() {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspacePath) {
        return;
    }
    try {
        await discoverModelsForWorkspace(workspacePath);
        state.progressLogger?.debug("Preloaded model list into memory", "Config");
    }
    catch (error) {
        state.progressLogger?.debug(`Model preload skipped: ${error instanceof Error ? error.message : String(error)}`, "Config");
    }
}
//# sourceMappingURL=modelCatalog.js.map