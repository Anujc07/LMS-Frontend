import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const navigate = useNavigate();

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        console.log('Submitting email:', email); 
        try {
            const response = await axios.post('http://127.0.0.1:8000/OTP/', { email: email });
            // console.log("=================================",email);
            if (response && response.data && response.data.message === '1') {                
                setShowPasswordFields(true);
            } else {
                console.error('Failed to send OTP');
            }
        } catch (error) {
            console.error('Failed to send OTP:', error);
        }
    };

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/resetpassword/', { otp, newPassword });

            if (response && response.data && response.data.success) {
                alert('Password reset successful');
                navigate('/Login');
                window.location.reload();
            } else {
                alert('Password reset failed');
            }
        } catch (error) {
            // console.error('Failed to reset password:', error);
            alert('Password reset failed');
        }
    };

    return (
        <>
            <div className="auth-page-wrapper pt-5">
                <div className="auth-one-bg-position auth-one-bg" id="auth-particles">
                    <div className="bg-overlay"></div>

                    <div className="shape">
                        <img src="assets/images/sage-bhopal.jpg" alt="Logo" />
                    </div>
                </div>

                <div className="auth-page-content">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6 col-xl-5">
                                <div className="card mt-4">
                                    <div className="card-body p-4">
                                        {!showPasswordFields ? (
                                            <form onSubmit={handleSubmitEmail}>
                                                <div className="text-center mt-2">
                                                    <h5 className="text-primary">Reset Password</h5>
                                                    <p className="text-muted">Enter your email to receive the OTP.</p>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="email-input">Email</label>
                                                    <input type="email" className="form-control" placeholder="Enter Email" value={email} onChange={(e) => { setEmail(e.target.value); console.log('Email:', e.target.value); }} required />
                                                </div>
                                                <button className="btn btn-success w-100" type="submit">Send OTP</button>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleSubmitPassword}>
                                                <div className="text-center mt-2">
                                                    <h5 className="text-primary">Create new password</h5>
                                                    <p className="text-muted">Your new password must be different from the previous password.</p>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="otp-input">Enter OTP</label>
                                                    <input type="number" className="form-control" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="new-password-input">New Password</label>
                                                    <input type="password" className="form-control" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                                </div>
                                                <button className="btn btn-success w-100" type="submit">Reset Password</button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;
