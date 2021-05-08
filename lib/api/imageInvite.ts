export default (firestore:any) => {
  try {
    const ref = firestore().collection('imageInvites');
    return {
      getAll: async (userId: any) => {
        const snapshot = await ref.where('userId', '==', userId).get();
        if (snapshot.isEmpty) return [];
        return snapshot.docs.map((doc: any) => ({
          ...doc.data(),
          inviteId: doc.id
        }));
      },
      get: async (id: any) => {
        const snapshot = await ref.doc(id).get();
        if (!snapshot.exists) throw new Error('Invalid Invite Id');
        return { inviteId: id, ...snapshot.data() };
      },
      delete: async (id: any) => await ref.doc(id).delete(),
      update: async (id: any, data: any) => await ref.doc(id).update(data),
      create: async (data: any) => {
        console.log(data);
        const id = Math.random()
          .toString()
          .slice(2, 15);
        await ref.doc(id).set(data);
        return id;
      },
    };
  } catch (err) {
    console.log(err);
  }
};
