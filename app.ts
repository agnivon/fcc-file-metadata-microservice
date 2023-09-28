import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import multer from "multer";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Set the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Set the filename (you can customize this)
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (_req: Request, res: Response) => {
  res.render("index");
});

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (req.file) {
    const { originalname, mimetype, size } = req.file;
    return res.json({ name: originalname, type: mimetype, size: size });
  } else {
    return res.status(400).send();
  }
});

app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
