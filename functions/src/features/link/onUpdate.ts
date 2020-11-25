import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const bucket = admin.storage().bucket();
exports.default = functions
    .region('europe-west1')
    .firestore.document('link/{linkId}')
    .onUpdate(async (change, context) => {
        if (change.before.data().imgpath !== change.after.data().imgpath) {
            await bucket.file('link/' + change.before.data().imgpath).delete();
        }
        return;
    });
