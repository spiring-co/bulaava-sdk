module.exports = (firestore, Buzzle) => {
  const ref = firestore().collection('videoInvites');
  const videoTemplatesRef = firestore().collection('videoTemplates');

  const populateVideoInvite = async vi => {
    const buzzleJob = await Buzzle.Job.get(vi._jobId, true)
    const buzzleVideoTemplate = buzzleJob.videoTemplate
    delete buzzleJob['videoTemplate']
    const videoTemplate = await (await videoTemplatesRef.doc(vi.videoTemplateId).get()).data()
    return { buzzleJob, buzzleVideoTemplate, videoTemplate, ...vi };
  };

  const populateVideoTemplate = async vt => {
    return { ...(await Buzzle.VideoTemplate.get(vt._templateId)), ...vt };
  };
  return {
    getAll: async userId => {
      console.log('userId', userId);
      const snapshot = await ref.where('userId', '==', userId).get();
      if (snapshot.empty) return [];

      const videoInvites = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      const results = [];
      for (let videoInvite of videoInvites) {
        try {
          results.push(await populateVideoInvite(videoInvite));
        } catch (err) {
          console.log(err);
        }
      }
      return results;
    },

    get: async id => {
      const snapshot = await ref.doc(id).get();
      const videoInvite = { ...snapshot.data(), id };
      return populateVideoInvite(videoInvite);
    },

    create: async (data = {}, actions = {}, videoTemplateId, versionIndex, userId) => {
      console.log('data', data);
      if (!videoTemplateId) throw new Error(`No template with ID ${videoTemplateId}`);

      const snapshot = await videoTemplatesRef.doc(videoTemplateId).get();
      const videoTemplate = { ...snapshot.data(), id: videoTemplateId };
      const { _templateId, versions } = await populateVideoTemplate(videoTemplate);
      const { id: _jobId } = await Buzzle.Job.create({
        data,
        actions,
        idVideoTemplate: _templateId,
        idVersion: versions[versionIndex].id,
      });

      await ref.doc().set({
        _jobId,
        isPaid: false,
        userId,
        videoTemplateId,
        createdAt: new Date(),
      });
      return true;
    },

    delete: async id => {
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
