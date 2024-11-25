const express = require("express");
const router = express.Router();
const db = require("../../knex");
// endpoints

// /messages/get
router.get("/get", async (req, res) => {
  try {
    const data = await db("messages")
      .join("users", "users.id", "=", "messages.id")
      .select("messages.*", "users.username", "users.image_url");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// export router
module.exports = router;
