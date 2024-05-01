import db from "../config/firebase-admin.js";

export const setDocument = async (
    collection: string,
    docId: string,
    data: Record<string, any>
) => {
    const docRef = db.collection(collection).doc(docId);
    await docRef.set(data);
    return docRef.id; 
};

export const getDocument = async (collection: string, docId: string) => {
    // TODO: Implement caching mechanism if necessary
    const doc = await db.collection(collection).doc(docId).get();
    return doc.exists ? doc.data() : null;
};
