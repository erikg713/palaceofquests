import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import MarketplaceItem from './MarketplaceItem';
import { buyMarketItem } from '../hooks/marketActions';

const VendorModal = ({ userId, onClose }) => {
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseMsg, setPurchaseMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/market_items');
        if (!res.ok) throw new Error('Failed to fetch market items.');
        const items = await res.json();
        if (isMounted) setMarketItems(items);
      } catch (err) {
        if (isMounted) setError('Could not load marketplace items. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchItems();
    return () => { isMounted = false; };
  }, []);

  const handleBuy = useCallback(async (item) => {
    setPurchaseMsg('');
    try {
      await buyMarketItem(userId, item);
      setPurchaseMsg(`Purchased ${item.name} for ${item.price} Pi!`);
    } catch {
      setPurchaseMsg('Purchase failed. Please try again.');
    }
  }, [userId]);

  // Optional: auto-clear purchase messages after 2.5s
  useEffect(() => {
    if (!purchaseMsg) return;
    const timeout = setTimeout(() => setPurchaseMsg(''), 2500);
    return () => clearTimeout(timeout);
  }, [purchaseMsg]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="marketplace-title"
      tabIndex={-1}
      onKeyDown={e => e.key === 'Escape' && onClose()}
    >
      <div className="modal-content vendor-modal">
        <header className="modal-header">
          <h2 id="marketplace-title">Marketplace</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >×</button>
        </header>
        <section className="modal-body">
          {error && <div className="modal-error">{error}</div>}
          {purchaseMsg && <div className="modal-success">{purchaseMsg}</div>}
          {loading ? (
            <div className="modal-loading">Loading...</div>
          ) : (
            <div className="marketplace-list">
              {marketItems.length === 0 ? (
                <div className="modal-empty">No items available.</div>
              ) : (
                marketItems.map(item => (
                  <MarketplaceItem
                    key={item.id}
                    item={item}
                    onBuy={handleBuy}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

VendorModal.propTypes = {
  userId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default VendorModal;
