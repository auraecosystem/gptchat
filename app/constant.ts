export const OWNER = "ChatGPTNextWeb";
export const REPO = "ChatGPT-Next-Web";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const PLUGINS_REPO_URL = `https://github.com/${OWNER}/NextChat-Awesome-Plugins`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";

export const OPENAI_BASE_URL = "https://api.openai.com";
export const ANTHROPIC_BASE_URL = "https://api.anthropic.com";
export const ALIBABA_BASE_URL = "https://dashscope.aliyuncs.com/api/";
export const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
export const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export const CACHE_URL_PREFIX = "/api/cache";
export const UPLOAD_URL = `${CACHE_URL_PREFIX}/upload`;

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",
  Plugins = "/plugins",
  Auth = "/auth",
  Sd = "/sd",
  SdNew = "/sd-new",
  Artifacts = "/artifacts",
  SearchChat = "/search-chat",
  McpMarket = "/mcp-market",
}

export enum ApiPath {
  Cors = "",
  OpenAI = "/api/openai",
  Anthropic = "/api/anthropic",
  Alibaba = "/api/alibaba",
  DeepSeek = "/api/deepseek",
  Artifacts = "/api/artifacts",
  /** @deprecated removed in trim-models build */
  Azure = "/api/azure",
  /** @deprecated removed in trim-models build */
  Google = "/api/google",
  /** @deprecated removed in trim-models build */
  Baidu = "/api/baidu",
  /** @deprecated removed in trim-models build */
  ByteDance = "/api/bytedance",
  /** @deprecated removed in trim-models build */
  Tencent = "/api/tencent",
  /** @deprecated removed in trim-models build */
  Moonshot = "/api/moonshot",
  /** @deprecated removed in trim-models build */
  Iflytek = "/api/iflytek",
  /** @deprecated removed in trim-models build */
  Stability = "/api/stability",
  /** @deprecated removed in trim-models build */
  XAI = "/api/xai",
  /** @deprecated removed in trim-models build */
  ChatGLM = "/api/chatglm",
  /** @deprecated removed in trim-models build */
  SiliconFlow = "/api/siliconflow",
  Nvidia = "/api/nvidia",
  /** @deprecated removed in trim-models build */
  "302.AI" = "/api/302ai",
}

export enum SlotID {
  AppBody = "app-body",
  CustomModel = "custom-model",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Plugin = "chat-next-web-plugin",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
  SdList = "sd-list",
  Mcp = "mcp-store",
}

export const DEFAULT_SIDEBAR_WIDTH = 300;
export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";
export const UNFINISHED_INPUT = (id: string) => "unfinished-input-" + id;

export const STORAGE_KEY = "chatgpt-next-web";

export const REQUEST_TIMEOUT_MS = 60000;
export const REQUEST_TIMEOUT_MS_FOR_THINKING = REQUEST_TIMEOUT_MS * 5;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export enum ServiceProvider {
  OpenAI = "OpenAI",
  Anthropic = "Anthropic",
  Alibaba = "Alibaba",
  DeepSeek = "DeepSeek",
  /** @deprecated removed in trim-models build */
  Azure = "Azure",
  /** @deprecated removed in trim-models build */
  Google = "Google",
  /** @deprecated removed in trim-models build */
  Baidu = "Baidu",
  /** @deprecated removed in trim-models build */
  ByteDance = "ByteDance",
  /** @deprecated removed in trim-models build */
  Tencent = "Tencent",
  /** @deprecated removed in trim-models build */
  Moonshot = "Moonshot",
  /** @deprecated removed in trim-models build */
  Stability = "Stability",
  /** @deprecated removed in trim-models build */
  Iflytek = "Iflytek",
  /** @deprecated removed in trim-models build */
  XAI = "XAI",
  /** @deprecated removed in trim-models build */
  ChatGLM = "ChatGLM",
  /** @deprecated removed in trim-models build */
  SiliconFlow = "SiliconFlow",
  Nvidia = "Nvidia",
  /** @deprecated removed in trim-models build */
  "302.AI" = "302.AI",
}

// Google API safety settings, see https://ai.google.dev/gemini-api/docs/safety-settings
// BLOCK_NONE will not block any content, and BLOCK_ONLY_HIGH will block only high-risk content.
export enum GoogleSafetySettingsThreshold {
  BLOCK_NONE = "BLOCK_NONE",
  BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
  BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
  BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
}

export enum ModelProvider {
  GPT = "GPT",
  Claude = "Claude",
  Qwen = "Qwen",
  DeepSeek = "DeepSeek",
  /** @deprecated removed in trim-models build */
  Stability = "Stability",
  /** @deprecated removed in trim-models build */
  GeminiPro = "GeminiPro",
  /** @deprecated removed in trim-models build */
  Ernie = "Ernie",
  /** @deprecated removed in trim-models build */
  Doubao = "Doubao",
  /** @deprecated removed in trim-models build */
  Hunyuan = "Hunyuan",
  /** @deprecated removed in trim-models build */
  Moonshot = "Moonshot",
  /** @deprecated removed in trim-models build */
  Iflytek = "Iflytek",
  /** @deprecated removed in trim-models build */
  XAI = "XAI",
  /** @deprecated removed in trim-models build */
  ChatGLM = "ChatGLM",
  /** @deprecated removed in trim-models build */
  SiliconFlow = "SiliconFlow",
  NvidiaDeepSeek = "NvidiaDeepSeek",
  /** @deprecated removed in trim-models build */
  "302.AI" = "302.AI",
}

export const Anthropic = {
  ChatPath: "v1/messages",
  ChatPath1: "v1/complete",
  ExampleEndpoint: "https://api.anthropic.com",
  Vision: "2023-06-01",
};

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  SpeechPath: "v1/audio/speech",
  ImagePath: "v1/images/generations",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

export const Alibaba = {
  ExampleEndpoint: ALIBABA_BASE_URL,
  ChatPath: (modelName: string) => {
    if (modelName.includes("vl") || modelName.includes("omni")) {
      return "v1/services/aigc/multimodal-generation/generation";
    }
    return `v1/services/aigc/text-generation/generation`;
  },
};

export const DeepSeek = {
  ExampleEndpoint: DEEPSEEK_BASE_URL,
  ChatPath: "chat/completions",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
// export const DEFAULT_SYSTEM_TEMPLATE = `
// You are ChatGPT, a large language model trained by {{ServiceProvider}}.
// Knowledge cutoff: {{cutoff}}
// Current model: {{model}}
// Current time: {{time}}
// Latex inline: $x^2$
// Latex block: $$e=mc^2$$
// `;
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by {{ServiceProvider}}.
Knowledge cutoff: {{cutoff}}
Current model: {{model}}
Current time: {{time}}
Latex inline: \\(x^2\\) 
Latex block: $$e=mc^2$$
`;

export const MCP_TOOLS_TEMPLATE = `
[clientId]
{{ clientId }}
[tools]
{{ tools }}
`;

export const MCP_SYSTEM_TEMPLATE = `
You are an AI assistant with access to system tools. Your role is to help users by combining natural language understanding with tool operations when needed.

1. AVAILABLE TOOLS:
{{ MCP_TOOLS }}

2. WHEN TO USE TOOLS:
   - ALWAYS USE TOOLS when they can help answer user questions
   - DO NOT just describe what you could do - TAKE ACTION immediately
   - If you're not sure whether to use a tool, USE IT
   - Common triggers for tool use:
     * Questions about files or directories
     * Requests to check, list, or manipulate system resources
     * Any query that can be answered with available tools

3. HOW TO USE TOOLS:
   A. Tool Call Format:
      - Use markdown code blocks with format: \`\`\`json:mcp:{clientId}\`\`\`
      - Always include:
        * method: "tools/call"（Only this method is supported）
        * params: 
          - name: must match an available primitive name
          - arguments: required parameters for the primitive

   B. Response Format:
      - Tool responses will come as user messages
      - Format: \`\`\`json:mcp-response:{clientId}\`\`\`
      - Wait for response before making another tool call

   C. Important Rules:
      - Only use tools/call method
      - Only ONE tool call per message
      - ALWAYS TAKE ACTION instead of just describing what you could do
      - Include the correct clientId in code block language tag
      - Verify arguments match the primitive's requirements

4. INTERACTION FLOW:
   A. When user makes a request:
      - IMMEDIATELY use appropriate tool if available
      - DO NOT ask if user wants you to use the tool
      - DO NOT just describe what you could do
   B. After receiving tool response:
      - Explain results clearly
      - Take next appropriate action if needed
   C. If tools fail:
      - Explain the error
      - Try alternative approach immediately

5. EXAMPLE INTERACTION:

  good example:

   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "list_allowed_directories",
       "arguments": {}
     }
   }
   \`\`\`"


  \`\`\`json:mcp-response:filesystem
  {
  "method": "tools/call",
  "params": {
    "name": "write_file",
    "arguments": {
      "path": "/Users/river/dev/nextchat/test/joke.txt",
      "content": "为什么数学书总是感到忧伤？因为它有太多的问题。"
    }
  }
  }
\`\`\`

   follwing is the wrong! mcp json example:

   \`\`\`json:mcp:filesystem
   {
      "method": "write_file",
      "params": {
        "path": "NextChat_Information.txt",
        "content": "1"
    }
   }
   \`\`\`

   This is wrong because the method is not tools/call.
   
   \`\`\`{
  "method": "search_repositories",
  "params": {
    "query": "2oeee"
  }
}
   \`\`\`

   This is wrong because the method is not tools/call.!!!!!!!!!!!

   the right format is:
   \`\`\`json:mcp:filesystem
   {
     "method": "tools/call",
     "params": {
       "name": "search_repositories",
       "arguments": {
         "query": "2oeee"
       }
     }
   }
   \`\`\`
   
   please follow the format strictly ONLY use tools/call method!!!!!!!!!!!
   
`;

export const SUMMARIZE_MODEL = "gpt-5.6-luna";
// 本分支的 DeepSeek 走 NVIDIA NIM 转发（见 app/api/deepseek.ts）
export const DEEPSEEK_SUMMARIZE_MODEL = "deepseek-ai/deepseek-v4-flash";

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4": "2023-12",
  "gpt-4-0613": "2023-06",
  "gpt-4.1": "2024-06",
  "gpt-4.1-2025-04-14": "2024-06",
  "gpt-4.1-mini": "2024-06",
  "gpt-4.1-mini-2025-04-14": "2024-06",
  "gpt-4.1-nano": "2024-06",
  "gpt-4.1-nano-2025-04-14": "2024-06",
  "gpt-4.5-preview": "2025-03",
  "gpt-4.5-preview-2025-02-27": "2025-03",
  "gpt-4o": "2023-10",
  "gpt-4o-2024-05-13": "2023-10",
  "gpt-4o-2024-08-06": "2023-10",
  "gpt-4o-2024-11-20": "2023-10",
  "chatgpt-4o-latest": "2023-10",
  "gpt-4o-mini": "2023-10",
  "gpt-4o-mini-2024-07-18": "2023-10",
  "o1-mini-2024-09-12": "2023-10",
  "o1-mini": "2023-10",
  "o1-preview-2024-09-12": "2023-10",
  "o1-preview": "2023-10",
  "o1-2024-12-17": "2023-10",
  o1: "2023-10",
  "o3-mini-2025-01-31": "2023-10",
  "o3-mini": "2023-10",
  o3: "2025-06",
  "o4-mini": "2025-06",
  "gpt-5-chat": "2025-06",
  "gpt-5-mini": "2025-06",
  "gpt-5-nano": "2025-06",
  "gpt-5-chat-2025-01-01-preview": "2025-06",
  "gpt-5": "2025-08",
  "gpt-5.2": "2025-08",
  "gpt-5.4": "2025-08",
  "gpt-5.5": "2025-11",
  "deepseek-chat": "2024-07",
  "deepseek-v3": "2024-12",
  "deepseek-coder": "2024-07",
  "deepseek-coder-v2": "2024-12",
  "deepseek-reasoner": "2024-11",
  "deepseek-reasoner-v2": "2025-03",
  "claude-haiku-4-5": "2025-09",
  "claude-haiku-4-6": "2025-09",
  "claude-sonnet-4-5": "2025-09",
  "claude-sonnet-4-6": "2025-09",
  "claude-sonnet-4-20250514": "2025-09",
  "claude-opus-4-5": "2025-09",
  "claude-opus-4-6": "2025-09",
  "claude-opus-4-7": "2025-09",
  "claude-opus-4-20250514": "2025-09",
  "claude-3-5-haiku-20241022": "2024-08",
  "claude-3-5-haiku-latest": "2024-08",
  "claude-3-5-sonnet-20240620": "2024-08",
  "claude-3-5-sonnet-20241022": "2024-08",
  "claude-3-5-sonnet-latest": "2024-08",
  "claude-3-7-sonnet-20250219": "2025-03",
  "claude-3-7-sonnet-latest": "2025-03",
  "claude-3-opus-20240229": "2023-08",
  "claude-3-opus-latest": "2023-08",
  "claude-3-haiku-20240307": "2023-08",
  "o3-pro": "2025-06",
  "o4-mini-2025-04-16": "2025-06",
};

export const DEFAULT_TTS_ENGINE = "OpenAI-TTS";
export const DEFAULT_TTS_ENGINES = ["OpenAI-TTS", "Edge-TTS"];
export const DEFAULT_TTS_MODEL = "tts-1";
export const DEFAULT_TTS_VOICE = "alloy";
export const DEFAULT_TTS_MODELS = ["tts-1", "tts-1-hd"];
export const DEFAULT_TTS_VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
];

export const VISION_MODEL_REGEXES = [
  /vision/,
  /gpt-4o/,
  /gpt-4\.1/,
  /gpt-4-turbo(?!.*preview)/,
  /gpt-5/,
  /gpt-4-vision/,
  /claude.*[34]/,
  /claude-(opus|sonnet|haiku|fable)/, // Claude 4/5 新命名，如 claude-opus-5
  /gemini/,
  /learnlm/,
  /qwen-vl/,
  /qwen2-vl/,
  /dall-e/,
  /o3/,
  /o4-mini/,
];

export const EXCLUDE_VISION_MODEL_REGEXES = [/claude-3-5-haiku-20241022/];

// GPT-5.6 家族（2026-07 发布）：sol 为旗舰，terra 均衡，luna 主打低成本。
// gpt-5.6 是 gpt-5.6-sol 的别名。知识截止 2026-02-16。
const openaiModels = [
  "gpt-4",
  "gpt-4-0613",
  "gpt-4.1",
  "gpt-4.1-2025-04-14",
  "gpt-4.1-mini",
  "gpt-4.1-mini-2025-04-14",
  "gpt-4.1-nano",
  "gpt-4.1-nano-2025-04-14",
  "gpt-4.5-preview",
  "gpt-4.5-preview-2025-02-27",
  "gpt-4o",
  "gpt-4o-2024-05-13",
  "gpt-4o-2024-08-06",
  "gpt-4o-2024-11-20",
  "chatgpt-4o-latest",
  "gpt-4o-mini",
  "gpt-4o-mini-2024-07-18",
  "o1-mini",
  "o1-preview",
  "o1",
  "o3-mini",
  "o3-mini-2025-01-31",
  "o3",
  "o4-mini",
  "o4-mini-2025-04-16",
  "o3-pro",
  "gpt-5-chat",
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-5",
  "gpt-5-chat-2025-01-01-preview",
  "gpt-5.2",
  "gpt-5.4",
  "gpt-5.5",
  // GPT-5.6 家族（2026-07）：sol 旗舰 / terra 均衡 / luna 低成本，gpt-5.6 是 sol 的别名
  "gpt-5.6",
  "gpt-5.6-sol",
  "gpt-5.6-terra",
  "gpt-5.6-luna",
];

// Claude 3.x 全系已退役（claude-3-7-sonnet / claude-3-5-haiku 于 2026-02-19 下线）。
// 以下均为在服模型，别名不带日期后缀。
const anthropicModels = [
  // Claude 5 series (latest)
  "claude-fable-5",
  "claude-opus-5",
  "claude-sonnet-5",
  // Claude 4 series
  "claude-haiku-4-5",
  "claude-haiku-4-6",
  "claude-sonnet-4",
  "claude-sonnet-4-5",
  "claude-sonnet-4-6",
  "claude-sonnet-4-20250514",
  "claude-opus-4",
  "claude-opus-4-5",
  "claude-opus-4-6",
  "claude-opus-4-7",
  "claude-opus-4-8",
  // Legacy Claude 3.5 / 3.7
  "claude-3-5-haiku-20241022",
  "claude-3-5-haiku-latest",
  "claude-3-5-sonnet-20240620",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-sonnet-latest",
  "claude-3-7-sonnet-20250219",
  "claude-3-7-sonnet-latest",
  // Legacy Claude 3
  "claude-3-opus-20240229",
  "claude-3-opus-latest",
  "claude-3-haiku-20240307",
];

const alibabaModes = [
  "qwen-turbo",
  "qwen-plus",
  "qwen-max",
  "qwen-max-0428",
  "qwen-max-0403",
  "qwen-max-0107",
  "qwen-max-longcontext",
  "qwen2.5-turbo",
  "qwen2.5-plus",
  "qwen2.5-max",
  "qwen2.5-coder",
  "qwen2.5-math",
  "qwen-vl-plus",
  "qwen-vl-max",
  "qwen2.5-vl",
  "qwen2.5-vl-32b",
  "qwen-omni-turbo",
];

// 本分支的 DeepSeek 经 app/api/deepseek.ts 转发到 NVIDIA NIM，故使用 NIM 的模型 ID。
// DeepSeek 官方的 deepseek-chat / deepseek-coder / deepseek-reasoner 已于 2026-07-24 下线。
const deepseekModels = [
  "deepseek-ai/deepseek-v4-pro",
  "deepseek-ai/deepseek-v4-flash",
];

const nvidiaModels = [
  "deepseek-ai/deepseek-v4-pro",
  "deepseek-ai/deepseek-v4-flash",
];

let seq = 1000; // 内置的模型序号生成器从1000开始
export const DEFAULT_MODELS = [
  ...openaiModels.map((name) => ({
    name,
    available: true,
    sorted: seq++, // Global sequence sort(index)
    provider: {
      id: "openai",
      providerName: "OpenAI",
      providerType: "openai",
      sorted: 1,
    },
  })),
  ...anthropicModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "anthropic",
      providerName: "Anthropic",
      providerType: "anthropic",
      sorted: 2,
    },
  })),
  ...alibabaModes.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "alibaba",
      providerName: "Alibaba",
      providerType: "alibaba",
      sorted: 3,
    },
  })),
  ...deepseekModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "deepseek",
      providerName: "DeepSeek",
      providerType: "deepseek",
      sorted: 4,
    },
  })),
  ...nvidiaModels.map((name) => ({
    name,
    available: true,
    sorted: seq++,
    provider: {
      id: "nvidia",
      providerName: "Nvidia",
      providerType: "nvidia",
      sorted: 5,
    },
  })),
] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;

// some famous webdav endpoints
export const internalAllowedWebDavEndpoints = [
  "https://dav.jianguoyun.com/dav/",
  "https://dav.dropdav.com/",
  "https://dav.box.com/dav",
  "https://nanao.teracloud.jp/dav/",
  "https://bora.teracloud.jp/dav/",
  "https://webdav.4shared.com/",
  "https://dav.idrivesync.com",
  "https://webdav.yandex.com",
  "https://app.koofr.net/dav/Koofr",
];

export const DEFAULT_GA_ID = "G-89WN60ZK2E";

export const SAAS_CHAT_URL = "https://nextchat.club";
export const SAAS_CHAT_UTM_URL = "https://nextchat.club?utm=github";

// Stubs for removed providers (kept for compatibility with other modules)
// These are no-ops for the trimmed build

/** @deprecated removed in trim-models build */
export const GEMINI_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const BAIDU_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const BAIDU_OATUH_URL = BAIDU_BASE_URL + "/oauth/2.0/token";
/** @deprecated removed in trim-models build */
export const BYTEDANCE_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const TENCENT_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const MOONSHOT_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const STABILITY_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const IFLYTEK_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const XAI_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const CHATGLM_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const SILICONFLOW_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const AI302_BASE_URL = OPENAI_BASE_URL;
/** @deprecated removed in trim-models build */
export const GEMINI_SUMMARIZE_MODEL = SUMMARIZE_MODEL;

/** @deprecated removed in trim-models build */
export const Google = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: (m: string) => `v1beta/models/${m}:streamGenerateContent`,
};
/** @deprecated removed in trim-models build */
export const Baidu = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: (m: string) => {
    let ep = m;
    if (m === "ernie-4.0-8k") ep = "completions_pro";
    if (m === "ernie-4.0-8k-preview-0518") ep = "completions_adv_pro";
    if (m === "ernie-3.5-8k") ep = "completions";
    if (m === "ernie-speed-8k") ep = "ernie_speed";
    return `rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${ep}`;
  },
};
/** @deprecated removed in trim-models build */
export const ByteDance = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: "api/v3/chat/completions",
};
/** @deprecated removed in trim-models build */
export const Tencent = { ExampleEndpoint: OPENAI_BASE_URL };
/** @deprecated removed in trim-models build */
export const Moonshot = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: "v1/chat/completions",
};
/** @deprecated removed in trim-models build */
export const Stability = { GeneratePath: "", ExampleEndpoint: OPENAI_BASE_URL };
/** @deprecated removed in trim-models build */
export const Iflytek = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: "v1/chat/completions",
};
/** @deprecated removed in trim-models build */
export const XAI = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: "v1/chat/completions",
};
/** @deprecated removed in trim-models build */
export const ChatGLM = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: "api/paas/v4/chat/completions",
  ImagePath: "api/paas/v4/images/generations",
  VideoPath: "api/paas/v4/videos/generations",
};
/** @deprecated removed in trim-models build */
export const SiliconFlow = {
  ExampleEndpoint: OPENAI_BASE_URL,
  ChatPath: "v1/chat/completions",
  ListModelPath: "v1/models?&sub_type=chat",
};
/** @deprecated removed in trim-models build */
export const AI302 = {
  ChatPath: "v1/chat/completions",
  ListModelPath: "v1/models?llm=1",
  ExampleEndpoint: OPENAI_BASE_URL,
};
/** @deprecated removed in trim-models build */
export const Azure = {
  ChatPath: (_deployName: string, _apiVersion: string) => "",
  ImagePath: (_deployName: string, _apiVersion: string) => "",
  ExampleEndpoint: OPENAI_BASE_URL,
  GeneratePath: "",
};
