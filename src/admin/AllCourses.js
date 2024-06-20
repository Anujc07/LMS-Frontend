
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination } from 'react-bootstrap';
function AllCourses() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [joinedCourses, setJoinedCourses] = useState(new Set());
    const userId = sessionStorage.getItem('userid') || sessionStorage.getItem('userId');
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 10;
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:8000/all-courses/${userId}/`);
                setCourses(response.data.data);
                // console.log(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const canEnroll = sessionStorage.getItem('userRole') === '1';
    const userRoleFromSession = sessionStorage.getItem('userRole');

    // const userrole = userRoleFromSession === '1' || userRoleFromSession === '0';
    const userrole = sessionStorage.getItem('userRole')
    const filteredCourses = userrole === '1'
        ? courses.filter(course => course.course_status === 1 && !joinedCourses.has(course.id))
        : courses.filter(course => !joinedCourses.has(course.id));


    // console.log("========filteredCourses======", filteredCourses);



    const handleJoinCourse = async (courseId, index) => {
        if (joinedCourses.has(courseId)) {
            setErrorMessage('You have already joined this course.');
            setSuccessMessage('4');
            return;
        }
        try {
            const response = await axios.post(`http://127.0.0.1:8000/join-course/${userId}/${courseId}/`, {
                userId: userId
            });
            setSuccessMessage('Course Successfully Added to the Cart!');
            setErrorMessage('');
            setJoinedCourses(prevJoinedCourses => new Set([...prevJoinedCourses, courseId]));
        } catch (error) {
            // console.error('Error joining course:', error);
            setErrorMessage('Failed to join the course.');
            setSuccessMessage('');
        }
    };

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);


    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    return (
        <div class="row">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <h1>All Courses</h1>
            <div class="col-lg-12">
                <div class="card">                    
                    <div class="card-body">
                        <div id="customerList">
                            <div class="row g-4 mb-3">
                                <div class="col-sm">
                                    <div class="d-flex justify-content-sm-end">
                                        <div class="search-box ms-2">
                                            <input type="text" class="form-control search" placeholder="Search..." />
                                            <i class="ri-search-line search-icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive table-card mt-3 mb-1">
                                <table class="table align-middle table-nowrap" id="customerTable">
                                    <thead class="table-light">
                                        <tr>

                                            <th class="sort" data-sort="id">S.No</th>
                                            <th class="sort" data-sort="course_name">Course Name</th>
                                            <th class="sort" data-sort="Category">Category</th>
                                            {!userrole && (
                                                <>
                                                    <th class="sort" data-sort="opted_std">Opted Std</th>
                                                    <th class="sort" data-sort="approval_pending">Approval Pending</th>
                                                    <th class="sort" data-sort="pymnt_com">Payment Complete</th>
                                                    <th class="sort" data-sort="pymnt_not">Payment Not Recived</th>
                                                </>
                                            )}
                                            {/* <th class="sort" data-sort="opted_std">Opted Std</th>
                                            <th class="sort" data-sort="approval_pending">Approval Pending</th>
                                            <th class="sort" data-sort="pymnt_com">Payment Complete</th>
                                            <th class="sort" data-sort="pymnt_not">Payment Not Recived</th> */}
                                            <th class="sort" data-sort="status">Status</th>

                                            {canEnroll && (
                                                <th class="sort" data-sort="pymnt_not">Enroll</th>
                                            )}


                                        </tr>
                                    </thead>
                                    <tbody class="list form-check-all">
                                        {currentCourses.map((course, index) => (
                                            <tr key={index}>

                                                <td class="id">{((currentPage - 1) * coursesPerPage) + index + 1}</td>
                                                <td class="course_name">{course.course_title}</td>
                                                <td class="Category">
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
                                                {!userrole && (
                                                    <>
                                                        <td class="opted_std"></td>
                                                        <td class="approval_pending"></td>
                                                        <td class="pymnt_com"></td>
                                                        <td class="pymnt_not"></td>
                                                    </>
                                                )}

                                                <td class="status">
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
                                                    {canEnroll && (
                                                        <div class="d-flex gap-2">
                                                            <div class="edit">
                                                                <button class="btn btn-sm btn-success" onClick={() => handleJoinCourse(course.id, index)}>Add to Cart</button>
                                                            </div>
                                                            <div>
                                                                <button class="btn btn-sm btn-success">Buy the Course</button>
                                                            </div>
                                                        </div>
                                                    )}

                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div class="d-flex justify-content-end">
                                <Pagination>
                                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                                    {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }).map((_, index) => (
                                        <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastCourse >= filteredCourses.length} />
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade zoomIn" id="deleteRecordModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btn-close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mt-2 text-center">
                                    <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" ></lord-icon>
                                    <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                                        <h4>Are you Sure ?</h4>
                                        <p class="text-muted mx-4 mb-0">Are you Sure You want to Remove this Record ?</p>
                                    </div>
                                </div>
                                <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
                                    <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn w-sm btn-danger " id="delete-record">Yes, Delete It!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default AllCourses;

