import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import Web3 from 'web3';
import LandCard from './LandCard';
import AddLandModal from './AddLandModal'; // Import the new modal component
import { abi, contractAddress } from '../utils/constants';
import { set } from 'zod';
import { toast } from 'react-toastify';

const Home: React.FC<{ address: string }> = ({ address }) => {
  const [lands, setLands] = useState<any[]>([]);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewerAddress, setViewerAddress] = useState<string>('');
  const [showAddLandModal, setShowAddLandModal] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [ownersCount, setOwnersCount] = useState<number>(0);
  const [addressList, setAddressList] = useState<string[]>([]);
  const [fractionalPartList, setFractionalPartList] = useState<number[]>([]);

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
          const result = (await contract.methods.getDetailedFractionOwnership().call({ from: accounts[0] })) as any;
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
    setShowAddLandModal(true);
  };

  const handleCloseAddLandModal = () => {
    setName('');
    setDescription('');
    setOwnersCount(0);
    setAddressList([]);
    setFractionalPartList([]);
    setShowAddLandModal(false);
  };
  const handleMintLand = async () => {
      try {
        // Validate owners count
        if (ownersCount < 1) {
          toast.error('Owners count should be at least 1');
          return;
        }
        if(fractionalPartList.length !== ownersCount){
          toast.error('Please enter fractional parts for all owners');
          return;
        }

        if(addressList.length !== ownersCount){
          toast.error('Please enter addresses for all owners');
          return;
        }
    
        // Validate sum of fractional parts
        const sum = fractionalPartList.reduce((acc, curr) => acc + curr, 0);
        if (sum !== 100) {
          toast.error('Sum of fractional parts should be 100');
          return;
        }

        toast.info('Minting land... Please wait.');
    
        // Convert fractional parts to percentages (multiply by 100)
        const fractionalPartsInPercentage = fractionalPartList.map((fraction) => fraction * 100);
    
        const web3Instance = new Web3((window as any).ethereum);
    
        // Request account access if not available
        await (window as any).ethereum.enable();
    
        const contract = new web3Instance.eth.Contract(abi, contractAddress);
        
    
        // Create a transaction to call the mintLand function in the contract
        const data = contract.methods.mint( addressList, fractionalPartsInPercentage, name, description).encodeABI();
        
        const transactionObject = {
          from: viewerAddress, // Specify the sender (msg.sender) address
          to: contractAddress, // Contract address
          data, // Transaction data
        };

        // Send the transaction
        const transactionReceipt = await web3Instance.eth.sendTransaction(transactionObject);
       
    
        // Check the transaction receipt for success
        if (transactionReceipt.status) {
          toast.success('Land minted successfully!');
          handleCloseAddLandModal();
          // You may want to refresh the lands data after minting a new land
          // Call the necessary functions to refresh lands data here if needed
        } else {
          toast.error('Minting land failed. Please check the transaction status.');
        }
      } catch (error) {
        console.error('Minting land failed:', error);
        toast.error('Minting land failed. Please check the console for error details.');
      }
    };
  

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between p-4 w-full">
      <header className="bg-black">
  <nav className="flex justify-between items-center p-4">
    <div>
      <p className="text-xl text-white" style={{ fontWeight: 'bold' }}>
        FractionaNFT
      </p>
    </div>
    <div className="hidden md:block"> {/* Hide on small screens */}
      <ul className="flex items-center gap-4">
        <li className='text-white'> User <span style={{ fontWeight: 'bold' }}>{address}</span></li>
      </ul>
    </div>
    <div className="md:hidden"> {/* Show on small screens */}
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
  </nav>
</header>

  
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
        <p className="text-center" style={{ fontWeight: 'bold' }}>
          Loading lands...
        </p>
      ) : lands.length === 0 ? (
        <p className="text-center " style={{ fontWeight: 'bold' }}>
          No lands found.
        </p>
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

      {showAddLandModal && (
        <AddLandModal
          name={name}
          description={description}
          ownersCount={ownersCount}
          addressList={addressList}
          fractionalPartList={fractionalPartList}
          setName={setName}
          setDescription={setDescription}
          setOwnersCount={setOwnersCount}
          setAddressList={setAddressList}
          setFractionalPartList={setFractionalPartList}
          onClose={handleCloseAddLandModal}
          onMintLand={handleMintLand}
        />
      )}
    </div>
  );
};

export default Home;
