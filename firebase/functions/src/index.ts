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

app.get("/seed", async (req: Request, res: Response) => {
  seedUsers();
  seedTermins();
  res.send("seeded");
});

function seedUsers() {
  const adminAuth = getAuth();
  const users: any[] = [
    {
      email: "lan.vukusic@penis.good",
      name: "Lan",
      surname: "Vukušič",
      room: 302,
      password: "geslo123",
      phone: "+386 41 123 456",
    },
    {
      email: "zan@oberstar.eu.org",
      name: "Žan",
      surname: "Oberstar",
      room: 310,
      password: "geslo123",
      phone: "+386 41 123 457",
    },
    {
      email: "enei@slugic.net",
      name: "Enej",
      surname: "Šlugić",
      room: 310,
      password: "geslo123",
      phone: "+386 41 123 458",
    },
  ];

  for (let user of users) {
    const email: string = user.email;
    const name: string = user.name;
    const surname: string = user.surname;
    const room: number = user.room;
    const password: string = user.password;
    const phone: string = user.phone;

    adminAuth
      .createUser({
        email: email,
        password: password,
        phoneNumber: phone,
      })
      .then((user) => {
        adminAuth.setCustomUserClaims(user.uid, {
          name: name,
          surname: surname,
          room: room,
          role: "user",
          confirmed: false,
        });
      });
  }
}

function seedTermins() {
  const database = getFirestore();
  const days = 14;
  for (let neki = 0; neki < 7; neki++) {
    for (let i = 0; i < days; i++) {
      const secPerDay = 86400;
      const dateGenerated = Math.floor(new Date().getTime() / 1000);
      const uuid: string = "seeded";
      const date: number = dateGenerated + i * secPerDay;
      const termin: number = neki;
      const washer: number = Math.floor(Math.random() * 2) + 1;

      database.collection("termin").add({
        uuid: uuid,
        date: date,
        termin: termin,
        washer: washer,
      });
    }
  }
}

// returns an array of start and end times for each day
// in the month in seconds
// [start, end) or better date >= start && date < end
function daysInMonth(month: number, year: number) {
  let daysCount = new Date(year, month, 0).getDate(); // number of days in the month
  let epochTime = Math.floor(new Date(year, month - 1).getTime() / 1000); // epoch in seconds not ms
  const secPerDay = 86400;

  // console.log(month, year);
  // console.log(daysCount);
  // console.log(new Date(year, month - 1).getTime() / 1000);

  let arr = [];
  for (let i = -1; i < daysCount - 1; i++) {
    // bug fixed!
    let current = epochTime + i * secPerDay;
    arr.push([current, current + secPerDay]);
  }

  // console.log(arr);

  return arr;
}

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
  database
    .collection("termin")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        response.send(JSON.stringify({ id: doc.id, ...doc.data() }));
      } else {
        response.sendStatus(404);
      }
    })
    .then(() => {
      response.sendStatus(200);
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "getTermin", ...err }));
    });
});

app.get(
  "/getTerminsByUser/:uuid/:active?",
  async (request: Request, response: Response) => {
    const uuid = request.params.uuid;
    const active = request.params?.active;
    const database = getFirestore();

    if (active) {
      const date = Math.floor(new Date().getTime() / 1000);
      database
        .collection("termin")
        .where("uuid", "==", uuid)
        .where("date", ">=", date)
        .get()
        .then((querySnapshot) => {
          const termin: any[] = [];
          querySnapshot.forEach((doc) => {
            termin.push({ id: doc.id, ...doc.data() });
          });
          response.send(JSON.stringify(termin));
        })
        .then(() => {
          response.sendStatus(200);
        })
        .catch((err: Error) => {
          response
            .status(503)
            .send(JSON.stringify({ step: "getTerminByUserA", ...err }));
        });
    } else {
      database
        .collection("termin")
        .where("uuid", "==", uuid)
        .get()
        .then((querySnapshot) => {
          const termin: any[] = [];
          querySnapshot.forEach((doc) => {
            termin.push({ id: doc.id, ...doc.data() });
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
  }
);

app.get(
  "/getTerminsInRange/:start/:end",
  async (request: Request, response: Response) => {
    const start: string = request.params.start;
    const end: string = request.params.end;
    const database = getFirestore();

    database
      .collection("termin")
      .where("date", ">=", start)
      .where("date", "<=", end)
      .get()
      .then((querySnapshot) => {
        const termin: any[] = [];
        querySnapshot.forEach((doc) => {
          termin.push({ id: doc.id, ...doc.data() });
        });
        response.send(JSON.stringify(termin));
      })
      .catch((err: Error) => {
        response
          .status(503)
          .send(JSON.stringify({ step: "getTerminInRange", ...err }));
      });
  }
);

app.get("/getTerminsMonthly/:month/:year", async (request, response) => {
  const month: number = parseInt(request.params.month);
  const year: number = parseInt(request.params.year);
  const dates = daysInMonth(month, year);

  // console.log(month, year);
  // console.log(dates);

  const database = getFirestore();
  const collection = database.collection("termin");

  const promises: Promise<any>[] = [];
  const allTermins: any[] = [];
  for (let range of dates) {
    promises.push(
      collection
        .where("date", ">=", range[0])
        .where("date", "<", range[1])
        .get()
    );
    // .then((querySnapshot) => {
    //   const termins: any[] = [];
    //   querySnapshot.forEach((doc) => {
    //     termins.push({ id: doc.id, ...doc.data() });
    //   });
    //   allTermins.push(termins);
    // }).catch((err: Error) => {
    //   response
    //     .status(503)
    //     .send(JSON.stringify({ step: "getTerminMonthly", ...err }));
    // });
  }
  Promise.allSettled(promises).then((results) => {
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        const querySnapshot = result.value;
        const termins: any[] = [];
        querySnapshot.forEach((doc: any) => {
          termins.push({ id: doc.id, ...doc.data() });
        });
        allTermins.push(termins);
      } else {
        response
          .status(503)
          .send(JSON.stringify({ step: "getTerminMonthly", ...result.reason }));
      }
    });
    response.send(JSON.stringify(allTermins));
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
