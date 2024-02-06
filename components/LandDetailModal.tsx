// components/LandDetailModal.tsx
import React, { useEffect } from 'react';

interface LandDetailModalProps {
  name: string;
  description: string;
  viewerAddress: string;
  addresses: string[];
  sharePercentages: number[];
  onClose: () => void;
}

const LandDetailModal: React.FC<LandDetailModalProps> = ({ name, description, viewerAddress,  addresses, sharePercentages, onClose }) => {
  const isDesktop = window.innerWidth >= 768; // Adjust the breakpoint as needed

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isDesktop) {
        // Change to desktop view
        onClose(); // Close the modal on resize if transitioning to desktop view
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isDesktop, onClose]);

  const modalStyle = isDesktop
  ? 'fixed inset-y-0 right-0 max-w-xl w-full p-4 bg-white shadow-md transform translate-x-0'
  : 'fixed inset-0 max-h-full w-full p-4 bg-white shadow-md overflow-y-auto';

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      {/* Sliding Panel */}
      <div className={modalStyle}>
        {/* Close button */}
        <button
          className="absolute top-0 right-0 m-4 text-red-600 hover:text-gray-800 focus:outline-none"
          onClick={onClose}
        >
          Close
        </button>
        {/* Content */}
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Share Percentage</th>
            </tr>
          </thead>
          <tbody>
                {addresses.map((address, index) => (
                    <tr key={index}>
                    <td className="border border-gray-300 p-2">
                        {address === viewerAddress ? <strong>{address}</strong> : address}
                    </td>
                    <td className="border border-gray-300 p-2">
                        {address === viewerAddress
                        ? <strong>{((sharePercentages[index]).toString()).slice(0, 2) + "." + ((sharePercentages[index]).toString()).slice(2) + '%'}</strong>
                        : ((sharePercentages[index]).toString()).slice(0, 2) + "." + ((sharePercentages[index]).toString()).slice(2) + '%'
                        }
                    </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default LandDetailModal;
