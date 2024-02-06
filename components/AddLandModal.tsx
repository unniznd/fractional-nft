import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import AddLandOwnersStep from './AddLandOwnersStep';
import { toast, ToastContainer } from 'react-toastify';

interface AddLandModalProps {
  name: string;
  description: string;
  ownersCount: number;
  addressList: string[];
  fractionalPartList: number[];
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setOwnersCount: React.Dispatch<React.SetStateAction<number>>;
  setAddressList: React.Dispatch<React.SetStateAction<string[]>>;
  setFractionalPartList: React.Dispatch<React.SetStateAction<number[]>>;
  onClose: () => void;
  onMintLand: () => void;
}

const AddLandModal: React.FC<AddLandModalProps> = ({
  name,
  description,
  ownersCount,
  addressList,
  fractionalPartList,
  setName,
  setDescription,
  setOwnersCount,
  setAddressList,
  setFractionalPartList,
  onClose,
  onMintLand,
}) => {
  const [step, setStep] = useState<number>(1);

  const handleNextStep = () => {
    if (!name) {
      toast.error('Please enter the name');
      return;
    }
    if (!description) {
      toast.error('Please enter the description');
      return;
    }
    if(ownersCount == 0){
        toast.error('Please enter the number of owners');
        return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  }
  const handleMintLand = () => {
    onMintLand();
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
          onClick={onClose}
        >
          <FaTimes />
        </button>
        {/* Content */}
        <h2 className="text-xl font-bold mb-2">Add Land</h2>
        {step === 1 && (
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description:
              </label>
              <textarea
                id="description"
                className="w-full border border-gray-300 p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="ownersCount" className="block text-gray-700 text-sm font-bold mb-2">
                Owners Count:
              </label>
              <input
                type="number"
                id="ownersCount"
                className="w-full border border-gray-300 p-2"
                value={ownersCount ==  0 ? '' : ownersCount}
                onChange={(e) => setOwnersCount(Number(e.target.value))}
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <AddLandOwnersStep
            ownersCount={ownersCount}
            addressList={addressList}
            fractionalPartList={fractionalPartList}
            setAddressList={setAddressList}
            setFractionalPartList={setFractionalPartList}
            onBack={handleBack}
            onMintLand={handleMintLand}
            onClose={onClose}
          />
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default AddLandModal;
