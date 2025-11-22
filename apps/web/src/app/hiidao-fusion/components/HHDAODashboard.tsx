// Archived placeholder to avoid duplicate exports.
// Canonical dashboard: '@/components/HHDAODashboard'

export const __HHDAODashboardArchived = true;
      {/* Breadcrumbs */}
      {(selectedProject || currentView !== 'dashboard' || showSettings) && (
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <button onClick={() => { setCurrentView('dashboard'); setShowSettings(false); setSelectedProject(null); }} className="hover:text-white">
              Home
            </button>
            <ChevronRight size={16} />
            {showSettings && <span className="text-white">Settings</span>}
            {!showSettings && currentView !== 'dashboard' && (
              <>
                <button onClick={() => setSelectedProject(null)} className="hover:text-white capitalize">
                  {currentView}
                </button>
                {selectedProject && (
                  <>
                    <ChevronRight size={16} />
                    <span className="text-white">{selectedProject.name}</span>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {showSettings ? renderSettings() : (
          <>
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'rewards' && renderRewards()}
            {currentView === 'map' && !selectedProject && renderMap()}
            {currentView === 'community' && renderCommunity()}
            {currentView === 'create-project' && renderProjectCreation()}
            {selectedProject && (currentView === 'map' || currentView === 'project-detail') && renderProjectDetail()}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Zap className="text-blue-400" size={20} />
              <span className="text-gray-400">HHDAO v1.0 - Built on Internet Computer</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Docs</a>
              <a href="#" className="text-gray-400 hover:text-white">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HHDAODashboard;
