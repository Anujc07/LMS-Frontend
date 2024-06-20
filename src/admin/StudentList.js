import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Pagination } from "react-bootstrap";

function StudentList() {
    const { pk } = useParams();
    const courseid = pk;
    const [stdlist, setStdList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage] = useState(10);

    useEffect(() => {
        const fetchstdlist = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/student-list/${courseid}/`);
                setStdList(response.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchstdlist();
    }, [courseid]);

    // Calculate indexes for pagination
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = stdlist.slice(indexOfFirstStudent, indexOfLastStudent);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card-body">
                        <div className="live-preview">
                            <div className="table-responsive">
                                <table className="table table-nowrap">
                                    <thead>
                                        <tr>
                                            <th scope="col">S.No</th>
                                            <th scope="col">Student Detail</th>
                                            <th scope="col">Date of Registration</th>
                                            <th scope="col">Phone Number</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentStudents.map((student, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td> {/* Serial number */}
                                                <td>{student.uname}, {student.email}</td>
                                                <td>{student.created_at}</td>
                                                <td>{student.phonenum}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex justify-content-end">
                            <Pagination>
                                <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                                {Array.from({ length: Math.ceil(stdlist.length / studentsPerPage) }).map((_, index) => (
                                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastStudent >= stdlist.length} />
                            </Pagination></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default StudentList;
