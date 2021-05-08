export default (firestore:any) => {
  const ref = firestore().collection("users");
  return {
    get: async (id: any) => {
      const snapshot = await ref.doc(id).get();
      return { ...snapshot.data(), id };
    },

    create: async (data: any) => await ref.doc().set(data),

    delete: async (id: any) => await ref.doc(id).delete(),

    update: async (id: any, data: any) => await ref.doc(id).update(data),
  };
};
