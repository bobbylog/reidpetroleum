import React from 'react';
import CustomerList from './components/CustomerList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: '200px' }}>
        <h4 className="text-center">Reid Petroleum</h4>
        <ul className="nav flex-column mt-4">
          <li className="nav-item">
            <span className="nav-link active text-white">Home</span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        <h2>Customer Directory</h2>
        <CustomerList />
      </div>
    </div>
  );
}

export default App;
