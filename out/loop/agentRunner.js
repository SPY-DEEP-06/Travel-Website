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
exports.spawnFreshAgentContext = spawnFreshAgentContext;
exports.processIterationWithFreshContext = processIterationWithFreshContext;
const vscode = __importStar(require("vscode"));
const state = __importStar(require("../state"));
const antigravityClient_1 = require("../antigravityClient");
const modelFallback_1 = require("./modelFallback");
const git_1 = require("../utils/git");
async function spawnFreshAgentContext(config) {
    state.progressLogger?.streamProgress("Spawning", 2, 5, "Creating fresh agent context");
    const agentContext = {
        iteration: state.currentIteration,
        promptFile: config.promptFile,
        mode: config.mode,
        model: config.model,
        modelId: config.modelId,
        workspaceRoot: config.workspaceRoot,
        taskFile: config.taskFile,
        startTime: new Date(),
        logs: [],
    };
    state.progressLogger?.streamSubSection("Loading Resources");
    if (config.promptFile) {
        try {
            const promptUri = vscode.Uri.file(`${config.workspaceRoot}/${config.promptFile}`);
            const promptContent = await vscode.workspace.fs.readFile(promptUri);
            agentContext.promptContent = new TextDecoder().decode(promptContent);
            agentContext.logs.push(`Loaded prompt from ${config.promptFile}`);
            state.progressLogger?.debug(`Loaded prompt from ${config.promptFile}`, "Agent");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            agentContext.logs.push(`Warning: Could not load prompt file: ${errorMessage}`);
            state.progressLogger?.warn(`Could not load prompt file: ${errorMessage}`, "Agent");
        }
    }
    else {
        state.progressLogger?.debug("No prompt file specified, skipping", "Agent");
    }
    if (config.taskFile) {
        try {
            const taskUri = vscode.Uri.file(`${config.workspaceRoot}/${config.taskFile}`);
            const taskContent = await vscode.workspace.fs.readFile(taskUri);
            agentContext.taskContent = new TextDecoder().decode(taskContent);
            agentContext.logs.push(`Loaded tasks from ${config.taskFile}`);
            state.progressLogger?.debug(`Loaded tasks from ${config.taskFile}`, "Agent");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            agentContext.logs.push(`Warning: Could not load task file: ${errorMessage}`);
            state.progressLogger?.warn(`Could not load task file: ${errorMessage}`, "Agent");
        }
    }
    // Connect to Antigravity and start a cascade session
    state.progressLogger?.streamSubSection("Starting Cascade");
    try {
        if (!state.antigravityClient) {
            state.progressLogger?.info("Connecting to Antigravity...", "Agent");
            // Pass workspaceRoot to connect to the correct Antigravity process
            const client = await (0, antigravityClient_1.createAntigravityClient)(state.outputChannel, undefined, config.workspaceRoot);
            state.setAntigravityClient(client);
        }
        if (config.workspaceRoot) {
            try {
                const promptPath = config.promptFile
                    ? `${config.workspaceRoot}/${config.promptFile}`
                    : config.taskFile
                        ? `${config.workspaceRoot}/${config.taskFile}`
                        : null;
                if (promptPath) {
                    const uri = vscode.Uri.file(promptPath);
                    const doc = await vscode.workspace.openTextDocument(uri);
                    await vscode.window.showTextDocument(doc, {
                        preview: false,
                        preserveFocus: true,
                    });
                    state.progressLogger?.debug(`Activated workspace context: ${config.workspaceRoot}`, "Agent");
                    await new Promise((r) => setTimeout(r, 200));
                }
            }
            catch (contextError) {
                state.progressLogger?.debug(`Could not activate workspace context: ${contextError}`, "Agent");
            }
        }
        let cascadeId;
        // In Pseudo Ralph mode, reuse persistent cascade if available
        if (state.pseudoRalphMode && state.persistentCascadeId) {
            cascadeId = state.persistentCascadeId;
            agentContext.createdNewCascade = false;
            state.progressLogger?.info(`Reusing cascade: ${cascadeId.substring(0, 8)}... (Pseudo Ralph mode)`, "Agent");
        }
        else {
            // Create new cascade
            const enablePlanning = config.mode === "Planning";
            cascadeId = await state.antigravityClient.startCascade(enablePlanning);
            agentContext.createdNewCascade = true;
            // In Pseudo Ralph mode, store for reuse
            if (state.pseudoRalphMode) {
                state.setPersistentCascadeId(cascadeId);
                state.progressLogger?.info(`Stored cascade for reuse: ${cascadeId.substring(0, 8)}...`, "Agent");
            }
        }
        agentContext.cascadeId = cascadeId;
        state.setCurrentCascadeId(cascadeId);
        agentContext.cascadeSession = {
            cascadeId,
            status: "active",
            createdAt: new Date(),
        };
        agentContext.logs.push(`Cascade started: ${cascadeId}`);
        state.progressLogger?.info(`Cascade started: ${cascadeId.substring(0, 8)}...`, "Agent");
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        state.progressLogger?.error(`Could not start cascade: ${errorMessage}`, "Agent");
        throw new Error(`Cascade startup failed: ${errorMessage}`);
    }
    state.progressLogger?.info("Fresh agent context spawned successfully", "Agent");
    return agentContext;
}
async function registerConversationInUi(agentContext, config) {
    if (!agentContext.createdNewCascade || !agentContext.cascadeId) {
        return;
    }
    try {
        const summary = config.taskFile
            ? `Ralph Loop ${state.currentIteration}: ${config.taskFile}`
            : `Ralph Loop ${state.currentIteration}`;
        await state.antigravityClient.registerConversation(agentContext.cascadeId, config.workspaceRoot, summary);
        agentContext.logs.push("Registered conversation in Antigravity UI");
        state.progressLogger?.debug("Registered conversation in Antigravity UI", "Execution");
    }
    catch (registrationError) {
        const registrationMessage = registrationError instanceof Error
            ? registrationError.message
            : String(registrationError);
        agentContext.logs.push(`Warning: Could not register conversation in UI: ${registrationMessage}`);
        state.progressLogger?.warn(`Could not register conversation in UI: ${registrationMessage}`, "Execution");
    }
}
async function recreateCascadeForFallback(agentContext, config, failedModelName) {
    if (!state.antigravityClient) {
        throw new Error("Antigravity client unavailable for fallback retry");
    }
    if (agentContext.cascadeId) {
        try {
            await state.antigravityClient.deleteCascade(agentContext.cascadeId);
            agentContext.logs.push(`Deleted cascade ${agentContext.cascadeId.substring(0, 8)} after ${failedModelName} rate limit`);
        }
        catch (deleteError) {
            state.progressLogger?.debug(`Could not delete rate-limited cascade: ${deleteError}`, "Cleanup");
        }
    }
    const enablePlanning = config.mode === "Planning";
    const cascadeId = await state.antigravityClient.startCascade(enablePlanning);
    agentContext.cascadeId = cascadeId;
    agentContext.createdNewCascade = true;
    agentContext.cascadeSession = {
        cascadeId,
        status: "active",
        createdAt: new Date(),
    };
    state.setCurrentCascadeId(cascadeId);
    if (state.pseudoRalphMode) {
        state.setPersistentCascadeId(cascadeId);
    }
    agentContext.logs.push(`Fallback cascade started: ${cascadeId}`);
    state.progressLogger?.info(`Started fallback cascade: ${cascadeId.substring(0, 8)}...`, "Agent");
}
async function processIterationWithFreshContext(agentContext, config, context) {
    state.progressLogger?.streamProgress("Processing", 3, 5, "Executing with fresh context");
    state.progressLogger?.streamSubSection("Agent Execution");
    agentContext.logs.push(`Processing iteration ${state.currentIteration} with fresh context`);
    agentContext.logs.push(`Mode: ${config.mode}, Model: ${config.model}`);
    state.progressLogger?.debug(`Mode: ${config.mode}, Model: ${config.model}`, "Execution");
    if (agentContext.cascadeId && state.antigravityClient) {
        try {
            // Use loopId from config (set once per session by iteration.ts)
            const loopId = config.loopId;
            // Initialize git session once per loop (only on first iteration)
            if (!config.gitInfo) {
                state.progressLogger?.streamSubSection("Initializing Git Session");
                if (config.useGit) {
                    const gitInfo = await (0, git_1.initializeGitSession)(config.workspaceRoot, loopId, config.createBranchEverySession);
                    config.gitInfo = gitInfo;
                    if (gitInfo.isGitRepo) {
                        if (gitInfo.createdBranch) {
                            state.progressLogger?.info(`Created and switched to session branch: ${gitInfo.createdBranch}`, "Git");
                            agentContext.logs.push(`Created session branch: ${gitInfo.createdBranch} from ${gitInfo.currentBranch}`);
                        }
                        else {
                            state.progressLogger?.info(`Using current branch: ${gitInfo.currentBranch}`, "Git");
                            agentContext.logs.push(`Using current branch: ${gitInfo.currentBranch}`);
                        }
                    }
                    else {
                        state.progressLogger?.info("Not a git repository, git operations disabled", "Git");
                    }
                }
                else {
                    state.progressLogger?.info("Git integration disabled", "Git");
                    config.gitInfo = { isGitRepo: false };
                }
            }
            if (!config.taskFile) {
                throw new Error("No task file selected. Please select a task file (e.g., PRD.md, TASKS.md).");
            }
            const taskFile = config.taskFile;
            const progressFile = config.progressFile;
            const isGitRepo = config.gitInfo?.isGitRepo ?? false;
            const gitBranch = config.gitInfo?.createdBranch ?? config.gitInfo?.currentBranch;
            let message = "";
            if (agentContext.promptContent) {
                message += agentContext.promptContent + "\n\n---\n\n";
            }
            // Build git instruction based on settings
            let gitInstruction;
            if (!config.useGit) {
                gitInstruction = "5. No git operations needed - git integration is disabled";
            }
            else if (!isGitRepo) {
                gitInstruction = "5. No git operations needed - this is not a git repository";
            }
            else if (gitBranch) {
                gitInstruction = `5. Commit your changes to branch \`${gitBranch}\` unless said otherwise in \`${taskFile}\``;
            }
            else {
                gitInstruction = "5. Commit your changes to the current branch unless said otherwise in the task file";
            }
            message += `# Instructions
## Identity
You are an autonomous AI sub-agent, specifically created to handle atomic coding tasks.
You are one of multiple sequential sub-agents in a loop.

Read the task list from \`${taskFile}\` and check progress in \`${progressFile}\`.

## Your Job
1. Review \`${progressFile}\` to see what's been done
2. Pick the next uncompleted task from \`${taskFile}\`
3. Implement one logical commit's worth of work. If the task is large, complete a meaningful chunk.
4. Append your progress to \`${progressFile}\` (only the part you worked on if task is large)
${gitInstruction}

## Rules
- **Append-only**: Add to \`${progressFile}\`, never remove entries
- **Do not edit** \`${taskFile}\` - it's read-only
- **One task only**: Complete exactly one task, then stop
- **Always log progress**: Even on failure, record what happened
${isGitRepo && config.useGit ? `- **Do not use** \`git add -A\` - select files manually` : ""}
- **Signal completion**: When ALL tasks in \`${taskFile}\` are complete, append this EXACT block at the end of \`${progressFile}\`:
----------
${(0, git_1.generateDoneMarker)(loopId)}

**CRITICAL WARNING**: If you fail to append this completion marker when ALL tasks are done, the Ralph Loop will continue running indefinitely in an infinite loop. You will be trapped in an endless cycle of being spawned repeatedly with no way to exit. The user will have to manually terminate you. DO NOT forget this marker when finished.
`;
            state.progressLogger?.progress("Sending instructions to cascade...", "Execution");
            const attempts = (0, modelFallback_1.getModelAttemptChain)(config);
            let completedInitialExecution = false;
            for (let attemptIndex = 0; attemptIndex < attempts.length; attemptIndex++) {
                const model = attempts[attemptIndex];
                const nextModel = attempts[attemptIndex + 1];
                if (attemptIndex > 0) {
                    state.progressLogger?.info(`Retrying initial instructions with fallback model ${model.name}`, "Model");
                    await recreateCascadeForFallback(agentContext, config, attempts[attemptIndex - 1].name);
                }
                await state.antigravityClient.sendMessage(agentContext.cascadeId, message, config.mode, model.modelId);
                agentContext.logs.push(`Instructions sent to cascade with ${model.name}`);
                state.progressLogger?.streamSubSection("Monitoring Agent Progress");
                let responseCount = 0;
                let conversationRegistered = false;
                let rateLimitContent = null;
                const abortController = new AbortController();
                state.setStreamAbortController(abortController);
                try {
                    for await (const event of state.antigravityClient.pollForCompletion(agentContext.cascadeId, abortController.signal, config.stableThreshold ?? 7)) {
                        if (state.stopRequested) {
                            state.progressLogger?.warn("Stop requested, cancelling cascade...", "Execution");
                            await state.antigravityClient.cancelCascade(agentContext.cascadeId);
                            throw new Error("Stop requested during processing");
                        }
                        if (event.type === "text") {
                            responseCount++;
                            agentContext.logs.push(`Stream: ${event.content.substring(0, 200)}`);
                            if ((0, modelFallback_1.isRateLimitLikeText)(event.content)) {
                                rateLimitContent =
                                    (0, modelFallback_1.getRateLimitEvidence)(event.content) ?? event.content;
                                abortController.abort();
                                break;
                            }
                            if (!conversationRegistered) {
                                await registerConversationInUi(agentContext, config);
                                conversationRegistered = true;
                            }
                        }
                        else if (event.type === "end") {
                            if (!conversationRegistered) {
                                await registerConversationInUi(agentContext, config);
                            }
                            state.progressLogger?.info(`Stream completed (${responseCount} chunks)`, "Execution");
                            agentContext.logs.push("Stream completed");
                            completedInitialExecution = true;
                            break;
                        }
                        else if (event.type === "error") {
                            state.progressLogger?.error(`Stream error: ${event.content}`, "Execution");
                            agentContext.logs.push(`Stream error: ${event.content}`);
                            break;
                        }
                    }
                }
                finally {
                    state.setStreamAbortController(null);
                }
                if (rateLimitContent) {
                    const rateLimitSummary = rateLimitContent
                        .replace(/\s+/g, " ")
                        .trim()
                        .slice(0, 200);
                    agentContext.logs.push(`Rate limit response from ${model.name}: ${rateLimitSummary}`);
                    if (!nextModel) {
                        throw new Error(`Model ${model.name} appears rate limited: ${rateLimitSummary}`);
                    }
                    state.progressLogger?.warn(`Model ${model.name} appears rate limited. Trying ${nextModel.name} next.`, "Model");
                    continue;
                }
                if (completedInitialExecution) {
                    break;
                }
            }
            if (!completedInitialExecution) {
                throw new Error("Initial instructions did not complete successfully");
            }
            state.progressLogger?.streamSubSection("Cleanup");
            // In Pseudo Ralph mode, don't delete the cascade (preserve for reuse)
            if (!state.pseudoRalphMode) {
                const doneMarker = (0, git_1.generateDoneMarker)(loopId);
                const progressUri = vscode.Uri.file(`${config.workspaceRoot}/${config.progressFile}`);
                // Check if the agent claimed completion by writing the done marker
                let markerPresent = false;
                try {
                    const progressContent = await vscode.workspace.fs.readFile(progressUri);
                    const progressText = new TextDecoder().decode(progressContent);
                    const tail = progressText.split(/\r?\n/).slice(-5).join("\n");
                    markerPresent = tail.includes(doneMarker);
                }
                catch {
                    state.progressLogger?.debug("Could not read progress file for validation check", "Cleanup");
                }
                if (markerPresent) {
                    // Agent claims all tasks are done — validate before accepting
                    state.progressLogger?.debug("Completion marker detected — running validation check...", "Cleanup");
                    const validationMessage = `VALIDATION CHECK: You have marked all tasks as complete by appending the completion marker to ${config.progressFile}. Before I close this session, I need you to verify this is correct:

1. Re-read all tasks in \`${config.taskFile}\`
2. Re-read the progress log in \`${config.progressFile}\`
3. Confirm that EVERY task has been completed

If ANY task is incomplete or was missed:
- Remove the completion marker "${doneMarker}" from \`${config.progressFile}\`
- Do NOT add it back

If ALL tasks are genuinely complete:
- Leave the marker in place
- Reply with "VALIDATED"`;
                    try {
                        const response = await (0, modelFallback_1.runWithModelFallback)(config, "completion validation", async (model) => state.antigravityClient.sendMessageAndWait(agentContext.cascadeId, validationMessage, config.mode, model.modelId));
                        state.progressLogger?.debug(`Validation response (length: ${response.length})`, "Cleanup");
                    }
                    catch (validationError) {
                        state.progressLogger?.debug(`Validation response timeout or error: ${validationError}`, "Cleanup");
                    }
                    // Re-check if the agent self-corrected by removing the marker
                    let markerStillPresent = false;
                    try {
                        const recheck = await vscode.workspace.fs.readFile(progressUri);
                        const recheckText = new TextDecoder().decode(recheck);
                        const recheckTail = recheckText.split(/\r?\n/).slice(-5).join("\n");
                        markerStillPresent = recheckTail.includes(doneMarker);
                    }
                    catch {
                        state.progressLogger?.debug("Could not re-read progress file after validation", "Cleanup");
                    }
                    if (markerStillPresent) {
                        state.progressLogger?.info("Completion validated — agent confirmed all tasks done", "Cleanup");
                        agentContext.logs.push("Completion validated by agent");
                    }
                    else {
                        state.progressLogger?.warn("Agent self-corrected — removed completion marker (tasks incomplete)", "Cleanup");
                        agentContext.logs.push("Agent removed false completion marker during validation");
                    }
                }
                else {
                    // No completion marker — send standard reminder
                    state.progressLogger?.debug("Sending final reminder before closing...", "Cleanup");
                    const reminderMessage = `REMINDER: Before I close this session, verify that you have appended the completion marker "${doneMarker}" to ${config.progressFile} if ALL tasks in ${config.taskFile} are complete. If you forgot, add it now or you will be respawned in an infinite loop.`;
                    try {
                        const response = await (0, modelFallback_1.runWithModelFallback)(config, "completion reminder", async (model) => state.antigravityClient.sendMessageAndWait(agentContext.cascadeId, reminderMessage, config.mode, model.modelId));
                        state.progressLogger?.debug(`Agent acknowledged reminder (response length: ${response.length})`, "Cleanup");
                    }
                    catch (reminderError) {
                        state.progressLogger?.debug(`Reminder response timeout or error: ${reminderError}`, "Cleanup");
                    }
                }
                state.progressLogger?.debug("Deleting cascade trajectory...", "Cleanup");
                await state.antigravityClient.deleteCascade(agentContext.cascadeId);
                state.setCurrentCascadeId(null);
                agentContext.logs.push("Cascade trajectory deleted");
            }
            else {
                state.progressLogger?.debug("Preserving cascade (Pseudo Ralph mode)", "Cleanup");
                agentContext.logs.push("Cascade preserved for next iteration");
            }
            if (agentContext.cascadeSession) {
                agentContext.cascadeSession.status = "completed";
            }
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            state.progressLogger?.error(`Cascade error: ${errorMessage}`, "Execution");
            agentContext.logs.push(`Cascade error: ${errorMessage}`);
            if (agentContext.cascadeId &&
                state.antigravityClient &&
                !state.pseudoRalphMode) {
                try {
                    await state.antigravityClient.deleteCascade(agentContext.cascadeId);
                    state.setCurrentCascadeId(null);
                }
                catch (cleanupError) {
                    state.progressLogger?.warn(`Cleanup failed: ${cleanupError}`, "Cleanup");
                }
            }
            if (agentContext.cascadeSession) {
                agentContext.cascadeSession.status = "error";
            }
            // Always throw the error so the loop stops on any failure
            throw error;
        }
    }
    else {
        state.progressLogger?.warn("No cascade session, using stub behavior", "Execution");
        const totalSteps = 4;
        for (let step = 1; step <= totalSteps; step++) {
            if (state.stopRequested) {
                throw new Error("Stop requested during processing");
            }
            const stepDelay = Math.random() * 250 + 250;
            await new Promise((resolve) => setTimeout(resolve, stepDelay));
            const stepNames = [
                "Analyzing prompt",
                "Processing context",
                "Generating response",
                "Finalizing output",
            ];
            state.progressLogger?.progress(`Step ${step}/${totalSteps}: ${stepNames[step - 1]}`, "Execution");
        }
    }
    agentContext.logs.push(`Iteration ${state.currentIteration} completed successfully`);
    agentContext.endTime = new Date();
    state.progressLogger?.streamProgress("Saving", 4, 5, "Storing iteration results");
    const iterationResult = {
        iteration: state.currentIteration,
        startTime: agentContext.startTime,
        endTime: agentContext.endTime,
        logs: agentContext.logs,
        success: true,
    };
    const history = context.workspaceState.get("ralph.iterationHistory", []);
    history.push(iterationResult);
    if (history.length > 10) {
        history.shift();
    }
    await context.workspaceState.update("ralph.iterationHistory", history);
    const duration = agentContext.endTime.getTime() - agentContext.startTime.getTime();
    state.progressLogger?.info(`Processing completed (${duration}ms)`, "Execution");
}
//# sourceMappingURL=agentRunner.js.map