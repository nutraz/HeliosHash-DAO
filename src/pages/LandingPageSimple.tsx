// Simple vanilla JS version of the landing page for e2e testing
export default function LandingPage() {
  // Create the main container
  const container = document.createElement('div');
  container.className = 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 min-h-screen font-sans text-white';
  
  // Add basic structure with test IDs
  container.innerHTML = `
    <div class="flex justify-center items-center min-h-screen px-5">
      <div class="text-center max-w-4xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          HeliosHash DAO
        </h1>
        <h2 class="text-xl md:text-2xl mb-6">
          Organisations, Investors, and Local Communities
        </h2>
        <p class="text-gray-300 mb-8">
          To fund vital infrastructure, 100% community owned, where 100% of the profits go back to participants.
        </p>
        
        <div id="wallet-section" class="mb-8">
          <button 
            id="connect-wallet-btn"
            data-testid="connect-wallet"
            class="px-6 py-3 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition mr-4"
          >
            Connect Wallet
          </button>
          <a href="#learn" class="px-6 py-3 rounded bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">
            Learn More
          </a>
        </div>
        
        <div id="connected-section" class="hidden mb-8">
          <div class="flex items-center justify-center gap-4 mb-4">
            <span data-testid="wallet-address" class="text-green-300">
              Connected: test-wallet...1234
            </span>
            <button 
              id="disconnect-btn"
              data-testid="disconnect-button"
              class="px-4 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
            >
              Disconnect
            </button>
          </div>
          <button 
            id="create-project-btn"
            data-testid="create-project"
            class="px-6 py-3 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
    
    <!-- Project Creation Modal -->
    <div id="project-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-indigo-900 p-8 rounded-xl max-w-md w-full mx-4">
        <h3 class="text-2xl font-bold mb-6">Create New Solar Project</h3>
        <form id="project-form">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Project Name</label>
            <input
              type="text"
              id="project-name-input"
              data-testid="project-name"
              class="w-full px-3 py-2 bg-indigo-800 border border-indigo-700 rounded-lg text-white"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Project Location</label>
            <input
              type="text"
              id="project-location-input"
              data-testid="project-location"
              class="w-full px-3 py-2 bg-indigo-800 border border-indigo-700 rounded-lg text-white"
              required
            />
          </div>
          <div class="flex gap-4">
            <button
              type="submit"
              data-testid="submit-project"
              class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Submit Project
            </button>
            <button
              type="button"
              id="cancel-project-btn"
              class="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Success Message -->
    <div id="success-message" data-testid="success-message" class="hidden fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      Project created successfully!
    </div>
  `;
  
  // Add event listeners after the content is added to DOM
  setTimeout(() => {
    const connectBtn = document.getElementById('connect-wallet-btn');
    const disconnectBtn = document.getElementById('disconnect-btn');
    const createProjectBtn = document.getElementById('create-project-btn');
    const walletSection = document.getElementById('wallet-section');
    const connectedSection = document.getElementById('connected-section');
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    const cancelBtn = document.getElementById('cancel-project-btn');
    const successMessage = document.getElementById('success-message');
    
    if (connectBtn) {
      connectBtn.addEventListener('click', () => {
        walletSection?.classList.add('hidden');
        connectedSection?.classList.remove('hidden');
      });
    }
    
    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => {
        connectedSection?.classList.add('hidden');
        walletSection?.classList.remove('hidden');
      });
    }
    
    if (createProjectBtn) {
      createProjectBtn.addEventListener('click', () => {
        projectModal?.classList.remove('hidden');
      });
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        projectModal?.classList.add('hidden');
      });
    }
    
    if (projectForm) {
      projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        projectModal?.classList.add('hidden');
        successMessage?.classList.remove('hidden');
        setTimeout(() => {
          successMessage?.classList.add('hidden');
        }, 3000);
      });
    }
  }, 100);
  
  return container;
}