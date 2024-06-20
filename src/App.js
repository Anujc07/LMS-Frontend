import React ,{useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CourseApproval from './admin/CourseApproval';
import Holidayslist from './admin/Holidayslist';
import AllCourses from './admin/AllCourses';
import Coordinators from './admin/Coordinators';
import CourseOpted from './admin/CourseOpted';
import PymntCom from './admin/PymntCom';
import PymntnotCom from './admin/PymtnotCom';
import Dashboard from './admin/Dashboard';
import CourseAttandance from './admin/CourseAttandance';
import Login from './Login';
import Base from './admin/Base';
import useAuth from './useAuth'; 
import Add_course from './admin/Add_course';
import Carts from './std/Carts';
import ChangePassword from './ChangePassword';
import Registration from './Registration';
import EditCourse from './admin/EditCourse';
import CoordCourse from './coordinator/CoordCourse';
import AddTrainer from './coordinator/AddTrainer';
import YourCourses from './std/YourCourses';
import StdAttendance from './coordinator/StdAttendance';
import StudentList from './admin/StudentList';

function App() {
  const { loggedIn, login, logout } = useAuth(); 
  const [refreshedAfterLogout, setRefreshedAfterLogout] = useState(false);

  useEffect(() => {
    if (!loggedIn && refreshedAfterLogout) {
      window.location.reload();
    }
  }, [loggedIn, refreshedAfterLogout]);


  // const handleLogout = () => {
  //   logout();
  //   setRefreshedAfterLogout(true);
  // };

  return (
    <Router>
      <Routes>
        <Route path="/Registration" element={<Registration />} />
        <Route path="/OTP" element={<ChangePassword />} />        
        {!loggedIn && <Route path="/" element={<Login onLogin={login} />} />}        
      </Routes>
      <div id="layout-wrapper">
        {loggedIn && (
          <>
            <Base onMenuItemClick={logout} />
            <div className="main-content">
              <div className="page-content">
                <div className="container-fluid">
                  <Routes>
                    <Route path="/Student-list/:pk/:url" element={<StudentList/>}/>
                    <Route path="/Add-trainer/:pk/:course_title" element={<AddTrainer/>} />
                    <Route path="/Your-courses" element={<CoordCourse/>} />
                    <Route path="/Edit-Course/:id" element={<EditCourse />} />
                    <Route path="/Change-Password" element={<ChangePassword />} />
                    <Route path="/Course-Approval" element={<CourseApproval />} />
                    <Route path="/Holidays-list" element={<Holidayslist />} />
                    <Route path="/Pymnt-Com" element={<PymntCom />} />
                    <Route path="/Pymnt-not-Com" element={<PymntnotCom />} />
                    <Route path="/Course-Opted" element={<CourseOpted />} />
                    <Route path="/All-Courses" element={<AllCourses />} />
                    <Route path="/Coordinators" element={<Coordinators />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/Course-Attandance" element={<CourseAttandance />} />
                    <Route path="/Add-course" element={<Add_course />} />
                    <Route path="/Student-Cart" element={<Carts />} />
                    <Route path="/YourCourses" element={<YourCourses />} />
                    <Route path="/Student-Attendance/:pk/:course_title" element={<StdAttendance />} />
                  </Routes>
                </div>
              </div>
            </div>
            <footer className="footer">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-6">
                    {new Date().getFullYear()} © The Sage.
                  </div>
                  <div className="col-sm-6">
                    <div className="text-sm-end d-none d-sm-block">
                      Design & Develop by ❤️
                      <a href="https://www.linkedin.com/in/anuj-choubey-9542a9249/"> Anuj Choubey</a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
