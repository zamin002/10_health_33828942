USE health;

INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (
    "gold",
    "Gold",
    "User",
    "Gold@gold.ac.uk",
    "$2b$10$Zi3.E7ArG522LxR2ehzYZufuM0jjTMPwKva6rGeDG.ShZlaEvJ4cS"
);

# some exercises
INSERT INTO exercises (name, muscle_group) VALUES 
    ("Bench Press", "Chest"),
    ("Squats", "Legs"),
    ("Deadlift", "Back"),
    ("Lat Pulldown", "Back"),
    ("Shoulder Press", "Shoulders"),
    ("Bicep Curl", "Bicep"),
    ("Preacher Curl", "Bicep"),
    ("Skullcrushers", "Tricep"),
    ("Rope Push Down", "Tricep");


# eg workout for user gold
INSERT INTO workouts (user_id, workout_date, name, notes) VALUES
    (1, "2025-12-01", "Push Day", "Chest + Shoulders + Triceps"),
    (1, "2025-12-02", "Pull Day", "Back + Biceps");


INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight_kg) VALUES 
    (1,1,2,6,70.00), # Bench
    (1,5,2,6,24.00); # shoulder press


INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight_kg) VALUES 
    (2,4,2,7,73.00), #Lat pulldown
    (2,3,2,5,120.00); # Deadlift


INSERT INTO body_measurements (user_id, measurement_date, bodyweight_kg, waist_cm, notes) VALUES 
    (1,"2025-12-01", 86.30, 85.0, "Start of tracking"),
    (1,"2025-12-08", 85.50, 84.0, "One week in");
