CREATE DATABASE IF NOT EXISTS health;
USE health;

#table for users
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

#table for exercises
CREATE TABLE IF NOT EXISTS exercises(
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

#table for workouts
CREATE TABLE IF NOT EXISTS workouts(
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    workout_date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    notes TEXT,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
        #if user id gets deleted, this will automatically be deleted too
        ON DELETE CASCADE   
);

#exercises done in every workout
CREATE TABLE IF NOT EXISTS workout_exercises(
    id INT AUTO_INCREMENT,
    workout_id INT NOT NULL,
    exercise_id INT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
        #reason why cascade here is because removing a workout kills all sets logged for that workout
        ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
        #reason why restrict is used here is because you cant delete an exercise if used in logged workout
        ON DELETE RESTRICT
);

#table for body measurements
CREATE TABLE IF NOT EXISTS body_measurements(
    id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    measurement_date DATE NOT NULL,
    bodyweight_kg DECIMAL(5,2) NOT NULL,
    waist_cm DECIMAL(5,2),
    notes TEXT,
    PRIMARY KEY(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);