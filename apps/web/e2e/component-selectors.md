# HeliosHash DAO Component Selectors Guide

## Required data-testid Attributes

Add these to your React components for better E2E testing:

### Authentication
```tsx
<button data-testid="login-button">Login</button>
<button data-testid="internet-identity-button">Internet Identity</button>
<div data-testid="user-profile">{user.name}</div>
```

### Social Hub
```tsx
<nav data-testid="social-navigation">
  <a data-testid="social-feed-link">Feed</a>
  <a data-testid="messaging-link">Messages</a>
  <a data-testid="communities-link">Communities</a>
</nav>

<div data-testid="post-creator">
  <textarea data-testid="post-content"></textarea>
  <button data-testid="submit-post">Post</button>
</div>
```

### DAO Governance
```tsx
<section data-testid="governance-section">
  <button data-testid="new-proposal-button">New Proposal</button>
  <div data-testid="proposal-list">
    <div data-testid="proposal-item">{proposal.title}</div>
  </div>
</section>
```

### Dashboard
```tsx
<main data-testid="dashboard-main">
  <div data-testid="rwa-metrics">
    <div data-testid="solar-yield">Solar Yield</div>
    <div data-testid="mining-revenue">Mining Revenue</div>
  </div>
</main>
```

(See your components under `src/components/` and add these attributes where appropriate.)
