import React from 'react';

import './UserInfoForm.css';

export const UserInfoForm = ({ UserInfo, setUserInfo }) => {
    const name = UserInfo?.Name || '';
    const email = UserInfo?.Email || '';
    const phone = UserInfo?.Phone || '';
    const address = UserInfo?.Address || '';
    const rewardPoints = UserInfo?.RewardPoints || 0;
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
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
                    <input className='form-control mb-1' id='firstName' type='text' placeholder=''
                        name='Name'
                        value={name}
                        onChange={handleInputChange} />
                </div>

                <div className='form-group mb-1'>
                    <label className='mb-1' htmlFor='lastName'>Email</label>
                    <input id='lastName' type='text' className='form-control' placeholder='Email'
                        name='Email'
                        value={email}
                        onChange={handleInputChange} />
                </div>

                <div className='form-group mb-1'>
                    <label className='mb-1'>Phone</label>
                    <input className='form-control' type='text' id='street1' placeholder='A1A Beach Front Ave'
                        name='Phone'
                        value={phone}
                        onChange={handleInputChange} />
                </div>

                <div className='form-group mb-1'>
                    <label className='mb-1' htmlFor='city'>Address</label>
                    <input type='text' id='city' className='form-control' placeholder='Miami'
                        name='Address'
                        value={address}
                        onChange={handleInputChange} />
                </div>
                <div className='form-group mb-1 rewardpoint'>
                    <label className='mb-1' htmlFor='rewardPoints'>Reward Points</label>
                    <div className='d-flex'>
                        <input
                            type='text'
                            id='rewardPoints'
                            className='form-control mr-2'
                            placeholder='Available reward points'
                            readOnly
                        />
                        <select className='form-control' id='useRewardPoints'>
                            <option value=''>Apply all points</option>
                            <option value='yes'>Don't apply</option>
                        </select>
                    </div>
                </div>
                <button className='btn btn-primary mt-4 user-info-form-button' type='submit'>
                    <i className="fas fa-lock mr-2 user-info-form-icon"></i>Submit Payment
                </button>
            </form>
        </div>
    );
}