// pages/index.tsx
import React, { useState } from 'react';
import MetamaskConnect from '../components/MetamaskConnect';
import Home from '../components/Home';
import Web3 from 'web3';

const Index: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const handleConnect = (connectedWeb3: Web3) => {
    setWeb3(connectedWeb3);
    getAccount(connectedWeb3);
  };

  const getAccount = async (web3: Web3) => {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0] || null);
  };

  return (
    <div>
      {web3 ? (
        <Home address={account || ''} />
      ) : (
        <MetamaskConnect onConnect={handleConnect} />
      )}
    </div>
  );
};

export default Index;
