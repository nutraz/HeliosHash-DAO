import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, Project } from '../services/projectService';
import StatusBanner from './StatusBanner';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectData = await projectService.getProjects();
        setProjects(projectData);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark">
        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-4 py-8">
        <StatusBanner />

        <section className="bg-dark2 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-accent3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-light">Today's Safety Tip</h3>
                <p className="text-muted">Family Emergency Meeting Point</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/family-emergency')}
              className="px-4 py-2 bg-accent hover:bg-accent2 text-white rounded-lg transition-colors font-medium"
            >
              Learn More
            </button>
          </div>
        </section>

        <section className="bg-dark2 rounded-lg shadow-lg p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-light mb-2">HeliosHash DAO Dashboard</h1>
            <p className="text-lg text-muted">Solar Energy Infrastructure Management</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <button className="px-4 py-2 rounded bg-accent hover:bg-accent2 text-white font-semibold shadow transition">Create Project</button>
            <button className="px-4 py-2 rounded bg-accent3 hover:bg-accent4 text-white font-semibold shadow transition">Export Data</button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="bg-dark2 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <svg className="h-8 w-8 text-accent3 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-muted">Total Projects</span>
            <span className="text-2xl font-bold text-light">{projects.length}</span>
          </div>
        </section>

        <section className="bg-dark2 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-light mb-4">Solar Projects</h2>
          <p className="text-muted mb-6">Overview of all solar energy projects</p>
          <div className="overflow-x-auto">
            {projects.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-dark3">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-accent3 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-accent3 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-accent3 uppercase tracking-wider">Capacity (kW)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-accent3 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-dark2 divide-y divide-gray-800">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-dark3 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-light">{project.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted">{project.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted">{project.capacity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === '#Planning' ? 'bg-yellow-900 text-yellow-300' :
                          project.status === '#Construction' ? 'bg-blue-900 text-blue-300' :
                          project.status === '#Operational' ? 'bg-green-900 text-green-300' :
                          'bg-red-900 text-red-300'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-light">No projects</h3>
                <p className="mt-1 text-base text-muted">Get started by creating a new solar project.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
