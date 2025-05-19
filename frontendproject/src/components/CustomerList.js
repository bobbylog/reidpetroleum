import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    phone: '',
    profile_picture: '',
    start_date: '',
    expire_date: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/customer');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


 const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length > 100) {
      newErrors.name = "Name is required and must be under 100 characters.";
    }

    if (
      !formData.email ||
      formData.email.length > 150 ||
      !/^\S+@\S+\.\S+$/.test(formData.email)
    ) {
      newErrors.email = "A valid email is required and must be under 150 characters.";
    }

    if (formData.company_name && (formData.company_name.length > 100 || formData.company_name !== 'Reid Petroleum')) {
      newErrors.company_name = "Company name must be under 100 characters and Must be Reid Petroleum.";
    }

    if (
  formData.phone &&
  (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(formData.phone))
) {
  newErrors.phone = "Phone must match format XXX-XXX-XXXX.";
}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
    return;
  }

  try {
    await axios.post('http://localhost:3000/customer', formData);
    setFormData({
      name: '',
      email: '',
      company_name: '',
      phone: '',
      profile_picture: '',
      start_date: '',
      expire_date: ''
    });
    setErrors({});
    setShowModal(false);
    fetchCustomers();
  } catch (err) {
    console.error("Error adding customer:", err);
    alert("Error adding customer. Please try again.");
  }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/customer/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error('Error deleting customer', err);
    }
  };

const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 5;

const totalPages = Math.ceil(customers.length / rowsPerPage);
const paginatedCustomers = customers.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

const fieldConfigs = {
  name: { type: 'text', maxLength: 100, required: true },
  email: { type: 'email', placeholder: 'email@domain.com',maxLength: 150, required: true },
  company_name: { type: 'text',  maxLength: 100 },
  phone: { type: 'tel', placeholder: '999-999-9999', maxLength: 12, pattern: '^[0-9]{3}-[0-9]{3}-[0-9]{4}$', required: true},
  profile_picture: { type: 'url' },
  start_date: { type: 'date' },
  expire_date: { type: 'date' }
};

  return (
   <div className="container mt-4">
   
    <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
      ➕ Add Customer
    </Button>

    {/* Add Customer Modal */}
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         {Object.keys(fieldConfigs).map((field) => {
    const config = fieldConfigs[field];

    return (
      <div className="mb-2" key={field}>
        <label className="form-label text-capitalize">
          {field.replace('_', ' ')}:
        </label>
        <input
          {...config}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
        />
        {errors[field] && (
          <div className="invalid-feedback d-block">{errors[field]}</div>
        )}
      </div>
    );
  })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
        <Button variant="success" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>

    {/* Customer Table */}
    <table className="table table-bordered table-striped">
      <thead className="table-dark">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Company</th>
          <th>Phone</th>
          <th>Start</th>
          <th>Expire</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedCustomers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.company_name}</td>
            <td>{customer.phone}</td>
            <td>{customer.contract_start_date}</td>
            <td>{customer.contract_expire_date}</td>
            <td>
              <button className="btn btn-sm btn-danger" onClick={() => deleteCustomer(customer.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination */}
    <div className="d-flex justify-content-between align-items-center mt-3">
      <Button
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        ← Prev
      </Button>

      <span>Page {currentPage} of {totalPages}</span>

      <Button
        variant="secondary"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      >
        Next →
      </Button>
    </div>
  </div>
  );
}
