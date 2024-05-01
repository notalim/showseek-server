import db from "../config/firebase-admin.js";
import { DocumentData } from "firebase-admin/firestore";

export async function deleteAllDocumentsInCollection(collectionPath: string) {
    const collectionRef = db.collection(collectionPath);
    const batchSize = 500;

    const query = collectionRef.limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(
    query: any,
    batchSize: number,
    resolve: any,
    reject: any
) {
    query
        .get()
        .then((snapshot: any) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            const batch = db.batch();
            snapshot.docs.forEach((doc: any) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        })
        .then((numDeleted: number) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }
     
            process.nextTick(() => {
                deleteQueryBatch(query, batchSize, resolve, reject);
            });
        })
        .catch(reject);
}
