const express = require("express");
const router = express.Router();
const db = require("../../knex");
// endpoints
// /medicine/save
router.post("/save", async (req, res) => {
  console.log("started/save");
  const { id, name, dosage, frequency, specialinstructions, times } = req.body;
  try {
    await db("medicines").insert({
      id,
      name,
      dosage,
      frequency,
      specialinstructions,
      time: times,
      create_time: new Date(),
    });
    res.status(200).json({ message: "Medicine saved successfully!" });
  } catch (error) {
    console.error("Error saving medicine:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// /medicine/get/:id
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const medicines = await db("medicines").where({ id });
    res.status(200).json(medicines);
  } catch (error) {
    console.error("Error getting medicines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// /medicine/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db("medicines").where({ med_id:id }).del();
    res.status(200).json({ message: "Medicine deleted successfully!" });
  } catch (error) {
    console.error("Error deleting medicine:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// exports
module.exports = router;
