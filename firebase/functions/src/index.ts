import { getAuth, ListUsersResult } from "firebase-admin/auth";
import {
  DocumentData,
  getFirestore,
  QuerySnapshot,
} from "firebase-admin/firestore";
import { https, logger, Request, Response } from "firebase-functions";
import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";

// import { defaultAuth, defaultDatabase } from "./firebase";

// firebase stuff
admin.initializeApp({ credential: applicationDefault() });

export const allUsers = https.onRequest(
  (request: Request, response: Response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set("Access-Control-Allow-Methods", "GET, POST");
    response.set(
      "Access-Control-Allow-Headers",
      "append,delete,entries,foreach,get,has,keys,set,values,Authorization"
    );

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

        response.send(JSON.stringify(filtered));
      })
      .catch((err: Error) => {
        response.status(503).send(JSON.stringify({ step: "list", ...err }));
      });
  }
);

export const user = https.onRequest((request: Request, response: Response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");

  const data = request.body;
  const defaultAuth = getAuth();
  defaultAuth
    .getUser(data.uuid)
    .then((user) => {
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
    })
    .catch((err: Error) => {
      response.status(503).send(JSON.stringify({ step: "user", ...err }));
    });
});

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
    defaultAuth
      .deleteUser(uuid)
      .then(() => {
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
    defaultAuth
      .setCustomUserClaims(uuid, {
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
    const defaultAuth = getAuth();

    console.log(data);

    defaultAuth
      .setCustomUserClaims(uuid, {
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
