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
exports.getModelAttemptChain = getModelAttemptChain;
exports.getRateLimitEvidence = getRateLimitEvidence;
exports.isRateLimitLikeText = isRateLimitLikeText;
exports.runWithModelFallback = runWithModelFallback;
const modelCatalog_1 = require("../antigravityClient/modelCatalog");
const protobuf_1 = require("../antigravityClient/protobuf");
const state = __importStar(require("../state"));
const PRIMARY_RATE_LIMIT_PATTERNS = [
    /model limit exceeded/i,
    /exhausted your capacity on this model/i,
    /quota will reset after/i,
];
const SUPPORTING_RATE_LIMIT_PATTERNS = [
    /resource_exhausted/i,
    /http 429 too many requests/i,
];
function getModelAttemptChain(config) {
    const primaryModel = {
        name: config.model,
        modelId: config.modelId ?? protobuf_1.DEFAULT_MODEL_ID,
    };
    const primaryBucket = (0, modelCatalog_1.getModelQuotaBucket)(primaryModel.name);
    const fallbackModels = config.modelFallbackSelections
        .filter((selection) => selection.bucket !== primaryBucket)
        .map((selection) => ({
        name: selection.modelName,
        modelId: selection.modelId,
    }));
    const attempts = [primaryModel, ...fallbackModels];
    const seen = new Set();
    return attempts.filter((model) => {
        if (seen.has(model.modelId)) {
            return false;
        }
        seen.add(model.modelId);
        return true;
    });
}
function getRateLimitEvidence(text) {
    for (const pattern of PRIMARY_RATE_LIMIT_PATTERNS) {
        const match = text.match(pattern);
        if (match?.index !== undefined) {
            return text
                .slice(Math.max(0, match.index - 120), Math.min(text.length, match.index + match[0].length + 200))
                .trim();
        }
    }
    const supportingMatches = SUPPORTING_RATE_LIMIT_PATTERNS
        .map((pattern) => {
        const match = text.match(pattern);
        return match?.index !== undefined
            ? { match: match[0], index: match.index }
            : null;
    })
        .filter((match) => match !== null);
    if (supportingMatches.length >= 2) {
        const firstMatch = supportingMatches[0];
        return text
            .slice(Math.max(0, firstMatch.index - 120), Math.min(text.length, firstMatch.index + firstMatch.match.length + 200))
            .trim();
    }
    return null;
}
function isRateLimitLikeText(text) {
    return getRateLimitEvidence(text) !== null;
}
function isRateLimitLikeError(error) {
    const message = error instanceof Error ? error.message : String(error);
    return isRateLimitLikeText(message);
}
async function runWithModelFallback(config, actionLabel, action) {
    const attempts = getModelAttemptChain(config);
    let lastError;
    for (let index = 0; index < attempts.length; index++) {
        const model = attempts[index];
        try {
            if (index > 0) {
                state.progressLogger?.info(`Retrying ${actionLabel} with fallback model ${model.name}`, "Model");
            }
            return await action(model);
        }
        catch (error) {
            lastError = error;
            const nextModel = attempts[index + 1];
            if (!nextModel || !isRateLimitLikeError(error)) {
                throw error;
            }
            state.progressLogger?.warn(`Model ${model.name} appears rate limited. Trying ${nextModel.name} next.`, "Model");
        }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
//# sourceMappingURL=modelFallback.js.map