const pool = require("../config/db");

const getEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events");
    res.json({ events: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

const getUserEvents = async (req, res) => {
  let { userId } = req.params;
  console.log(`user_id: ${userId}`);
  try {
    const query = `
            SELECT 
                rsvps.id AS rsvp_id,
                rsvps.status,
                rsvps.created_at AS rsvp_created_at,
                events.id AS event_id,
                events.name,
                events.description,
                events.event_date,
                events.event_time,
                events.location,
                events.capacity,
                events.available_seats,
                events.type,
                events.created_by,
                events.created_at AS event_created_at
            FROM 
                rsvps
            INNER JOIN 
                events 
            ON 
                rsvps.event_id = events.id
            WHERE 
                rsvps.user_id = $1
        `;

    const result = await pool.query(query, [userId]);
    return res.status(200).json({ events: result.rows });
  } catch (error) {
    console.error("Error fetching user events:", error);
    return res.status(500).json({ error: "Error fetching user events" });
  }
};


const cancelEvent = async (req, res) => {
  try {
    await pool.query("DELETE FROM rsvps WHERE event_id = $1", [req.params.eventId]);
    res.json({ message: "Event cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling event" });
  }
};

const confirmRSVP = async (req, res) => {
  const {userId, eventId} = req.body
  console.log(`userId: ${userId}, eventId: ${eventId}`)
  try {
    await pool.query("INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2)", [userId, eventId]);
    res.json({ message: "RSVP confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error confirming RSVP" });
  }
};

const createEvent = async (req, res) => {
  const {
    name,
    description,
    location,
    event_date,
    event_time,
    type,
    capacity,
    created_by
  } = req.body;

  let available_seats = capacity

  try {
    const result = await pool.query(
      `INSERT INTO events 
      (name, description, location, event_date, event_time, type, capacity, available_seats, created_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [name, description, location, event_date, event_time, type, capacity, available_seats, created_by]
    );

    res.status(201).json({ 
      message: "Event created successfully", 
      event: result.rows[0] 
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event" });
  }
};

module.exports = { getEvents, getUserEvents, cancelEvent, confirmRSVP, createEvent };
