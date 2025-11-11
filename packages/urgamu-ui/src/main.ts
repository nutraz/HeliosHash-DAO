import './components/DaoHeader';
import './styles.css';

// mount a small message to show it's loaded
const root = document.createElement('div');
root.style.padding = '12px';
root.style.fontFamily = 'system-ui, sans-serif';
root.textContent = 'UrgamU UI Starter loaded — <urgamu-dao-header> registered.';
document.body.appendChild(root);
