module.exports = (firestore: any) => {
  console.log("firestore:", firestore);
  const ref = firestore().collection("admins");
  return {
    get: async (id: any) => {
      const snapshot = await ref.doc(id).get();
      if (snapshot.isEmpty) return null;
      return { ...snapshot.data(), id };
    },

    create: async (data: any) => await ref.doc().set(data),

    delete: async (id: any) => await ref.doc(id).delete(),

    update: async (id: any, data: any) => await ref.doc(id).update(data),
  };
};
