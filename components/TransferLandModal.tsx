import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TransferLandModalProps {
  landId: number;
  onClose: () => void;
  onTransfer: (to: string, amount: number) => Promise<void>;
}

const TransferLandModal: React.FC<TransferLandModalProps> = ({ onClose, onTransfer }) => {
  const [toAddress, setToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState<string | ''>('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    // Validate inputs and perform transfer
    if (toAddress && transferAmount !== '' && !isNaN(Number(transferAmount))) {
     
        setIsTransferring(true);
        await onTransfer(toAddress, parseFloat(transferAmount as string));
        setIsTransferring(false);
        setToAddress('');
        setTransferAmount('');
    } else {
        toast.error('Invalid input. Please check the fields and try again.');
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      {/* Sliding Panel */}
      <div className="fixed inset-y-0 right-0 max-w-xl w-full p-4 bg-white shadow-md transform translate-x-0">
        {/* Close button */}
        <button
          className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          onClick={isTransferring ? undefined : onClose}
          disabled={isTransferring}
        >
          <FaTimes />
        </button>
        {/* Content */}
        <h2 className="text-xl font-bold mb-2">Transfer Land</h2>
        <div className="mb-4">
          <label htmlFor="toAddress" className="block text-gray-700 text-sm font-bold mb-2">
            To Address:
          </label>
          <input
            type="text"
            id="toAddress"
            className="w-full border border-gray-300 p-2"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            disabled={isTransferring}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="transferAmount" className="block text-gray-700 text-sm font-bold mb-2">
            Transfer Amount (%):
          </label>
          <input
            type="text"
            id="transferAmount"
            className="w-full border border-gray-300 p-2"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            disabled={isTransferring}
          />
        </div>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue`}
          onClick={handleTransfer}
          disabled={isTransferring}
        >
          {isTransferring ? 'Transferring...' : 'Transfer'}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default TransferLandModal;
