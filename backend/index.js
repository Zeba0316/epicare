require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const db = require("./knex");
// router:
const authrouter = require("./routes/auth/auth");
const medicinerouter = require("./routes/medicine/medicine");
const drAppointmentRouter = require("./routes/drappointments/drappointments");
const seizurerouter = require("./routes/seizure/seizure");
const phoneRouter = require("./routes/phone/phone");
const messageRouter = require("./routes/messages/messages");

// iniitialize app:
const app = express();

app.use(cors());
app.use(bodyParser.json());

//routes
app.use("/auth", authrouter);
app.use("/medicine", medicinerouter);
app.use("/drappointments", drAppointmentRouter);
app.use("/seizure", seizurerouter);
app.use("/phone", phoneRouter);
app.use("/messages", messageRouter);

app.get("/test", (req, res) => {
  res.json({
    message: "h000",
  });
});
const server = app.listen(5000, () => {
  console.log("Server running on port 5000");
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("connceted user", socket.id);
  socket.on("message-server", async (data) => {
    const [savedData] = await db("messages").insert(data).returning("*");
    const senderDetails = await db("users").where({ id: data.id });
    savedData["username"] = senderDetails[0].username;
    savedData["image_url"] = senderDetails[0].image_url;
    console.log(savedData);
    socket.broadcast.emit("message-client", savedData);
  });
  socket.on("disconnect", () => {
    console.log("disconnected user", socket.id);
  });
});
