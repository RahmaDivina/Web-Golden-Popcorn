import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal";

const Country = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState("");

  // Mengambil data country dari API saat komponen dimuat
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fungsi untuk mengambil data country
  const fetchCountries = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Fungsi untuk menambah country baru
  const handleAddCountry = async () => {
    if (newCountry.trim() !== "") {
      try {
        const response = await fetch('http://localhost:5000/api/countries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCountry, isDefault: false })
        });
        const data = await response.json();
        setCountries([...countries, data]);
        setNewCountry("");
      } catch (error) {
        console.error("Error adding country:", error);
      }
    }
  };

  // Fungsi untuk membuka modal edit
  const handleEditClick = (country) => {
    setSelectedCountry(country);
    setShowModal(true);
  };  

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCountry(null);
  };

  // Fungsi untuk menyimpan perubahan pada country
  const handleSaveChanges = async () => {
    try {
      await fetch(`http://localhost:5000/api/countries/${selectedCountry.id_country}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedCountry.name,
          isDefault: selectedCountry.is_default
        })
      });
      fetchCountries(); // Ambil ulang data setelah update
      handleCloseModal();
    } catch (error) {
      console.error("Error updating country:", error);
    }
  };

  // Fungsi untuk menghapus country
  const handleDeleteCountry = async (country) => {
    try {
      await fetch(`http://localhost:5000/api/countries/${country.id_country}`, {
        method: 'DELETE'
      });
      setCountries(countries.filter(c => c.id_country !== country.id_country));
    } catch (error) {
      console.error("Error deleting country:", error);
    }
  };

  // Filter data country berdasarkan search term
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-box">
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box">    
        <div className="mt-4 mb-4">
          <h3 style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '29px' }}>CMS Country</h3>
        </div>

        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value)}
            style={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "#C6A628",
              padding: "10px 20px",
              color: "#000000",
              marginRight: "10px"
            }}
            placeholder="Enter new country"
          />
          <button
            className="btn btn-primary"
            style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }}
            onClick={handleAddCountry}
          >
            Submit
          </button>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>No</th>
                <th>Countries</th>
                <th>Default</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country, index) => (
                <tr key={country.id_country}>
                  <td>{index + 1}</td>
                  <td>{country.name}</td>
                  <td>
                    <input
                      type="radio"
                      name="defaultCountry"
                      checked={country.is_default}
                      onChange={() => {
                        const updatedCountries = countries.map(c =>
                          c.id_country === country.id_country
                            ? { ...c, is_default: true }
                            : { ...c, is_default: false }
                        );
                        setCountries(updatedCountries);
                        setSelectedCountry({ ...country, is_default: true });
                      }}
                    />
                  </td>
                  <td>
                    <a
                      href="#"
                      className="text-primary me-2"
                      onClick={() => handleEditClick(country)}
                    >
                      Edit
                    </a>
                    <span>| </span>
                    <a
                      href="#"
                      className="text-danger"
                      onClick={() => handleDeleteCountry(country)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="editCountry" className="form-label">
                Country Name
              </label>
              <input
                type="text"
                id="editCountry"
                className="form-control"
                value={selectedCountry?.name || ""}
                onChange={(e) =>
                  setSelectedCountry({ ...selectedCountry, name: e.target.value })
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Country;
