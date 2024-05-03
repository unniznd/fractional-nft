// components/MetamaskConnect.tsx
import React, { useState } from 'react';
import Web3 from 'web3';

const MetamaskConnect: React.FC<{ onConnect: (web3: Web3) => void }> = ({ onConnect }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectMetaMask = async () => {
    try {
      setLoading(true);
      if ((window as any).ethereum) {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3((window as any).ethereum);
        onConnect(web3);
      } else {
        throw new Error('Metamask extension not detected');
      }
    } catch (error) {
      setError((error as any).message || 'An error occurred while connecting to Metamask');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-auto max-w-md p-6 rounded-lg shadow-[0_0_20px_theme('colors.purple.700')] flex flex-col items-center justify-center"> 
        <p className="text-2xl text-white font-bold mb-6">Welcome to FractionalNFT</p>
        <div className="mb-6">
        <button
  className={`bg-purple-700 text-white px-8 py-3 rounded-full hover:bg-purple-900 focus:outline-none focus:shadow-outline-purple`}
  onClick={connectMetaMask}
  disabled={loading}
>
  {loading && (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="w-6 h-6 border-t-4 border-blue-200 border-solid rounded-full animate-spin"></div>
    </div>
  )}
  {loading ? 'Connecting....' : 'Connect to Wallet'}
</button>

        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
  
};

export default MetamaskConnect;
