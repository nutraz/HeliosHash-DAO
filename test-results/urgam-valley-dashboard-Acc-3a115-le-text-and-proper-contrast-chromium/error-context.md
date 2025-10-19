# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "HeliosHash DAO" [ref=e6] [cursor=pointer]:
        - /url: /
      - navigation "Navigation menu" [ref=e7]:
        - link "Dashboard" [ref=e8] [cursor=pointer]:
          - /url: /dashboard
        - link "Projects" [ref=e9] [cursor=pointer]:
          - /url: /projects
        - link "Governance" [ref=e10] [cursor=pointer]:
          - /url: /governance
        - link "Wallet" [ref=e11] [cursor=pointer]:
          - /url: /wallet
        - link "Community" [ref=e12] [cursor=pointer]:
          - /url: /community
      - generic [ref=e13]:
        - combobox "Select language" [ref=e15]:
          - option "English" [selected]
          - option "हिंदी"
        - button "🎤" [ref=e16]
        - button "🌙" [ref=e17]
        - button "☰" [ref=e18]
        - generic [ref=e20]: U
  - generic [ref=e22]:
    - heading "404" [level=1] [ref=e23]
    - heading "This page could not be found." [level=2] [ref=e25]
  - button "Open Next.js Dev Tools" [ref=e31] [cursor=pointer]:
    - img [ref=e32] [cursor=pointer]
  - alert [ref=e35]
```