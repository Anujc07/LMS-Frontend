import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import 'react-phone-input-2/lib/bootstrap.css';


function Registration({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [country, setCountry] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        uname: "",
        password: '',
        fname: "",
        email: "",
        phonenum: "",
        ref_name: "",
        isSageian: "",
        Gender: "",
        role: 1,
        // country: "",
        // state: "",
        // city: "",
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        };
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/register/",
                formData,
                { headers }
            );
            setFormData({
                uname: "",
                fname: "",
                email: "",
                phonenum: "",
                ref_name: "",
                isSageian: "",
                Gender: "",
                password: "",
                role: 1,
                // country: "",
                // state: "",
                // city: "",
            });
            console.log("Response:", response.data);
            const { user } = response.data;
            // const {role, uname, id  } = response.data.user;
            if (user) {
                // console.log(user);
                const { role, uname, id } = user;
                sessionStorage.setItem('userRole', role);
                sessionStorage.setItem('uname', uname);
                sessionStorage.setItem('userId', id);

                // console.log("session data::====", role, uname, id);            
                // onLogin();
                navigate('/login');
            } else {
                console.error("Registration failed: User data not found in response");
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    };
    const togglePasswordVisibility = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/country/code/');
                setCountry(response.data.Country_data);
                // console.log(response.data.Country_data);
            } catch (error) {
                console.error(error)
            }
        };
        fetchData();
    }, []);

    const handleCountryChange = async (e) => {
        const selectedCountryId = e.target.value;
        const selectedCountry = country.find(country => country.id === selectedCountryId);
        if (selectedCountry) {
            setFormData(prevFormData => ({
                ...prevFormData,
                country: selectedCountryId,
                phonenum: selectedCountry.phonecode
            }));
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/state/${selectedCountryId}`);
            setStates(response.data.states_data);
        } catch (error) {
            console.error(error);
        }
    };
    

    const handleStateChange = async (e) => {
        const selectedStateId = e.target.value;
        setFormData(prevFormData => ({
            ...prevFormData,
            state: selectedStateId,
            city: ''
        }));

        try {
            const response = await axios.get(`http://127.0.0.1:8000/city/${selectedStateId}`);
            setCities(response.data.cities_data);
            console.log(cities)
        } catch (error) {
            console.error(error);
        }
    };

   
    return (
        <div className="auth-page-content">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="text-center mt-sm-5 mb-4 text-white-50">
                            <p>Hello Sage</p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card mt-4">
                            <div className="card-body p-4">
                                <div className="text-center mt-2">
                                    <h5 className="text-primary">The Sage Summer School</h5>
                                    <p className="text-muted">
                                        Create Your Account to join the Sage Summer School.
                                    </p>
                                </div>
                                <div className="p-2 mt-4">
                                    <form onSubmit={handleSubmit}>

                                        <div className="row row-space" >
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label For="uname" className="form-label" style={{ fontSize: '15px' }}>
                                                    Username <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                {/* <p class="text-muted"> * Please Remember the User Name *</p> */}
                                                <input
                                                    type="text"
                                                    name="uname"
                                                    className="form-control"
                                                    value={formData.uname}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label htmlFor="uname" className="form-label" >
                                                    Password <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                {/* <p class="text-muted"> * Please Remember the Password *</p> */}
                                                <div className="position-relative auth-pass-inputgroup input-group">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        name="password"
                                                        className="form-control pe-5"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <button
                                                        className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-decoration-none text-muted shadow-none"
                                                        type="button"
                                                        id="password-addon"
                                                        onClick={() => setShowPassword(prevShowPassword => !prevShowPassword)}
                                                    >
                                                        <i className={`ri-eye-fill align-middle`}></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label For="fname" className="form-label" style={{ fontSize: '15px' }}>
                                                    Father's Name <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fname"
                                                    className="form-control"
                                                    value={formData.fname}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label For="email" className="form-label" style={{ fontSize: '15px' }}>
                                                    Email <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                {/* <p class="text-muted"> * Please Enter Valid Email *</p> */}
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row row-space">
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label htmlFor="country" className="form-label" style={{ fontSize: '15px' }}>
                                                    Country <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    name="country"
                                                    className="form-select"
                                                    value={formData.country}
                                                    onChange={handleCountryChange}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    {country.map((countryItem) => (
                                                        <option key={countryItem.id} value={countryItem.id}>{countryItem.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label htmlFor="state" className="form-label" style={{ fontSize: '15px' }}>
                                                    State <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    name="state"
                                                    className="form-select"
                                                    value={formData.state}
                                                    onChange={handleStateChange}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    {states.map((state) => (
                                                        <option key={state.id} value={state.id}>{state.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row row-space" >
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label htmlFor="city" className="form-label" style={{ fontSize: '15px' }}>
                                                    City <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    name="city"
                                                    className="form-select"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    {cities.map((city) => (
                                                        <option key={city.id} value={city.id}>{city.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label For="phonenum" className="form-label" style={{ fontSize: '15px' }}>
                                                    Phone Number <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phonenum"
                                                    className="form-control"
                                                    value={formData.phonenum}
                                                    onChange={handleChange}
                                                    pattern="[6-9]{1}[0-9]{9}"
                                                    title="Phone number should start with 6-9 and remaing 9 digit with 0-9"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="row row-space">
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label For="ref_name" className="form-label" style={{ fontSize: '15px' }}>
                                                    Reference Name <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="ref_name"
                                                    className="form-control"
                                                    value={formData.ref_name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label For="isSageian" className="form-label" style={{ fontSize: '15px' }}>
                                                    Are You Sageian? <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    name="isSageian"
                                                    className="form-select"
                                                    value={formData.isSageian}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div></div>
                                        <div className="row row-space">
                                            <div className="col-md-6" style={{ marginTop: '15px' }}>
                                                <label For="gender" className="form-label" style={{ fontSize: '15px' }}>
                                                    Gender <span style={{ color: 'red' }}>*</span>
                                                </label>
                                                <select
                                                    name="Gender"
                                                    className="form-select"
                                                    value={formData.Gender}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select</option>
                                                    <option value="M">Male</option>
                                                    <option value="F">Female</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <button className="btn btn-success w-100" type="submit">
                                                Sign Up
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}
export default Registration;