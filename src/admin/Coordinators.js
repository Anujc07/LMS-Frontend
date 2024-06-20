import axios from 'axios';
import { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';

function Coodinators() {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [csrfToken, setCsrfToken] = useState('');
    const [coordata, setCoorData] = useState([])
    const [formValue, setFormValue] = useState({
        uname: '', fname: '', phonenum: '', vertical: '', email: '', gender: '', role: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);
    const [coordID, setCoordId] = useState(null)
    const [selectedstatus, setSelectedStatus] = useState('')
    useEffect(() => {
        async function fetchCsrfToken() {
            const response = await axios.get('http://127.0.0.1:8000/csrf_cookie/');
            const csrfToken = response.data.csrfToken;
            setCsrfToken(csrfToken);
        }

        fetchCsrfToken();
    }, []);
    const handleChange = (e) => {
        setFormValue({
            ...formValue,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        };
        try {
            const response = await axios.post('http://127.0.0.1:8000/coordinator/add-coordinator', formValue, { headers });
            if (response.data.uname && response.data.uname.length > 0) {
                // User name already exists, set the error message
                setSuccessMessage(response.data.uname[0]);
                setTimeout(() => setSuccessMessage(''), 5000);
            } else {
                setSuccessMessage("Coordinator added successfully!");
                setTimeout(() => setSuccessMessage(''), 5000); 
                setCoorData(prevData => [...prevData, response.data.data]);
                setFormValue({
                    uname: '', fname: '', phonenum: '', vertical: '', email: '', gender: '', role: 0,
                });
            }
        } catch (error) {
            if (error.response) {
                console.error('Server responded with error status:', error.response.status);
                console.error('Error response data:', error.response.data);
                if (error.response.data && error.response.data.uname && error.response.data.uname.length > 0) {
                    setErrorMessage("This Name already taken");
                    setTimeout(() => setErrorMessage(''), 5000);
                }
            } else if (error.request) {
                setErrorMessage(error.request);
                // console.error('No response received from server:', error.request);
            } else {
                setErrorMessage(error.message);
                // console.error('Error setting up request:', error.message);
            }
        }
    };
    
    

    

    useEffect(() => {
        const fetchCoordinatorData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/coordinator/coordinator-data');
                setCoorData(response.data.data);
                // console.log("data", response.data.data);
            } catch (error) {
                setErrorMessage(error);
                // console.error('Error fetching coordinator data:', error);
            }
        };

        fetchCoordinatorData();
    }, []);



    
    const handleDelete = async () => {
        if (userToDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/delete-user/${userToDelete}/`);
                setCoorData(prevData => prevData.filter(coordinator => coordinator.id !== userToDelete));
                // console.log('Coordinator deleted successfully');
            } catch (error) {
                setErrorMessage(error);
                // console.error('Error deleting coordinator:', error);
            }
        }
    };

    // const handleStatus = async () => {
    //     if (coordID) {
    //         try {
    //             const response = await axios.put(`http://127.0.0.1:8000/coord-status-update/${coordID}/${selectedstatus}/`);
    //             //Update the status in coordata state
    //             const updatedCoorData = coordata.map(coordinator => {
    //                 if (coordinator.id === coordID) {
    //                     return {
    //                         ...coordinator,
    //                         status: selectedstatus 
    //                     };
    //                 }
    //                 return coordinator;
    //             });
    //             setCoorData(updatedCoorData);
    //         } catch (error) {
    //             // console.error('Error updating coordinator status:', error);
    //         }
    //     }
    // };
    const handleStatus = async () => {
        if (coordID) {
            try {
                console.log(`Updating status for coordinator ID: ${coordID} to status: ${selectedstatus}`);
                const response = await axios.put(`http://127.0.0.1:8000/coord-status-update/${coordID}/${selectedstatus}/`);
    
                // Check if the response is successful and contains the updated status
                if (response.status === 200) {
                    const updatedCoorData = coordata.map(coordinator => {
                        if (coordinator.id === coordID) {
                            return {
                                ...coordinator,
                                status: parseInt(selectedstatus, 10) 
                                
                            };
                        }
                        return coordinator;
                    });
                    setCoorData(updatedCoorData);
                    // console.log(`Coordinator status updated successfully`);
                } else {
                    // console.error('Failed to update status:', response);
                }
            } catch (error) {
                // console.error('Error updating coordinator status:', error);
                setErrorMessage('Failed to update status');
                setTimeout(() => setErrorMessage(''), 5000);
            }
        }
    };
    



    const [currentPage, setCurrentPage] = useState(1);
    const coordinatorsPerPage = 5;
    const indexOfLastCoordinator = currentPage * coordinatorsPerPage;
    const indexOfFirstCoordinator = indexOfLastCoordinator - coordinatorsPerPage;
    const filteredCoordinators = searchTerm
    ? coordata.filter(coordinator => coordinator.uname.toLowerCase().includes(searchTerm.toLowerCase()))
    : coordata;
    const currentCoordinators = filteredCoordinators.slice(indexOfFirstCoordinator, indexOfLastCoordinator);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div class="row">
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorMessage}
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            )}
            <div class="col-lg-12">
                <div class="card">
                    {/* <div class="card-header">
                        <h4 class="card-title mb-0"></h4>
                    </div> */}
                    <div class="card-body">
                        <div id="customerList">
                            <div class="row g-4 mb-3">
                                <div class="col-sm-auto">
                                    <div>
                                        <button type="button" class="btn btn-success add-btn" data-bs-toggle="modal" id="create-btn" data-bs-target="#showModal"><i class="ri-add-line align-bottom me-1"></i> Add Coodinator</button>
                                    </div>
                                </div>
                                <div class="col-sm">
                                    <div class="d-flex justify-content-sm-end">
                                        <div class="search-box ms-2">
                                            <input
                                                type="text"
                                                className="form-control search"
                                                placeholder="Search by name..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />                                            
                                            <i class="ri-search-line search-icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="table-responsive table-card mt-3 mb-1">
                                <table class="table align-middle table-nowrap" id="customerTable">
                                    <thead class="table-light">
                                        <tr>

                                            <th class="" >S No</th>
                                            <th class="" >Session</th>
                                            <th class="" >Coord Details</th>
                                            <th class="" >Father Name</th>
                                            <th class="" >Status</th>
                                            <th class="" >Action</th>

                                        </tr>
                                    </thead>
                                    <tbody class="list form-check-all">
                                        {currentCoordinators.map((coordinator, index) => (
                                            <tr key={index}>

                                                <td className="id"><a className="fw-medium link-primary">{(currentPage - 1) * coordinatorsPerPage + index + 1}</a></td>
                                                <td class="session">Summer School 2024</td>
                                                <td class="coord_details">
                                                    {coordinator.uname}<br /> {coordinator.phonenum}<br /> {coordinator.vertical}
                                                </td>

                                                <td class="f_name">{coordinator.fname}</td>
                                                <td class="status">
                                                <span className={`badge rounded-pill badge-outline-primary ${coordinator.status === 1 ? 'badge-outline-success' : 'badge-outline-danger'}`}>
                                                    {coordinator.status === 1 ? 'Active' : 'Inactive'}
                                                </span>
                                                </td>
                                                <td>
                                                    <div class="d-flex mb-2 gap-2">                                                       
                                                            <button class="btn btn-sm btn-danger remove-item-btn" data-bs-toggle="modal" onClick={() => setUserToDelete(coordinator.id)} data-bs-target="#deleteRecordModal">Remove</button>
                                                    </div>
                                                    <div class="d-flex  gap-2">                                                       
                                                            <button class="btn btn-sm btn-success remove-item-btn" data-bs-toggle="modal" onClick={() => setCoordId(coordinator.id)} data-bs-target="#statusmodal">Status</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div class="d-flex justify-content-end">
                                <Pagination>
                                    <Pagination.Prev onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))} />
                                    {Array.from({ length: Math.ceil(coordata ? coordata.length / coordinatorsPerPage : 0) }, (_, i) => (
                                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(coordata.length / coordinatorsPerPage)))} />
                                </Pagination>

                            </div>
                        </div>
                    </div>

                </div>
                <div className="modal fade" id="statusmodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header bg-light p-3">
                                    <h5 className="modal-title" id="exampleModalLabel"></h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close-modal"></button>
                                </div>
                                <form>
                                    <div className="modal-body">
                                        <div>
                                            <label htmlFor="status-field" className="form-label">Status</label>
                                            <select className="form-control" data-trigger name="status" value={selectedstatus} onChange={(e)=> setSelectedStatus(e.target.value)}>
                                                <option value="">Status</option>
                                                <option value="1">Active</option>
                                                <option value="0">Unactive</option>        
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <div className="hstack gap-2 justify-content-end">
                                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleStatus}>Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                <div class="modal fade" id="showModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header bg-light p-3">
                                <h5 class="modal-title" id="exampleModalLabel"></h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="close-modal"></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div class="modal-body">

                                    <div class="mb-3">
                                        <label for="coordinator-name" class="form-label">Coordinator Name</label>
                                        <input type="text" name="uname" class="form-control" value={formValue.uname} onChange={handleChange} placeholder="Enter Name" required />
                                    </div>

                                    <div class="mb-3">
                                        <label for="father-field" class="form-label">Coordinator Father`s Name</label>
                                        <input type="text" name="fname" class="form-control" value={formValue.fname} onChange={handleChange} placeholder="Enter Father`s Name" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="mail-field" class="form-label">Coordinator Mail ID</label>
                                        <input type="email" name="email" class="form-control" value={formValue.email} onChange={handleChange} placeholder="Enter Mail Id" required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="phone-field" class="form-label">Phone</label>
                                        <input type="text" name="phonenum" class="form-control" value={formValue.phonenum} onChange={handleChange} placeholder="Enter Phone no." required />
                                    </div>
                                    <div class="mb-3">
                                        <label for="status-field" class="form-label">Gender</label>
                                        <select class="form-control" data-trigger name="gender" value={formValue.gender} onChange={handleChange} id="status-field">
                                            <option value="">Please Select Gender</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>

                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="status-field" class="form-label">Status</label>
                                        <select class="form-control" name="vertical" value={formValue.vertical} onChange={handleChange} id="status-field">
                                            <option value="">Please Select Your Vertical</option>
                                            <option value="SUB">SUB</option>
                                            <option value="SUI">SUI</option>
                                            <option value="SIRT">SIRT</option>
                                            <option value="SIRTE">SIRTE</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <div class="text-end">
                                            <button type="submit" class="btn btn-success btn-label waves-effect right waves-light rounded-pill"  data-bs-dismiss="modal"><i class="ri-check-double-line label-icon align-center rounded-pill fs-16 ms-2"></i> Add</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal fade zoomIn" id="deleteRecordModal" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="btn-close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mt-2 text-center">
                                    <lord-icon src="https://cdn.lordicon.com/gsqxdxog.json" trigger="loop" ></lord-icon>
                                    <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
                                        <h4>Are you Sure ?</h4>
                                        <p class="text-muted mx-4 mb-0">Are you Sure You want to Remove this Record ?</p>
                                    </div>
                                </div>
                                <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
                                    <button type="button" class="btn w-sm btn-light" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn w-sm btn-danger " onClick={handleDelete} data-bs-dismiss="modal">Yes, Delete It!</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Coodinators;
