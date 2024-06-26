import React from 'react';
import './Quantity.css';

const Quantity = ({ value, increment, decrement }) => {
    return (
        <div className="quantity-input">
            <button
                className="quantity-input__modifier quantity-input__modifier--left"
                onClick={decrement}
            >
                —
            </button>
            <input
                className="quantity-input__screen"
                type="text"
                value={value}
                readOnly
            />
            <button
                className="quantity-input__modifier quantity-input__modifier--right"
                onClick={increment}
            >
                ＋
            </button>
        </div>
    );
};

export default Quantity;
