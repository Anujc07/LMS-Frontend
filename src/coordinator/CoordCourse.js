import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';

function CoordCourse() {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 5;
    const userID = sessionStorage.getItem('userid');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/coordinator/course/${userID}/`);
                setCourses(JSON.parse(response.data.data));
                // console.log(response.data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, [userID]);

    // Get current courses
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>
            <h1>Your Sage Summer Courses</h1>
            <div className="row">                
                <div className="card">                    
                    <div className="card-body">
                        <div id="customerList">
                            <div className="row g-4 mb-3">
                                <div className="col-sm">
                                    <div className="d-flex justify-content-sm-end">
                                        <div className="search-box ms-2">
                                            <input type="text" className="form-control search" placeholder="Search..." />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="table-responsive table-card mt-3 mb-1">
                                <table className="table align-middle table-nowrap" id="customerTable">
                                    <thead className="table-light">
                                        <tr>
                                            <th data-sort="id">S.No</th>
                                            <th data-sort="course_name">Course Detail</th>
                                            <th data-sort="Category">Coordinator Detail</th>                                      
                                            <th data-sort="Category">Action</th>                                      
                                        </tr>
                                    </thead>
                                    <tbody className="list form-check-all">
                                    {currentCourses.length > 0 ? (
                                        currentCourses.map((course, index) => (
                                            <tr key={indexOfFirstCourse + index + 1}>
                                                <td className="id">{indexOfFirstCourse + index + 1}</td>
                                                <td className="course_name">
                                                    {course.fields.course_title}<br/>
                                                    {course.fields.course_category}<br/>
                                                    {course.fields.vertical}
                                                </td>
                                                <td className="course_name">
                                                    {course.fields.coord_name}<br/>
                                                    {course.fields.coord_mob}<br/>
                                                    {course.fields.coord_mail}
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                     
                                                        <div>
                                                            <button className="btn btn-sm btn-warning">Edit</button>
                                                        </div>
                                                        <div>
                                                            <Link to={`/Add-trainer/${course.pk}/${course.fields.course_title}`} className="btn btn-sm btn-primary">Add Trainer</Link>
                                                        </div>
                                                        
                                                        <div>
                                                            <Link to={`/Student-Attendance/${course.pk}/${course.fields.course_title}`} className="btn btn-sm btn-info">Attandance</Link>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No courses found</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex justify-content-end">
                                <Pagination>
                                    <Pagination.Prev 
                                        onClick={() => paginate(currentPage - 1)} 
                                        disabled={currentPage === 1} 
                                    />
                                    {Array.from({ length: Math.ceil(courses.length / coursesPerPage) }).map((_, index) => (
                                        <Pagination.Item 
                                            key={index + 1} 
                                            active={index + 1 === currentPage} 
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next 
                                        onClick={() => paginate(currentPage + 1)} 
                                        disabled={indexOfLastCourse >= courses.length} 
                                    />
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CoordCourse;
