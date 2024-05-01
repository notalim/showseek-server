import db from "../config/firebase-admin.js";
export async function deleteAllDocumentsInCollection(collectionPath) {
    const collectionRef = db.collection(collectionPath);
    const batchSize = 500;
    const query = collectionRef.limit(batchSize);
    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, batchSize, resolve, reject);
    });
}
function deleteQueryBatch(query, batchSize, resolve, reject) {
    query
        .get()
        .then((snapshot) => {
        // When there are no documents left, we are done
        if (snapshot.size === 0) {
            return 0;
        }
        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        return batch.commit().then(() => {
            return snapshot.size;
        });
    })
        .then((numDeleted) => {
        if (numDeleted === 0) {
            resolve();
            return;
        }
        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(query, batchSize, resolve, reject);
        });
    })
        .catch(reject);
}
