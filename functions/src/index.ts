import { getAuth, ListUsersResult } from "firebase-admin/auth";
import {
  DocumentData,
  getFirestore,
  QuerySnapshot,
} from "firebase-admin/firestore";
import { merge } from "lodash";
import { https, Request, Response } from "firebase-functions";
import * as admin from "firebase-admin";
import { applicationDefault } from "firebase-admin/app";
// import { defaultAuth, defaultDatabase } from "./firebase";

// firebase stuff
admin.initializeApp({ credential: applicationDefault() });

// returns a list of all users
export const allusers = https.onRequest(
  (request: Request, response: Response) => {
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
