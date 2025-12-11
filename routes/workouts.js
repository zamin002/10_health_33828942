const express = require("express")
const router = express.Router()
const base = process.env.HEALTH_BASE_PATH || ''

// redirect login same as users.js
const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect(base+"/users/login")
  }
  next()
}

// GET /workouts/new  --> show form
router.get("/workouts/new", redirectLogin, (req, res) => {
  const sql = "SELECT id, name FROM exercises ORDER BY name";

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
      return res.send("Database error")
    }

    // rows = list of exercises for dropdown
    res.render("workouts_new.ejs", {exercises: rows})
  })
})

// POST /workouts  --> save workout + ONE exercise
router.post("/workouts", redirectLogin, (req, res) => {
  const userId = req.session.userId

  const workoutDate = req.body.workout_date
  const workoutName = req.body.workout_name
  const notes = req.body.notes || null

  const exerciseId = req.body.exercise_id
  const sets = req.body.sets
  const reps = req.body.reps
  const weight = req.body.weight

  // 1) Insert into workouts
  const sqlWorkout = "INSERT INTO workouts (user_id, workout_date, name, notes) VALUES (?, ?, ?, ?)"

  db.query(
    sqlWorkout,
    [userId, workoutDate, workoutName, notes],
    (err, result) => {
      if (err) {
        console.log(err)
        return res.send("Database error")
      }

      const workoutId = result.insertId

      // 2) Insert into workout_exercises (one exercise)
      const sqlExercise = "INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight_kg) VALUES (?, ?, ?, ?, ?)";

      db.query(
        sqlExercise,
        [workoutId, exerciseId, sets, reps, weight],
        (err2) => {
          if (err2) {
            console.log(err2)
            return res.send("Database error")
          }

          // after saving, go to list of workouts
          res.redirect("/workouts")
        }
      )
    }
  )
})

// GET /workouts  --> list workouts for this user
router.get("/workouts", redirectLogin, (req, res) => {
  const userId = req.session.userId

  const sql = "SELECT id, workout_date, name FROM workouts WHERE user_id = ? ORDER BY workout_date DESC"

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.log(err)
      return res.send("Database error")
    }

    res.render("workouts_list.ejs", { workouts: rows })
  })
})

module.exports = router