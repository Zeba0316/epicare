const formatDateUTC = (date) => {
    const year = date.getUTCFullYear();  // Get UTC year
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = String(date.getUTCDate()).padStart(2, '0'); // Day with leading zero
    const hours = String(date.getUTCHours()).padStart(2, '0'); // Hours in UTC with leading zero
    const minutes = String(date.getUTCMinutes()).padStart(2, '0'); // Minutes in UTC with leading zero
    const seconds = String(date.getUTCSeconds()).padStart(2, '0'); // Seconds in UTC with leading zero
    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0'); // Milliseconds in UTC with leading zero
  
    // Return formatted UTC string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };
  
  // Usage
  const now = new Date();
  const formattedDateUTC = formatDateUTC(now);
  console.log(formattedDateUTC); // Example Output: "2024-11-25 09:35:32.811"
  