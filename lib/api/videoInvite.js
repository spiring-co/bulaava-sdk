export default (Buzzle) => {
  const ref = firestore().collection("videoInvites");

  const populateVideoInvite = async (vi) => {
    return { ...(await Buzzle.Job.get(vi._jobId, true)), ...vi };
  };

  return {
    getAll: async (userId) => {
      console.log("userId", userId);
      const snapshot = await ref.where("userId", "==", userId).get();
      if (snapshot.empty) return [];

      const videoInvites = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      return Promise.all(videoInvites.map(populateVideoInvite));
    },

    get: async (id) => {
      const snapshot = await ref.doc(id).get();
      const videoInvite = { ...snapshot.data(), id };

      return populateVideoInvite(videoInvite);
    },

    create: async (
      data = {},
      actions = {},
      videoTemplateId,
      versionIndex,
      userId
    ) => {
      console.log("data", data);
      if (!videoTemplateId)
        throw new Error(`No template with ID ${videoTemplateId}`);

      const snapshot = await videoTemplateRef.doc(videoTemplateId).get();
      const videoTemplate = { ...snapshot.data(), id: videoTemplateId };
      const { _templateId, versions } = await populateVideoTemplate(
        videoTemplate
      );
      const { id: _jobId } = await Buzzle.Job.create({
        data,
        actions,
        idVideoTemplate: _templateId,
        idVersion: versions[versionIndex].id,
      });

      await ref.doc().set({
        _jobId,
        userId,
        videoTemplateId,
        createdAt: new Date(),
      });
      return true;
    },

    delete: async (id) => {
      const { _jobId } = (await ref.doc(id).get()).data();
      console.log(_jobId);
      await Buzzle.Job.delete(_jobId);
      await ref.doc(id).delete();
    },

    update: async (id, data = {}, actions = {}) => {
      await ref.doc(id).update(data);
      const { _jobId } = (await ref.doc(id).get()).data();
      await Buzzle.Job.update(_jobId, {
        data,
        actions,
      });
      return true;
    },
  };
};
