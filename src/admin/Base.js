import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../useAuth";
import axios from "axios";
const Base = () => {
  const { logout, role: authRole } = useAuth();
  const [sessionRole, setSessionRole] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenSize, setScreenSize] = useState("lg");
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const screenWidth = window.innerWidth;
      setScreenSize(screenWidth <= 768 ? "sm" : "lg");
      if (screenWidth <= 768) {
        document.body.classList.add("twocolumn-panel");
      } else {
        document.body.classList.remove("twocolumn-panel");
      }
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleCloseButtonClick = () => {
    document.body.classList.remove("vertical-sidebar-enable");
  };

  
  const renderHamburgerButton = () => {
    if (screenSize === "lg") {
      return (
        <button
          type="button"
          className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
          id="topnav-hamburger-icon"
          onClick={toggleMenuLg}
        >
          <span className={`hamburger-icon ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
          id="topnav-hamburger-icon"
          onClick={toggleMenuSm}
        >
          <span className="hamburger-icon ">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      );
    }
  };

  const toggleMenuSm = () => {
    setIsMenuOpen(!isMenuOpen);
    if (screenSize === "sm") {
      document.body.classList.toggle("vertical-sidebar-enable");
    }
  };

  const toggleMenuLg = () => {
    setIsMenuOpen(!isMenuOpen);
    updateSidebarSize("lg");
  };

  const updateSidebarSize = () => {
    const htmlElement = document.querySelector("html");
    const currentSize = htmlElement.getAttribute("data-sidebar-size");
    const newSize = currentSize === "lg" ? "sm" : "lg";
    htmlElement.setAttribute("data-sidebar-size", newSize);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    const uname = sessionStorage.getItem("uname");
    const gender = sessionStorage.getItem("gender");
    const userid = sessionStorage.getItem("userid");
    const vertical = sessionStorage.getItem('vertical');
    setSessionRole(userRole);
    // console.log("======================", uname, userRole, gender);
  }, []);

  const deleteUser = async () => {
    try {
      const user_id = sessionStorage.getItem("userid");
      await axios.delete(`http://127.0.0.1:8000/delete-user/${user_id}/`);
      logout();
    } catch (error) {
      setDeleteError(error.message);
    }
  };
  return (
    <>
      <header id="page-topbar">
        <div class="layout-width">
          <div class="navbar-header">
            <div class="d-flex">
              <div class="navbar-brand-box horizontal-logo">
                <a class="logo logo-dark">
                  <span class="logo-sm">
                    <img src="ass ets/ima ges/logo-sm.png" alt="" height="22" />
                  </span>
                  <span class="logo-lg">
                    <img src="ass ets/ima ges/logo-dark.png" alt="" height="17" />
                  </span>
                </a>
                <a  class="logo logo-light">
                  <span class="logo-sm">
                    <img src="ass ets/ima ges/logo-sm.png" alt="" height="22" />
                  </span>
                  <span class="logo-lg">
                    <img
                      src="ass ets/ima ges/logo-light.png"
                      alt=""
                      height="17"
                    />
                  </span>
                </a>
              </div>
              {renderHamburgerButton()}
            </div>
            <div class="d-flex align-items-center">
              {/* <div class="ms-1 header-item d-none d-sm-flex">
                <button
                  type="button"
                  class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode shadow-none"
                >
                  <i class="bx bx-moon fs-22"></i>
                </button>
              </div> */}

              <div class="dropdown ms-sm-3 header-item topbar-user">
                <button
                  type="button"
                  class="btn shadow-none"
                  id="page-header-user-dropdown"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span class="d-flex align-items-center">
                    {sessionStorage.getItem("gender") === "F" && (
                      <img
                        class="rounded-circle header-profile-user"
                        src="assets/images/users/avatar-1.jpg"
                        alt="Male Avatar"
                      />
                    )}
                    {sessionStorage.getItem("gender") === "M" && (
                      <img
                        class="rounded-circle header-profile-user"
                        src="assets/images/users/avatar-3.jpg"
                        alt="Female Avatar"
                      />
                    )}
                    <span class="text-start ms-xl-2">
                      <span class="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                        {sessionStorage.getItem("uname")}
                      </span>
                      {sessionStorage.getItem("userRole") === "1" && (
                        <span class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                          Student
                        </span>
                      )}
                      {sessionStorage.getItem("userRole") === "2" && (
                        <span class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                          Admin
                        </span>
                      )}
                      {sessionStorage.getItem("userRole") === "0" && (
                        <span class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                          Coordinator
                        </span>
                      )}
                    </span>
                  </span>
                </button>
                <div class="dropdown-menu dropdown-menu-end">
                  <h6 class="dropdown-header">
                    Welcome {sessionStorage.getItem("uname")} !
                  </h6>
                  {/* <a class="dropdown-item" href="pages-profile.html">
                                        <i class="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
                                        <span class="align-middle">Profile</span>
                                    </a> */}
                  <a class="dropdown-item" onClick={handleLogout}>
                    <i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                    <span class="align-middle" data-key="t-logout">
                      Logout
                    </span>
                  </a>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="app-menu navbar-menu">
        <div class="navbar-brand-box">
          <a class="logo logo-dark">
            <span class="logo-sm">
              <img src="as sets/im ages/logo-sm.png" alt="" height="22" />
            </span>
            <span class="logo-lg">
              <img src="ass ets/ima ges/logo-dark.png" alt="" height="17" />
            </span>
          </a>

          <a href="index-2.html" class="logo logo-light">
            <span class="logo-sm">
              <img src="ass ets/imag es/logo-sm.png" alt="" height="22" />
            </span>
            <span class="logo-lg">
              <img src="as sets/imag es/logo-light.png" alt="" height="17" />
            </span>
          </a>
          <button
            type="button"
            class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i class="ri-record-circle-line"></i>
          </button>
        </div>
        <div id="scrollbar">
          <div class="container-fluid">
            <div id="two-column-menu"></div>
            <ul class="navbar-nav" id="navbar-nav">
              {/* Role 0 means coordinator */}
              {(sessionRole === "0" || sessionRole === 0) && (
                <>
                  <li class="menu-title">
                    <span data-key="t-menu">User Dashboard</span>
                    {screenSize === "sm" && (
                      <button class="btn-close" aria-label="Close" onClick={handleCloseButtonClick}></button>
                    )}{" "}
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Dashboard" class="nav-link menu-link">
                      <i class="ri-home-fill"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  
                  {/* <li class="nav-item">
                      <Link class="nav-link menu-link" to="/Student-Attendance"  >
                          <i class="mdi mdi-calendar-month"></i>
                          <span> Courses Attendance</span>
                      </Link>
                  </li> */}

                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Holidays-list" class="nav-link menu-link">
                      <i class="mdi mdi-calendar-month"></i>
                      <span>Holiday List</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Add-course" class="nav-link menu-link">
                      <i class="mdi mdi-calendar-month"></i>
                      <span>Add Course</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Your-courses" class="nav-link menu-link">
                      <i class="mdi mdi-calendar-month"></i>
                      <span>Your Courses</span>
                    </Link>
                  </li>
                </>
              )}
              {/* Role 2 means Admin */}
              {(sessionRole === "2" || sessionRole === 2) && (
                <>
                  <li class="menu-title">
                    <span data-key="t-menu">User Dashboard</span>
                    {screenSize === "sm" && (
                      <button class="btn-close" aria-label="Close" style={{ backgroundColor : 'white', fontSize: '17px', marginLeft: '51px' }} onClick={handleCloseButtonClick}></button>
                      )}{" "}
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Dashboard" class="nav-link menu-link">
                      <i class="ri-home-fill"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Course-Approval" class="nav-link menu-link">
                      <i class="mdi mdi-speedometer"></i>
                      <span>Courses Action</span>
                    </Link>
                  </li>

                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Holidays-list" class="nav-link menu-link">
                      <i class="mdi mdi-calendar-month"></i>
                      <span>Holiday List</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link class="nav-link menu-link" to="/Course-Attandance">
                      <i class="mdi mdi-calendar-month"></i>
                      <span> Courses Attendance</span>
                    </Link>
                  </li>

                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link class="nav-link menu-link" to="/Pymnt-Com">
                      <i class="mdi mdi-view-grid-plus-outline"></i>
                      <span>Payment Complete Student List</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link class="nav-link menu-link" to="/Pymnt-not-Com">
                      <i class="bx bxs-badge-dollar"></i>
                      <span>Payment Not Complete Student List</span>
                    </Link>
                  </li>

                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link class="nav-link menu-link" to="/Course-Opted">
                      <i class="ri-clipboard-line"></i>
                      <span>Courses opted list</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link class="nav-link menu-link" to="/All-Courses">
                      <i class="ri-align-justify"></i>
                      <span> All Courses Status</span>
                    </Link>
                  </li>

                  <ul class="navbar-nav" id="navbar-nav">
                    <li class="menu-title">
                      <span>Coordinators</span>
                    </li>
                    <Link to="/Coordinators" class="nav-link menu-link" onClick={handleCloseButtonClick}>
                      <i class="ri-user-line"></i>
                      <span>Coordinator</span>
                    </Link>
                  </ul>
                </>
              )}

              {/* Role 1 means Student */}

              {(sessionRole === "1" || sessionRole === 1) && (
                <>
                  <li class="menu-title">
                    <span data-key="t-menu">User Dashboard</span>
                    {screenSize === "sm" && (
                      <button onClick={handleCloseButtonClick}>Close</button>
                    )}{" "}
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Dashboard" class="nav-link menu-link">
                      <i class="ri-home-fill"></i>
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/All-Courses" class="nav-link menu-link">
                      <i class="ri-list-check"></i>
                      <span> All Courses </span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/Student-Cart" class="nav-link menu-link">
                      <i class="ri-grid-fill"></i>
                      <span>Your Carts</span>
                    </Link>
                  </li>
                  <li class="nav-item" onClick={handleCloseButtonClick}>
                    <Link to="/YourCourses" class="nav-link menu-link">
                      <i class="ri-grid-fill"></i>
                      <span>Your Courses</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
        <div class="sidebar-background"></div>
        
      </div>
    </>
  );
};
export default Base;
