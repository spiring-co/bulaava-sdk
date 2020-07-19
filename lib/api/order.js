module.exports = (firestore) => {
  const ref = firestore().collection("orders");

  return {
    getAll: async () => {
      const snapshot = await ref.get();
      if (snapshot.isEmpty) return [];

      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    },

    getByUser: async (userId) => {
      const snapshot = await ref.where("userId", "==", userId).get();
      if (snapshot.empty) return [];

      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      return orders;
    },

    get: async (id) => {
      const snapshot = await ref.doc(id).get();
      return { ...snapshot.data(), id };
    },

    create: async ({ value, userId, productId, paymentGateway, paymentReference }) => {
      const snapshot = await ref.where("productId", "==", productId).get();
      if (!snapshot.empty) throw new Error("An order for this product already exists!");

      await ref.doc().set({
        value,
        userId,
        productId,
        paymentGateway,
        paymentReference,
        createdAt: new Date(),
      });

      return true;
    },

    delete: async (id) => await ref.doc(id).delete(),

    update: async (id, data) => await ref.doc(id).update(data),
  };
};
