from openai import OpenAI

# Connect to local Ollama
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

def main():
    print("🟢 Interactive Local AI Chat (llama3:latest)")
    print("Type 'exit' to quit.\n")

    conversation = []

    while True:
        user_input = input("You: ")
        if user_input.strip().lower() == "exit":
            print("Exiting chat. Goodbye! 👋")
            break

        conversation.append({"role": "user", "content": user_input})

        try:
            response = client.chat.completions.create(
                model="llama3:latest",
                messages=conversation
            )
            reply = response.choices[0].message.content
            print(f"AI: {reply}\n")

            conversation.append({"role": "assistant", "content": reply})

        except Exception as e:
            print(f"⚠️ Error: {e}\n")

if __name__ == "__main__":
    main()
