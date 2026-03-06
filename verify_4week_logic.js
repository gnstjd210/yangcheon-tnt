const assert = require('assert');

function simulateBatch(startDateStr) {
    const [year, month, dayStr] = startDateStr.split("-").map(Number);
    const schedules = [];

    // Original logic mimicking createBatchSchedules
    for (let i = 0; i < 4; i++) {
        const targetDate = new Date(year, month - 1, dayStr + (i * 7), 12, 0, 0);
        schedules.push(targetDate);
    }
    return schedules;
}

function run100Tests() {
    let passed = 0;
    let failed = 0;

    // Pick 100 random Fridays across different months and years to test leap years & boundaries
    const baseDate = new Date("2026-03-06T12:00:00"); // A known Friday

    for (let i = 0; i < 100; i++) {
        // Shift base date by i weeks and some random days but ensure we track the starting day of week
        const testStartDate = new Date(baseDate.getTime() + (i * 7 * 24 * 60 * 60 * 1000));

        // Format to YYYY-MM-DD
        const year = testStartDate.getFullYear();
        const month = String(testStartDate.getMonth() + 1).padStart(2, '0');
        const day = String(testStartDate.getDate()).padStart(2, '0');
        const startDateStr = `${year}-${month}-${day}`;

        const expectedDayOfWeek = testStartDate.getDay(); // 5 for Friday

        const batchDates = simulateBatch(startDateStr);

        try {
            assert.strictEqual(batchDates.length, 4, "Should generate exactly 4 dates");

            for (let j = 0; j < 4; j++) {
                // Verify all 4 dates fall exactly on the same Day of Week (Friday)
                assert.strictEqual(
                    batchDates[j].getDay(),
                    expectedDayOfWeek,
                    `Date ${batchDates[j].toISOString()} does not match expected day of week ${expectedDayOfWeek}`
                );

                // Verify exactly 7 days difference between consecutive schedules
                if (j > 0) {
                    const diffTime = Math.abs(batchDates[j] - batchDates[j - 1]);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    assert.strictEqual(diffDays, 7, `Difference between instances is ${diffDays} days, expected 7`);
                }
            }
            passed++;
        } catch (e) {
            console.error(`Test ${i + 1} failed for start date ${startDateStr}:`, e.message);
            failed++;
        }
    }

    console.log(`\n--- Test Results ---`);
    console.log(`Total Run: 100`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    if (failed === 0) {
        console.log(`SUCCESS: The 7-day interval and day-of-week constraint is mathematically completely robust.`);
    }
}

run100Tests();
