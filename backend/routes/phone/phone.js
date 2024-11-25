const express = require("express");
const router = express.Router();
const db = require("../../knex");

// endpoints

// /phone/save
router.post("/save", async (req, res) => {
  const { id, name, number } = req.body;
  try {
    await db("phone_numbers").insert({
      id,
      name,
      phone_number: number,
    });
    res.status(200).json({ message: "Phone saved successfully!" });
  } catch (error) {
    console.error("Error saving phone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const phone = await db("phone_numbers").where({ id });
    res.status(200).json(phone);
  } catch (error) {
    console.error("Error getting phone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// /phone/delete/:id
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db("phone_numbers").where({ contact_id: id }).del();
    res.status(200).json({ message: "Phone deleted successfully!" });
  } catch (error) {
    console.error("Error deleting phone:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// export router
module.exports = router;
