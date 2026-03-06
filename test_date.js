const { format } = require("date-fns");
const startDateStr = "2026-03-06";
const [year, month, dayStr] = startDateStr.split("-").map(Number);
console.log(year, month, dayStr);

for (let i = 0; i < 4; i++) {
    const targetDate = new Date(year, month - 1, dayStr + (i * 7), 12, 0, 0);
    console.log(`targetDate ${i}:`, targetDate, "-> is object?", targetDate instanceof Date);
    const formatted = targetDate ? format(targetDate, "yyyy-MM-dd") : "";
    console.log(`formatted:`, formatted);
    console.log(`start string:`, `${formatted}T10:00`);
}
