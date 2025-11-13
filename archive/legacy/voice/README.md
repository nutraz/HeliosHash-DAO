# Voice Notes → Proposal Draft (Stub)

This is a placeholder for the VoiceNotes AI MVP. Goal: allow community members to speak a proposal idea in Hindi/Gujarati and produce a structured draft.

## Intended Flow

1. Capture audio (mobile browser or lightweight PWA) – WAV/WEBM.
2. Transcribe locally (Whisper.cpp) or remote (OpenAI / local server) – bilingual support.
3. Run summarizer → extract: title, purpose, stakeholders, rough budget, impact metrics.
4. (Optional) Translate to English for global reviewers.
5. Output JSON matching `examples/proposals/` schema.

## Directory Plan

- `voice/raw/` – raw recordings (NEVER commit real PII – .gitignore recommended)
- `voice/transcripts/` – plain text transcripts
- `voice/drafts/` – generated proposal JSON drafts

## Future Script (Not Implemented Yet)

```bash
./voice/transcribe.sh voice/raw/idea1.wav > voice/transcripts/idea1.txt
./voice/draft.sh voice/transcripts/idea1.txt > voice/drafts/idea1.json
```

## MVP Considerations

- Accent robustness and rural noise conditions
- Offline-first vs cloud fallback
- Privacy: ensure raw audio not uploaded without consent
- Guardrails: detect abusive or irrelevant content

## Next Steps

- Add `.gitignore` for `voice/raw/`
- Provide minimal `transcribe.sh` wrapper calling local whisper binary
- Integrate summarizer prompt template

---

_Status: Stub only – implementation deferred until after Pilot loop validation._
