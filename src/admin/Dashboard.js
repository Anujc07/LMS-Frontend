import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
    const [totalNumCourses, setTotalNumCourses] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalcoord, setTotalCoord] = useState(0);
    const userRole = sessionStorage.getItem('userRole');
    const [totalApprovedCourses, setTotalApprovedCourses] = useState(0); 
    // console.log('==============',userRole);
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/total-courses-std/");
            setTotalNumCourses(response.data.total_num_courses);
            setTotalStudents(response.data.total_students);
            setTotalCoord(response.data.total_coord);
            setTotalApprovedCourses(response.data.total_approved_course)

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };


    return (
        <div class="row">
            <h1>Dashboard</h1>
            <div class="col">
                <div class="h-100">
                    <div class="row mb-3 pb-1">
                        <div class="col-12">
                            <div class="d-flex align-items-lg-center flex-lg-row flex-column">
                                <div class="flex-grow-1">
                                    <h4 class="fs-16 mb-1">Hello, {sessionStorage.getItem('uname')} !</h4>
                                    {/* <p class="text-muted mb-0">Here's what's happening with your store today.</p> */}
                                </div>
                                
                            </div>
                        </div>

                    </div>
                    <div class="row">
                    {(userRole === '1' || userRole === '2') && (
                        <div class="col-xl-3 col-md-6">
                            <div class="card card-animate">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1 overflow-hidden">
                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> Total Courses</p>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-end justify-content-between mt-4">
                                        <div class="avatar-sm flex-shrink-0">
                                            <span class="avatar-title bg-success rounded fs-4">
                                                {totalApprovedCourses}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                        {userRole === '2' && (
                            <div class="col-xl-3 col-md-6">
                                <div class="card card-animate">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center">
                                            <div class="flex-grow-1 overflow-hidden">
                                                <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> Total Students</p>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-end justify-content-between mt-4">
                                            <div class="avatar-sm flex-shrink-0">
                                                <span class="avatar-title bg-info rounded fs-4">
                                                    {totalApprovedCourses}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {userRole === '2' && (
                        <div class="col-xl-3 col-md-6">

                            <div class="card card-animate">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">

                                        <div class="flex-grow-1 overflow-hidden">
                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> Total Coordinators</p>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-end justify-content-between mt-4">

                                        <div class="avatar-sm flex-shrink-0">
                                            <span class="avatar-title bg-warning rounded fs-4">
                                                {totalcoord}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                        {userRole === '2' && (
                            <div class="col-xl-3 col-md-6">
                                <div class="card card-animate">
                                    <div class="card-body">
                                        <div class="d-flex align-items-center">
                                            <div class="flex-grow-1 overflow-hidden">
                                                <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> Total Opted Students</p>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-end justify-content-between mt-4">
                                            <div class="avatar-sm flex-shrink-0">
                                                <span class="avatar-title bg-danger rounded fs-4">
                                                    00
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         )}
                    </div>
                    <div class="row">
                    {userRole === '2' && (
                        <div class="col-xl-3 col-md-6">
                            <div class="card card-animate">
                                <div class="card-body">
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1 overflow-hidden">
                                            <p class="text-uppercase fw-medium text-muted text-truncate mb-0"> Total Complete Payment </p>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-end justify-content-between mt-4">
                                        <div class="avatar-sm flex-shrink-0">
                                            <span class="avatar-title bg-success rounded fs-4">
                                                00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}                        
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Dashboard;