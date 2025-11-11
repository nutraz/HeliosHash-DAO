import React from 'react';

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <section className="bg-slate-800/20 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 sm:p-6 shadow-xl h-full animate-fade-in">
      <div className="flex items-center mb-4">
        {icon && <div className="text-cyan mr-3 w-6 h-6">{icon}</div>}
        <h2 className="text-xl sm:text-2xl font-bold text-lighttext">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
};

export default Section;
