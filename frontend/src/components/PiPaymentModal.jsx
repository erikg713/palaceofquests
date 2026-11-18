import { useState } from 'react';
import PropTypes from 'prop-types';
import { initiatePiPayment } from '../utils/piPayment';

export default function PiPaymentModal({ userId, visible, onClose, payload }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setStatus('processing');
    setError(null);

    const { amount, memo, metadata, onSuccess } = payload || {};

    try {
      await initiatePiPayment({
        uid: userId,
        amount,
        memo,
        metadata,
      });

      if (onSuccess) await onSuccess();

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('failed');
      setError(err?.message || 'Pi payment failed or cancelled.');
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-panel text-white">
        <h2 className="text-xl font-bold mb-3">💰 Pay with Pi</h2>
        <p className="mb-4 text-gray-300">{payload?.memo}</p>

        {status === 'idle' && (
          <button
            className="bg-gold text-black font-bold py-2 px-4 rounded"
            onClick={handlePayment}
          >
            Confirm &amp; Pay {payload?.amount} π
          </button>
        )}

        {status === 'processing' && (
          <p className="text-blue-400">Processing payment…</p>
        )}
        {status === 'success' && (
          <p className="text-green-400">✅ Payment successful!</p>
        )}
        {status === 'failed' && <p className="text-red-400">{error}</p>}

        <button
          className="mt-4 text-sm underline text-gray-400"
          onClick={() => {
            onClose();
            setStatus('idle');
            setError(null);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

PiPaymentModal.propTypes = {
  userId: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  payload: PropTypes.shape({
    amount: PropTypes.number,
    memo: PropTypes.string,
    metadata: PropTypes.object,
    onSuccess: PropTypes.func,
  }),
};

PiPaymentModal.defaultProps = {
  userId: undefined,
  visible: false,
  payload: undefined,
};
