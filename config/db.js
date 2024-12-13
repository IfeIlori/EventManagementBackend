const {Pool} = require("pg")
const connectionString ="postgresql://esther:n1XuKE0ZhsgFIi6KQ3FJjC1SIworbMKb@dpg-cta6ojbtq21c73c11agg-a.oregon-postgres.render.com/campus_events";

const pool = new Pool({
    connectionString: connectionString,
    ssl:{
        rejectUnauthorized:false
    }
})

pool.connect().then(response=>console.log("Connected to Esther's Database")).catch(err=>console.log("Error connected to database",err))

module.exports = pool