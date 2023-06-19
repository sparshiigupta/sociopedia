// package.json-> type:module so that we can use import instead of using require
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyUser } from "./middleware/auth.js";
import { createPost } from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS -> kind of middleware(runs before requests)*/

//because we used type:module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

//some more middlewares
app.use(express.json());
// helps in securing HTTP headers.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//tool that logs the requests along with some other information depending upon its configuration
app.use(morgan("common"));
//parsing the incoming request
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */

//multer implementation
const storage = multer.diskStorage({
  // destination is used to specify the path of the directory in which the files have to be stored
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  // It is the filename that is given to the saved file.
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// Configure storage engine instead of dest object
const upload = multer({ storage: storage });

/*ROUTES WITH FILES*/
// keeping this route here coz upload function can be accessed here only
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyUser, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/posts", postRoutes);

//connect to db
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    //listen for requests
    app.listen(PORT, () => {
      console.log("connected to db and listening on port", PORT);
    });
    /* ADD DATA ONE TIME */
    User.insertMany(users);
    Post.insertMany(posts);
  })
  .catch((err) => {
    console.log(err);
  });
