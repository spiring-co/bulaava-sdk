export default (firestore:any) => {
  const ref = firestore().collection("categories");

  return {
    getAll: async () => {
      const snapshot = await ref.get();
      if (snapshot.isEmpty) return [];

      return snapshot.docs
        .map((d: any) => ({
        id: d.id,
        ...d.data()
      }))
        .sort((a: any, b: any) => (a.rank > b.rank ? 0 : -1));
    },

    get: async (id: any) => {
      const snapshot = await ref.doc(id).get();
      return { ...snapshot.data(), id };
    },

    create: async (data: any) => await ref.doc().set(data),

    delete: async (id: any) => await ref.doc(id).delete(),

    update: async (id: any, data: any) => await ref.doc(id).update(data),
  };
};
