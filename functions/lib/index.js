"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
/*exports.onCreateWiki = require('./features/wiki/onCreate');
exports.onDeleteWiki = require('./features/wiki/onDelete');
exports.onUpdateWiki = require('./features/wiki/onUpdate');
exports.onDeleteInspiration = require('./features/link/onDelete');*/
exports.tt = functions.region('europe-west1')
    .https.onRequest(async (req, res) => {
    const db = admin.firestore();
    const promises = [];
    promises.push(db.runTransaction(async (t) => {
        const inspirations = await db.collection('inspiration').get();
        inspirations.forEach(doc => {
            t.set(db.collection('link').doc(doc.id), {
                category: 'inspiration',
                id: doc.id,
                content: doc.data().content || '',
                desc: doc.data().desc || '',
                imgurl: doc.data().url || '',
                imgpath: '',
                extlink: '',
            });
        });
    }));
    promises.push(db.runTransaction(async (t) => {
        const tools = await db.collection('toread').get();
        tools.forEach(doc => {
            t.set(db.collection('link').doc(doc.id), {
                category: 'lecture',
                id: doc.id,
                content: doc.data().content || '',
                desc: doc.data().desc || '',
                imgurl: '',
                imgpath: '',
                extlink: doc.data().url || '',
            });
        });
    }));
    promises.push(db.runTransaction(async (t) => {
        const tools = await db.collection('tool').get();
        tools.forEach(doc => {
            t.set(db.collection('link').doc(doc.id), {
                category: 'outil',
                id: doc.id,
                content: doc.data().content || '',
                desc: doc.data().desc || '',
                imgurl: '',
                imgpath: '',
                extlink: doc.data().url || '',
            });
        });
    }));
    await Promise.all(promises);
    res.sendStatus(200);
});
//# sourceMappingURL=index.js.map