import * as functions from "firebase-functions";

import  algoliasearch from 'algoliasearch';

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;
const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('wiki');


exports.default = functions
    .region('europe-west1')
    .firestore.document('wiki/{wikiId}')
    .onUpdate((change) => {
        const data = change.after.data();
        console.log('---------------data',data);
        const objectID = change.after.id;
        console.log('---------------objectId',objectID);
        return index.partialUpdateObject({...data, objectID})
    });
