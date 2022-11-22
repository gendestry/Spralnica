import * as express from "express";
import * as cors from "cors";

// init app
const app = express();
app.use(cors());
app.options("*", cors()); // preflight OPTIONS; put before other routes

// handle cors from all origins
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("access-control-allow-origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// handle GET request

app.get("/app/hello", (req, res) => {
  console.log(req.headers);

  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("access-control-allow-origin", "*");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );
  console.log("GET request");
  res.send("Hello World!");
});

app.use((req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
});

// run app on 4002
app.listen(4002, "0.0.0.0");
