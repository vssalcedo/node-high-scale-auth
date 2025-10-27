import "./otel";
import express from "express";

// Uncomment the implementation you want to use
import performLogin from "./controllers/login_w_bcrypt";
//import performLogin from "./controllers/login_w_bcryptjs";
//import performLogin from "./controllers/login_w_bcrypt_gRPC";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const response = await performLogin(email, password);

    if (!response) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(response);

  } catch (err) {
    console.error("Login error:", err);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at port ${port}`);
});
