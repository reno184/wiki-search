import * as admin from "firebase-admin";

admin.initializeApp();

exports.onCreateWiki = require('./features/wiki/onCreate');
exports.onDeleteWiki = require('./features/wiki/onDelete');
exports.onUpdateWiki = require('./features/wiki/onUpdate');
exports.onDeleteLink = require('./features/link/onDelete');
exports.onUpdateLink = require('./features/link/onUpdate');
