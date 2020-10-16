module.exports = (firestore, Buzzle) => {
  const ref = firestore().collection('videoTemplates');

  const getArrayOfIdsAsQueryString = (field, ids) => {
    return ids.map((id, index) => `${index === 0 ? "" : "&"}${field}[]=${id}`).toString().replace(/,/g, "")
  }
  const populateVideoTemplate = async vt => {
    return { ...(await Buzzle.VideoTemplate.get(vt._templateId)), ...vt };
  };

  return {
    getAll: async categoryId => {
      let snapshot;
      if (categoryId) {
        snapshot = await ref
          .where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId)
          .get();
      } else {
        snapshot = await ref.get();
      }

      if (snapshot.empty) return [];

      const videoTemplates = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      const populatedTemplates = (await Buzzle.VideoTemplate.getAll(1, videoTemplates.length, getArrayOfIdsAsQueryString('id',
        videoTemplates.map(({ _templateId }) => _templateId)))).data
      return videoTemplates.map(vt => ({ ...populatedTemplates.find(({ id }) => id === vt._templateId), ...vt }))
    },

    get: async id => {
      const snapshot = await ref.doc(id).get();
      const videoTemplate = { ...snapshot.data(), id };

      return populateVideoTemplate(videoTemplate);
    },

    create: async data => {
      const id = Math.random()
        .toString()
        .slice(2, 15);
      await ref.doc(id).set(data);
      return id;
    },

    delete: async id => await ref.doc(id).delete(),

    update: async (id, data) => await ref.doc(id).update(data),
  };
};


