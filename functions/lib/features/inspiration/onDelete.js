"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const bucket = admin.storage().bucket();
exports.default = functions
    .region('europe-west1')
    .firestore.document('link/{inspirationId}')
    .onDelete(snapshot => {
    const url = 'gs://wiki-crm.appspot.com/link/';
    return bucket.file(url + snapshot.data().fileName || '').delete();
});
//# sourceMappingURL=onDelete.js.map