import { getAuth, ListUsersResult } from "firebase-admin/auth";
import {
  DocumentData,
  getFirestore,
  QuerySnapshot,
} from "firebase-admin/firestore";
import { https, logger, Request, Response } from "firebase-functions";
import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
// import { collection } from "firebase/firestore";

import cors = require("cors");
import * as express from "express";
import { user } from "firebase-functions/v1/auth";

const app = express();
app.use(cors());
app.options("*", cors()); // preflight OPTIONS; put before other routes

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.all("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// res.set("Access-Control-Allow-Origin", "*");
// res.set("content-type", "application/json");

// firebase stuff
admin.initializeApp({ credential: applicationDefault() });

app.get("/allUsers", async (request: Request, response: Response) => {
  const defaultAuth = getAuth();
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

      response.send(JSON.stringify(filtered));
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "list", ...err }));
    });
});

app.get("/user/:id", async (request: Request, response: Response) => {
  console.log(request.params.id, "ID");

  const defaultAuth = getAuth();
  defaultAuth
    .getUser(request.params.id)
    .then((user) => {
      const filtered = {
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

      response.send(JSON.stringify(filtered));
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "user", ...err }));
    });
});

app.get("/me", async (request: Request, response: Response) => {
  const auth = request.headers.authorization;
  getAuth()
    .verifyIdToken(auth || "")
    .then((decodedToken) => {
      const uuid = decodedToken.uid;
      getAuth()
        .getUser(uuid)
        .then((user) => {
          const filtered = {
            uuid: user.uid,
            email: user.email,
            phone: user.phoneNumber,
            name: user.customClaims?.name,
            surname: user.customClaims?.surname,
            room: user.customClaims?.room,
            confirmed: user.customClaims?.confirmed,
            disabled: user.disabled,
          };

          response.send(JSON.stringify(filtered));
        })
        .catch((err: Error) => {
          response
            .status(503)
            .send(JSON.stringify({ step: "me-getuser", ...err }));
        });
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "me-getauth", ...err }));
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

app.post("/updateUser", async (request: Request, response: Response) => {
  const data = request.body;
  const uuid: string = data.uuid;
  const name: string | undefined = data.name;
  const surname: string | undefined = data.surname;
  const room: string | undefined = data.room;
  const role: string | undefined = data.role;
  const email: string | undefined = data.email;
  const phone: string | undefined = data.phone;
  const confirmed: boolean | undefined = data.confirmed;
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
        confirmed: confirmed || claims?.confirmed,
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

/*
Termin
  - tid : string - autogen
  - uuid : string - user id
  - date : string - date of washing
  - termin : number - time of washing [0, 7] 
  - washer : number - washer number [0, 1]
*/

app.post("/addTermin", async (request: Request, response: Response) => {
  const data = request.body;
  const uuid: string = data.uuid;
  const date: number = data.date;
  const termin: number = data.termin;
  const washer: number = data.washer;

  const database = getFirestore();
  database
    .collection("termin")
    .add({
      uuid: uuid,
      date: date,
      termin: termin,
      washer: washer,
    })
    .then(() => {
      response.sendStatus(200);
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "addTermin", ...err }));
    });
});

app.get("/getTermin/:id", async (request: Request, response: Response) => {
  const id = request.params.id;
  const database = getFirestore();
  database.collection("termin").doc(id).get().then((doc) => {
    if (doc.exists) {
      response.send(JSON.stringify({ id: doc.id, ...doc.data() }));
    } else {
      database
        .collection("termin")
        .where("uuid", "==", uuid)
        .get()
        .then((querySnapshot) => {
          const termin: any[] = [];
          querySnapshot.forEach((doc) => {
            termin.push(doc.data());
          });
          response.send(JSON.stringify(termin));
        })
        .then(() => {
          response.sendStatus(200);
        })
        .catch((err: Error) => {
          response
            .status(503)
            .send(JSON.stringify({ step: "getTerminByUser", ...err }));
        });
    }
  }).then(() => {
    response.sendStatus(200);
  }).catch((err: Error) => {
    response.status(503).send(JSON.stringify({ step: "getTermin", ...err }));
  });
});

app.get("/getTerminsByUser/:uuid/:active?", async (request: Request, response: Response) => {
  const uuid = request.params.uuid;
  const active = request.params?.active;
  const database = getFirestore();

  if(active) {
    const date = Math.floor(new Date().getTime() / 1000);
    database.collection("termin").where("uuid", "==", uuid).where("date", ">=", date).
    get().then((querySnapshot) => {
      const termin: any[] = [];
      querySnapshot.forEach((doc) => {
        termin.push({ id: doc.id, ...doc.data() });
      });
      response.send(JSON.stringify(termin));
    }).then(() => {
      response.sendStatus(200);
    }).catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "getTerminByUserA", ...err }));
    });
  }
  else {
    database.collection("termin").where("uuid", "==", uuid).get().then((querySnapshot) => {
      const termin: any[] = [];
      querySnapshot.forEach((doc) => {
        termin.push({ id: doc.id, ...doc.data() });
      });
  }
});

app.get("/getTerminsInRange/:start/:end", async (request: Request, response: Response) => {
  const start: string = request.params.start;
  const end: string = request.params.end;
  const database = getFirestore();

  database.collection("termin").where("date", ">=", start).where("date", "<=", end).get().then((querySnapshot) => {
    const termin: any[] = [];
    querySnapshot.forEach((doc) => {
      termin.push({ id: doc.id, ...doc.data() });
    });
    response.send(JSON.stringify(termin));
  }).then(() => {
    response.sendStatus(200);
  }).catch((err: Error) => {
    response.status(503).send(JSON.stringify({ step: "getTerminInRange", ...err }));
  });
});

app.post("/deleteTermin", async (request: Request, response: Response) => {
  const data = request.body;
  const id: string = data.id;
  const database = getFirestore();

  database
    .collection("termin")
    .doc(id)
    .delete()
    .then(() => {
      response.sendStatus(200);
    })
    .catch((err: Error) => {
      response
        .status(503)
        .send(JSON.stringify({ step: "deleteTermin", ...err }));
    });
});

exports.app = https.onRequest(app);
