# Health & Fitness Tracker

A health and fitness web application built for the **Dynamic Web Applications** module.  
Users can register, log in, log workouts, track body measurements, search for exercises by muscle group, and find local gyms.

---

## 1. Project Overview

This app lets users:

- Create an account and log in
- Log workouts (with exercises, sets, reps, weight)
- View a list of their past workouts
- Track body measurements over time (bodyweight, waist, notes)
- Search exercises by muscle group
- Add new exercises/muscle groups to the database (with duplicate protection)
- Find local gyms based on postcode, with results shown on a map, using Google Places API and Geolocating API

The app is built around the **health & fitness** theme required by the coursework brief.

---

## 2. Technology Stack

- **Node.js**
- **Express**
- **EJS**
- **MySQL**
- CSS via `main.css`
- Google Maps JavaScript API (for the gym map page)

---

## 3. Features (Mapping to Coursework Requirements)

- **Home page**  
  - `GET /` → `views/home.ejs`  
  - Links to About, Register, Login, Gyms, Workouts, Exercises, Measurements.

- **About page**  
  - `GET /about` → `views/about.ejs`

- **User registration & login**
  - Register: `GET /users/register`, `POST /users/registered`
  - Login: `GET /users/login`, `POST /users/loggedin`
  - Logout: `GET /users/logout`
  - Default marker account: **username**: `gold`, **password**: `smiths`
  - Passwords stored as hashed values in the database.

- **Database-backed features**
  - All user accounts, workouts, exercises, workout entries, and measurements are stored in **MySQL** schema `health`.

- **Search against the database**
  - `GET /exercises/by-muscle`  
    - Dropdown of muscle groups  
    - Returns exercises filtered by selected muscle group (or all if none selected).

- **Forms that insert/update data**
  - Add exercise: `GET /exercises/manage`, `POST /exercises/manage`
  - Log workout: `GET /workouts/new`, `POST /workouts`
  - Body measurements:
    - List: `GET /measurements`
    - New: `GET /measurements/new`, `POST /measurements`
    - Edit: `GET /measurements/:id/edit`, `POST /measurements/:id`
    - Delete: `POST /measurements/:id/delete`

- **Gyms search + map**
  - `GET /gyms` and/or `POST /gyms`
  - User submits postcode, app finds gyms nearby and renders them:
    - List of gym names
    - Map with markers using Google Maps JavaScript API.

---

## 4. Project Structure (Key Files)

- `index.js` – main entry point (Express app setup, routes mounting)
- `routes/` (or similar):
  - `main.js` – home and about routes
  - `users.js` – register, login, logout
  - `workouts.js` – workout CRUD/logging
  - `measurements.js` – measurements CRUD
  - `exercise_group.js` – exercises by muscle group
  - `gyms.js` – gym search + maps
- `views/`
  - `home.ejs`, `about.ejs`
  - `login.ejs`, `register.ejs`
  - `workouts_list.ejs`, `workouts_new.ejs`
  - `measurements_list.ejs`, `measurements_new.ejs`, `measurements_edit.ejs`
  - `exercises_manage.ejs`, `exercises_by_muscle.ejs`
  - `gyms.ejs`
- `public/`
  - `main.css`
- `create_db.sql`
- `insert_test_data.sql`
- `report.pdf` or `report.docx`
- `links.txt`

---

## 5. Installation & Setup (Local)

### Prerequisites

- Node.js (LTS version)
- MySQL server running locally

### 5.1 Clone the repository

```bash
git clone https://github.com/zamin002/10_health_33828942.git
cd 10_health_33828942
```

### 5.2 
npm install

### 5.3 Database setup

Run the schema file:

mysql -u health_app -p health < create_db.sql


Insert test data (including default user gold):

mysql -u health_app -p health < insert_test_data.sql


The database must be named health

### 6 Running the Application

Start server:

node index.js


The app will run on:

http://localhost:8000


You can then access:

/ — Home

/about — About page

/users/register — Register

/users/login — Log in

/workouts — View workouts

/measurements — View measurements

/exercises/by-muscle — Exercise filtering

/gyms — Gym search