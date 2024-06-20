import { useEffect, useState } from "react";
import axios from "axios";
function CourseOpted(){
    const [student, setStudent] = useState([])

    useEffect(() => {
        const fetchStudentData = async() => {
            try{
                const response = await axios.get(`http://127.0.0.1:8000/all-opt-student/`);
                setStudent(response.data);
                console.log('===', response.data)
            }
            catch (error){
                console.error()
            }
        };
        fetchStudentData();
    } ,[]);

    return(

        <>
        <h1>Courses Opted Students List</h1>
        <div class="row">
            
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Courses Opted Students List</h4>
                    </div>


                    <div class="card-body">
                        <div id="customerList">                         
                            <div class="table-responsive table-card mt-3 mb-1">
                                <table class="table align-middle table-nowrap" id="customerTable">
                                    <thead class="table-light">
                                        <tr>
                                            <th scope="col">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="checkAll" value="option" />
                                                </div>
                                            </th>

                                            <th class="sort" data-short="">S. No</th>
                                            <th class="sort" data-sort="Student_detail">Student Detail</th>
                                            <th class="sort" data-sort="Category">Course Name</th>
                                            <th class="sort" data-sort="date">Start | End Date</th>
                                            <th class="sort" data-sort="status">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody class="list form-check-all">
                                        <tr>
                                            <th scope="row">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" name="chk_child" value="option1" />
                                                </div>
                                            </th>
                                            <td class="id" ><a class="fw-medium link-primary">1</a></td>
                                            <td class="customer_name">a</td>
                                            <td class="email">a</td>
                                            <td class="status"><span class="badge badge-soft-success text-uppercase">Active</span></td>
                                            <td class="status"><span class="badge rounded-pill badge-outline-primary">Statuc</span></td>
                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="d-flex justify-content-end">
                                <div class="pagination-wrap hstack gap-2">
                                    <a class="page-item pagination-prev disabled" href="#">
                                        Previous
                                    </a>
                                    <ul class="pagination listjs-pagination mb-0"></ul>
                                    <a class="page-item pagination-next" href="#">
                                        Next
                                    </a>
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


export default CourseOpted;