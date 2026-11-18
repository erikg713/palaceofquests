import React from 'react';
import PropTypes from 'prop-types';

// Reward modal shown after a realm unlock or quest reward grant.
// `loot` is the granted reward object ({ name, description } or a string).
export default function RewardModal({ loot, onClose }) {
  const title = typeof loot === 'string' ? loot : loot?.name || 'Your reward';
  const description =
    typeof loot === 'object' && loot?.description ? loot.description : null;

  return (
    <div className="modal-backdrop">
      <div className="modal-panel text-white text-center">
        <div className="text-4xl mb-2" aria-hidden="true">
          🎁
        </div>
        <h2 className="text-xl font-bold mb-2">Reward granted!</h2>
        <p className="text-gold font-semibold">{title}</p>
        {description && <p className="text-gray-300 mt-2">{description}</p>}
        <button className="quest-button mt-6" onClick={onClose}>
          Claim
        </button>
      </div>
    </div>
  );
}

RewardModal.propTypes = {
  loot: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
    }),
  ]),
  onClose: PropTypes.func.isRequired,
};

RewardModal.defaultProps = {
  loot: null,
};
