const pool = require("../config/db")
const bcrypt = require("bcryptjs")

const Login = async (req,res)=>{
    const {email, password} = req.body
    
    if(!email||!password){
        console.log("Please enter some credientials")
        return res.status(401).send("Please enter some credientials");
    }

    try {
        const {rows} = await pool.query("SELECT * FROM users WHERE email =$1", [email])
        if(rows.length<1){
            console.log("No user found")
            return res.status(404).send("No user found");
        }

        console.log(`User ${email} logged in succesfully`)
        return res.status(200).json({msg:"Login successful",user:rows[0]})
    } catch (error) {
        console.log("Error", error)
        return res.status(404).send(error);
    }
}

const Register = async (req, res) => {
  const { name, email, password, role, preferences } = req.body;
  console.log(
    `Name: ${name} || email: ${email} || password: ${password} || role: ${role} || preferences: ${preferences}`
  );

  if (!name || !email || !password || !role || !preferences) {
    console.log("Please enter all the needed information");
    return res
      .status(400)
      .json({ error: "Please enter all the needed information" });
  }

  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length > 0) {
    console.log("Email already exists");
    return res.status(400).json({ error: "Email already exists" });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 13);
    const results = await pool.query(
      "INSERT INTO users (name,email,password, role, preferences) VALUES($1,$2,$3,$4,$5)",
      [name, email, hashPassword, role ||"user", preferences]
    );
 
    console.log("User registered successfully");
    return res.status(201).json({ message: "User registered successfully", user: results.rows[0] });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ error: "Error registering user" });
  }
}

module.exports = {Register, Login}