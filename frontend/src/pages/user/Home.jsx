import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import MovieGrid from '../../components/MovieGridHome';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Slider from "react-slick";


const HomePage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]); // State untuk menyimpan 10 film populer
  const [sortedMovies, setSortedMovies] = useState([]);
  const [sortBy, setSortBy] = useState('alphabetics-az');
  const [resetFilters, setResetFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20;


  useEffect(() => {
    // Dapatkan token dari query parameter di URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');


    if (token) {
      // Simpan token di localStorage
      localStorage.setItem('UserToken', token);

      // Setelah menyimpan token, hilangkan query parameter dari URL
      window.location.href = 'http://localhost:3000/home'; // Redirect tanpa query parameters
    }
  }, [navigate]);

  // Fetch semua data film tanpa query pencarian
  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     try {
  //       const res = await fetch('http://localhost:5000/api/movies/all');
  //       const data = await res.json();
  //       setMovies(data);
  //     } catch (err) {
  //       console.error(err.message);
  //     }
  //   };

  //   fetchMovies(currentPage);
  // }, [currentPage]);

  const fetchMovies = async (page) => {
    try {
      // Mengambil data film dari API, dengan query parameter page dan limit
      const res = await fetch(`http://localhost:5000/api/movies/all?page=${page}&limit=${moviesPerPage}`);
      const data = await res.json(); // Mengubah respons API menjadi JSON
      console.log('Fetched movies:', data);
      setMovies(data); // Update state movies dengan data baru
      setTopMovies(data.slice(0, 10)); // Simpan 10 film teratas untuk slider
    } catch (err) {
      console.error('Error fetching movies:', err); // Menangani error
    }
  };

  // Ketika currentPage berubah, panggil useEffect untuk mengambil data film
  useEffect(() => {
    fetchMovies(currentPage); // Ambil film sesuai halaman saat ini
  }, [currentPage]);

  // Apply sorting ke seluruh film
  useEffect(() => {

    // Hapus duplikasi berdasarkan id_movie
    const uniqueMovies = movies.filter(
      (movie, index, self) =>
        index === self.findIndex((m) => m.id_movie === movie.id_movie)
    );

    let sorted = [...uniqueMovies];

    if (sortBy === 'alphabetics-az') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'alphabetics-za') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'year-asc') {
      sorted.sort((a, b) => a.year - b.year);
    } else if (sortBy === 'year-desc') {
      sorted.sort((a, b) => b.year - a.year);
    }

    setSortedMovies(sorted);
  }, [movies, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterChange = (filters) => {  
    const { genre, country, award, year } = filters;

    fetch(`http://localhost:5000/api/movies/?genre=${genre}&country=${country}&award=${award}&year=${year}`)
      .then(response => response.json())
      .then(data => {
        setMovies(data);  // Update state movies dengan hasil yang difilter
      })
      .catch(error => {
        console.error('Error fetching filtered movies:', error);
      });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1); // Kurangi currentPage untuk kembali ke halaman sebelumnya
    }
  };

  // Fungsi untuk menambahkan movie ke watchlist
  const handleAddWatchlist = (movie) => {
    const token = localStorage.getItem('userToken');

    if (!token) {
        // Jika belum login, redirect ke halaman login
        window.location.href = '/login'; 
        return;
    }

    // Jika sudah login, kirim request ke API untuk menambahkan movie ke watchlist
    fetch('/api/watchlist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId: movie.id })
    })
    .then(response => {
        if (response.ok) {
            // Tampilkan notifikasi (di sini menggunakan alert, tapi di aplikasi nyata bisa gunakan React-Toastify atau modal popup)
            alert(`${movie.title} has been added to your watchlist.`);
        } else {
            // Tampilkan error jika gagal
            alert('Failed to add movie to watchlist. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error adding movie to watchlist:', error);
        alert('An error occurred. Please try again later.');
    });
};

const goToDetailPage = (title) => {
    const encodedTitle = encodeURIComponent(title); // Encode title
    navigate(`/movie/title/${encodedTitle}`); // Navigasi ke halaman detail film dengan id
};

  // Pengaturan untuk slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6, // Menampilkan 4 film sekaligus
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="main-container flex-grow-1 d-flex">
        <div className="filter-section col-md-3">
          <Filter
            onFilterChange={handleFilterChange}
            resetFilters={resetFilters} 
            onResetComplete={() => setResetFilters(false)}
          />
        </div>

        <div className="movie-grid-section col-md-9 mt-3">
          <h2>Top 10 Popular Movies</h2>
          <Slider {...sliderSettings}>
            {topMovies.map((movie) => (
              <div key={movie.id_movie} className="movie-slide">
                <img 
                  src={movie.poster || '/images/default-movie.png'} 
                  alt={movie.title} 
                  className="movies-image img-fluid rounded"
                  style={{ cursor: 'pointer' }}  
                  onClick={() => goToDetailPage(movie.title)}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = '/images/default-movie.png'; 
                  }}
                />
                <div className="btn-wrapper">
                  <button className="btn-add-watchlist" onClick={() => handleAddWatchlist(movie)}>
                    Add Watchlist
                  </button>
                  <button className="btn-trailer" onClick={() => window.open(movie.trailer, '_blank')}>
                    Trailer
                  </button>
                </div>
                <h5 className="movies-title mt-2">
                  {movie.title}
                </h5>
              </div>
            ))}
          </Slider>

          {/* Bagian All Movies */}
          <div className="all-movies-section mt-3">
            <h2>All Movies</h2> 
            <div className="d-flex justify-content-end gap-2 align-items-center mb-3">
              <label htmlFor="sort" className="form-label mb-0">Sorted by:</label>
              <select id="sort" className="form-select w-auto" value={sortBy} onChange={handleSortChange}>
                <option value="alphabetics-az">Alphabetics A-Z</option>
                <option value="alphabetics-za">Alphabetics Z-A</option>
                <option value="rating">Rating</option>
                <option value="year-asc">Year (Oldest to Newest)</option>
                <option value="year-desc">Year (Newest to Oldest)</option>
              </select>
            </div>
            <MovieGrid movies={sortedMovies} />
            {/* Tombol Pagination */}
            <div className="d-flex justify-content-center gap-2 align-items-center mb-3">
              <Button className="btn-golden" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <span>Page {currentPage}</span>
              <Button className="btn-golden" onClick={handleNextPage}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;


