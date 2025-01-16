# Movie Recommendation System

A content-based movie recommendation system built using Flask (backend) and React (frontend). This project leverages movie metadata to suggest similar movies based on user input, using features such as genres, overview, cast, and more.

## Features
- Recommends movies based on:
  - **Genres**
  - **Overview**
  - **Cast**
  - **Director**
- Autocomplete search functionality for movies.
- Light/Dark mode toggle for user experience.
- User-friendly interface built with Material-UI.

## Tech Stack
- **Backend:** Flask, Pandas, Scikit-learn
- **Frontend:** React, Material-UI
- **Data:** TMDB 5000 Movies Dataset

## Installation
### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-recommendation-system.git
   ```
2. Navigate to the backend directory:
   ```bash
   cd movie-recommendation-system
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### Running the Application
1. Ensure the backend and frontend servers are running.
2. Open the browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage
1. Enter a movie name in the search bar.
2. Select a movie from the suggestions.
3. View the top 10 recommended movies based on the selected title.
4. Click on any recommended movie to search for it on Google.

![Recommendations Page](Movie Recommendation System/Screenshot.png)

## Dataset
- The project uses the **TMDB 5000 Movies Dataset**, which includes metadata such as genres, cast, crew, and overview.
- Preprocessing is done to extract relevant features for better recommendations.


## License
This project is licensed under the MIT License.

## Acknowledgments
- TMDB for the dataset.
- Material-UI for the frontend design components.
- Flask and React communities for their excellent documentation and support.
