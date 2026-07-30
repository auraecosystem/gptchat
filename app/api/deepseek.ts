import { getServerSideConfig, getApiKey } from "@/app/config/server";
import {
  NVIDIA_BASE_URL,
  ApiPath,
  ModelProvider,
  ServiceProvider,
} from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth";
import { isModelNotavailableInServer } from "@/app/utils/model";

const serverConfig = getServerSideConfig();
// 使用NVIDIA的API端点和密钥
const NVIDIA_API_KEY = getApiKey(process.env.DEEPSEEK_API_KEY);

// 旧的 DeepSeek 官方模型名 -> NVIDIA NIM 模型名
const LEGACY_MODEL_MAP: Record<string, string> = {
  "deepseek-chat": "deepseek-ai/deepseek-v4-flash",
  "deepseek-coder": "deepseek-ai/deepseek-v4-flash",
  "deepseek-reasoner": "deepseek-ai/deepseek-v4-pro",
  "deepseek-ai/deepseek-r1": "deepseek-ai/deepseek-v4-pro",
};

export async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[DeepSeek Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const authResult = auth(req, ModelProvider.DeepSeek);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    const response = await request(req);
    return response;
  } catch (e) {
    console.error("[DeepSeek] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

async function request(req: NextRequest) {
  const controller = new AbortController();

  // 使用DeepSeek的路径，但将请求发送到NVIDIA的API端点
  let path = `${req.nextUrl.pathname}`.replaceAll(ApiPath.DeepSeek, "");

  // 使用NVIDIA的基础URL
  let baseUrl = NVIDIA_BASE_URL;

  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }

  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  console.log("[Proxy] ", path);
  console.log("[Base Url]", baseUrl);

  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  const fetchUrl = `${baseUrl}${path}`;

  // 使用NVIDIA的API密钥
  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
    },
    method: req.method,
    body: req.body,
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };

  // 修改请求体，确保使用正确的模型名称
  if (req.body) {
    try {
      const clonedBody = await req.text();
      const jsonBody = JSON.parse(clonedBody);

      // DeepSeek 官方的 deepseek-chat / deepseek-coder / deepseek-reasoner
      // 已于 2026-07-24 下线，这里把历史会话里残留的旧模型名映射到
      // NVIDIA NIM 上对应的 DeepSeek V4 模型；已经是 NIM 模型名的直接透传。
      if (jsonBody.model) {
        jsonBody.model = LEGACY_MODEL_MAP[jsonBody.model] ?? jsonBody.model;
      }

      fetchOptions.body = JSON.stringify(jsonBody);

      // 检查模型可用性
      if (
        serverConfig.customModels &&
        isModelNotavailableInServer(
          serverConfig.customModels,
          jsonBody?.model as string,
          ServiceProvider.DeepSeek as string,
        )
      ) {
        return NextResponse.json(
          {
            error: true,
            message: `you are not allowed to use ${jsonBody?.model} model`,
          },
          {
            status: 403,
          },
        );
      }
    } catch (e) {
      console.error(`[DeepSeek] filter`, e);
    }
  }

  try {
    const res = await fetch(fetchUrl, fetchOptions);

    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
