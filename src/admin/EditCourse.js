import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import JoditEditor from "jodit-react";

function EditCourse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const descriptionEditorRef = useRef(null);
    const syllabusEditorRef = useRef(null);
    const outcomeEditorRef = useRef(null);
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/selected-courses/${id}/`);
                const courseData = JSON.parse(response.data.data);
                console.log("courseData:", courseData); // Log the entire courseData object
                setFormData(courseData[0].fields); // Access the fields property
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch course details. Please try again.");
                console.error("Fetch course details failed:", error);
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }
            const response = await axios.put(
                `http://127.0.0.1:8000/course/edit/${id}/`, 
                formDataToSend,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setSuccessMessage("Course updated successfully!");
            setFormData(null);
            navigate('/Course-Approval');
        } catch (error) {
            setError("Failed to update course. Please try again.");
            console.error("Update course failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-body">
                        {formData && (
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="live-preview">
                                    <div className="row gy-4">
                                        <div className="col-md-12">
                                            <div>
                                                <label
                                                    htmlFor="courseTitleInput"
                                                    className="form-label fs-5"
                                                    style={{ fontSize: "16px" }}
                                                >
                                                    Title of Course
                                                </label>
                                                <input
                                                    type="text"
                                                    name="course_title"
                                                    value={formData.course_title}
                                                    onChange={handleChange}
                                                    className="form-control"
                                                    placeholder="Enter Course Title"
                                                />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <label class="input-group-text" for="inputGroupSelect01" style={{ fontSize: '14px' }}>Category</label>
                                                <select class="form-select" name="course_category" value={formData.course_category} onChange={handleChange}>
                                                    <option value="">Choose One Category</option>
                                                    <option value="1">Science and Technology</option>
                                                    <option value="2">Life Enrichment</option>
                                                    <option value="3">Skill Development</option>
                                                    <option value="4">Management and Finance</option>
                                                </select>
                                            </div>                                        
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group">
                                                <label class="input-group-text" for="inputGroupSelect01">Course Mode</label>
                                                <select class="form-select" name="course_mode" value={formData.course_mode} onChange={handleChange}>
                                                    <option selected>Choose Course Mode</option>
                                                    <option value="0">Online</option>
                                                    <option value="1">Offline</option>
                                                </select>
                                            </div>
                                        </div>
                                        {/* <div class="col-lg-12">
                                            <div>
                                                <label for="formFile" class="form-label" style={{ fontSize: '16px' }}>Sample Image of Course</label>

                                                <input class="form-control" type="file" name="course_img" onChange={handleFileChange} />
                                                <div>
                                                    <p class="text-muted">Note:- Image Size Should Be 416px X 278px</p>
                                                    <p class="text-muted">Note:- Image Should be in WebP and Min Size be 100KB</p>
                                                    {imageSizeError && <div className="text-danger mt-2">{imageSizeError}</div>}
                                                </div>
                                            </div>
                                        </div> */}
                                        <div class="col-md-12">
                                            <div>
                                                <label for="basiInput" class="form-label" style={{ fontSize: '16px' }}>URL</label>
                                                <input type="text" class="form-control" name="url" value={formData.url} onChange={handleChange} placeholder="Enter URL For Course" />
                                                <p class="text-muted">Note :- Copy and paste your title and remove space with - Example :- Sage-summer-school</p>
                                            </div>
                                        </div>
                                        <div class="col-md-12" style={{ marginTop: '25px' }}>
                                            <div>
                                                <label for="basiInput" class="form-label" style={{ fontSize: '16px' }}>Description</label>
                                                <JoditEditor
                                                    ref={descriptionEditorRef}
                                                    value={formData.description}
                                                    onChange={(newContent) => setFormData({ ...formData, description: newContent })}
                                                />
                                            </div>
                                        </div>
                                        <div class="col-md-12" style={{ marginTop: '25px' }}>
                                            <div>
                                                <label for="basiInput" class="form-label" style={{ fontSize: '16px' }}>syllabus</label>
                                                <JoditEditor
                                                    ref={syllabusEditorRef}
                                                    value={formData.syllabus}
                                                    onChange={(newContent) => setFormData({ ...formData, syllabus: newContent })} />
                                            </div>
                                        </div>
                                        <div class="col-md-12 " style={{ marginTop: '25px' }}>
                                            <div>
                                                <label for="basiInput" class="form-label" style={{ fontSize: '16px' }}>Course Outcome</label>
                                                <JoditEditor
                                                    ref={outcomeEditorRef}
                                                    value={formData.outcome}
                                                    onChange={(newContent) => setFormData({ ...formData, outcome: newContent })} />
                                            </div>
                                        </div>
                                        <div class="mb-3 row" style={{ marginTop: '25px' }}>
                                    <label for="basiInput" class="col-sm-2 col-form-label" style={{ fontSize: '16px', marginTop: '5px' }}>Coordinator Mobile</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" name="coord_mob" value={formData.coord_mob} onChange={handleChange} placeholder="Enter Coordinator Mobile Number" />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="staticEmail" class="col-sm-2 col-form-label" style={{ fontSize: '16px' }}>Coordinator Name</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" name="coord_name" value={formData.coord_name} onChange={handleChange} placeholder="Enter Coordinator Name" />
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <label for="staticEmail" class="col-sm-2 col-form-label" style={{ fontSize: '16px' }}>Coordinator Email</label>
                                    <div class="col-sm-10">
                                        <input type="email" class="form-control" name="coord_mail" value={formData.coord_mail} onChange={handleChange} placeholder="Enter Coordinator Email" />
                                    </div>
                                </div>
                                    </div>
                                    
                                </div>
                                <div className="mt-4">
                                    <button className="btn btn-success" type="submit" disabled={loading}>
                                        {loading ? "Updating Course..." : "Update Course"}
                                    </button>
                                    {error && <div className="text-danger mt-2">{error}</div>}
                                    {successMessage && <div className="text-success mt-2">{successMessage}</div>}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditCourse;
