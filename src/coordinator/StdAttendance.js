import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function StdAttendance() {
    const { pk: course_ID } = useParams();
    const [students, setStudents] = useState([]);
    const [courseData, setCourseData] = useState(null);
    const [student_id, setStudentId] = useState(null);
    const user = sessionStorage.getItem('userid');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [checkedStatus, setCheckedStatus] = useState({});
    const [attendanceUpdated, setAttendanceUpdated] = useState(false); // Flag to indicate whether attendance has been updated

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/coordinator/std-attendance/${course_ID}/`);
                setStudents(response.data.student_data);
                setCourseData(response.data.course_data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
        fetchStudents();
    }, [course_ID]);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/student/attendance/${course_ID}/`);
                const data = response.data.data;

                const updatedCheckedStatus = {};
                data.forEach(item => {
                    const dates = item.date.split(',').map(date => date.trim());
                    dates.forEach(date => {
                        if (!updatedCheckedStatus[item.student_id]) {
                            updatedCheckedStatus[item.student_id] = {};
                        }
                        updatedCheckedStatus[item.student_id][date] = true;
                    });
                });
                setCheckedStatus(updatedCheckedStatus);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };
        fetchAttendance();
    }, [course_ID]);

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            const day = String(currentDate.getDate()).padStart(2, '0');
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const year = currentDate.getFullYear();
            dates.push(`${day}-${month}-${year}`);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };

    const startDate = courseData && courseData.length > 0 ? courseData[0].startdate : null;
    const endDate = courseData && courseData.length > 0 ? courseData[0].enddate : null;

    let dateHeaders = null;
    if (startDate && endDate) {
        const dates = getDatesBetween(startDate, endDate);
        dateHeaders = dates.map((date, index) => (
            <th key={`date_${index}`}>{date}</th>
        ));
    }

    const handleCheckboxChange = (studentId, date) => {
        if (!attendanceUpdated) { 
            setStudentId(studentId);
            setCheckedStatus(prevStatus => ({
                ...prevStatus,
                [studentId]: {
                    ...(prevStatus[studentId] || {}),
                    [date]: !prevStatus[studentId]?.[date]
                }
            }));
        }
    };

    const handleUpdateAttendance = async () => {
        try {
            const updatedStudents = students.map(student => {
                const selectedStudentAttendance = dateHeaders.map((date, dateIndex) => ({
                    date: date.props.children,
                    attended: checkedStatus[student.id]?.[date.props.children] || false
                }));

                return {
                    student_id: student.id,
                    attendance: selectedStudentAttendance
                };
            });
           
            await axios.post(`http://127.0.0.1:8000/update/std-attendance/${course_ID}/`, {
                attendanceData: updatedStudents,
                user
            });

            // Disable further changes to attendance
            setAttendanceUpdated(true);
            setSuccessMessage('Attendance updated successfully');
            setErrorMessage('');
        } catch (error) {
            console.error('Error updating attendance:', error);
            setErrorMessage('Failed to update attendance');
            setSuccessMessage('');
        }
    };

    return (
        <>
            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
            <button onClick={handleUpdateAttendance} type="button" className="btn btn-outline-success waves-effect waves-light shadow-none">Update Attendance</button>

            <table className="table table-nowrap">
                <thead>
                    <tr>
                        <th scope="col">S. No</th>
                        <th scope="col">Student Name</th>
                        {dateHeaders}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, studentIndex) => (
                        <tr key={student.id}>
                            <td>{studentIndex + 1}</td>
                            <td>{student.uname},{student.id}</td>
                            {dateHeaders && dateHeaders.map((date, dateIndex) => {
                                const dateStr = date.props.children;
                                const isChecked = checkedStatus[student.id]?.[dateStr];
                                return (
                                    <td key={`${student.id}_${dateIndex}`}>
                                        <input
                                            type="checkbox"
                                            id={`student_${student.id}_date_${dateIndex}`}
                                            name={`student_${student.id}_date_${dateIndex}`}
                                            checked={isChecked || false}
                                            onChange={() => handleCheckboxChange(student.id, dateStr)}
                                            // disabled={attendanceUpdated}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default StdAttendance;
