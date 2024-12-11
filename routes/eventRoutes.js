const router = require("express").Router();
const { getEvents, getUserEvents, cancelEvent, confirmRSVP, createEvent } = require("../controllers/eventController");

router.get("/getEvents", getEvents);
router.get("/getUserEvents/:userId", getUserEvents);
router.delete("/cancelEvent/:eventId", cancelEvent);
router.post("/confirmRSVP", confirmRSVP);
router.post("/createEvent", createEvent);
module.exports = router;
