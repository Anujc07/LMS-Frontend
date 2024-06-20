import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Carts() {
    const [optedCourses, setOptedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removalMessage, setRemovalMessage] = useState('');

    useEffect(() => {
        const fetchOptedCourses = async () => {
            try {
                setLoading(true);
                const userId = sessionStorage.getItem('userid') || sessionStorage.getItem('userId');
                const response = await axios.get(`http://127.0.0.1:8000/opted-courses/${userId}/`);
                setOptedCourses(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching opted courses:', error);
                setLoading(false);
            }
        };
        fetchOptedCourses();
    }, []);

    const removeOptedCourse = async (optedCourseToRemove) => {
        try {
            const optID = optedCourseToRemove.id;
            await axios.delete(`http://127.0.0.1:8000/student/remove-course/${optID}/`);
    
            // Display removal message with danger class
            setRemovalMessage(`Course "${optedCourseToRemove.course_data[0].course_title}" removed successfully.`);
            
            // Remove the course from the list
            setOptedCourses(prevOptedCourses =>
                prevOptedCourses.filter(course => course.id !== optedCourseToRemove.id)
            );
        } catch (error) {
            console.error('Error removing course from cart:', error);
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h1>Your Sage Summer Cart</h1>
            {removalMessage && <p className="btn btn-danger">{removalMessage}</p>}
            <div className="row">
                {optedCourses.map(optedCourse => (
                    <div key={optedCourse.cart_id} className="col-sm-6 col-xl-3">
                        <div className="card">
                            {optedCourse.course_data && optedCourse.course_data.map(courseData => (
                                <div key={courseData.id}>
                                    <img className="card-img-top img-fluid" src={'http://127.0.0.1:8000/media/' + courseData.course_img} alt={courseData.course_title} />
                                    <div className="card-body">
                                        <h4 className="card-title mb-2">{courseData.course_title}</h4>
                                        <p className="card-text">{courseData.description}</p>

                                        <div className='row'>
                                            <div className='col-6'><a href="#" className="btn btn-primary">Pay Fee</a></div>
                                            <div className='col-6'><button onClick={() => removeOptedCourse(optedCourse)} className="btn btn-danger">Remove</button></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Carts;
