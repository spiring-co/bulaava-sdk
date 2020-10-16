module.exports = (firestore, Buzzle) => {
  const ref = firestore().collection('videoInvites');
  const videoTemplatesRef = firestore().collection('videoTemplates');
  const getArrayOfIdsAsQueryString = (field, ids) => {
    return ids.map((id, index) => `${index === 0 ? "" : "&"}${field}[]=${id}`).toString().replace(/,/g, "")
  }
  const populateVideoInvite = async vi => {
    const buzzleJob = await Buzzle.Job.get(vi._jobId, true);
    const buzzleVideoTemplate = buzzleJob.videoTemplate;
    delete buzzleJob['videoTemplate'];
    const videoTemplate = await (await videoTemplatesRef.doc(vi.videoTemplateId).get()).data();
    console.log(videoTemplate, vi)
    return { buzzleJob, buzzleVideoTemplate, videoTemplate, ...vi };
  };

  const populateVideoTemplate = async vt => {
    return { ...(await Buzzle.VideoTemplate.get(vt._templateId)), ...vt };
  };
  return {
    getAll: async userId => {
      const snapshot = await ref.where('userId', '==', userId).get();
      if (snapshot.empty) return [];
      const videoInvites = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      const populateJobs = (await Buzzle.Job.getAll(1, videoInvites.length, getArrayOfIdsAsQueryString('id',
        videoInvites.map(vi => vi._jobId)))).data
      const results = [];
      populateJobs.map(jd => {
        let invite = videoInvites.find(vi => vi._jobId === jd.id);
        if (invite) {
          invite.buzzleJob = jd;
          invite.buzzleVideoTemplate = jd.videoTemplate;
          results.push(invite);
        }
      });
      return results;
    },
    get: async id => {
      const snapshot = await ref.doc(id).get();
      const videoInvite = { ...snapshot.data(), id };
      return populateVideoInvite(videoInvite);
    },

    create: async (data = {}, actions = {}, videoTemplate, idVersion, userId, renderPrefs) => {
      const { id = "", _templateId = "" } = videoTemplate // id is document id, _templateId is buzzle videoTemplate id
      if (!_templateId) throw new Error(`No template with ID ${_templateId}`);
      if (!idVersion) throw new Error(`No template with Version ID ${idVersion}`);
      const { id: _jobId } = await Buzzle.Job.create({
        data,
        actions,
        idVideoTemplate: _templateId,
        idVersion,
        renderPrefs,
      });
      const date = new Date()
      await ref.doc().set({
        _jobId,
        userId,
        videoTemplateId: id,
        createdAt: date,
        updatedAt: date
      });
      return true;
    },

    delete: async id => {
      const { _jobId } = (await ref.doc(id).get()).data();
      await Buzzle.Job.delete(_jobId);
      await ref.doc(id).delete();
    },

    update: async (id, data = {}, actions = {}, renderPrefs = {}) => {
      const { _jobId } = (await ref.doc(id).get()).data();
      await Buzzle.Job.update(_jobId, {
        data,
        actions,
        renderPrefs
      });
      await ref.doc(id).update({
        updatedAt: new Date(),
      });
      return true;
    },
  };
};
