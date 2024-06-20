import axios from 'axios';
import { useEffect, useState } from 'react';

function CourseAttendance() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/student/attendance/');
                setData(response.data.data);
                console.log('=========================', response.data.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    return (
        <>
            <h1>Attendance</h1>
            <table className="table table-nowrap">
                <thead>
                    <tr>
                        <th scope="col">S. No</th>
                        <th scope="col">Course Name</th>
                        <th scope="col">Student Name</th>
                        <th scope="col">Dates</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((attendance, index) => (
                        <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{attendance.course_name}</td>
                            <td>{attendance.student_name}</td>
                            <td>{attendance.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default CourseAttendance;
