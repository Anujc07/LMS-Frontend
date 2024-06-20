import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function CourseApproval() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/all-approval-courses/');
                setCourses(response.data.courses);
                setFilteredCourses(response.data.courses);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);
    const sortTable = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    const sortedCourses = () => {
        const sorted = [...filteredCourses];
        if (sortConfig.key !== null) {
            sorted.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sorted;
    };
    const handleSearch = (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        const filtered = courses.filter(course => {
            return course.course_title.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredCourses(filtered);
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/update-cour-status/${selectedCourseId}/`, {
                status: selectedStatus
            });
            // Update the course status in the local state
            const updatedCourses = courses.map(course => {
                if (course.id === selectedCourseId) {
                    return { ...course, course_status: parseInt(selectedStatus) };
                }
                return course;
            });
            // Update both the filtered and original courses state
            setCourses(updatedCourses);
            setFilteredCourses(updatedCourses);
            setSuccessMessage('Status update successful');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/course-delete/${selectedCourseId}/`, {
                status: selectedStatus
            });          
            setErrorMessage('Course Deleted Succesfully');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);

        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentCourses = sortedCourses().slice(indexOfFirstPost, indexOfLastPost);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {/* <h1>Course Approval</h1> */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        
                        <div className="card-body">
                            <div id="customerList">
                                <div className="row g-4 mb-3">
                                <div class="col-sm-auto">
                                    <div>
                                    <h4 className="card-title mb-0">Course Edit, Update Status</h4>
                                    </div>
                                </div>
                                    <div className="col-sm">
                                        <div className="d-flex justify-content-sm-end">
                                            <div className="search-box ms-2">
                                                <input
                                                    type="text"
                                                    className="form-control search"
                                                    placeholder="Search..."
                                                    value={searchTerm}
                                                    onChange={handleSearch} />
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="table-responsive table-card mt-3 mb-1">
                                    <table className="table align-middle table-nowrap" id="customerTable">
                                        <thead className="table-light">
                                            <tr>
                                                <th>S. No</th>
                                                <th className="sort" onClick={() => sortTable('course_title')}>Course Name</th>
                                                <th className="sort" data-sort="Category">Category</th>
                                                <th className="sort" data-sort="Coordinators_name">Coordinators</th>
                                                <th className="sort" data-sort="date">Start | End Date</th>
                                                <th className="sort" data-sort="date">Mode</th>
                                                <th className="sort" data-sort="status">Status</th>
                                                <th className="sort" data-sort="action">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="list form-check-all">
                                            {currentCourses.map((course, index) => (
                                                <tr key={index}>
                                                    <td className="id"><a className="fw-medium link-primary">{(currentPage - 1) * postsPerPage + index + 1}</a></td>
                                                    <td className="customer_name">{course.course_title}</td>
                                                    <td className="Category">
                                                        {course.course_category === '1' ? (
                                                            <span className="badge badge-soft-info text-uppercase">Science and Technology</span>
                                                        ) : course.course_category === '2' ? (
                                                            <span className="badge badge-soft-info text-uppercase">Life Enrichment</span>
                                                        ) : course.course_category === '3' ? (
                                                            <span className="badge badge-soft-info text-uppercase">Skill Development</span>
                                                        ) : course.course_category === '4' ? (
                                                            <span className="badge badge-soft-info text-uppercase">Management and Finance</span>
                                                        ) : null}
                                                    </td>
                                                    <td className="Coordinators_name">{course.coord_name}</td>
                                                    <td className="date">{course.startdate}--- ||---{course.enddate}</td>
                                                    <td className="Category">
                                                        {course.course_category === '1' ? (
                                                            <span className="badge badge-soft-info text-uppercase">Offline</span>
                                                        ) : course.course_category === '0' ? (
                                                            <span className="badge badge-soft-primary text-uppercase">Online</span>
                                                        ) : null}
                                                    </td>
                                                    <td className="status">
                                                        {course.course_status === 0 ? (
                                                            <span className="badge badge-soft-primary text-uppercase">New Added</span>
                                                        ) : course.course_status === 1 ? (
                                                            <span className="badge badge-soft-success text-uppercase">Approved</span>
                                                        ) : course.course_status === 2 ? (
                                                            <span className="badge badge-soft-info text-uppercase">Changes Required</span>
                                                        ) : course.course_status === 3 ? (
                                                            <span className="badge badge-soft-danger text-uppercase">Disapproved</span>
                                                        ) : course.course_status === 4 ? (
                                                            <span className="badge badge-soft-success text-uppercase">Completed</span>
                                                        ) : null}
                                                    </td>
                                                    <td>
                                                        <div className='row'>
                                                            <div className="d-flex gap-2">
                                                                <div className="edit">
                                                                    <button className="btn btn-sm btn-success edit-item-btn" data-bs-toggle="modal" data-bs-target="#showModal" onClick={() => setSelectedCourseId(course.id)}>Status</button>
                                                                </div>
                                                                <div className="remove">
                                                                    <button className="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal" onClick={() => setSelectedCourseId(course.id)}>Remove</button>
                                                                </div>
                                                                <div className="edit">
                                                                    <Link to={`/Edit-Course/${course.id}`} className="btn btn-sm btn-primary edit-item-btn">Edit</Link>
                                                                </div>

                                                                <div className="remove">
                                                                    <Link to={`/Student-list/${course.id}/${course.url}`} className="btn btn-sm btn-success">Student List</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Pagination>
                                        <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                                        {Array.from({ length: Math.ceil(filteredCourses.length / postsPerPage) }).map((_, index) => {
                                            const pageNumber = index + 1;
                                            if (
                                                pageNumber >= currentPage - 2 &&
                                                pageNumber <= currentPage + 2 &&
                                                pageNumber <= Math.ceil(filteredCourses.length / postsPerPage)
                                            ) {
                                                return (
                                                    <Pagination.Item key={index} active={pageNumber === currentPage} onClick={() => paginate(pageNumber)}>
                                                        {pageNumber}
                                                    </Pagination.Item>
                                                );
                                            }
                                            return null;
                                        })}
                                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastPost >= filteredCourses.length} />
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade" id="showModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-light p-3">
                                    <h5 className="modal-title" id="exampleModalLabel"></h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close-modal"></button>
                                </div>
                                <form>
                                    <div className="modal-body">
                                        <div>
                                            <label htmlFor="status-field" className="form-label">Status</label>
                                            <select className="form-control" data-trigger name="status" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                                <option value="">Status</option>
                                                <option value="1">Approved</option>
                                                <option value="2">Changes Required</option>
                                                <option value="3">Disapproved</option>
                                                <option value="4">Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleUpdate}>Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal fade zoomIn" id="deleteRecordModal" tabIndex="-1" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btn-close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mt-2 text-center">
                                        <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" ></lord-icon>
                                        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                                            <h4>Are you Sure ?</h4>
                                            <p className="text-muted mx-4 mb-0">Are you Sure You want to Remove this Record ?</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
                                        <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal">Close</button>
                                        <button type="button" className="btn w-sm btn-danger" id="delete-record" data-bs-dismiss="modal" onClick={handleDelete}>Yes, Delete It!</button>
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

export default CourseApproval;


