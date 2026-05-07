#!/usr/bin/env python3
"""
OpenAI 格式大模型连续对话脚本
支持多轮对话、上下文记忆、流式输出、清空历史、退出等交互命令。
"""

import os
import sys
import argparse
from typing import List, Dict

try:
    from openai import OpenAI
except ImportError:
    print("请先安装 openai 库: pip install openai")
    sys.exit(1)

# ==================== 直接配置区（请在此处填写您的信息）====================
CONFIG = {
    "api_key": "sk-6Wa9cIzWMc8J8q311EGfY3WgDvfmufg8taELQQ9dTKezEwP3",      # 您的 API Key
    "base_url": "http://60.217.65.250:3017/v1",  # 您的 Base URL
    "model": "Qwen3.5_SZR",            # 模型名称
    "temperature": 0.7,
    "max_tokens": 2048,
    "stream": False,                     # 是否流式输出
}
# =========================================================================

class Conversation:
    def __init__(self, api_key: str = None, base_url: str = None, model: str = None,
                 temperature: float = 0.7, max_tokens: int = 2048, stream: bool = False):
        # 优先使用传入参数，否则使用上方硬编码配置
        self.api_key = api_key if api_key is not None else CONFIG["api_key"]
        self.base_url = base_url if base_url is not None else CONFIG["base_url"]
        self.model = model if model is not None else CONFIG["model"]
        self.temperature = temperature if temperature is not None else CONFIG["temperature"]
        self.max_tokens = max_tokens if max_tokens is not None else CONFIG["max_tokens"]
        self.stream = stream if stream is not None else CONFIG["stream"]
        
        self.history = []
        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url,
        )

    def add_message(self, role: str, content: str):
        self.history.append({"role": role, "content": content})

    def clear_history(self):
        self.history = []
        print("对话历史已清空。")

    def summarize_history(self, max_len: int = 2000) -> str:
        if not self.history:
            return "(无历史)"
        summary = []
        for msg in self.history[-6:]:
            role = msg["role"]
            content = msg["content"][:50] + "..." if len(msg["content"]) > 50 else msg["content"]
            summary.append(f"{role}: {content}")
        return "\n".join(summary)

    def chat(self, user_input: str) -> str:
        if not user_input.strip():
            return ""

        self.add_message("user", user_input)

        try:
            if self.stream:
                print("Assistant: ", end="", flush=True)
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=self.history,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    stream=True,
                )
                collected_content = []
                for chunk in response:
                    if chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        print(content, end="", flush=True)
                        collected_content.append(content)
                print()
                full_reply = "".join(collected_content)
            else:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=self.history,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens,
                    stream=False,
                )
                full_reply = response.choices[0].message.content
                print(f"Assistant: {full_reply}")

            self.add_message("assistant", full_reply)
            return full_reply

        except Exception as e:
            error_msg = f"请求出错: {e}"
            print(error_msg, file=sys.stderr)
            if self.history and self.history[-1]["role"] == "user":
                self.history.pop()
            return error_msg

    def run_interactive(self):
        print("\n" + "=" * 50)
        print(f"模型: {self.model}")
        print(f"Temperature: {self.temperature}, Max tokens: {self.max_tokens}, Stream: {self.stream}")
        print("命令: /clear 清空历史, /history 显示历史摘要, /quit 或 /exit 退出")
        print("直接输入问题开始对话。")
        print("=" * 50 + "\n")

        while True:
            try:
                user_input = input("You: ").strip()
            except (EOFError, KeyboardInterrupt):
                print("\n退出对话。")
                break

            if not user_input:
                continue

            cmd = user_input.lower()
            if cmd in ["/quit", "/exit"]:
                print("再见！")
                break
            elif cmd == "/clear":
                self.clear_history()
                continue
            elif cmd == "/history":
                print("\n--- 历史摘要（最近6条）---")
                print(self.summarize_history())
                print("--- 结束 ---\n")
                continue

            self.chat(user_input)


def main():
    print("OpenAI 模型连续对话脚本")
    parser = argparse.ArgumentParser(description="OpenAI 格式大模型连续对话脚本")
    parser.add_argument("--api-key", type=str, default=None, help="API Key (若不提供则使用脚本内配置)")
    parser.add_argument("--base-url", type=str, default=None, help="API Base URL (若不提供则使用脚本内配置)")
    parser.add_argument("--model", type=str, default=None, help="模型名称")
    parser.add_argument("--temperature", type=float, default=None, help="温度参数")
    parser.add_argument("--max-tokens", type=int, default=None, help="最大生成 token 数")
    parser.add_argument("--stream", action="store_true", default=None, help="启用流式输出")
    args = parser.parse_args()

    # 如果没有任何外部参数且硬编码配置为空，则提示
    if not CONFIG["api_key"] and not args.api_key:
        print("错误: 请在脚本顶部 CONFIG 中填写 api_key，或通过 --api-key 提供。")
        sys.exit(1)

    conv = Conversation(
        api_key=args.api_key,
        base_url=args.base_url,
        model=args.model,
        temperature=args.temperature,
        max_tokens=args.max_tokens,
        stream=args.stream,
    )
    conv.run_interactive()


if __name__ == "__main__":
    main()