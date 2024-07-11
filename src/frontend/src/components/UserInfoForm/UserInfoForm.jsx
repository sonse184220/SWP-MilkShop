import React from 'react';

import './UserInfoForm.css';

export const UserInfoForm = ({ userFormData, setUserFormData, isMember }) => {
    const name = userFormData?.Name || '';
    const email = userFormData?.Email || '';
    const phone = userFormData?.Phone || '';
    const address = userFormData?.Address || '';
    const rewardPoints = userFormData?.RewardPoints || 0;
    // const UseRewardPoints = userFormData?.useRewardPoints || false;
    const useRewardPoints = userFormData?.useRewardPoints || false;
    const paymentMethod = userFormData?.paymentMethod || 'COD';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRewardPointsChange = (e) => {
        const usePoints = e.target.value === 'yes';
        setUserFormData(prevState => ({
            ...prevState,
            useRewardPoints: usePoints
        }));
    };

    const handlePaymentMethodChange = (e) => {
        setUserFormData(prevState => ({
            ...prevState,
            paymentMethod: e.target.value
        }));
    };

    return (
        <div className='user-info-form-wrapper'>
            <form>
                <h5 className='user-info-form-subtitle'>Order Info</h5>
                <p className='promptorder'>This info will be used for your order. Do you want to change?</p>
                <hr className='user-info-form-divider' />
                <div className='form-group mb-1'>
                    <label className='mb-1' htmlFor='firstName'>Name</label>
                    <input className='form-control mb-1' id='firstName' type='text' placeholder='Name'
                        name='Name'
                        value={name}
                        onChange={handleInputChange} />

                </div>
                {name.length === 0 && <p className="info-error-message">*Please input name</p>}

                <div className='form-group mb-1'>
                    <label className='mb-1' htmlFor='lastName'>Email</label>
                    <input id='lastName' type='text' className='form-control mb-1' placeholder='Email'
                        name='Email'
                        value={email}
                        onChange={handleInputChange} />

                </div>
                {email.length === 0 && <p className="info-error-message">*Please input email</p>}
                <div className='form-group mb-1'>
                    <label className='mb-1'>Phone</label>
                    <input className='form-control mb-1' type='text' id='street1' placeholder='Phone Number'
                        name='Phone'
                        value={phone}
                        onChange={handleInputChange} />
                </div>
                {phone.length === 0 && <p className="info-error-message">*Please input phone number</p>}

                <div className='form-group mb-1'>
                    <label className='mb-1' htmlFor='city'>Address</label>
                    <input type='text' id='city' className='form-control mb-1' placeholder='Address'
                        name='Address'
                        value={address}
                        onChange={handleInputChange} />
                </div>
                {address.length === 0 && <p className="info-error-message">*Please input address</p>}
                {isMember && (
                    <>
                        <div className='form-group mb-1 rewardpoint'>
                            <label className='mb-1' htmlFor='rewardPoints'>Reward Points</label>
                            <div className='d-flex'>
                                <input
                                    type='text'
                                    id='rewardPoints'
                                    className='form-control mr-2'
                                    placeholder='Available reward points'
                                    value={rewardPoints}
                                    readOnly
                                    style={{ marginBottom: '10px' }}
                                />
                                <select
                                    className='form-control'
                                    id='useRewardPoints'
                                    value={useRewardPoints ? 'yes' : 'no'}
                                    onChange={handleRewardPointsChange}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <option value='yes'>Apply all points</option>
                                    <option value='no'>Don't apply</option>
                                </select>
                            </div>
                        </div>
                        <div className='form-group mb-1'>
                            <label className='mb-1' >Payment Method</label>
                            {/* <div className='d-flex'> */}
                            <select
                                className='form-control'
                                id='paymentMethod'
                                name='paymentMethod'
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                                style={{ width: '60%', height: '100%' }}
                            >
                                <option value='COD'>COD</option>
                                <option value='Banking'>Banking</option>
                            </select>
                            {/* </div> */}
                        </div>
                    </>
                )}

                {/* <button className='btn btn-primary mt-4 user-info-form-button' type='submit'>
                    <i className="fas fa-lock mr-2 user-info-form-icon"></i>Submit Payment
                </button> */}
            </form >
        </div >
    );
}