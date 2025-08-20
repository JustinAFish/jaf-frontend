/**
 * Reusable Modal component - Renders a centered modal dialog with a semi-transparent background overlay.
 * (a modal is just the proper word for a popup)
 * This renders the modal container centered on the screen with rounded corners and a dark background
 * Allows the parent component to pass in the content to be displayed inside the modal
**/
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  
  // If the `isOpen` prop is false, the component will return null and not render anything
  if (!isOpen) return null;

  return (

    // Background overlay
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-41" onClick={onClose}>
      
      {/* Modal container*/}
      <div 
        className="bg-[#282828]/70 rounded-lg p-6 w-full max-w-3xl mx-4 relative"
        onClick={e => e.stopPropagation()} 
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* The actual modal content (children) */}
        {children}

      </div>
    </div>
  );
}