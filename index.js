const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require("./routes/authRoutes")
const eventRoutes = require("./routes/eventRoutes")
require("dotenv").config()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/api/auth",authRoutes)
app.use("/api/events",eventRoutes)

const PORT = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send("Welcome to Esther's server")
})
app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})