export default (firestore) => {
  const ref = firestore().collection("imageInvites");

  return {
    getAll: async (userId) => {
      if (!userId) throw new Error("User ID is required");

      const snapshot = await ref.where("userId", "==", userId).get();
      if (snapshot.isEmpty) return [];

      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        inviteId: doc.id,
      }));
    },

    get: async (id) => {
      const snapshot = await ref.doc(id).get();
      if (!snapshot.exists) throw new Error("Invalid Invite Id");

      return { inviteId: id, ...snapshot.data() };
    },

    delete: async (id) => await ref.doc(id).delete(),

    update: async (id, data) => await ref.doc(id).update(data),

    create: async (data) => {
      const id = Math.random().toString().slice(2, 15);

      await ref.doc(id).set(data);

      return id;
    },
  };
};
