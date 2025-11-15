#!/usr/bin/env python3

# HHDAO Claude Cost Calculator (Option 2)

def calc_cost(model, in_tokens, out_tokens):
    pricing = {
        "haiku":  {"in": 0.0008/1000, "out": 0.0024/1000},
        "sonnet": {"in": 0.003/1000,  "out": 0.015/1000},
        "opus":   {"in": 0.015/1000, "out": 0.075/1000},
    }
    p = pricing[model]
    return in_tokens*p["in"] + out_tokens*p["out"]

print("\n--- HHDAO Claude Cost Calculator (Option 2) ---\n")

# Choose model
print("Choose model:")
print("1) Claude Haiku (cheap, fast workflows)")
print("2) Claude Sonnet (balanced)")
print("3) Claude Opus (maximum intelligence)")
model_choice = input("Model [1/2/3]: ").strip()

model_map = {"1":"haiku", "2":"sonnet", "3":"opus"}
model = model_map.get(model_choice, "haiku")

# User inputs
avg_in = float(input("\nAvg input tokens per call (e.g., 1500): "))
avg_out = float(input("Avg output tokens per call (e.g., 800): "))
calls = int(input("Number of calls per month (e.g., 200): "))

# Total tokens
total_in = avg_in * calls
total_out = avg_out * calls

# Calculate cost
cost = calc_cost(model, total_in, total_out)

print("\n--------------------------------------")
print(f"Model selected: {model.upper()}")
print(f"Total input tokens: {total_in:,.0f}")
print(f"Total output tokens: {total_out:,.0f}")
print(f"Estimated monthly cost: ${cost:.4f} USD")
print("--------------------------------------\n")
