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
exports.DEBUG_AUTORUN_SENTINEL = void 0;
exports.debugConversationRegistration = debugConversationRegistration;
exports.shouldAutorunConversationRegistrationDebug = shouldAutorunConversationRegistrationDebug;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const state = __importStar(require("../state"));
const factory_1 = require("../antigravityClient/factory");
exports.DEBUG_AUTORUN_SENTINEL = path.join(os.tmpdir(), "ralph-debug-conversation-registration");
function log(message, data) {
    const suffix = data === undefined
        ? ""
        : ` ${typeof data === "string" ? data : safeStringify(data)}`;
    const line = `[Ralph Debug] ${message}${suffix}`;
    state.outputChannel.appendLine(line);
    console.log(line);
}
function safeStringify(value) {
    try {
        return JSON.stringify(value);
    }
    catch {
        return String(value);
    }
}
function describeObjectPaths(root, maxDepth = 3, maxEntries = 120) {
    const results = [];
    const seen = new WeakSet();
    const visit = (value, path, depth) => {
        if (results.length >= maxEntries) {
            return;
        }
        if (typeof value === "function") {
            results.push({ path, kind: "function" });
            return;
        }
        if (!value || typeof value !== "object") {
            results.push({ path, kind: "value" });
            return;
        }
        if (seen.has(value)) {
            return;
        }
        seen.add(value);
        const keys = Object.keys(value).slice(0, 20);
        results.push({ path, kind: "object", keys });
        if (depth >= maxDepth) {
            return;
        }
        for (const key of keys) {
            try {
                visit(value[key], path ? `${path}.${key}` : key, depth + 1);
            }
            catch (error) {
                log(`describeObjectPaths failed at ${path}.${key}`, String(error));
            }
        }
    };
    visit(root, "exports", 0);
    return results;
}
function findInterestingPaths(paths) {
    return paths.filter((entry) => {
        const haystack = `${entry.path} ${(entry.keys || []).join(" ")}`.toLowerCase();
        return (haystack.includes("trajectory") ||
            haystack.includes("summary") ||
            haystack.includes("sync") ||
            haystack.includes("state") ||
            haystack.includes("command") ||
            haystack.includes("provider") ||
            haystack.includes("pushupdate"));
    });
}
async function debugConversationRegistration(_context) {
    state.outputChannel.show(true);
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ??
        "/Users/abhishekbhakat/CODES/GENERIC/DISCUSSION";
    log("debugConversationRegistration workspace", workspaceRoot);
    const commands = await vscode.commands.getCommands(true);
    const antigravityCommands = commands
        .filter((command) => command.startsWith("antigravity."))
        .sort();
    log("available antigravity commands", antigravityCommands);
    const antigravityExtension = vscode.extensions.getExtension("google.antigravity");
    log("antigravity extension present", Boolean(antigravityExtension));
    if (antigravityExtension) {
        log("antigravity extension meta", {
            id: antigravityExtension.id,
            isActive: antigravityExtension.isActive,
            version: antigravityExtension.packageJSON?.version,
            extensionPath: antigravityExtension.extensionPath,
        });
        try {
            const exportsValue = antigravityExtension.isActive
                ? antigravityExtension.exports
                : await antigravityExtension.activate();
            log("antigravity extension exports type", typeof exportsValue);
            const described = describeObjectPaths(exportsValue);
            log("antigravity extension export paths", described);
            log("interesting export paths", findInterestingPaths(described));
        }
        catch (error) {
            log("antigravity extension activate/inspect failed", String(error));
        }
    }
    let client;
    try {
        client = await (0, factory_1.createAntigravityClient)(state.outputChannel, undefined, workspaceRoot);
        const cascadeId = await client.startCascade(false);
        log("host-side experiment cascadeId", cascadeId);
        const message = `Host-side registration experiment ${new Date().toISOString()}`;
        await client.sendMessage(cascadeId, message, "Fast");
        log("host-side experiment messageSent", message);
        try {
            await vscode.commands.executeCommand("antigravity.toggleChatFocus");
            log("executed antigravity.toggleChatFocus");
        }
        catch (error) {
            log("toggleChatFocus failed", String(error));
        }
    }
    catch (error) {
        log("debugConversationRegistration failed", String(error));
        throw error;
    }
    finally {
        client?.disconnect();
    }
}
function shouldAutorunConversationRegistrationDebug() {
    try {
        return fs.existsSync(exports.DEBUG_AUTORUN_SENTINEL);
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=debug.js.map