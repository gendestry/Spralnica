import { getAuth, ListUsersResult } from "firebase-admin/auth";
import {
  DocumentData,
  getFirestore,
  QuerySnapshot,
} from "firebase-admin/firestore";
import { https, logger, Request, Response } from "firebase-functions";
import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

import cors = require("cors");
import * as express from "express";
import { user } from "firebase-functions/v1/auth";
const app = express();
app.use(cors());
app.options("*", cors()); // preflight OPTIONS; put before other routes

// app.all("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// firebase stuff
admin.initializeApp({ credential: applicationDefault() });

app.get("/allUsers", async (req: Request, res: Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("content-type", "application/json");
  const defaultAuth = getAuth();
  console.log("aaaa");

  defaultAuth
    .listUsers()
    .then((usersList: ListUsersResult) => {
      const filtered = usersList.users.map((user) => {
        return {
          uuid: user.uid,
          email: user.email,
          phone: user.phoneNumber,
          name: user.customClaims?.name,
          surname: user.customClaims?.surname,
          room: user.customClaims?.room,
          role: user.customClaims?.role,
          confirmed: user.customClaims?.confirmed,
          disabled: user.disabled,
        };
      });

      res.send(JSON.stringify(filtered));
    })
    .catch((err: Error) => {
      res.status(503).send(JSON.stringify({ step: "list", ...err }));
    });
});

app.post("/registerUser", async (request: Request, response: Response) => {
  const data = request.body;
  const email: string = data.email;
  const name: string = data.name;
  const surname: string = data.surname;
  const room: number = data.room;
  const password: string = data.password;
  const phone: string = data.phone;

  const adminAuth = getAuth();
  adminAuth
    .createUser({
      email: email,
      password: password,
      phoneNumber: phone,
    })
    .then((user) => {
      adminAuth
        .setCustomUserClaims(user.uid, {
          name: name,
          surname: surname,
          room: room,
          role: "user",
          confirmed: false,
        })
        .then(() => {
          response.sendStatus(200);
        })
        .catch((err: Error) => {
          response.status(503).send(JSON.stringify({ step: "claim", ...err }));
        });
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "create", ...err }));
    });
});

app.post("/deleteUser", async (request: Request, response: Response) => {
  const data = request.body;
  const uuid: string = data.uuid;

  const adminAuth = getAuth();
  adminAuth
    .deleteUser(uuid)
    .then(() => {
      response.sendStatus(200);
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "delete", ...err }));
    });
});

app.post("/setConfirmed", async (request: Request, response: Response) => {
  console.log("setConfirmed");

  const data = request.body;

  const uuid: string = data.uuid;
  const confirmed: boolean = data.confirmed;

  const adminAuth = getAuth();
  adminAuth
    .getUser(uuid)
    .then((user) => {
      const updatedClaims = { ...user.customClaims };
      updatedClaims.confirmed = confirmed;
      console.log(updatedClaims, confirmed);
      adminAuth
        .setCustomUserClaims(uuid, updatedClaims)
        .then(() => {
          response.sendStatus(200);
        })
        .catch((err: Error) => {
          response
            .status(503)
            .send(JSON.stringify({ step: "confirmed", ...err }));
        });
    })
    .catch((err: Error) => {
      response
        .status(503)
        .send(JSON.stringify({ step: "confirmed-getuser", ...err }));
    });
});

app.post("/updateUser", async (request: Request, response: Response) => {
  const data = request.body;
  const uuid: string = data.uuid;
  const name: string | undefined = data.name;
  const surname: string | undefined = data.surname;
  const room: string | undefined = data.room;
  const role: string | undefined = data.role;
  const email: string | undefined = data.email;
  const phone: string | undefined = data.phone;
  let disabled: boolean | undefined;

  if (data.disabled !== undefined && data.disabled !== null) {
    disabled = data.disabled;
  } else {
    disabled = undefined;
  }

  const adminAuth = getAuth();

  // update claims
  adminAuth
    .getUser(uuid)
    .then((user) => {
      const claims = user.customClaims;
      const updatedClaims = {
        name: name || claims?.name,
        surname: surname || claims?.surname,
        room: room || claims?.room,
        role: role || claims?.role,
        confirmed: claims?.confirmed,
      };

      adminAuth
        .setCustomUserClaims(uuid, updatedClaims)
        .then(() => {
          response.sendStatus(200);
        })
        .catch((err: Error) => {
          response.status(503).send(JSON.stringify({ step: "update", ...err }));
        });
    })
    .catch((err: Error) => {
      response
        .status(503)
        .send(JSON.stringify({ step: "update-claims", ...err }));
    });

  // update email / phone
  adminAuth
    .getUser(uuid)
    .then((user) => {
      adminAuth.updateUser(uuid, {
        phoneNumber: phone || user.phoneNumber,
        email: email || user.email,
        disabled: disabled,
      });
    })
    .catch((err: Error) => {
      response
        .status(503)
        .send(JSON.stringify({ step: "update-email-phone", ...err }));
    });
});

exports.app = https.onRequest(app);
