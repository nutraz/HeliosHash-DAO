import { LitElement, html, css } from 'lit';

export class UrgamuDaoHeader extends LitElement {
  static styles = css`
    :host { display: block; background: var(--navy, #0b1a2b); color: var(--text, #f7fbff); padding: 1rem; text-align: center; }
    .chakra { animation: pulse-glow 2s infinite alternate; font-size: 2rem; color: var(--gold, #ffd366); }
    h1 { margin: 0.25rem 0 0; font-size: 1.1rem; font-weight: 700; }
    @keyframes pulse-glow {
      from { text-shadow: 0 0 10px rgba(255,215,0,0.6); }
      to { text-shadow: 0 0 30px rgba(0,255,255,0.12), 0 0 40px rgba(255,215,0,0.3); }
    }
  `;

  render() {
    return html`
      <div class="chakra">ॐ उर्गमू</div>
      <h1>From Sunlight to Sovereignty</h1>
    `;
  }
}

customElements.define('urgamu-dao-header', UrgamuDaoHeader);
