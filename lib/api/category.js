export default (firestore) => {
  const ref = firestore().collection("categories");

  return {
    getAll: async () => {
      const snapshot = await ref.get();
      if (snapshot.isEmpty) return [];

      return snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.rank > b.rank ? 0 : -1));
    },

    get: async (id) => {
      const snapshot = await ref.doc(id).get();
      return { ...snapshot.data(), id };
    },

    create: async (data) => await ref.doc().set(data),

    delete: async (id) => await ref.doc(id).delete(),

    update: async (id, data) => await ref.doc(id).update(data),
  };
};
