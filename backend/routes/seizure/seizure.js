const express = require("express");
const router = require("express").Router();
const db = require("../../knex");
const nodemailer = require("nodemailer");
// endpoints
// /seizure/save
router.post("/save", async (req, res) => {
  const {
    id,
    date,
    time,
    felt_it_coming,
    during_sleep,
    triggers,
    location,
    medications,
    remarks,
    seizure_type,
    duration,
  } = req.body;
  try {
    await db("seizure").insert({
      id,
      date,
      time,
      felt_it_coming,
      during_sleep,
      triggers,
      location,
      medications,
      remarks,
      seizure_type,
      duration,
      create_time: new Date(),
    });
    res.status(200).json({ message: "Seizure saved successfully!" });
  } catch (error) {
    console.error("Error saving seizure:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// /seizure/get/:id
router.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const seizures = await db("seizure").where({ id });
    res.status(200).json(seizures);
  } catch (error) {
    console.error("Error getting seizures:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// /seizure/count/:id
router.get("/count/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const seizures = await db("seizure").where({ id });
    res.status(200).json(seizures.length);
  } catch (error) {
    console.error("Error getting seizures:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// function getLast7Days() :
const getLast7datesCount = async (id) => {
  try {
    const last7days = [];
    const today = new Date();

    // Generate last 7 days in IST timezone
    for (let i = -1; i < 9; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Shift to IST (UTC+5:30) and format as YYYY-MM-DD
      const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      last7days.push(istDate);
    }

    console.log("Last 7 days (IST):", last7days); // Debug: Check last 7 days in IST

    // Fetch seizure records from the database for the last 7 days
    const records = await db("seizure")
      .where({ id })
      .whereBetween("date", [last7days[9], last7days[0]]) // Filter by UTC dates
      .select("date"); // Fetch raw UTC dates without grouping

    // Function to convert UTC date to IST and return YYYY-MM-DD
    const convertUTCtoIST = (utcDate) => {
      const istDate = new Date(
        new Date(utcDate).getTime() + 5.5 * 60 * 60 * 1000
      );
      return istDate.toISOString().split("T")[0];
    };

    // Consolidate records by IST date
    const istDateCounts = records.reduce((acc, record) => {
      const istDate = convertUTCtoIST(record.date); // Convert UTC to IST date (YYYY-MM-DD)
      acc[istDate] = (acc[istDate] || 0) + 1; // Increment count for this IST date
      return acc;
    }, {});

    // Map last 7 days to the consolidated counts
    const dateCountMap = last7days.reduce((acc, date) => {
      acc[date] = istDateCounts[date] || 0; // Use 0 if no records for the date
      return acc;
    }, {});
// remove first day
    delete dateCountMap[last7days[0]];
    delete dateCountMap[last7days[last7days.length - 1]];
    return dateCountMap;
  } catch (error) {
    console.error(error);
  }
};

// /seizure/count/last7days/:id
router.get("/count/last7days/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const seizures = await getLast7datesCount(id);
    res.status(200).json(seizures);
  } catch (error) {
    console.error("Error getting seizures:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// /sendToDoctor

router.post("/sendToDoctor", async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: "zebakhan0316@gmail.com", // Replace with your email
        pass: "btru xiqx jwwo nebs", // Replace with your email password or app password
      },
    });
    const emailSubject = `Seizure Data for Patient`;

    // Send the email
    const mailOptions = {
      from: "zebakhan0316@gmail.com", // Sender address
      to: "zebakhan0316@gmail.com", // Doctor's email address
      subject: emailSubject,
      html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #6B4CE6;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 20px;
        }
        .footer {
            background-color: #f1f1f1;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666;
        }
        .footer a {
            color: #6B4CE6;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Epicare Seizure Attack Report
        </div>
        <div class="content">
            <p>${prompt}</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Epicare App. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`, // HTML body of the email
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent to doctor successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// export router
module.exports = router;
