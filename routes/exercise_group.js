const express = require("express")
const router = express.Router()
const base = process.env.HEALTH_BASE_PATH || ''

const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect(base + "/users/login")
  }
  next()
}

// GET /exercises/by-muscle
router.get("/exercises/by-muscle", (req, res) => {
  const selectedMuscleGroup = req.query.muscle_group || null

  // Get muscle groups for dropdown
  const groupsSql = `SELECT DISTINCT muscle_group FROM exercises ORDER BY muscle_group`;

  db.query(groupsSql, (err, muscleGroups) => {
    if (err) {
      console.error(err)
      return res.send("Database error")
    }

    // Get exercises (filtered if a group is selected)
    let exercisesSql = `SELECT id, name, muscle_group FROM exercises`;
    const params = []

    if (selectedMuscleGroup) {
      exercisesSql += " WHERE muscle_group = ?"
      params.push(selectedMuscleGroup)
    }

    exercisesSql += " ORDER BY name"

    db.query(exercisesSql, params, (err2, exercises) => {
      if (err2) {
        console.error(err2)
        return res.send("Database error")
      }

      res.render("exercises_by_muscle.ejs", {
        muscleGroups,
        selectedMuscleGroup,
        exercises
      })
    })
  })
})

// GET /exercises/manage, see all exercises and form to add
router.get("/exercises/manage", redirectLogin, (req, res) => {
  const sql = `SELECT id, name, muscle_group FROM exercises ORDER BY muscle_group, name`
  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err)
      return res.send("Database error")
    }

    res.render("exercises_manage.ejs", {
      exercises: rows,
      errorMessage: null
    })
  })
})

// POST /exercises/manage, add exercise while ensuring there are no duplicates
router.post("/exercises/manage", redirectLogin, (req, res) => {
  let { name, muscle_group } = req.body

  name = (name || "").trim()
  muscle_group = (muscle_group || "").trim()

  if (!name || !muscle_group) {
    // Reload page with error if fields are empty
    const sql = `SELECT id, name, muscle_group FROM exercises ORDER BY muscle_group, name`
    return db.query(sql, (err, rows) => {
      if (err) {
        console.error(err)
        return res.send("Database error")
      }

      res.render("exercises_manage.ejs", {
        exercises: rows,
        errorMessage: "Name and muscle group required."
      })
    })
  }

  const insertSql = `INSERT INTO exercises (name, muscle_group) VALUES (?, ?)`
  db.query(insertSql, [name, muscle_group], (err) => {
    if (err) {
      // Duplicate (caught by UNIQUE constraint)
      if (err.code == "ER_DUP_ENTRY") {
        const sql = `SELECT id, name, muscle_group FROM exercises ORDER BY muscle_group, name`
        return db.query(sql, (err2, rows) => {
          if (err2) {
            console.error(err2)
            return res.send("Database error")
          }

          res.render("exercises_manage.ejs", {
            exercises: rows,
            errorMessage: "That exercise for this muscle group already exists"
          })
        })
      }

      console.error(err)
      return res.send("Database error")
    }

    // after success page is reloaded
    res.redirect("/exercises/manage")
  })
})


module.exports = router