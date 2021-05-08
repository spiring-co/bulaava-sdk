module.exports = (firestore: any, Buzzle: any) => {
  const ref = firestore().collection('videoTemplates');

  const getArrayOfIdsAsQueryString = (field: any, ids: any) => {
    return ids.map((id: any, index: any) => `${index === 0 ? "" : "&"}${field}[]=${id}`).toString().replace(/,/g, "");
  }
  const populateVideoTemplate = async (vt: any) => {
    return { ...(await Buzzle.VideoTemplate.get(vt._templateId)), ...vt };
  };

  return {
    getAll: async (showNotAvailable = false, categoryId: any, page = 0, size = 10) => {
      let snapshot;
      let count;
      if (categoryId) {
        const { size: totalCount = 0 } = await ref.where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId).get()
        count = totalCount
        snapshot = await ref
          .where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId)
          .orderBy('ranking')
          .startAfter(page * size)
          .limit(size)
          .get()

      } else {
        const { size: totalCount = 0 } = await ref.get()
        count = totalCount
        snapshot = await ref
          .orderBy('ranking')
          .startAfter(page * size)
          .limit(size)
          .get()

      }
      if (snapshot.empty) return { data: [], page: page, count: 0 };

      const videoTemplates = snapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data()
      }));

      const populatedTemplates = (await Buzzle.VideoTemplate.getAll(1, videoTemplates.length, getArrayOfIdsAsQueryString('id',
        videoTemplates.map(({
          _templateId
        }: any) => _templateId)))).data
      if (showNotAvailable) {
        return { data: videoTemplates.map((vt: any) => ({
          ...populatedTemplates.find(({
            id
          }: any) => id === vt._templateId),

          ...vt
        })), page: page + 1, count };
      } else {
        const data = videoTemplates.map((vt: any) => ({
          ...populatedTemplates.find(({
            id
          }: any) => id === vt._templateId),

          ...vt
        }))
          .filter(({
          isAvailable,
          _templateId
        }: any) => isAvailable)
        return {
          data, page: page + 1, count: count - (videoTemplates?.length - data.length)
        }
      }

    },
    getRecommendations: async (showNotAvailable = false, categoryId: any, limitCount = false,
      excludedVideoTemplateId = false) => {
      let snapshot;
      if (categoryId) {
        if (limitCount) {
          // only limit the videoTemplates
          snapshot = await ref
            .where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId)
            .limit(limitCount)
            .get()
        } else {
          snapshot = await ref
            .where('categories', typeof categoryId === 'string' ? 'array-contains' : 'array-contains-any', categoryId)
            .get();
        }
      } else {
        if (limitCount) {
          // only limit the videoTemplates
          snapshot = await ref
            .limit(limitCount)
            .get()
        } else {
          snapshot = await ref.get();
        }
      }

      if (snapshot.empty) return [];

      const videoTemplates = snapshot.docs.map((d: any) => ({
        id: d.id,
        ...d.data()
      }));

      const populatedTemplates = (await Buzzle.VideoTemplate.getAll(1, videoTemplates.length, getArrayOfIdsAsQueryString('id',
        videoTemplates.map(({
          _templateId
        }: any) => _templateId)))).data
      if (excludedVideoTemplateId) {
        if (showNotAvailable) {
          return videoTemplates.map((vt: any) => ({
            ...populatedTemplates.find(({
              id
            }: any) => id === vt._templateId),

            ...vt
          }))
            .filter(({
            _templateId
          }: any) => _templateId !== excludedVideoTemplateId);
        } else {
          return videoTemplates.map((vt: any) => ({
            ...populatedTemplates.find(({
              id
            }: any) => id === vt._templateId),

            ...vt
          }))
            .filter(({
            isAvailable,
            _templateId
          }: any) => isAvailable && _templateId !== excludedVideoTemplateId);
        }
      } else {
        if (showNotAvailable) {
          return videoTemplates.map((vt: any) => ({
            ...populatedTemplates.find(({
              id
            }: any) => id === vt._templateId),

            ...vt
          }));
        } else {
          return videoTemplates.map((vt: any) => ({
            ...populatedTemplates.find(({
              id
            }: any) => id === vt._templateId),

            ...vt
          }))
            .filter(({
            isAvailable,
            _templateId
          }: any) => isAvailable);
        }
      }
    },

    get: async (id: any) => {
      const snapshot = await ref.doc(id).get();
      const videoTemplate = { ...snapshot.data(), id };

      return populateVideoTemplate(videoTemplate);
    },

    create: async (data: any) => {
      const id = Math.random()
        .toString()
        .slice(2, 15);
      await ref.doc(id).set(data);
      return id;
    },

    delete: async (id: any) => await ref.doc(id).delete(),

    update: async (id: any, data: any) => await ref.doc(id).update(data),
  };
};


