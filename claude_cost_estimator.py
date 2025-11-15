#!/usr/bin/env python3
"""
Claude API cost estimator (copy-paste, then run: python3 claude_cost_estimator.py)

Calculates monthly cost estimates for Anthropic Claude models (Haiku, Sonnet, Opus)
using current headline per-1M-token input/output rates.

Pricing sources (headline rates used in this script):
- Haiku (example headline): $1.00 per 1M input tokens, $5.00 per 1M output tokens.
- Sonnet (mid-tier): $3.00 per 1M input tokens, $15.00 per 1M output tokens.
- Opus (top-tier): $15.00 per 1M input tokens, $75.00 per 1M output tokens.

Note: token = model token. If you measure in characters/words, convert to tokens first
(rough rule of thumb: ~1 token ≈ 4 characters English, or ~0.75 token/word, but this varies).
This script asks for tokens directly to avoid inaccurate conversions.

Sources: Anthropic product pages & pricing guides.
"""

import math

MODEL_RATES = {
    "Haiku": {"input_per_million_usd": 1.00, "output_per_million_usd": 5.00},
    "Sonnet": {"input_per_million_usd": 3.00, "output_per_million_usd": 15.00},
    "Opus": {"input_per_million_usd": 15.00, "output_per_million_usd": 75.00},
}

def usd_for_tokens(model_name, input_tokens, output_tokens):
    r = MODEL_RATES[model_name]
    cost_input = (input_tokens / 1_000_000.0) * r["input_per_million_usd"]
    cost_output = (output_tokens / 1_000_000.0) * r["output_per_million_usd"]
    return cost_input + cost_output

def prompt_float(prompt, default=None):
    while True:
        raw = input(f"{prompt}{' ['+str(default)+']' if default is not None else ''}: ").strip()
        if raw == "" and default is not None:
            return float(default)
        try:
            return float(raw)
        except:
            print("Please enter a numeric value (e.g. 1250000)")

def main():
    print("\nCLAUDE API COST ESTIMATOR\n(enter token counts; tokens = model tokens; 1M = 1,000,000)\n")

    mode = ""
    while mode not in ("1","2"):
        mode = input("Choose input mode: (1) total tokens/month OR (2) per-call avg tokens + calls/month [1/2]: ").strip()

    if mode == "1":
        input_tokens = prompt_float("Estimated total INPUT tokens per month (e.g. 1500000 for 1.5M)", default=1500000)
        output_tokens = prompt_float("Estimated total OUTPUT tokens per month (e.g. 400000 for 0.4M)", default=400000)
    else:
        avg_in = prompt_float("Average INPUT tokens per API call (e.g. 800)", default=800)
        avg_out = prompt_float("Average OUTPUT tokens per API call (e.g. 600)", default=600)
        calls = prompt_float("Estimated API calls per month (e.g. 2000)", default=2000)
        input_tokens = avg_in * calls
        output_tokens = avg_out * calls

    print("\nModel\t\tInput tokens\tOutput tokens\tEstimated monthly cost (USD)")
    print("-----\t\t------------\t-------------\t-----------------------------")
    totals = {}
    for model in MODEL_RATES:
        cost = usd_for_tokens(model, input_tokens, output_tokens)
        totals[model] = cost
        print(f"{model:8}\t{int(input_tokens):12,}\t{int(output_tokens):13,}\t${cost:,.2f}")

    # Show cheapest option
    cheapest = min(totals, key=totals.get)
    print("\nCheapest model for your estimated volume:", cheapest, f"(${totals[cheapest]:,.2f}/month)")

    print("\nNotes:")
    print("- These are rough estimates using headline input/output rates.")
    print("- Anthropic has caching and other billing nuances (cache reads/writes, context tiers).")
    print("- Prices change over time; check Anthropic docs for exact billing rules.")
    print("\nDone.\n")

if __name__ == "__main__":
    main()

