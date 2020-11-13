"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const algoliasearch = require('algoliasearch');
const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('wiki');
exports.default = functions
    .region('europe-west1')
    .firestore.document('wiki/{wikiId}')
    .onDelete(snapshot => {
    return index.deleteObject(snapshot.id);
});
//# sourceMappingURL=onDelete.js.map