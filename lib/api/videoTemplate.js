module.exports = (firestore, Buzzle) => {
  const ref = firestore().collection("videoTemplates");

  const populateVideoTemplate = async (vt) => {
    return { ...(await Buzzle.VideoTemplate.get(vt._templateId)), ...vt };
  };

  return {
    getAll: async (categoryId) => {
      if (categoryId) {
        const snapshot = await ref
          .where("categories", "array-contains", categoryId)
          .get();
        if (snapshot.empty) return [];
        const videoTemplates = snapshot.docs.map((d) => d.data());
        return Promise.all(videoTemplates.map(populateVideoTemplate));
      } else {
        const snapshot = await ref.get();
        if (snapshot.empty) return [];

        const videoTemplates = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        return Promise.all(videoTemplates.map(populateVideoTemplate));
      }
    },

    get: async (id) => {
      const snapshot = await ref.doc(id).get();
      const videoTemplate = { ...snapshot.data(), id };

      return populateVideoTemplate(videoTemplate);
    },

    create: async (data) => await ref.doc().set(data),

    delete: async (id) => await ref.doc(id).delete(),

    update: async (id, data) => await ref.doc(id).update(data),
  };
};
