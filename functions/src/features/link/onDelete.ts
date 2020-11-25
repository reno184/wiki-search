import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const bucket = admin.storage().bucket();
exports.default = functions
    .region('europe-west1')
    .firestore.document('link/{linkId}')
    .onDelete(doc => {
        return bucket.file('link/' + doc.data().imgpath).delete();
    });
