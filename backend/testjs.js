const db = require("./knex");

const getLast7datesCount = async (id) => {
  try {
    const last7days = [];
    const today = new Date();

    // Generate last 7 days in IST timezone
    for (let i = -1; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Shift to IST (UTC+5:30) and format as YYYY-MM-DD
      const istDate = new Date(
        date.getTime() + 5.5 * 60 * 60 * 1000
      ).toISOString().split("T")[0];
      last7days.push(istDate);
    }

    console.log("Last 7 days (IST):", last7days); // Debug: Check last 7 days in IST

    // Fetch seizure records from the database for the last 7 days
    const records = await db("seizure")
      .where({ id })
      .whereBetween("date", [last7days[7], last7days[0]]) // Filter by UTC dates
      .select("date"); // Fetch raw UTC dates without grouping

    console.log("Database Records:", records); // Debug: Check raw database records

    // Function to convert UTC date to IST and return YYYY-MM-DD
    const convertUTCtoIST = (utcDate) => {
      const istDate = new Date(new Date(utcDate).getTime() + 5.5 * 60 * 60 * 1000);
      return istDate.toISOString().split("T")[0];
    };

    // Consolidate records by IST date
    const istDateCounts = records.reduce((acc, record) => {
      const istDate = convertUTCtoIST(record.date); // Convert UTC to IST date (YYYY-MM-DD)
      acc[istDate] = (acc[istDate] || 0) + 1; // Increment count for this IST date
      return acc;
    }, {});

    console.log("IST Date Counts:", istDateCounts); // Debug: Consolidated counts

    // Map last 7 days to the consolidated counts
    const dateCountMap = last7days.reduce((acc, date) => {
      acc[date] = istDateCounts[date] || 0; // Use 0 if no records for the date
      return acc;
    }, {});

    console.log("Final Date Count Map:", dateCountMap); // Debug: Check final output
    return dateCountMap;
  } catch (error) {
    console.error(error);
  }
};

// Example Usage
getLast7datesCount(6);
