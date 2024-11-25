const express = require("express");
const router = express.Router();
const db = require("../../knex");

// endpoints
// drappointments/save
router.post("/save", async (req, res) => {
  const { id, date, time, doctorType, name } = req.body;
  try {
    await db("appointments").insert({
      id,
      name,
      doctortype: doctorType,
      scheduled_time: time,
      scheduled_date: date,
      create_time: new Date(),
    });
    res.status(200).json({ message: "DrAppointment saved successfully!" });
  } catch (error) {
    console.error("Error saving DrAppointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// drappointments/get/:id
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointments = await db("appointments").where({ id });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// drappointments/delete/:id
router.delete("/delete/:id", async (req, res) => {
  console.log("started/delete");
  const { id } = req.params;
  try {
    await db("appointments").where({ appointment_id: id }).del();
    res.status(200).json({ message: "DrAppointment deleted successfully!" });
  } catch (error) {
    console.error("Error deleting DrAppointment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// export router
module.exports = router;
