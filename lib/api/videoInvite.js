module.exports = (firestore, Buzzle) => {
  const ref = firestore().collection('videoInvites');
  const videoTemplatesRef = firestore().collection('videoTemplates');
  const usersRef = firestore().collection('users')
  const populateVideoInvite = async vi => {
    const buzzleJob = await Buzzle.Job.get(vi._jobId, true);
    const buzzleVideoTemplate = buzzleJob.videoTemplate;
    delete buzzleJob['videoTemplate'];
    const videoTemplate = await (await videoTemplatesRef.doc(vi.videoTemplateId).get()).data();
    return { buzzleJob, buzzleVideoTemplate, videoTemplate, ...vi };
  };

  const populateVideoTemplate = async vt => {
    return { ...(await Buzzle.VideoTemplate.get(vt._templateId)), ...vt };
  };
  return {
    getAll: async (userId = "", populateUser) => {
      if (userId) {
        const snapshot = await ref.where('userId', '==', userId).get();
        if (snapshot.empty) return [];
        const videoInvites = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));

        // hacker boy code incoming...
        const jobIds = JSON.stringify(videoInvites.map(vi => vi._jobId));
        const jobsData = await fetch(`http://pharaoh-api.herokuapp.com/jobs?ids=${jobIds}`).then(res => res.json());

        const results = [];
        jobsData.map(jd => {
          let invite = videoInvites.find(vi => vi._jobId === jd.id);

          if (invite) {
            invite.buzzleJob = jd;
            invite.buzzleVideoTemplate = jd.videoTemplate;
            results.push(invite);
          }
        });
        return results;
      } else {
        const snapshot = await ref.get()
        if (snapshot.empty) return [];
        const data = snapshot.docs.map(d => {
          return ({
            id: d.id,
            ...d.data(),
            createdAt: d.data().createdAt.toDate() + "",
          })
        })
        return await Promise.all(data.map(async (d) => {
          const { name = "----", email = "----", phone = "----" } = await (await usersRef.doc(d.userId).get()).data() || {}
          return ({ ...d, name, email, phone })
        }))
      }

    },
    get: async id => {
      const snapshot = await ref.doc(id).get();
      const videoInvite = { ...snapshot.data(), id };
      return populateVideoInvite(videoInvite);
    },

    create: async (data = {}, actions = {}, videoTemplateId, versionIndex, userId, renderPrefs) => {
      if (!videoTemplateId) throw new Error(`No template with ID ${videoTemplateId}`);

      const snapshot = await videoTemplatesRef.doc(videoTemplateId).get();
      const videoTemplate = { ...snapshot.data(), id: videoTemplateId };
      const { _templateId, versions } = await populateVideoTemplate(videoTemplate);
      const { id: _jobId } = await Buzzle.Job.create({
        data,
        actions,
        idVideoTemplate: _templateId,
        idVersion: versions[versionIndex].id,
        renderPrefs,
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
