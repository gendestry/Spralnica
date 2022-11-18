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

// returns a list of all users
export const allUsers = https.onRequest(
  (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST");

    const defaultAuth = getAuth();
    const defaultDatabase = getFirestore();

    const promises: [
      Promise<ListUsersResult>,
      Promise<QuerySnapshot<DocumentData>>
    ] = [defaultAuth.listUsers(), defaultDatabase.collection("users").get()];

    Promise.all(promises)
      .then((values) => {
        const filtered = values[0].users.map((user) => {
          return {
            uuid: user.uid, // CHECK IF NOT MERGING
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            disabled: user.disabled,
            metadata: user.metadata,
          };
        });
        const usersFromDatabase = values[1].docs.map((doc) => {
          return {
            uuid: doc.id,
            ...doc.data(),
          };
        });
        // merge objects with same uuid
        const merged = merge(filtered, usersFromDatabase);
        response.send(JSON.stringify(merged));
      })
      .catch((error) => {
        // logger.error(error, { structuredData: true });
        response.status(500).send(error);
      });
  }
);

export const registerUser = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    // const uuid: string = data.uuid;
    const email: string = data.email;
    const name: string = data.name;
    const surname: string = data.string;
    const room: number = data.room;
    const password: string = data.password;
    const phone: string = data.phone;

    const defaultAuth = getAuth();
    defaultAuth
      .createUser({
        // await.....
        email: email,
        password: password,
        phoneNumber: phone,
      })
      .then((user) => {
        // console.log(user);
        // response.sendStatus(200);
        defaultAuth
          .setCustomUserClaims(user.uid, {
            name: name,
            surname: surname,
            room: room,
            role: "user",
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

    // const defaultDatabase = getFirestore();
  }
);

// when a user is successfully registered, call this endpoint to initialize the user
// export const postRegister = https.onRequest(
//   (request: Request, response: Response) => {
//     const data = request.body;
//     logger.info(data, { structuredData: true });
//     // read: "uuid", "name", "surname", "room" from data
//     const uuid: string = data.uuid;
//     const name: string = data.name;
//     const surname: string = data.surname;
//     const room: number = data.room;

//     const defaultDatabase = getFirestore();
//     // create a new document in the "users" collection
//     defaultDatabase
//       .collection("users")
//       .add({
//         uuid,
//         name,
//         surname,
//         room,
//         confirmed: false,
//       })
//       .then(() => {
//         response.send("success");
//       })
//       .catch((error) => {
//         // user could not be initialized. Remove the user from the auth list
//         const defaultAuth = getAuth();
//         defaultAuth
//           .deleteUser(uuid)
//           .then(() => {
//             response.status(500).send(error);
//           })
//           .catch((error) => {
//             response.status(500).send(error);
//           });
//       });
//   }
// );

// toggle user enabled
export const setConfirmed = https.onRequest(
  (request: Request, response: Response) => {
    const data = request.body;
    const uuid: string = data.uuid;
    const confirmed: boolean = data.confirmed;

    const defaultDatabase = getFirestore();
    defaultDatabase
      .collection("users")
      .select("uuid", "==", uuid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          doc.ref.update({ confirmed });
        });
      })
      .then(() => {
        response.send("success");
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  }
);

// ban user from auth
export const banUser = https.onRequest(
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
        response.send("success");
      })
      .catch((error) => {
        response.status(500).send(error);
      });
  }
);
