#!/usr/bin/env bash
# Incrementally restore canisters from dfx.json.bak and test `dfx start`.
# Usage: run from repo root: `./scripts/dfx-bisect-canisters.sh`

set -u

BAK_FILE="dfx.json.bak"
TEST_FILE="dfx.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: 'jq' is required but not installed. Install jq and retry." >&2
  exit 2
fi

if [ ! -f "$BAK_FILE" ]; then
  echo "Error: backup file '$BAK_FILE' not found. Ensure you have a backup of the original dfx.json." >&2
  exit 2
fi

# Make a safety copy of current dfx.json (if exists)
if [ -f "$TEST_FILE" ]; then
  cp -a "$TEST_FILE" "${TEST_FILE}.pre-bisect" || true
fi

echo "Reading canister keys from $BAK_FILE..."
mapfile -t NAMES < <(jq -r '.canisters | keys[]' "$BAK_FILE")

COUNT=${#NAMES[@]}
echo "Found $COUNT canisters to test. Starting baseline check..."

# baseline minimal dfx.json
echo '{"version":1,"canisters":{}}' > "$TEST_FILE"

echo "Stopping any running dfx..."
dfx stop >/dev/null 2>&1 || true

start_and_wait() {
  # Start dfx in background and wait for the replica API to accept connections on 127.0.0.1:4943
  LOGFILE="logs/dfx-bisect-$(date +%s).log"
  mkdir -p logs
  echo "Starting dfx (background). Logging to $LOGFILE"
  dfx start --background --clean >"$LOGFILE" 2>&1 || true

  # wait up to 30s for port 4943
  for i in $(seq 1 30); do
    if bash -c "</dev/tcp/127.0.0.1/4943" >/dev/null 2>&1; then
      echo "Replica API is listening on 127.0.0.1:4943"
      return 0
    fi
    sleep 1
  done
  echo "Timed out waiting for replica API on 127.0.0.1:4943. See $LOGFILE" >&2
  return 1
}

echo "Starting dfx to verify baseline..."
if start_and_wait; then
  echo "Baseline dfx start succeeded. Stopping replica to continue tests..."
  dfx stop >/dev/null 2>&1 || true
else
  echo "Baseline dfx start failed — this environment can't start dfx with an empty 'canisters' object. Aborting." >&2
  # restore original if we have a pre-bisect
  [ -f "${TEST_FILE}.pre-bisect" ] && mv "${TEST_FILE}.pre-bisect" "$TEST_FILE" || true
  exit 3
fi

echo "Beginning incremental canister addition..."
for ((i=0;i<COUNT;i++)); do
  idx=$((i+1))
  name=${NAMES[i]}
  echo "Testing first $idx canister(s) — adding '$name'..."

  # produce subset canisters object with first $idx entries
  subset=$(jq --argjson idx "$idx" '.canisters | to_entries | .[0:$idx] | from_entries' "$BAK_FILE")

  # write test dfx.json
  jq -n --argjson cans "$subset" '{version:1, canisters:$cans}' > "$TEST_FILE"

  # ensure no stray replica running
  dfx stop >/dev/null 2>&1 || true

  echo "Starting dfx (test with $idx canister(s))..."
  if start_and_wait; then
    echo "OK: dfx started successfully with first $idx canister(s)."
    dfx stop >/dev/null 2>&1 || true
  else
    echo "FAIL: dfx failed when adding canister '$name' (index $idx)." >&2
    echo "The current test dfx.json has the offending entry. Leaving it in place for inspection: $TEST_FILE" >&2
    echo "Restoring original backup to $TEST_FILE for safety." >&2
    mv "$BAK_FILE" "$TEST_FILE" || true
    exit 0
  fi
done

echo "All canisters added successfully in incremental test. Restoring original $BAK_FILE to $TEST_FILE." 
mv "$BAK_FILE" "$TEST_FILE"
echo "Done. You can now run 'dfx start --clean' to start the full configuration." 

exit 0
