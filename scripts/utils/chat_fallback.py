from openai import OpenAI
import sys

client = OpenAI()  # Uses your exported OPENAI_API_KEY

messages = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello! How are you?"}
]

def chat_with_fallback(model="gpt-4.1"):
    try:
        print("🟢 Trying streaming mode...\n")
        stream = client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True
        )

        for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.get("content"):
                sys.stdout.write(chunk.choices[0].delta.content)
                sys.stdout.flush()
        print("\n\n✅ Streaming completed successfully!")

    except Exception as e:
        print(f"\n⚠️ Streaming failed: {e}")
        print("🟡 Switching to normal (non-streaming) mode...\n")

        response = client.chat.completions.create(
            model=model,
            messages=messages
        )
        print(response.choices[0].message.content)

chat_with_fallback()
