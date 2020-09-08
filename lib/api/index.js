const { apiClient } = require('buzzle-sdk');

const Admin = require('./admin');
const Category = require('./category');
const VideoTemplate = require('./videoTemplate');
const VideoInvite = require('./videoInvite');
const Order = require('./order');
const User = require('./user');
const ImageTemplate = require('./imageTemplate');
const ImageInvite = require('./imageInvite');

// TODO migrate to TS
/**
 * @param  {} buzzleUrl Buzzle API URl
 * @param  {} firestore firestore instance
 */

module.exports = ({ buzzleUrl = 'http://192.168.0.103:5000', firestore }) => {
  const Buzzle = apiClient({ baseUrl: buzzleUrl });

  return {
    Admin: Admin(firestore),
    Category: Category(firestore),
    Order: Order(firestore),
    VideoInvite: VideoInvite(firestore, Buzzle),
    VideoTemplate: VideoTemplate(firestore, Buzzle),
    User: User(firestore),
    ImageTemplate: ImageTemplate(firestore),
    ImageInvite: ImageInvite(firestore)
  };
};
