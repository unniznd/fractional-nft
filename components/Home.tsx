// components/Home.tsx
import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Web3 from 'web3';
import LandCard from './LandCard';
import {abi, contractAddress} from '../utils/constants';

const Home: React.FC<{ address: string }> = ({ address }) => {
  const [lands, setLands] = useState<any[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewerAddress, setViewerAddress] = useState<string>('');

  const ownerAddress = '0x5c29C5e8E0DF5c2Fc7e43B443e05A0C59F490d5E';
  const isOwner = address === ownerAddress;

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if ((window as any).ethereum) {
          const web3Instance = new Web3((window as any).ethereum);
          setWeb3(web3Instance);
          const contract = new web3Instance.eth.Contract(abi, contractAddress);
          const accounts = await web3Instance.eth.getAccounts();
          setViewerAddress(accounts[0]);
          const result = (await contract.methods.getDetailedFractionOwnership().call({from:accounts[0]})) as any;
          setLands(result);
        } else {
          console.error('Web3 provider not detected');
        }
      } catch (error) {
        console.error('Error initializing Web3:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    initWeb3();
  }, []);

  const handleAddLand = () => {
    // Logic to add a new land to the lands array (if needed)
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between p-4">
        <div>
          <p className="text-lg">Hello <span style={{ fontWeight: 'bold' }}>{address}</span></p>
        </div>
        {isOwner && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-green-700 focus:outline-none focus:shadow-outline-green"
            onClick={handleAddLand}
          >
            <FaPlus className="mr-2" />
            Add Land
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center" style={{ fontWeight: 'bold' }}>Loading lands...</p>
      ) : lands.length === 0 ? (
        <p className="text-center " style={{ fontWeight: 'bold' }}>No lands found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {lands.map((land: any) => (
            <LandCard
              key={land[0]} // Add a unique key for each LandCard
              landId={land[0]}
              name={land[1]}
              description={land[2]}
              viewerAddress={viewerAddress}
              addresses={land[3]}
              sharePercentages={land[4]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
