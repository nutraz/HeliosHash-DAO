import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-neutral-900 text-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        <div>{children}</div>
        <button className="mt-6 px-4 py-2 bg-indigo-600 rounded text-white" onClick={onClose} aria-label="Close modal">Close</button>
      </div>
    </div>
  );
};
