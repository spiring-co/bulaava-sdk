const { apiClient } = require("buzzle-sdk");

const Category = require("./category");
const VideoTemplate = require("./videoTemplate");
const VideoInvite = require("./videoInvite");
const Order = require("./order");
const User = require("./user");

/**
 * @param  {} buzzleUrl Buzzle API URl
 * @param  {} firestore firestore instance
 */

module.exports = ({ buzzleUrl = "http://192.168.0.103:5000", firestore }) => {
  const Buzzle = apiClient({ baseUrl: buzzleUrl });

  return {
    Category: Category(firestore),
    Order: Order(firestore),
    VideoInvite: VideoInvite(firestore, Buzzle),
    VideoTemplate: VideoTemplate(firestore, Buzzle),
    User: User(firestore),
  };
};
