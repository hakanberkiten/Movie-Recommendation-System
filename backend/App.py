from flask import Flask, request, jsonify
import pandas as pd
import ast
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

movies_df = None
cosine_sim = None
indices = None

def load_movie_data():
    global movies_df, cosine_sim, indices
    credits = pd.read_csv('tmdb_5000_credits.csv')
    movies = pd.read_csv('tmdb_5000_movies.csv')

    movies = movies.dropna(subset=['title'])
    credits = credits.dropna(subset=['title'])

    movies = movies.merge(credits, left_on='id', right_on='movie_id', how='inner')
    movies = movies.rename(columns={'title_x': 'title'})
    movies = movies[['title', 'genres', 'overview', 'crew']]

    movies['genres'] = movies['genres'].apply(clean_genres)

    movies['combined_features'] = (
        movies['overview'].fillna('') + ' ' +
        movies['genres'].fillna('')
    )

    movies_df = movies.reset_index()

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(movies_df['combined_features'])

    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    indices = pd.Series(movies_df.index, index=movies_df['title'].str.lower()).drop_duplicates()

def clean_genres(genres):
    try:
        data = ast.literal_eval(genres)
        return " ".join([g['name'] for g in data])
    except:
        return ""

@app.route('/recommend', methods=['GET'])
def recommend():
    movie_title = request.args.get('movie', default="", type=str).strip().lower()
    
    if not movie_title:
        return jsonify({"error": "Movie title is required"}), 400
    
    if movie_title not in indices:
        return jsonify({"error": "Movie not found in the dataset"}), 404
    
    idx = indices[movie_title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:11]
    movie_indices = [i[0] for i in sim_scores]
    recommended_movies = movies_df['title'].iloc[movie_indices].to_list()
    
    return jsonify({"recommended": recommended_movies})

@app.route('/movies', methods=['GET'])
def get_movies():
    all_movies = movies_df['title'].tolist()
    return jsonify({"movies": all_movies})

if __name__ == '__main__':
    print("Loading data...")
    load_movie_data()
    print("Data loaded!")
    app.run(debug=True)
