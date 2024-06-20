import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";

function AddTrainer() {
    const { pk: course_id } = useParams();
    const { course_title } = useParams();
    const detailEditorRef = useRef(null);
    const [formData, setFormData] = useState({
        Trainer_name: "", Trainer_email: "", Trainer_number: "", Trainer_img: null, Detail: ""
    });
    const [csrfToken, setCsrfToken] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [imageSizeError, setImageSizeError] = useState('');
    
    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.size / 1024 > 100) {
            setImageSizeError("Image size should be less than 100KB");
            setTimeout(() => {
                setImageSizeError("");
            }, 10000);
            return;
        }
        setFormData({ ...formData, Trainer_img: file });
    };
    
    // Fetch CSRF token on component mount
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/csrf_cookie/');
                const csrfToken = response.data.csrfToken;
                setCsrfToken(csrfToken);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        }
        fetchCsrfToken();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('Trainer_name', formData.Trainer_name);
            formDataToSend.append('Trainer_email', formData.Trainer_email);
            formDataToSend.append('Trainer_number', formData.Trainer_number);
            formDataToSend.append('Trainer_img', formData.Trainer_img);
            formDataToSend.append('Detail', formData.Detail);
            
            const response = await axios.post(`http://127.0.0.1:8000/coordinator/add-trainer/${course_id}/`, formDataToSend, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Handle success response
            setSuccessMessage('Trainer added successfully');
            setErrorMessage('');
            // Clear form fields
            setFormData({ Trainer_name: "", Trainer_email: "", Trainer_number: "", Trainer_img: null, Detail: "" });
            // Log success response if needed
            // console.log('Trainer added successfully:', response.data);
        } catch (error) {
            // Handle error response
            setErrorMessage('Failed to add trainer');
            setSuccessMessage('');
            console.error('Failed to add trainer:', error);
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-body">
                            <form encType="multipart/form-data" onSubmit={handleSubmit}>
                                <div className="live-preview">
                                    <div className="row gy-4">
                                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                        <div className="mb-3 row" style={{ marginTop: '25px' }}>
                                            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px', marginTop: '5px' }}>Course Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" name="course_name" value={course_title} readOnly />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px' }}>Trainer Name</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" name="Trainer_name" value={formData.Trainer_name} onChange={handleChange} placeholder="Enter Trainer Name" />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px' }}>Trainer Email Id</label>
                                            <div className="col-sm-10">
                                                <input type="email" className="form-control" name="Trainer_email" value={formData.Trainer_email} onChange={handleChange} placeholder="Enter Trainer Email Id" />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px' }}>Trainer Mobile Number</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control" name="Trainer_number" value={formData.Trainer_number} onChange={handleChange} placeholder="Trainer Mobile Number" />
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px' }}>Trainer Image</label>
                                            <div className="col-sm-10">
                                                <input className="form-control" type="file" name="Trainer_img" onChange={handleFileChange} />
                                                <div>
                                                    <p className="text-muted">Note:- Image Size Should Be Less Than 100KB</p>
                                                    {imageSizeError && <div className="text-danger mt-2">{imageSizeError}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3 row">
                                            <label className="col-sm-2 col-form-label" style={{ fontSize: '16px' }}>Details</label>
                                            <div className="col-sm-10">
                                                <label className="form-label" style={{ fontSize: '16px' }}>Details</label>
                                                <JoditEditor
                                                    ref={detailEditorRef}
                                                    value={formData.Detail}
                                                    onChange={(newContent) => setFormData({...formData, Detail: newContent})}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                className="btn btn-success"
                                                type="submit"
                                            >
                                                Add Trainer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddTrainer;
