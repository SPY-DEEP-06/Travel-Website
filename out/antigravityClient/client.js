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
exports.AntigravityClient = void 0;
const http2 = __importStar(require("http2"));
const http = __importStar(require("http"));
const vscode = __importStar(require("vscode"));
const protobuf_1 = require("./protobuf");
function isDebugLoggingEnabled() {
    return vscode.workspace
        .getConfiguration("ralphLoop")
        .get("debugLogging", false);
}
class AntigravityClient {
    constructor(config, outputChannel) {
        this.client = null;
        this.config = config;
        this.outputChannel = outputChannel;
    }
    async connect() {
        return new Promise((resolve, reject) => {
            this.client = http2.connect(`https://127.0.0.1:${this.config.port}`, {
                rejectUnauthorized: false,
            });
            let connected = false;
            this.client.on("connect", () => {
                connected = true;
                this.log("Connected to Antigravity server");
                resolve();
            });
            this.client.on("error", (err) => {
                this.log(`Connection error: ${err.message}`);
                reject(err);
            });
            setTimeout(() => {
                if (!connected) {
                    reject(new Error("Connection timeout"));
                }
            }, 5000);
        });
    }
    disconnect() {
        if (!this.client)
            return;
        this.client.close();
        this.client = null;
        this.log("Disconnected from Antigravity server");
    }
    async registerConversation(cascadeId, workspacePath, summary) {
        if (!this.config.extensionServerPort ||
            !this.config.extensionServerCsrfToken) {
            throw new Error("Extension server credentials are unavailable");
        }
        const workspaceUri = vscode.Uri.file(workspacePath).toString();
        await this.pushUnifiedStateUpdate("uss-sidebarWorkspaces", workspaceUri, this.buildSidebarWorkspace(workspaceUri));
        await this.pushUnifiedStateUpdate("trajectorySummaries", cascadeId, this.buildCascadeTrajectorySummary(cascadeId, workspaceUri, summary));
        this.log(`Conversation registered in UI: ${cascadeId}`);
    }
    async startCascade(enablePlanning = false) {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const metadata = (0, protobuf_1.buildMetadata)(this.config.oauthToken);
        const payload = Buffer.concat([
            (0, protobuf_1.ldField)(1, metadata),
            Buffer.from([0x20, enablePlanning ? 0x01 : 0x00]),
        ]);
        return new Promise((resolve, reject) => {
            const req = this.client.request({
                ":method": "POST",
                ":path": "/exa.language_server_pb.LanguageServerService/StartCascade",
                "content-type": "application/proto",
                "connect-protocol-version": "1",
                origin: "vscode-file://vscode-app",
                "x-codeium-csrf-token": this.config.csrfToken,
                "content-length": payload.length.toString(),
            });
            let responseData = Buffer.alloc(0);
            req.on("response", (headers) => {
                if (headers[":status"] !== 200) {
                    reject(new Error(`StartCascade failed with status ${headers[":status"]}`));
                }
            });
            req.on("data", (chunk) => {
                responseData = Buffer.concat([responseData, chunk]);
            });
            req.on("end", () => {
                if (responseData.length > 2) {
                    const len = responseData[1];
                    const cascadeId = responseData.subarray(2, 2 + len).toString("utf8");
                    this.log(`Cascade started: ${cascadeId}`);
                    resolve(cascadeId);
                    return;
                }
                reject(new Error("Empty response from StartCascade"));
            });
            req.on("error", reject);
            req.write(payload);
            req.end();
        });
    }
    async pushUnifiedStateUpdate(topicName, key, value) {
        const payload = (0, protobuf_1.ldField)(1, Buffer.concat([
            (0, protobuf_1.ldField)(1, topicName),
            (0, protobuf_1.ldField)(5, Buffer.concat([
                (0, protobuf_1.ldField)(1, key),
                (0, protobuf_1.ldField)(2, (0, protobuf_1.ldField)(1, value.toString("base64"))),
            ])),
        ]));
        await new Promise((resolve, reject) => {
            const req = http.request({
                host: "127.0.0.1",
                port: this.config.extensionServerPort,
                method: "POST",
                path: "/exa.extension_server_pb.ExtensionServerService/PushUnifiedStateSyncUpdate",
                headers: {
                    "content-type": "application/proto",
                    "connect-protocol-version": "1",
                    origin: "vscode-file://vscode-app",
                    "x-codeium-csrf-token": this.config.extensionServerCsrfToken,
                    "content-length": payload.length.toString(),
                },
            }, (res) => {
                const chunks = [];
                res.on("data", (chunk) => {
                    chunks.push(chunk);
                });
                res.on("end", () => {
                    if (res.statusCode === 200) {
                        resolve();
                        return;
                    }
                    reject(new Error(`${topicName} update failed with status ${res.statusCode}: ${Buffer.concat(chunks)
                        .toString("utf8")
                        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
                        .trim()
                        .slice(0, 200)}`));
                });
            });
            req.on("error", reject);
            req.write(payload);
            req.end();
        });
    }
    buildSidebarWorkspace(workspaceUri) {
        return Buffer.concat([
            (0, protobuf_1.ldField)(4, workspaceUri),
            (0, protobuf_1.ldField)(5, Buffer.concat([
                Buffer.from([0x08, 0x00]),
                Buffer.from([0x10, 0x01]),
            ])),
        ]);
    }
    buildCascadeTrajectorySummary(cascadeId, workspaceUri, summary) {
        const timestamp = this.buildTimestamp(new Date());
        return Buffer.concat([
            (0, protobuf_1.ldField)(1, summary),
            (0, protobuf_1.ldField)(4, cascadeId),
            (0, protobuf_1.ldField)(3, timestamp),
            (0, protobuf_1.ldField)(7, timestamp),
            (0, protobuf_1.ldField)(10, timestamp),
            (0, protobuf_1.ldField)(9, (0, protobuf_1.ldField)(1, workspaceUri)),
        ]);
    }
    buildTimestamp(date) {
        const seconds = Math.floor(date.getTime() / 1000);
        const nanos = (date.getTime() % 1000) * 1000000;
        const fields = [Buffer.concat([Buffer.from([0x08]), (0, protobuf_1.encodeVarint)(seconds)])];
        if (nanos > 0) {
            fields.push(Buffer.concat([Buffer.from([0x10]), (0, protobuf_1.encodeVarint)(nanos)]));
        }
        return Buffer.concat(fields);
    }
    async sendMessage(cascadeId, message, mode = "Fast", modelId = protobuf_1.DEFAULT_MODEL_ID) {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const messageBody = (0, protobuf_1.ldField)(1, message);
        const planningMode = mode === "Planning" ? 1 : 0;
        const modeField = Buffer.from([0x70, planningMode]);
        const safetyConfig = (0, protobuf_1.buildSafetyConfig)(modelId);
        const payload = Buffer.concat([
            (0, protobuf_1.ldField)(1, cascadeId),
            (0, protobuf_1.ldField)(2, messageBody),
            (0, protobuf_1.ldField)(3, (0, protobuf_1.buildMetadata)(this.config.oauthToken)),
            safetyConfig,
            modeField,
        ]);
        return new Promise((resolve, reject) => {
            const req = this.client.request({
                ":method": "POST",
                ":path": "/exa.language_server_pb.LanguageServerService/SendUserCascadeMessage",
                "content-type": "application/proto",
                "connect-protocol-version": "1",
                origin: "vscode-file://vscode-app",
                "x-codeium-csrf-token": this.config.csrfToken,
                "content-length": payload.length.toString(),
            });
            let responseData = Buffer.alloc(0);
            let responseHeaders;
            let settled = false;
            req.on("data", (chunk) => {
                responseData = Buffer.concat([responseData, chunk]);
            });
            req.on("response", (headers) => {
                responseHeaders = headers;
                if (headers[":status"] === 200) {
                    this.log(`Message sent (mode=${mode}, modelId=${modelId})`);
                    settled = true;
                    resolve();
                }
            });
            req.on("end", () => {
                if (settled) {
                    return;
                }
                const responseBody = responseData
                    .toString("utf8")
                    .replace(/[^\x20-\x7E\n\r\t]/g, " ")
                    .trim();
                const bodySuffix = responseBody
                    ? ` body=${responseBody.slice(0, 200)}`
                    : "";
                reject(new Error(`SendMessage failed with status ${responseHeaders?.[":status"] ?? "unknown"}${bodySuffix}`));
            });
            req.on("error", reject);
            req.write(payload);
            req.end();
        });
    }
    async *streamUpdates(cascadeId, abortSignal) {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const varintField1 = Buffer.from([0x08, 0x01]);
        const protoPayload = Buffer.concat([
            varintField1,
            (0, protobuf_1.ldField)(2, cascadeId),
            (0, protobuf_1.ldField)(3, "chat-client-trajectories"),
        ]);
        const payload = (0, protobuf_1.frame)(protoPayload);
        const eventQueue = [];
        let streamEnded = false;
        let resolveNext = null;
        const idleTimeoutMs = 15000;
        let bytesReceived = 0;
        let idleTimeout = null;
        let pendingBuffer = Buffer.alloc(0); // Buffer for incomplete frames across chunks
        const clearIdleTimeout = () => {
            if (idleTimeout) {
                clearTimeout(idleTimeout);
                idleTimeout = null;
            }
        };
        const wake = () => {
            if (resolveNext) {
                resolveNext();
                resolveNext = null;
            }
        };
        const req = this.client.request({
            ":method": "POST",
            ":path": "/exa.language_server_pb.LanguageServerService/StreamCascadeReactiveUpdates",
            "content-type": "application/connect+proto",
            accept: "application/connect+proto",
            "connect-protocol-version": "1",
            origin: "vscode-file://vscode-app",
            "x-codeium-csrf-token": this.config.csrfToken,
        });
        const endStream = (event) => {
            if (streamEnded)
                return;
            streamEnded = true;
            clearIdleTimeout();
            eventQueue.push(event);
            try {
                req.close();
            }
            catch (error) {
                void error;
            }
            wake();
        };
        const armIdleTimeout = () => {
            clearIdleTimeout();
            if (bytesReceived <= 0)
                return;
            idleTimeout = setTimeout(() => {
                if (streamEnded || bytesReceived <= 0)
                    return;
                endStream({ type: "end", content: "idle-timeout" });
            }, idleTimeoutMs);
        };
        if (abortSignal) {
            abortSignal.addEventListener("abort", () => {
                this.log("Stream aborted via signal");
                endStream({ type: "error", content: "Stream aborted" });
            });
        }
        req.on("data", (chunk) => {
            if (streamEnded) {
                return;
            }
            if (chunk.length > 0) {
                bytesReceived += chunk.length;
                armIdleTimeout();
            }
            // Append new chunk to pending buffer
            pendingBuffer = Buffer.concat([pendingBuffer, chunk]);
            let pos = 0;
            let frameCount = 0;
            while (pos < pendingBuffer.length) {
                // Need at least 5 bytes for frame header
                if (pendingBuffer.length < pos + 5) {
                    break;
                }
                const len = pendingBuffer.readUInt32BE(pos + 1);
                // Sanity check: frame length should be reasonable (< 10MB)
                if (len > 10 * 1024 * 1024) {
                    this.log(`  WARNING: Unreasonable frame length ${len}, skipping 1 byte`);
                    pos += 1;
                    continue;
                }
                // Check if we have the complete frame
                if (pendingBuffer.length < pos + 5 + len) {
                    break;
                }
                const data = pendingBuffer.subarray(pos + 5, pos + 5 + len);
                const raw = data.toString("utf8");
                const text = raw.replace(/[^\x20-\x7E\n\r\t]/g, "").trim();
                if (text.length > 2) {
                    eventQueue.push({ type: "text", content: text, raw: data });
                }
                pos += 5 + len;
                frameCount++;
            }
            // Keep only unprocessed data in buffer
            if (pos > 0) {
                pendingBuffer = pendingBuffer.subarray(pos);
            }
            wake();
        });
        req.on("end", () => {
            this.log(`Stream ended event fired (bytesReceived=${bytesReceived})`);
            endStream({ type: "end", content: "" });
        });
        req.on("error", (err) => {
            this.log(`Stream error: ${err.message}`);
            endStream({ type: "error", content: err.message });
        });
        req.write(payload);
        req.end();
        while (!streamEnded || eventQueue.length > 0) {
            if (eventQueue.length > 0) {
                const event = eventQueue.shift();
                yield event;
                if (event.type === "end" || event.type === "error")
                    break;
            }
            else {
                await new Promise((resolve) => {
                    resolveNext = resolve;
                });
            }
        }
    }
    /**
     * Poll GetCascadeTrajectorySteps to monitor agent completion.
     * Returns when agent is done (content stable) or abort signal.
     */
    async *pollForCompletion(cascadeId, abortSignal, stableThreshold = 7) {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const pollIntervalMs = 2000; // Poll every 2 seconds
        let lastContentLen = 0;
        let stableCount = 0;
        let hasGrown = false;
        const startTime = Date.now();
        while (true) {
            if (abortSignal?.aborted) {
                yield { type: "error", content: "Polling aborted" };
                return;
            }
            const payload = (0, protobuf_1.ldField)(1, cascadeId);
            const runPollRequest = async () => new Promise((resolve, reject) => {
                const req = this.client.request({
                    ":method": "POST",
                    ":path": "/exa.language_server_pb.LanguageServerService/GetCascadeTrajectorySteps",
                    "content-type": "application/proto",
                    "connect-protocol-version": "1",
                    origin: "vscode-file://vscode-app",
                    "x-codeium-csrf-token": this.config.csrfToken,
                    "content-length": payload.length.toString(),
                });
                let responseData = Buffer.alloc(0);
                let settled = false;
                const timeout = setTimeout(() => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    try {
                        req.close(http2.constants.NGHTTP2_CANCEL);
                    }
                    catch {
                        // ignore close errors on timeout
                    }
                    reject(new Error("GetCascadeTrajectorySteps timed out after 1000ms"));
                }, 1000);
                req.on("data", (chunk) => {
                    responseData = Buffer.concat([responseData, chunk]);
                });
                req.on("response", (headers) => {
                    req.on("end", () => {
                        if (settled) {
                            return;
                        }
                        settled = true;
                        clearTimeout(timeout);
                        resolve({ status: headers[":status"], data: responseData });
                    });
                });
                req.on("error", (error) => {
                    if (settled) {
                        return;
                    }
                    settled = true;
                    clearTimeout(timeout);
                    reject(error);
                });
                req.write(payload);
                req.end();
            });
            let result;
            try {
                result = await runPollRequest();
            }
            catch (firstError) {
                this.debugLog(`Poll request failed, retrying once: ${String(firstError)}`);
                result = await runPollRequest();
            }
            if (result.status !== 200) {
                this.log(`Poll status: ${result.status}, waiting...`);
                await new Promise((r) => setTimeout(r, pollIntervalMs));
                continue;
            }
            const text = extractTrajectoryText(result.data);
            const elapsed = Math.round((Date.now() - startTime) / 1000);
            // Yield text content as event
            if (text.length > 0) {
                yield { type: "text", content: text, raw: result.data };
            }
            // Track content changes
            const contentGrew = text.length > lastContentLen;
            if (contentGrew) {
                hasGrown = true;
                stableCount = 0;
                this.debugLog(`[${elapsed}s] Content grew: ${lastContentLen} -> ${text.length}`);
            }
            else if (hasGrown) {
                stableCount++;
                this.debugLog(`[${elapsed}s] Content stable (${stableCount}/${stableThreshold})`);
                if (stableCount >= stableThreshold) {
                    this.debugLog(`Agent completed (content stable for ${stableCount * pollIntervalMs / 1000}s)`);
                    yield { type: "end", content: "completed" };
                    return;
                }
            }
            else {
                this.debugLog(`[${elapsed}s] Waiting for agent to start (len=${text.length})`);
            }
            lastContentLen = text.length;
            await new Promise((r) => setTimeout(r, pollIntervalMs));
        }
    }
    /**
     * Send a message and wait for agent response with polling.
     * Uses same logic as pollForCompletion: continues while content grows,
     * stops when content is stable.
     */
    async sendMessageAndWait(cascadeId, message, mode, modelId) {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        // First send the message
        await this.sendMessage(cascadeId, message, mode, modelId);
        // Then poll for response using same logic as pollForCompletion
        const responses = [];
        for await (const event of this.pollForCompletion(cascadeId)) {
            if (event.type === "text") {
                responses.push(event.content);
            }
            else if (event.type === "end" || event.type === "error") {
                break;
            }
        }
        return responses.join("\n");
    }
    async cancelCascade(cascadeId) {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const payload = (0, protobuf_1.ldField)(1, cascadeId);
        return new Promise((resolve, reject) => {
            const req = this.client.request({
                ":method": "POST",
                ":path": "/exa.language_server_pb.LanguageServerService/CancelCascadeInvocation",
                "content-type": "application/proto",
                "connect-protocol-version": "1",
                origin: "vscode-file://vscode-app",
                "x-codeium-csrf-token": this.config.csrfToken,
                "content-length": payload.length.toString(),
            });
            req.on("response", (headers) => {
                if (headers[":status"] === 200) {
                    this.log(`Cascade cancelled: ${cascadeId}`);
                    resolve();
                    return;
                }
                reject(new Error(`CancelCascade failed with status ${headers[":status"]}`));
            });
            req.on("error", reject);
            req.write(payload);
            req.end();
        });
    }
    async deleteCascade(cascadeId) {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const payload = (0, protobuf_1.ldField)(1, cascadeId);
        return new Promise((resolve, reject) => {
            const req = this.client.request({
                ":method": "POST",
                ":path": "/exa.language_server_pb.LanguageServerService/DeleteCascadeTrajectory",
                "content-type": "application/proto",
                "connect-protocol-version": "1",
                origin: "vscode-file://vscode-app",
                "x-codeium-csrf-token": this.config.csrfToken,
                "content-length": payload.length.toString(),
            });
            req.on("response", (headers) => {
                if (headers[":status"] === 200) {
                    this.log(`Cascade deleted: ${cascadeId}`);
                    resolve();
                    return;
                }
                reject(new Error(`DeleteCascade failed with status ${headers[":status"]}`));
            });
            req.on("error", reject);
            req.write(payload);
            req.end();
        });
    }
    async getUserStatus() {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const metadata = (0, protobuf_1.buildMetadata)(this.config.oauthToken);
        const payload = (0, protobuf_1.ldField)(1, metadata);
        return new Promise((resolve, reject) => {
            const req = this.client.request({
                ":method": "POST",
                ":path": "/exa.language_server_pb.LanguageServerService/GetUserStatus",
                "content-type": "application/proto",
                "connect-protocol-version": "1",
                origin: "vscode-file://vscode-app",
                "x-codeium-csrf-token": this.config.csrfToken,
                "content-length": payload.length.toString(),
            });
            let responseData = Buffer.alloc(0);
            req.on("data", (chunk) => {
                responseData = Buffer.concat([responseData, chunk]);
            });
            req.on("end", () => {
                const responseStr = responseData.toString("utf8");
                const status = {
                    cascadeCanAutoRunCommands: responseStr.includes("cascadeCanAutoRunCommands") ||
                        responseData.includes(Buffer.from([0x08, 0x01])),
                    allowAutoRunCommands: true,
                    allowMcpServers: true,
                    cascadeWebSearchEnabled: true,
                };
                this.log(`User status retrieved: autoRun=${status.cascadeCanAutoRunCommands}`);
                resolve(status);
            });
            req.on("error", reject);
            req.write(payload);
            req.end();
        });
    }
    async discoverModels() {
        if (!this.client) {
            throw new Error("Not connected to Antigravity server");
        }
        const metadata = (0, protobuf_1.buildMetadata)(this.config.oauthToken);
        const payload = (0, protobuf_1.ldField)(1, metadata);
        return new Promise((resolve, reject) => {
            const req = this.client.request({
                ":method": "POST",
                ":path": "/exa.language_server_pb.LanguageServerService/GetCascadeModelConfigData",
                "content-type": "application/proto",
                "connect-protocol-version": "1",
                origin: "vscode-file://vscode-app",
                "x-codeium-csrf-token": this.config.csrfToken,
                "content-length": payload.length.toString(),
            });
            let responseData = Buffer.alloc(0);
            req.on("data", (chunk) => {
                responseData = Buffer.concat([responseData, chunk]);
            });
            req.on("response", (headers) => {
                if (headers[":status"] !== 200) {
                    reject(new Error(`GetCascadeModelConfigData failed with status ${headers[":status"]}`));
                }
            });
            req.on("end", () => {
                try {
                    const models = parseModelConfigs(responseData);
                    this.log(`Discovered ${models.length} models`);
                    this.debugLog(`Models: ${models.map((m) => `${m.name}(${m.modelId})`).join(", ")}`);
                    resolve(models);
                }
                catch (err) {
                    reject(err);
                }
            });
            req.on("error", reject);
            req.write(payload);
            req.end();
        });
    }
    log(message) {
        this.outputChannel.appendLine(`[AntigravityClient] ${message}`);
    }
    debugLog(message) {
        if (isDebugLoggingEnabled()) {
            this.outputChannel.appendLine(`[AntigravityClient DEBUG] ${message}`);
        }
    }
}
exports.AntigravityClient = AntigravityClient;
function readVarint(buf, pos) {
    let result = 0;
    let shift = 0;
    while (pos < buf.length) {
        const b = buf[pos++];
        result |= (b & 0x7f) << shift;
        if ((b & 0x80) === 0)
            return [result, pos];
        shift += 7;
    }
    throw new Error("unterminated varint");
}
function readField(buf, pos) {
    const [key, p1] = readVarint(buf, pos);
    const tag = key >> 3;
    const wt = key & 7;
    if (wt === 0) {
        const [val, p2] = readVarint(buf, p1);
        return [{ tag, wt, value: val }, p2];
    }
    if (wt === 2) {
        const [len, p2] = readVarint(buf, p1);
        return [{ tag, wt, value: buf.subarray(p2, p2 + len) }, p2 + len];
    }
    // skip unknown wire types
    return [{ tag, wt, value: 0 }, p1];
}
function parseModelConfigs(body) {
    const models = [];
    let pos = 0;
    while (pos < body.length) {
        const [field, next] = readField(body, pos);
        pos = next;
        if (field.tag !== 1 || field.wt !== 2 || !Buffer.isBuffer(field.value))
            continue;
        // Parse inner message
        const inner = field.value;
        let ipos = 0;
        let name = null;
        let modelId = null;
        while (ipos < inner.length) {
            const [ifield, inext] = readField(inner, ipos);
            ipos = inext;
            if (ifield.tag === 1 && ifield.wt === 2 && Buffer.isBuffer(ifield.value)) {
                name = ifield.value.toString("utf8");
            }
            if (ifield.tag === 2 && ifield.wt === 2 && Buffer.isBuffer(ifield.value)) {
                // Nested message containing model ID as field 1 varint
                let npos = 0;
                while (npos < ifield.value.length) {
                    const [nfield, nnext] = readField(ifield.value, npos);
                    npos = nnext;
                    if (nfield.tag === 1 && nfield.wt === 0 && typeof nfield.value === "number") {
                        modelId = nfield.value;
                    }
                }
            }
        }
        if (name && modelId !== null) {
            models.push({ name, modelId });
        }
    }
    return models;
}
function extractTrajectoryText(body) {
    const seen = new Set();
    const segments = extractReadableStrings(body, 0);
    return segments
        .map((segment) => segment.replace(/\s+/g, " ").trim())
        .filter((segment) => {
        if (!segment || seen.has(segment)) {
            return false;
        }
        seen.add(segment);
        return true;
    })
        .join("\n");
}
function extractReadableStrings(buf, depth) {
    if (depth > 6 || buf.length === 0) {
        return [];
    }
    const decoded = sanitizeReadableText(buf);
    const segments = [];
    if (isReadableTextCandidate(decoded)) {
        segments.push(decoded);
    }
    let pos = 0;
    while (pos < buf.length) {
        try {
            const [field, next] = readField(buf, pos);
            pos = next;
            if (field.wt === 2 && Buffer.isBuffer(field.value) && field.value.length > 0) {
                segments.push(...extractReadableStrings(field.value, depth + 1));
            }
        }
        catch {
            break;
        }
    }
    return segments;
}
function sanitizeReadableText(buf) {
    return buf
        .toString("utf8")
        .replace(/[^\x20-\x7E\n\r\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function isReadableTextCandidate(text) {
    if (text.length < 8 || text.length > 4000) {
        return false;
    }
    const alphaCount = (text.match(/[A-Za-z]/g) ?? []).length;
    if (alphaCount < 6) {
        return false;
    }
    return /[ .,:;!?]/.test(text);
}
//# sourceMappingURL=client.js.map