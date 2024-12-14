const router = require("express").Router();
const { getEvents, getUserEvents, cancelEvent, confirmRSVP, createEvent, fetchUserEvents } = require("../controllers/eventController");

router.get("/getEvents", getEvents);
router.get("/getUserEvents/:userId", getUserEvents);
router.delete("/cancelEvent/:eventId", cancelEvent);
router.post("/confirmRSVP", confirmRSVP);
router.post("/createEvent", createEvent);
router.get("/getUserEvents/:userId", fetchUserEvents);
module.exports = router;
