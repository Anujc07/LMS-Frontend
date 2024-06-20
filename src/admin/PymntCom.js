function PymntCom(){
    return(
        <>
        <h1>Payment Complete</h1>
        <div class="row">
            
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Add, Edit & Remove</h4>
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
                                            <th class="sort" data-sort="Course_name">Student Details</th>
                                            <th class="sort" data-sort="Category">Course Name</th>
                                            <th class="sort" data-sort="Coordinators_name">Payment Ref Num / Date</th>
                                            <th class="sort" data-sort="date">Start | End Date</th>
                                            <th class="sort" data-sort="status">Status</th>
                                            <th class="sort" data-sort="action">Action</th>
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
                                            <td class="phone">0000000</td>
                                            <td class="date">06 Apr, 2021</td>
                                            <td class="status"><span class="badge rounded-pill badge-outline-primary">Statuc</span></td>
                                            <td>
                                                <div class="d-flex gap-2">                                                    
                                                    <div class="remove">
                                                        <button class="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" data-bs-target="#deleteRecordModal">Remove</button>
                                                    </div>
                                                </div>
                                            </td>
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


export default PymntCom;