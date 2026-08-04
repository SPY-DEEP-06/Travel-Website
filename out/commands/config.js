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
exports.configureIterations = configureIterations;
exports.setConfigMode = setConfigMode;
exports.setConfigModel = setConfigModel;
exports.setConfigModelFallbackPriority = setConfigModelFallbackPriority;
exports.setConfigPromptFile = setConfigPromptFile;
exports.setConfigTaskFile = setConfigTaskFile;
exports.setConfigProgressFile = setConfigProgressFile;
exports.configureStableThreshold = configureStableThreshold;
const vscode = __importStar(require("vscode"));
const state = __importStar(require("../state"));
const discovery_1 = require("../utils/discovery");
const modelCatalog_1 = require("../antigravityClient/modelCatalog");
const protobuf_1 = require("../antigravityClient/protobuf");
let isModelSelectionBusy = false;
async function configureIterations(context) {
    const currentIterations = context.workspaceState.get("ralph.lastMaxIterations") ?? 50;
    const result = await vscode.window.showInputBox({
        prompt: "Enter maximum iterations per loop",
        value: currentIterations.toString(),
        validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num <= 0 || num > 1000) {
                return "Please enter a number between 1 and 1000";
            }
            return null;
        },
    });
    if (result) {
        const value = parseInt(result);
        await context.workspaceState.update("ralph.lastMaxIterations", value);
        state.setMaxIterations(value);
        state.ralphLoopProvider.refresh();
        state.progressLogger?.info(`Max iterations set to ${value}`, "Config");
    }
}
async function setConfigMode(context) {
    const modes = ["Fast", "Planning"];
    const currentMode = context.workspaceState.get("ralph.lastMode") ?? "Fast";
    const sortedModes = [currentMode, ...modes.filter((m) => m !== currentMode)];
    const result = await vscode.window.showQuickPick(sortedModes, {
        placeHolder: "Select mode",
    });
    if (result) {
        await context.workspaceState.update("ralph.lastMode", result);
        state.ralphLoopProvider.refresh();
        state.progressLogger?.info(`Mode set to ${result}`, "Config");
    }
}
async function setConfigModel(context) {
    if (isModelSelectionBusy) {
        state.progressLogger?.debug("Ignoring duplicate model selection request", "Config");
        return;
    }
    isModelSelectionBusy = true;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspacePath = workspaceFolders?.[0]?.uri.fsPath;
    const config = vscode.workspace.getConfiguration("ralphLoop");
    const currentModel = context.workspaceState.get("ralph.lastModel") ??
        config.get("defaultModel", protobuf_1.DEFAULT_MODEL_NAME);
    try {
        const models = await (0, modelCatalog_1.discoverModelsForWorkspace)(workspacePath);
        if (models.length === 0) {
            vscode.window.showErrorMessage("No models returned from Antigravity server");
            return;
        }
        const sortedModels = currentModel
            ? [
                ...models.filter((model) => model.name === currentModel),
                ...models.filter((model) => model.name !== currentModel),
            ]
            : models;
        const modelNames = sortedModels.map((model) => model.name);
        const result = await vscode.window.showQuickPick(modelNames, {
            placeHolder: "Select AI model",
        });
        if (result) {
            const selected = sortedModels.find((model) => model.name === result);
            const selectedBucket = (0, modelCatalog_1.getModelQuotaBucket)(result);
            const currentBucketOrder = (0, modelCatalog_1.normalizeModelQuotaBucketOrder)(context.workspaceState.get("ralph.modelFallbackBucketOrder", modelCatalog_1.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER));
            const currentSelections = (0, modelCatalog_1.buildModelFallbackSelections)(currentBucketOrder, context.workspaceState.get("ralph.modelFallbackSelections", []), workspacePath);
            const selectedModelId = selected?.modelId ??
                currentSelections.find((selection) => selection.bucket === selectedBucket)
                    ?.modelId;
            await context.workspaceState.update("ralph.lastModel", result);
            await context.workspaceState.update("ralph.lastModelId", selected?.modelId);
            if (selectedModelId !== undefined) {
                const updatedSelections = [
                    {
                        bucket: selectedBucket,
                        modelName: result,
                        modelId: selectedModelId,
                    },
                    ...currentSelections.filter((selection) => selection.bucket !== selectedBucket),
                ];
                await context.workspaceState.update("ralph.modelFallbackSelections", updatedSelections);
            }
            state.ralphLoopProvider.refresh();
            state.progressLogger?.info(`Model set to ${result}`, "Config");
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Could not discover models: ${errorMessage}`);
    }
    finally {
        isModelSelectionBusy = false;
    }
}
async function setConfigModelFallbackPriority(context) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const workspacePath = workspaceFolders?.[0]?.uri.fsPath;
    const config = vscode.workspace.getConfiguration("ralphLoop");
    const currentModel = context.workspaceState.get("ralph.lastModel") ??
        config.get("defaultModel", protobuf_1.DEFAULT_MODEL_NAME);
    const currentBucketOrder = (0, modelCatalog_1.normalizeModelQuotaBucketOrder)(context.workspaceState.get("ralph.modelFallbackBucketOrder", modelCatalog_1.DEFAULT_MODEL_FALLBACK_BUCKET_ORDER));
    const primaryBucket = (0, modelCatalog_1.getModelQuotaBucket)(currentModel);
    const currentSelections = (0, modelCatalog_1.buildModelFallbackSelections)(currentBucketOrder, context.workspaceState.get("ralph.modelFallbackSelections", []), workspacePath);
    let models;
    try {
        models = await (0, modelCatalog_1.discoverModelsForWorkspace)(workspacePath);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Could not discover models: ${errorMessage}`);
        return;
    }
    const availableBuckets = (0, modelCatalog_1.getAvailableQuotaBuckets)(models).filter((bucket) => bucket !== primaryBucket);
    const normalizedCurrentSelections = currentSelections.filter((selection) => availableBuckets.includes(selection.bucket));
    const currentPrimaryModel = models.find((model) => model.name === currentModel);
    const primarySelection = currentPrimaryModel
        ? {
            bucket: primaryBucket,
            modelName: currentModel,
            modelId: currentPrimaryModel.modelId,
        }
        : currentSelections.find((selection) => selection.bucket === primaryBucket);
    const selectedSelections = [];
    const currentFallbackLabel = (0, modelCatalog_1.formatModelFallbackSelections)(normalizedCurrentSelections);
    while (true) {
        const remainingBuckets = availableBuckets.filter((bucket) => !selectedSelections.some((selection) => selection.bucket === bucket));
        const items = [
            ...(selectedSelections.length > 0
                ? [
                    {
                        label: "Save fallback chain",
                        description: (0, modelCatalog_1.formatModelFallbackSelections)(selectedSelections),
                        action: "save",
                    },
                ]
                : []),
            ...(selectedSelections.length === 0
                ? [
                    {
                        label: "Use current fallback chain",
                        description: currentFallbackLabel,
                        action: "reset",
                    },
                ]
                : []),
            ...remainingBuckets.map((bucket) => ({
                label: bucket,
                description: selectedSelections.length === 0
                    ? `Priority 1 after ${currentModel}`
                    : `Priority ${selectedSelections.length + 1}`,
                action: "bucket",
                bucket,
            })),
        ];
        const pick = await vscode.window.showQuickPick(items, {
            placeHolder: selectedSelections.length === 0
                ? `Select fallback bucket after primary model ${currentModel}`
                : "Select the next fallback bucket, or save the fallback chain",
        });
        if (!pick) {
            return;
        }
        if (pick.action === "reset") {
            const storedSelections = [
                ...(primarySelection ? [primarySelection] : []),
                ...normalizedCurrentSelections,
            ];
            await context.workspaceState.update("ralph.modelFallbackSelections", storedSelections);
            await context.workspaceState.update("ralph.modelFallbackBucketOrder", storedSelections.map((selection) => selection.bucket));
            state.ralphLoopProvider.refresh();
            return;
        }
        if (pick.action === "save") {
            const storedBucketOrder = [
                primaryBucket,
                ...selectedSelections.map((selection) => selection.bucket),
                ...normalizedCurrentSelections
                    .map((selection) => selection.bucket)
                    .filter((bucket) => !selectedSelections.some((selection) => selection.bucket === bucket)),
            ];
            const storedSelections = [
                ...(primarySelection ? [primarySelection] : []),
                ...selectedSelections,
                ...normalizedCurrentSelections.filter((selection) => !selectedSelections.some((selectedSelection) => selectedSelection.bucket === selection.bucket)),
            ];
            await context.workspaceState.update("ralph.modelFallbackBucketOrder", storedBucketOrder);
            await context.workspaceState.update("ralph.modelFallbackSelections", storedSelections);
            state.ralphLoopProvider.refresh();
            state.progressLogger?.info(`Fallback chain set to ${(0, modelCatalog_1.formatModelFallbackSelections)(selectedSelections.length > 0 ? selectedSelections : normalizedCurrentSelections)}`, "Config");
            return;
        }
        if (pick.bucket) {
            const currentSelectionForBucket = normalizedCurrentSelections.find((selection) => selection.bucket === pick.bucket);
            const bucketModels = (0, modelCatalog_1.getModelsForBucket)(pick.bucket, workspacePath, models);
            const sortedBucketModels = currentSelectionForBucket
                ? [
                    ...bucketModels.filter((model) => model.name === currentSelectionForBucket.modelName),
                    ...bucketModels.filter((model) => model.name !== currentSelectionForBucket.modelName),
                ]
                : bucketModels;
            const modelPick = await vscode.window.showQuickPick(sortedBucketModels.map((model) => ({
                label: model.name,
                description: pick.bucket,
                model,
            })), {
                placeHolder: `Select model for ${pick.bucket}`,
            });
            if (!modelPick?.model) {
                continue;
            }
            selectedSelections.push({
                bucket: pick.bucket,
                modelName: modelPick.model.name,
                modelId: modelPick.model.modelId,
            });
        }
    }
}
async function setConfigPromptFile(context) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders)
        return;
    // Get workspace from active editor, fall back to first workspace
    let workspaceRoot = workspaceFolders[0].uri.fsPath;
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const activeWorkspace = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
        if (activeWorkspace) {
            workspaceRoot = activeWorkspace.uri.fsPath;
        }
    }
    const promptFiles = await (0, discovery_1.discoverPromptFiles)(workspaceRoot);
    const options = ["None (skip prompt)", ...promptFiles];
    const result = await vscode.window.showQuickPick(options, {
        placeHolder: "Select prompt file",
    });
    if (result !== undefined) {
        const file = result.startsWith("None") ? "" : result;
        await context.workspaceState.update("ralph.lastPromptFile", file);
        state.ralphLoopProvider.refresh();
        state.progressLogger?.info(`Prompt file set to ${file || "None"}`, "Config");
    }
}
async function setConfigTaskFile(context) {
    const taskFileOptions = ["PRD.md", "TASKS.md", "None"];
    const currentTaskFile = context.workspaceState.get("ralph.lastTaskFile") ?? "PRD.md";
    const sortedOptions = [
        currentTaskFile,
        ...taskFileOptions.filter((t) => t !== currentTaskFile),
    ];
    const result = await vscode.window.showQuickPick(sortedOptions, {
        placeHolder: "Select task file",
    });
    if (result) {
        const file = result === "None" ? undefined : result;
        await context.workspaceState.update("ralph.lastTaskFile", file ?? "None");
        state.ralphLoopProvider.refresh();
        state.progressLogger?.info(`Task file set to ${file || "None"}`, "Config");
    }
}
async function setConfigProgressFile(context) {
    const currentProgressFile = context.workspaceState.get("ralph.lastProgressFile") ??
        "progress.txt";
    const result = await vscode.window.showInputBox({
        prompt: "Enter progress file path (relative to workspace root)",
        value: currentProgressFile,
        placeHolder: "progress.txt",
    });
    if (result !== undefined) {
        await context.workspaceState.update("ralph.lastProgressFile", result || "progress.txt");
        state.ralphLoopProvider.refresh();
        state.progressLogger?.info(`Progress file set to ${result || "progress.txt"}`, "Config");
    }
}
async function configureStableThreshold(context) {
    const currentThreshold = context.workspaceState.get("ralph.lastStableThreshold") ?? 7;
    const result = await vscode.window.showInputBox({
        prompt: "Enter stable threshold (number of stable polls before considering agent done)",
        value: currentThreshold.toString(),
        validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 20) {
                return "Please enter a number between 1 and 20";
            }
            return null;
        },
    });
    if (result) {
        const value = parseInt(result);
        await context.workspaceState.update("ralph.lastStableThreshold", value);
        state.ralphLoopProvider.refresh();
        state.progressLogger?.info(`Stable threshold set to ${value} (${value * 2} seconds)`, "Config");
    }
}
//# sourceMappingURL=config.js.map