import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

const bucket = admin.storage().bucket();
exports.default = functions
    .region('europe-west1')
    .firestore.document('link/{inspirationId}')
    .onDelete(snapshot => {
            const url = 'gs://wiki-crm.appspot.com/link/'
            return    bucket.file(url + snapshot.data().fileName || '' ).delete();
    });
