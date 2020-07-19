module.exports = (firestore) => {
  const ref = firestore().collection("users");
  return {
    get: async (id) => {
      const snapshot = await ref.doc(id).get();
      return { ...snapshot.data(), id };
    },

    create: async (data) => await ref.doc().set(data),

    delete: async (id) => await ref.doc(id).delete(),

    update: async (id, data) => await ref.doc(id).update(data),
  };
};
