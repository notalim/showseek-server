import cron from "node-cron";
import { updateAllUserVibes } from "../utils/vibeUtils.js";

const scheduleVibeUpdates = () => {
    cron.schedule("0 0 * * MON", () => {
        console.log("Running a task every week");
        updateAllUserVibes();
    });
};

export default scheduleVibeUpdates;
