module.exports = firestore => {
  try {
    const ref = firestore().collection('imageTemplates');
    return {
      getAll: async () => {
        const snapshot = await ref.get();
        if (snapshot.isEmpty) return [];
        return snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
      },
      get: async id => {
        const snapshot = await ref.doc(id).get();
        if (snapshot.isEmpty) return [];

        return snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
      },
      delete: async id => await ref.doc(id).delete(),
      update: async (id, data) => {
        const snap = ref.doc(id)
        if ((await snap.get()).exists) {
          await snap.update(data)
        } else {
          await snap.set({
            isAvailable: false,
            price: 0, ranking: 0,
            keywords: [],
            categories: [], ...data
          })
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}
