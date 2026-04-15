import express from "express"
import cors from "cors"


const app = express();

// basic configuration
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true, limit :"16kb"}))
app.use(express.static("public"))

// cors configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:8000",
    credentials: true,
    methods: ["GET","PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }),
);

// import the routes
import healthCheckRouter from "./routes/healtcheck.routes.js"
app.use("/api/v1/healthcheck", healthCheckRouter); 


app.get("/",(req,res) => {
    res.send("welcome to basecampy")
})

app.get("/Instagram",(req,res) => {
    res.send("This is an Instagram Page")
})

export default app