import { https, Request, Response, logger } from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = https.onRequest(
  (request: Request, response: Response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
  }
);
