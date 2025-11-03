
"use client";

import { useState, useEffect } from 'react';

import { useWallet } from '@/hooks/useWallet';

export default function Web3App() {

  const { wallet, isConnecting, error, connectWallet, disconnectWallet } = useWallet();

  const isConnected = !!wallet;

  const account = wallet?.address;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {

    setIsClient(true);

  }, []);

  const handleConnect = async () => {

    try {

      await connectWallet();

    } catch (err) {

      console.error('Wallet connection failed:', err);

    }

  };

  if (!isClient) {

    return <div>Loading...</div>;

  }

  return (

    <div className="web3-app">

      <div className="wallet-section">

        {!isConnected ? (

          <button

            onClick={handleConnect}

            className="connect-wallet-btn"

            disabled={isConnecting || !!error}

          >

            Connect Wallet

          </button>

        ) : (

          <div className="wallet-info">

            <p>Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</p>

            <button onClick={disconnectWallet}>Disconnect</button>

          </div>

        )}

        {error && (

          <div className="error-message">

            {error}

          </div>

        )}

      </div>

      {/* Add your CRUD operations interface here */}

      <CRUDInterface />

    </div>

  );

}

// CRUD Interface Component

function CRUDInterface() {

  const [items, setItems] = useState<any[]>([]);

  const [formData, setFormData] = useState({ name: '', description: '' });

  const [editingId, setEditingId] = useState<number | null>(null);

  // Create

  const handleCreate = async () => {

    if (!formData.name || !formData.description) return;

    const newItem = {

      id: Date.now(),

      ...formData,

      createdAt: new Date().toISOString()

    };

    setItems(prev => [...prev, newItem]);

    setFormData({ name: '', description: '' });

    // Here you would typically make API call to your backend

    // await fetch('/api/items', { method: 'POST', body: JSON.stringify(newItem) });

  };

  // Read - This happens automatically with state

  // Update

  const handleUpdate = (id: number) => {

    const item = items.find(item => item.id === id);

    if (item) {

      setFormData({ name: item.name, description: item.description });

      setEditingId(id);

    }

  };

  const handleSaveUpdate = () => {

    if (!editingId) return;

    setItems(prev => prev.map(item =>

      item.id === editingId

        ? { ...item, ...formData, updatedAt: new Date().toISOString() }

        : item

    ));

    setFormData({ name: '', description: '' });

    setEditingId(null);

  };

  // Delete

  const handleDelete = (id: number) => {

    setItems(prev => prev.filter(item => item.id !== id));

  };

  return (

    <div className="crud-interface">

      <h2>CRUD Operations</h2>

      {/* Create/Update Form */}

      <div className="form">

        <input

          type="text"

          placeholder="Name"

          value={formData.name}

          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}

        />

        <input

          type="text"

          placeholder="Description"

          value={formData.description}

          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}

        />

        {editingId ? (

          <button onClick={handleSaveUpdate}>Update Item</button>

        ) : (

          <button onClick={handleCreate}>Create Item</button>

        )}

      </div>

      {/* Items List */}

      <div className="items-list">

        {items.map(item => (

          <div key={item.id} className="item-card">

            <h3>{item.name}</h3>

            <p>{item.description}</p>

            <div className="item-actions">

              <button onClick={() => handleUpdate(item.id)}>Edit</button>

              <button onClick={() => handleDelete(item.id)}>Delete</button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
