const express = require("express")
const router = express.Router()

const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("../users/login")
  }
  next()
}

// GET /measurements, list all measurements for the logged in user
router.get("/measurements", redirectLogin, (req, res) => {
  const userId = req.session.userId

  const sql = `SELECT id, measurement_date, bodyweight_kg, waist_cm, notes FROM body_measurements WHERE user_id = ? ORDER BY measurement_date DESC`;
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.log(err)
      return res.send("Database error")
    }

    res.render("measurements_list.ejs", { measurements: rows })
  })
})

// GET /measurements/new, show form to add a measurement
router.get("/measurements/new", redirectLogin, (req, res) => {
  res.render("measurements_new.ejs")
})

// POST /measurements, insert new measurement
router.post("/measurements", redirectLogin, (req, res) => {
  const userId = req.session.userId
  const { measurement_date, bodyweight_kg, waist_cm, notes } = req.body

  const sql = `INSERT INTO body_measurements (user_id, measurement_date, bodyweight_kg, waist_cm, notes) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [userId, measurement_date, bodyweight_kg, waist_cm || null, notes || null],
    (err) => {
      if (err) {
        console.log(err)
        return res.send("Database error")
      }
      res.redirect("/measurements")
    }
  )
})

// GET /measurements/:id/edit, edit form
router.get("/measurements/:id/edit", redirectLogin, (req, res) => {
  const userId = req.session.userId
  const id = req.params.id

  const sql = `SELECT id, measurement_date, bodyweight_kg, waist_cm, notes FROM body_measurements WHERE id = ? AND user_id = ?`;
  db.query(sql, [id, userId], (err, rows) => {
    if (err) {
      console.log(err)
      return res.send("Database error")
    }
    if (rows.length == 0) {
      return res.send("Measurement not found")
    }
    res.render("measurements_edit.ejs", { m: rows[0] })
  })
})

// POST /measurements/:id, update
router.post("/measurements/:id", redirectLogin, (req, res) => {
  const userId = req.session.userId
  const id = req.params.id
  const {measurement_date, bodyweight_kg, waist_cm, notes } = req.body

  const sql = `UPDATE body_measurements SET measurement_date = ?, bodyweight_kg = ?, waist_cm = ?, notes = ? WHERE id = ? AND user_id = ?`;
  db.query(
    sql,[measurement_date, bodyweight_kg, waist_cm || null, notes || null, id, userId],(err) => {
      if (err) {
        console.log(err)
        return res.send("Database error")
      }
      res.redirect("/measurements")
    }
  )
})

// POST /measurements/:id/delete, delete
router.post("/measurements/:id/delete", redirectLogin, (req, res) => {
  const userId = req.session.userId
  const id = req.params.id

  const sql = `DELETE FROM body_measurements WHERE id = ? AND user_id = ?`;
  db.query(sql, [id, userId], (err) => {
    if (err) {
      console.log(err)
      return res.send("Database error")
    }
    res.redirect("/measurements")
  })
})

module.exports = router