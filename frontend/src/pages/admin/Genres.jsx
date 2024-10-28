import React, { useState, useEffect } from "react";
import Sidebar from '../../components/Sidebar';
import '../../styles/Actor.css';
import '../../styles/detail.css';
import Modal from "react-bootstrap/Modal";

const Genres = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newGenre, setNewGenre] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);

  // Mengambil data genre dari API saat komponen dimuat
  useEffect(() => {
    fetchGenres();
  }, []);

  // Fungsi untuk mengambil data genre
  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  // Fungsi untuk menambah genre baru
  const handleAddGenre = async () => {
    if (newGenre.trim() !== "") {
      try {
        const response = await fetch('http://localhost:5000/api/genres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newGenre })
        });
        const data = await response.json();
        setGenres([...genres, data]); // Tambahkan genre baru ke state
        setNewGenre("");
      } catch (error) {
        console.error("Error adding genre:", error);
      }
    }
  };

  // Fungsi untuk membuka modal edit
  const handleEditClick = (genre) => {
    setSelectedGenre(genre);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGenre(null);
  };

  // Fungsi untuk menyimpan perubahan pada genre
  const handleSaveChanges = async () => {
    try {
      await fetch(`http://localhost:5000/api/genres/${selectedGenre.id_genre}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedGenre.name })
      });
      fetchGenres(); // Ambil ulang data genre setelah update
      handleCloseModal();
    } catch (error) {
      console.error("Error updating genre:", error);
    }
  };

  // Fungsi untuk menghapus genre
  const handleDeleteGenre = async (genre) => {
    try {
      await fetch(`http://localhost:5000/api/genres/${genre.id_genre}`, {
        method: 'DELETE'
      });
      setGenres(genres.filter(g => g.id_genre !== genre.id_genre)); // Update state dengan menghapus genre yang terhapus
    } catch (error) {
      console.error("Error deleting genre:", error);
    }
  };

  // Filter data genre berdasarkan search term
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-box d-flex">
      <aside id="filterAside">
        <Sidebar />
      </aside>

      <div className="content-box" style={{ width: "100%" }}>
        <div className="mt-4 mb-4">
          <h3 className style={{ color: '#FFFFFF', fontFamily: 'Plus Jakarta Sans', fontSize: '27px' }}>CMS Genres</h3>
        </div>

        <div className="d-flex justify-content-start mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: "10px", backgroundColor: "#FFFFFF", border: "#C6A628", padding: "10px 20px", color: "#000000", marginRight: "10px", width: "250px" }}
            placeholder="Search"
          />
          <button className="btn btn-primary" style={{ backgroundColor: "#C6A628", borderColor: "#C6A628", marginRight: "10px" }}>Search</button>
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            style={{ borderRadius: "10px", backgroundColor: "#FFFFFF", border: "#C6A628", padding: "10px 20px", color: "#000000", marginRight: "10px", width: "250px" }}
            placeholder="Add new genre"
          />
          <button className="btn btn-primary" style={{ backgroundColor: "#C6A628", borderColor: "#C6A628" }} onClick={handleAddGenre}>Submit</button>
        </div>

        <div className="table-responsive mt-4">
          <table className="table-box">
            <thead>
              <tr>
                <th>No</th>
                <th>Genres</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGenres.map((genre, index) => (
                <tr key={genre.id_genre}>
                  <td>{index + 1}</td>
                  <td>{genre.name}</td>
                  <td>
                    <a href="#" className="text-primary me-2" onClick={() => handleEditClick(genre)}>Edit</a>
                    <span>| </span>
                    <a href="#" className="text-danger" onClick={() => handleDeleteGenre(genre)}>Delete</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Genre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="editGenre" className="form-label">Genre Name</label>
              <input
                type="text"
                id="editGenre"
                className="form-control"
                value={selectedGenre?.name || ""}
                onChange={(e) => setSelectedGenre({ ...selectedGenre, name: e.target.value })}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
          <button className="btn btn-primary" onClick={handleSaveChanges}>Save Changes</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Genres;
