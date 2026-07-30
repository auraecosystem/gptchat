import fetch from "node-fetch";

/**
 * 测试DeepSeek API的流式响应模式
 * 这个测试验证与NVIDIA API的流式集成
 */
async function testDeepSeekNvidiaStreamingIntegration() {
  console.log("开始测试DeepSeek到NVIDIA API的流式集成...");

  try {
    // 构建请求URL（使用本地开发服务器地址）
    const url = "http://localhost:3000/api/deepseek/chat/completions";

    // 构建请求体 - 注意stream设置为true
    const requestBody = {
      model: "deepseek-chat", // 这个会被后端替换为 "deepseek-ai/deepseek-r1"
      messages: [
        {
          role: "user",
          content: "用中文写一个简短的故事，不超过100字",
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true, // 启用流式响应
    };

    console.log("发送流式请求到:", url);
    console.log("请求体:", JSON.stringify(requestBody, null, 2));

    // 发送请求
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 不需要提供Authorization头，因为我们在后端硬编码了NVIDIA的API密钥
      },
      body: JSON.stringify(requestBody),
    });

    // 检查响应状态
    if (response.ok) {
      console.log("连接成功! 开始接收流式响应:");
      console.log("-----------------------------------");

      // 处理流式响应
      // Node 与 DOM 的 ReadableStream 类型定义不一致，这里显式取 web 流接口
      const reader = (
        response.body as ReadableStream<Uint8Array> | null
      )?.getReader();
      if (!reader) {
        throw new Error("无法获取响应流读取器");
      }

      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        // 处理SSE格式的响应
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const data = JSON.parse(line.substring(6));
              const content = data.choices?.[0]?.delta?.content || "";
              if (content) {
                process.stdout.write(content);
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }

      console.log("\n-----------------------------------");
      console.log("流式响应接收完成!");
      return true;
    } else {
      const errorText = await response.text();
      console.error("测试失败! 状态码:", response.status);
      console.error("错误信息:", errorText);
      return false;
    }
  } catch (error) {
    console.error("测试过程中发生错误:", error);
    return false;
  }
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  testDeepSeekNvidiaStreamingIntegration()
    .then((success) => {
      console.log("流式测试完成，结果:", success ? "成功" : "失败");
      process.exit(success ? 0 : 1);
    })
    .catch((err) => {
      console.error("流式测试执行出错:", err);
      process.exit(1);
    });
}

export { testDeepSeekNvidiaStreamingIntegration };
