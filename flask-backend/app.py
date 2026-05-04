from flask import Flask, request, jsonify, session
from flask_cors import CORS
import mysql.connector
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
import logging
from functools import wraps
from flask_session import Session
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = '123456'  # Replace with a strong, unique key
CORS(app, supports_credentials=True)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"  # Stores session files on the server
Session(app)  

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Kavindu1495?",
        database="learningContent3"
    )

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"message": "Unauthorized access!"}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        db.commit()
        return jsonify({"message": "User signed up successfully!"})
    except mysql.connector.IntegrityError:
        return jsonify({"message": "Username already exists."}), 400
    except Exception as e:
        return jsonify({"message": "An error occurred.", "error": str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT id, username FROM users WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    
    if user:
        session['user_id'] = user[0]
        app.logger.debug(f"User {username} logged in with user_id: {user[0]}")  # Debugging statement
        return jsonify({"message": "Login successful!", "user_id": user[0]})
    else:
        return jsonify({"message": "Invalid credentials!"}), 401
    
@app.route('/get-user-data', methods=['GET'])
@login_required
def get_user_data():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE user_id = %s", (user_id,))
    user_data = cursor.fetchone()
    cursor.close()
    db.close()

    if not user_data:
        return jsonify({"error": "User data not found"}), 404

    return jsonify(user_data)


@app.route('/submit-form', methods=['POST'])
@login_required
def submit_form():
    data = request.json
    user_id = session.get('user_id')  # Retrieve user_id from the session
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    required_fields = ['student_number', 'first_name', 'last_name', 'level', 'program']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()
        # Check if the user already exists
        cursor.execute("SELECT * FROM students WHERE user_id = %s", (user_id,))
        existing_user = cursor.fetchone()

        if existing_user:
            # Update existing user
            sql = """
            UPDATE students SET
                student_number = %s,
                first_name = %s,
                last_name = %s,
                level = %s,
                program = %s,
                preferred_learning_method = %s,
                preferred_study_time = %s,
                preferred_language = %s,
                challenging_subject_areas = %s,
                preferred_content_platforms = %s,
                topics_of_interest = %s,
                future_goals = %s,
                challenges = %s,
                suggestions = %s
            WHERE user_id = %s
            """
            values = (
                data['student_number'], data['first_name'], data['last_name'], data['level'], data['program'],
                ','.join(data.get('preferred_learning_methods', [])), ','.join(data.get('preferred_study_times', [])),
                ','.join(data.get('preferred_languages', [])), ','.join(data.get('challenging_subject_areas', [])),
                ','.join(data.get('preferred_content_platforms', [])), ','.join(data.get('topics_of_interest', [])),
                data.get('future_goals'), data.get('challenges'), data.get('suggestions'), user_id
            )
        else:
            # Insert new user
            sql = """
            INSERT INTO students (user_id, student_number, first_name, last_name, level, program, 
                preferred_learning_method, preferred_study_time, preferred_language, challenging_subject_areas, 
                preferred_content_platforms, topics_of_interest, future_goals, challenges, suggestions) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                user_id, data['student_number'], data['first_name'], data['last_name'], data['level'], data['program'],
                ','.join(data.get('preferred_learning_methods', [])), ','.join(data.get('preferred_study_times', [])),
                ','.join(data.get('preferred_languages', [])), ','.join(data.get('challenging_subject_areas', [])),
                ','.join(data.get('preferred_content_platforms', [])), ','.join(data.get('topics_of_interest', [])),
                data.get('future_goals'), data.get('challenges'), data.get('suggestions')
            )

        cursor.execute(sql, values)
        db.commit()
        return jsonify({'message': 'Form submitted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()

# Load models and datasets
video_matrix = np.load('video_matrix.npy')
course_matrix = np.load('course_matrix.npy')
with open('tfidf_vectorizer.pkl', 'rb') as f:
    tfidf_vectorizer = pickle.load(f)

videos_df = pd.read_csv('course_recommendations_multilang.csv')
courses_df = pd.read_csv('synthetic_courses_dataset2.csv')

def preprocess_student_data(student_row):
    student_preferences = " ".join(str(field) for field in student_row[6:12] if field)
    return tfidf_vectorizer.transform([student_preferences])

def weighted_random_selection(indices, scores, n=5):
    # Normalize scores to get probabilities
    probabilities = scores[indices] / np.sum(scores[indices])
    # Randomly select indices based on probabilities
    selected_indices = np.random.choice(indices, size=n, replace=False, p=probabilities)
    return selected_indices

@app.route('/recommendations', methods=['POST'])
@login_required
def recommendations():
    # Get the logged-in user's ID from the session
    user_id = session.get('user_id')
    
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401
    
    # Fetch the student_number associated with the logged-in user
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT student_number FROM students WHERE user_id = %s", (user_id,))
    student_row = cursor.fetchone()
    cursor.close()
    db.close()
    
    if not student_row:
        return jsonify({"error": "Student not found for the logged-in user"}), 404
    
    student_number = student_row[0]  # Extract the student_number
    
    # Fetch the student's data using the student_number
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM students WHERE student_number = %s", (student_number,))
    student_row = cursor.fetchone()
    cursor.close()
    db.close()
    
    if not student_row:
        return jsonify({"error": "Student data not found"}), 404
    
    # Generate recommendations
    student_vector = preprocess_student_data(student_row)
    
    course_scores = cosine_similarity(student_vector, course_matrix).flatten()
    video_scores = cosine_similarity(student_vector, video_matrix).flatten()
    
    # Get top 10 indices for courses and videos
    top_course_indices = np.argsort(course_scores)[-10:][::-1]
    top_video_indices = np.argsort(video_scores)[-10:][::-1]
    
    # Use weighted random selection to pick 5 recommendations
    selected_course_indices = weighted_random_selection(top_course_indices, course_scores)
    selected_video_indices = weighted_random_selection(top_video_indices, video_scores)
    
    recommended_courses = [
        {
            "title": courses_df.iloc[i]["Title"],
            "description": courses_df.iloc[i]["Description"] if str(courses_df.iloc[i]["Description"]) != "nan" else "No description available",
            "link": courses_df.iloc[i]["URLs"],
            "thumbnail": courses_df.iloc[i]["Images"] if pd.notna(courses_df.iloc[i]["Images"]) else "https://via.placeholder.com/300x180"
        }
        for i in selected_course_indices
    ]
    
    recommended_videos = [
        {
            "title": videos_df.iloc[i]["Title"],
            "description": videos_df.iloc[i]["Description"] if str(videos_df.iloc[i]["Description"]) != "nan" else "No description available",
            "link": videos_df.iloc[i]["URLs"],
            "thumbnail": videos_df.iloc[i]["Images"] if pd.notna(videos_df.iloc[i]["Images"]) else "https://via.placeholder.com/300x180"
        }
        for i in selected_video_indices
    ]
    
    return jsonify({"courses": recommended_courses, "videos": recommended_videos})


@app.route('/submit-results', methods=['POST'])
@login_required
def submit_results():
    data = request.json
    user_id = session.get('user_id')  # Retrieve user_id from the session
    app.logger.debug(f"Retrieved user_id from session: {user_id}")  # Debugging statement
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401

    try:
        db = get_db_connection()
        cursor = db.cursor()
        
        # Check if the user already has results
        cursor.execute("SELECT * FROM results WHERE user_id = %s", (user_id,))
        existing_results = cursor.fetchone()

        if existing_results:
            # Update existing results
            sql = """
            UPDATE results SET
                programming_fundamentals = %s,
                data_structures_and_algorithms = %s,
                operating_systems = %s,
                database_systems = %s,
                object_oriented_programming = %s,
                advanced_software_engineering = %s,
                artificial_intelligence = %s,
                network_security = %s,
                basic_electronics = %s,
                circuit_analysis = %s,
                microprocessor_systems = %s,
                digital_electronics = %s,
                embedded_systems_design = %s,
                power_electronics = %s,
                foundations_of_industrial_management = %s,
                operations_management = %s,
                strategic_management = %s,
                linear_algebra = %s,
                numerical_methods = %s,
                optimization_techniques = %s,
                introduction_to_probability_and_statistics = %s,
                statistical_inference = %s,
                time_series_analysis = %s
            WHERE user_id = %s
            """
            values = (
                data['programming_fundamentals'], data['data_structures_and_algorithms'], data['operating_systems'],
                data['database_systems'], data['object_oriented_programming'], data['advanced_software_engineering'],
                data['artificial_intelligence'], data['network_security'], data['basic_electronics'],
                data['circuit_analysis'], data['microprocessor_systems'], data['digital_electronics'],
                data['embedded_systems_design'], data['power_electronics'], data['foundations_of_industrial_management'],
                data['operations_management'], data['strategic_management'], data['linear_algebra'],
                data['numerical_methods'], data['optimization_techniques'], data['introduction_to_probability_and_statistics'],
                data['statistical_inference'], data['time_series_analysis'], user_id
            )
        else:
            # Insert new results
            sql = """
            INSERT INTO results (user_id, programming_fundamentals, data_structures_and_algorithms, operating_systems, 
                database_systems, object_oriented_programming, advanced_software_engineering, artificial_intelligence, 
                network_security, basic_electronics, circuit_analysis, microprocessor_systems, digital_electronics, 
                embedded_systems_design, power_electronics, foundations_of_industrial_management, operations_management, 
                strategic_management, linear_algebra, numerical_methods, optimization_techniques, 
                introduction_to_probability_and_statistics, statistical_inference, time_series_analysis) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                user_id, data['programming_fundamentals'], data['data_structures_and_algorithms'], data['operating_systems'],
                data['database_systems'], data['object_oriented_programming'], data['advanced_software_engineering'],
                data['artificial_intelligence'], data['network_security'], data['basic_electronics'],
                data['circuit_analysis'], data['microprocessor_systems'], data['digital_electronics'],
                data['embedded_systems_design'], data['power_electronics'], data['foundations_of_industrial_management'],
                data['operations_management'], data['strategic_management'], data['linear_algebra'],
                data['numerical_methods'], data['optimization_techniques'], data['introduction_to_probability_and_statistics'],
                data['statistical_inference'], data['time_series_analysis']
            )

        cursor.execute(sql, values)
        db.commit()
        return jsonify({'message': 'Results submitted successfully'})
    except Exception as e:
        app.logger.error(f"Error submitting results: {str(e)}")  # Debugging statement
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()

@app.route('/logout')
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

if __name__ == '__main__':
    app.run(debug=True)