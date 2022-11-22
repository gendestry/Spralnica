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
const app = express();

app.use(
  cors({
    origin: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-HTTP-Method-Override",
      "Accept",
      "Origin",
      "X-Custom-Header",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  })
);
// import { adminAuth, defaultDatabase } from "./firebase";

// firebase stuff
admin.initializeApp({ credential: applicationDefault() });

app.get("/allUsers", async (req: Request, res: Response) => {
  const defaultAuth = getAuth();
  defaultAuth
    .listUsers()
    .then((usersList: ListUsersResult) => {
      const filtered = usersList.users.map((user) => {
        return {
          uuid: user.uid,
          email: user.email,
          phoneNumber: user.phoneNumber,
          name: user.customClaims?.name,
          surname: user.customClaims?.surname,
          room: user.customClaims?.room,
          role: user.customClaims?.role,
          confirmed: user.customClaims?.confirmed,
          banStatus: user.disabled,
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

app.post("/setConfirmed", async (request: Request, response: Response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  const data = request.body;

  const uuid: string = data.uuid;
  const confirmed: boolean = data.confirmed;

  const adminAuth = getAuth();
  adminAuth
    .getUser(uuid)
    .then((user) => {
      const updatedClaims = { confirmed, ...user.customClaims };
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

exports.app = https.onRequest(app);

// export const user = https.onRequest((request: Request, response: Response) => {
//   response.set("Access-Control-Allow-Origin", "*");
//   response.set("Access-Control-Allow-Methods", "GET, POST");

//   const data = request.body;
//   const defaultAuth = getAuth();
//   defaultAuth
//     .getUser(data.uuid)
//     .then((user) => {
//       const filtered = {
//         uuid: user.uid,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//         name: user.customClaims?.name,
//         surname: user.customClaims?.surname,
//         room: user.customClaims?.room,
//         role: user.customClaims?.role,
//         confirmed: user.customClaims?.confirmed,
//         banStatus: user.disabled,
//       };

//       response.send(JSON.stringify(filtered));
//     })
//     .catch((err: Error) => {
//       response.status(503).send(JSON.stringify({ step: "user", ...err }));
//     });
// });

// export const me = https.onRequest((request: Request, response: Response) => {
//   const auth = request.headers.authorization;
//   getAuth()
//     .verifyIdToken(auth || "")
//     .then((decodedToken) => {
//       const uuid = decodedToken.uid;
//       getAuth()
//         .getUser(uuid)
//         .then((user) => {
//           const filtered = {
//             uuid: user.uid,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             name: user.customClaims?.name,
//             surname: user.customClaims?.surname,
//             room: user.customClaims?.room,
//             confirmed: user.customClaims?.confirmed,
//             banStatus: user.disabled,
//           };

//           response.send(JSON.stringify(filtered));
//         })
//         .catch((err: Error) => {
//           response
//             .status(503)
//             .send(JSON.stringify({ step: "me-getuser", ...err }));
//         });
//     })
//     .catch((err: Error) => {
//       response.status(503).send(JSON.stringify({ step: "me", ...err }));
//     });
// });

// export const deleteUser = https.onRequest(
//   (request: Request, response: Response) => {
//     const data = request.body;
//     const uuid: string = data.uuid;

//     const adminAuth = getAuth();
//     adminAuth
//       .deleteUser(uuid)
//       .then(() => {
//         response.sendStatus(200);
//       })
//       .catch((err: Error) => {
//         response.status(503).send(JSON.stringify({ step: "delete", ...err }));
//       });
//   }
// );

// export const setRole = https.onRequest(
//   (request: Request, response: Response) => {
//     const data = request.body;
//     const uuid: string = data.uuid;
//     const role: string = data.role;

//     const adminAuth = getAuth();
//     adminAuth
//       .getUser(uuid)
//       .then((user) => {
//         const updatedClaims = { role, ...user.customClaims };
//         adminAuth
//           .setCustomUserClaims(uuid, updatedClaims)
//           .then(() => {
//             response.sendStatus(200);
//           })
//           .catch((err: Error) => {
//             response.status(503).send(JSON.stringify({ step: "role", ...err }));
//           });
//       })
//       .catch((err: Error) => {
//         response
//           .status(503)
//           .send(JSON.stringify({ step: "role-getuser", ...err }));
//       });
//   }
// );

// export const setBan = https.onRequest(
//   (request: Request, response: Response) => {
//     const data = request.body;
//     const uuid: string = data.uuid;
//     const banned: boolean = data.banned;

//     const adminAuth = getAuth();
//     adminAuth
//       .updateUser(uuid, {
//         disabled: banned,
//       })
//       .then(() => {
//         response.sendStatus(200);
//       })
//       .catch((err: Error) => {
//         response.status(503).send(JSON.stringify({ step: "ban", ...err }));
//       });
//   }
// );

// /*
//   tid - random generated
//   uuid - user uuid
//   washingId - id of washing machine
//   termin - [0-7] 8 terminov / dan
//   date
// */

// export const addAllocation = https.onRequest(
//   (request: Request, response: Response) => {
//     const data = request.body;
//     const uuid: string = data.uuid;
//     const washingId: number = data.washingId;
//     const termin: number = data.termin;
//     const date: string = data.date;

//     const defaultDatabase = getFirestore();
//     defaultDatabase
//       .collection("washing")
//       .add({
//         uuid: uuid,
//         washingId: washingId,
//         termin: termin,
//         date: date,
//       })
//       .then(() => {
//         response.sendStatus(200);
//       })
//       .catch((err: Error) => {
//         response.status(503).send(JSON.stringify({ step: "addWash", ...err }));
//       });
//   }
// );

// export const getAllocations = https.onRequest(
//   (request: Request, response: Response) => {
//     const defaultDatabase = getFirestore();
//   }
// );

// toggle user enabled
// export const setConfirmed = https.onRequest(
//   (request: Request, response: Response) => {
//     const data = request.body;
//     const uuid: string = data.uuid;
//     const confirmed: boolean = data.confirmed;

//     const defaultDatabase = getFirestore();
//     defaultDatabase
//       .collection("users")
//       .select("uuid", "==", uuid)
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           doc.ref.update({ confirmed });
//         });
//       })
//       .then(() => {
//         response.send("success");
//       })
//       .catch((error) => {
//         response.status(500).send(error);
//       });
//   }
// );
