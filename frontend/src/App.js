import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Typography,
  Alert,
  Box,
  CssBaseline,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {
  const [movie, setMovie] = useState('');
  const [moviesList, setMoviesList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#90caf9' : '#1976d2',
      },
      background: {
        default: darkMode ? '#121212' : '#f4e4e3',
      },
    },
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:5000/movies');
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMoviesList(data.movies);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, []);

  const handleSelectMovie = async (selectedMovie) => {
    setMovie(selectedMovie);

    if (!selectedMovie) {
      setRecommendations([]);
      setErrorMsg('');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/recommend?movie=${selectedMovie}`);
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Error occurred while fetching recommendations');
        setRecommendations([]);
      } else {
        const data = await response.json();
        setRecommendations(data.recommended);
        setErrorMsg('');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Could not connect to the server');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
          }
          label={darkMode ? 'Light Mode' : 'Dark Mode'}
        />
      </Box>

      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Movie Recommendation System
        </Typography>

        <Autocomplete
          freeSolo
          options={moviesList}
          onInputChange={(event, value) => setMovie(value)}
          onChange={(event, value) => handleSelectMovie(value)}
          renderInput={(params) => (
            <TextField {...params} label="Enter a movie you like" variant="outlined" />
          )}
        />

        {errorMsg && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {recommendations.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Recommended Movies:</Typography>
            <Box sx={{ mt: 2 }}>
              {recommendations.map((recMovie, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(recMovie)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: darkMode ? '#90caf9' : '#1976d2' }}
                  >
                    {recMovie}
                  </a>
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
