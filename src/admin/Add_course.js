import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";

function Add_course() {
    const descriptionEditorRef = useRef(null);
    const syllabusEditorRef = useRef(null);
    const outcomeEditorRef = useRef(null);
    const [imageSizeError, setImageSizeError] = useState("");
    const [userid, setUserid] = useState(sessionStorage.getItem('userid'));
    // console.log("====userid",userid);
    const [formData, setFormData] = useState({
        course_title: "",
        course_category: "",
        vertical: sessionStorage.getItem('vertical') || "",
        course_mode: "",
        course_img: null,
        url: "",
        coord_mob: "",
        coord_name: "",
        coord_mail: "",
        coord_id: userid,
        startdate: "",
        course_status: 0,
        enddate:"",
        price: "",

    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [csrfToken, setCsrfToken] = useState('');
    useEffect(() => {
        async function fetchCsrfToken() {
            const response = await axios.get('http://127.0.0.1:8000/csrf_cookie/');
            const csrfToken = response.data.csrfToken;
            setCsrfToken(csrfToken);
        }

        fetchCsrfToken();
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.size / 1024 > 100) {
            setImageSizeError("Image size should be less than 100KB");
            setTimeout(() => {
                setImageSizeError("");
            }, 100000);
            return;
        }
        setFormData({ ...formData, course_img: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        const formDataToSend = new FormData();
        formDataToSend.append("course_title", formData.course_title);
        formDataToSend.append("course_category", formData.course_category);
        formDataToSend.append("vertical", formData.vertical);
        formDataToSend.append("course_mode", formData.course_mode);
        formDataToSend.append("course_img", formData.course_img);
        formDataToSend.append("url", formData.url);
        formDataToSend.append("coord_mob", formData.coord_mob);
        formDataToSend.append("coord_name", formData.coord_name);
        formDataToSend.append("coord_mail", formData.coord_mail);
        formDataToSend.append("coord_id", formData.coord_id);
        formDataToSend.append("startdate", formData.startdate);
        formDataToSend.append("course_status", formData.course_status);
        formDataToSend.append("outcome", formData.outcome);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("syllabus", formData.syllabus);
        formDataToSend.append("enddate", formData.enddate);
// console.log("==========data==========",formData);
        const headers = {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
        };

        try {
            // console.log("==========data==========",formData);

            const response = await axios.post(
                "http://127.0.0.1:8000/coordinator/course-add/",
                formDataToSend,
                { headers }
            );
            
            setSuccessMessage("Course added successfully!");
            // Clear form data after successful submission
            setFormData({
                course_title: "",
                course_category: "",
                vertical: sessionStorage.getItem('vertical') || "",
                course_mode: "",
                course_img: "",
                url: "",
                coord_mob: "",
                coord_name: "",
                coord_mail: "",
                coord_id: userid,
                startdate: "",
                course_status: 0,
                outcome: "",
                description: "",
                syllabus: "",
                enddate:"",
            });
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (error) {
            setError("Failed to add course. Please try again.");
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userRole = sessionStorage.getItem("userRole");
        const uname = sessionStorage.getItem("uname");
        const gender = sessionStorage.getItem("gender");
        const userid = sessionStorage.getItem("userid");
        const vertical = sessionStorage.getItem('vertical');
        // setSessionRole(userRole);
        // console.log("======================", uname, userRole, vertical);
      }, []);

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-body">
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
                                            <label class="input-group-text" for="inputGroupSelect01">Vertical</label>
                                            <select class="form-select" name="vertical" value={formData.vertical} onChange={handleChange}>
                                                <option value="">Choose One Vertical</option>
                                                <option value="SUB">SUB</option>
                                                <option value="SUI">SUI</option>
                                                <option value="SIRT">SIRT</option>
                                                <option value="SIRTE">SIRTE</option>
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
                                    <div class="col-lg-12">
                                        <div>
                                            <label for="formFile" class="form-label" style={{ fontSize: '16px' }}>Sample Image of Course</label>

                                            <input class="form-control" type="file" name="course_img" onChange={handleFileChange} />
                                            <div>
                                                <p class="text-muted">Note:- Image Size Should Be 416px X 278px</p>
                                                <p class="text-muted">Note:- Image Should be in WebP and Min Size be 100KB</p>
                                                {imageSizeError && <div className="text-danger mt-2">{imageSizeError}</div>}
                                            </div>
                                        </div>
                                    </div>
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
                                <div className="row">
                                    <div class="col-xxl-3 col-md-12" style={{ marginTop: '25px' }}>
                                        <div>
                                            <label for="exampleInputdate" class="form-label" style={{ fontSize: '16px' }}>Start date</label>
                                            <input type="date" class="form-control" name="startdate" value={formData.startdate} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div class="col-xxl-3 col-md-12" style={{ marginTop: '25px' }}>
                                        <div>
                                            <label for="exampleInputdate" class="form-label" style={{ fontSize: '16px' }}>End date</label>
                                            <input type="date" class="form-control" name="enddate" value={formData.enddate} onChange={handleChange} />
                                        </div>
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
                                <div className="mt-4">
                                    <button
                                        className="btn btn-success"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Adding Course..." : "Add Course"}
                                    </button>

                                    {error && (
                                        <div className="text-danger mt-2">{error}</div>
                                    )}
                                    {successMessage && (
                                        <div className="text-success mt-2" style={{ fontSize: '25px' }}>{successMessage}</div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
        </div >
    );
}

export default Add_course;
