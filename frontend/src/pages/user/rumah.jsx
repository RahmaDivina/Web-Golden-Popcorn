import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Filter from '../../components/Filter';
import MovieGrid from '../../components/MovieGrid';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [sortedMovies, setSortedMovies] = useState([]);
  const [sortBy, setSortBy] = useState('alphabetics-az');
  const [resetFilters, setResetFilters] = useState(false);

  // Fetch semua data film tanpa query pencarian
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/movies/all');
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchMovies();
  }, []);

  // Apply sorting ke seluruh film
  useEffect(() => {
    let sorted = [...movies];

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

    console.log('Fetching filtered movies with:', { genre, country, award, year });

    fetch(`http://localhost:5000/api/movies/?genre=${genre}&country=${country}&award=${award}&year=${year}`)
      .then(response => response.json())
      .then(data => {
        console.log('Filtered movies received:', data);
        setMovies(data);  // Update state movies dengan hasil yang difilter
      })
      .catch(error => {
        console.error('Error fetching filtered movies:', error);
      });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 d-flex">
        <Filter 
          onFilterChange={handleFilterChange} 
          resetFilters={resetFilters} 
          onResetComplete={() => setResetFilters(false)} 
        />
        <div className="col-md-10 mt-3">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
