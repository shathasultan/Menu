const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { logger } = require('firebase-functions');

initializeApp();

// Keeps the `admin` custom claim on the Auth user in sync with the `role`
// field on their users/{uid} Firestore doc. Admin is still granted the same
// way as before (manually setting role: 'admin' on the doc via console) —
// this just mirrors that onto the auth token so Firestore rules can check
// request.auth.token.admin instead of reading the doc with get(), which
// Firestore refuses for list/collectionGroup query provability.
exports.syncAdminClaim = onDocumentWritten('users/{uid}', async (event) => {
  const uid = event.params.uid;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  const isAdmin = after?.role === 'admin';

  try {
    await getAuth().setCustomUserClaims(uid, { admin: isAdmin });
    logger.info(`Synced admin claim for ${uid}: ${isAdmin}`);
  } catch (err) {
    logger.error(`Failed to sync admin claim for ${uid}`, err);
  }
});
