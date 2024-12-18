const pool = require("../config/db");

const getEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events");
    res.json({ events: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

const fetchUserEvents = async (req, res) => {
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
  console.log("req.params.eventId", req.params.eventId);
  try {
    await pool.query("DELETE FROM rsvps WHERE event_id = $1", [req.params.eventId]);
    res.json({ message: "Event cancelled successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error cancelling event" });
  }
};

const confirmRSVP = async (req, res) => {
  let { eventId, userId } = req.body;
  console.log(`event_id: ${eventId} || user_id: ${userId}`);

  if (!eventId || !userId) {
    console.log("Event ID and user ID are required");
    return res.status(400).json({ error: "Event ID and user ID are required" });
  }

  try {
    const event = await pool.query("SELECT * FROM events WHERE id = $1", [
      eventId,
    ]);
    if (event.rows[0].available_seats === 0) {
      return res.status(400).json({ error: "Event is already full" });
    }

    const existingRsvp = await pool.query(
      "SELECT * FROM rsvps WHERE event_id = $1 AND user_id = $2",
      [eventId, userId]
    );
    if (existingRsvp.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "User has already RSVP'd for this event" });
    }

    await pool.query("INSERT INTO rsvps (event_id, user_id) VALUES ($1, $2)", [
      eventId,
      userId,
    ]);
    await pool.query(
      "UPDATE events SET available_seats = available_seats - 1 WHERE id = $1",
      [eventId]
    );
    console.log("RSVP confirmed successfully");
    return res.status(200).json({ message: "RSVP confirmed successfully" });
  } catch (error) {
    console.error("Error confirming RSVP:", error);
    return res.status(500).json({ error: "Error confirming RSVP" });
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

module.exports = { getEvents, getUserEvents, cancelEvent, confirmRSVP, createEvent, fetchUserEvents };
