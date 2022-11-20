import { getAuth, ListUsersResult } from "firebase-admin/auth";
import {
  DocumentData,
  getFirestore,
  QuerySnapshot,
} from "firebase-admin/firestore";
import { merge } from "lodash";
import { https, logger, Request, Response } from "firebase-functions";
import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

// import { defaultAuth, defaultDatabase } from "./firebase";

// firebase stuff
admin.initializeApp({ credential: applicationDefault() });
// init emulators

function wraper(
  request: Request,
  response: Response,
  cb: (param0: Request, param1: Response) => void
) {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");

  cb(request, response);
}

export const allUsers = https.onRequest(
  (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST");

    const defaultAuth = getAuth();
    defaultAuth.listUsers().then((usersList: ListUsersResult) => {
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

      response.send(JSON.stringify(filtered));
    }).catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "list", ...err }));
    });
  }
);

export const user = https.onRequest(
  (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST");
    
    const data = request.body;
    const defaultAuth = getAuth();
    defaultAuth.getUser(data.uuid).then((user) => {
      const filtered = {
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

      response.send(JSON.stringify(filtered));
    }).catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "user", ...err }));
    });
  }
);

export const me = https.onRequest(
  (request: Request, response: Response) => {
    const auth = request.headers.authorization;
    getAuth().verifyIdToken(auth || "").then((decodedToken) => {
      const uuid = decodedToken.uid;
      getAuth().getUser(uuid).then((user) => {
        const filtered = {
          uuid: user.uid,
          email: user.email,
          phoneNumber: user.phoneNumber,
          name: user.customClaims?.name,
          surname: user.customClaims?.surname,
          room: user.customClaims?.room,
          confirmed: user.customClaims?.confirmed,
          banStatus: user.disabled,
        };

        response.send(JSON.stringify(filtered));
      }).catch((err: Error) => {
        response.status(503).send(JSON.stringify({ step: "me-getuser", ...err }));
      });
    }).catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "me", ...err }));
    });
  }
);

export const registerUser = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    const email: string = data.email;
    const name: string = data.name;
    const surname: string = data.surname;
    const room: number = data.room;
    const password: string = data.password;
    const phone: string = data.phone;

    const defaultAuth = getAuth();
    defaultAuth
      .createUser({
        email: email,
        password: password,
        phoneNumber: phone,
      })
      .then((user) => {
        defaultAuth
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
            response
              .status(503)
              .send(JSON.stringify({ step: "claim", ...err }));
          });
      })
      .catch((err: Error) => {
        response.status(503).send(JSON.stringify({ step: "create", ...err }));
      });
  }
);

export const deleteUser = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    const uuid: string = data.uuid;

    const defaultAuth = getAuth();
    defaultAuth.deleteUser(uuid).then(() => {
      response.sendStatus(200);
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "delete", ...err }));
    });
  }
);

export const setRole = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    const uuid: string = data.uuid;
    const role: string = data.role;

    const defaultAuth = getAuth();
    defaultAuth.setCustomUserClaims(uuid, {
      role: role,
    })
    .then(() => {
      response.sendStatus(200);
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "role", ...err }));
    });
  }
);

export const setConfirmed = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    const uuid: string = data.uuid;
    const confirmed: boolean = data.confirmed;

    const defaultAuth = getAuth();
    defaultAuth.setCustomUserClaims(uuid, {
      confirmed: confirmed,
    })
    .then(() => {
      response.sendStatus(200);
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "confirm", ...err }));
    });
  }
);

export const setBan = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    const uuid: string = data.uuid;
    const banned: boolean = data.banned;

    const defaultAuth = getAuth();
    defaultAuth
      .updateUser(uuid, {
        disabled: banned,
      })
      .then(() => {
        response.sendStatus(200);
      })
      .catch((err: Error) => {
        response.status(503).send(JSON.stringify({ step: "ban", ...err }));
      });
  }
);


/*
  tid - random generated
  uuid - user uuid
  washingId - id of washing machine
  termin - [0-7] 8 terminov / dan
  date
*/


export const addAllocation = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    const uuid: string = data.uuid;
    const washingId: number = data.washingId;
    const termin: number = data.termin;
    const date: string = data.date;

    const defaultDatabase = getFirestore();
    defaultDatabase.collection("washing").add({
      uuid: uuid,
      washingId: washingId,
      termin: termin,
      date: date,
    }).then(() => {
      response.sendStatus(200);
    }).catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "addWash", ...err }));
    });
  }
);

export const getAllocations = https.onRequest(
  (request: Request, response: Response) => {
    const defaultDatabase = getFirestore();
  }
);

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
