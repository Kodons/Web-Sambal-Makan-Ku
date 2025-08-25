import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WelcomePopup = ({ onClose, imageUrl }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="modal is-active delayed-popup">
        <div className="modal-background" onClick={onClose}></div>

        <motion.div
          className="modal-card"
          style={{ width: 'auto', maxWidth: '800px' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <section className="modal-card-body p-0">
            <figure className="image">
              <img
                src={imageUrl}
                alt="Promo Sambal Juara"
                onClick={onClose}
                style={{ cursor: 'pointer' }}
                width="800"
                height="533"
              />
            </figure>
          </section>
        </motion.div>

        <button
          className="modal-close is-large delete is-medium"
          aria-label="close"
          onClick={onClose}
        ></button>
      </div>
    </AnimatePresence>
  );
};

export default WelcomePopup;