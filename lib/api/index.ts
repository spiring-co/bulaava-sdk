import BuzzleSdk from  "buzzle-sdk";
const Admin = require("./admin");
const Category = require("./category");
const VideoTemplate = require("./videoTemplate");
const VideoInvite = require("./videoInvite");
const Order = require("./order");
const User = require("./user");
const ImageTemplate = require("./imageTemplate");
const ImageInvite = require("./imageInvite");

/**
 * @param  {} buzzleUrl Buzzle API URl
 * @param  {} firestore firestore instance
 */

const main = ({
  buzzleUrl = "http://buzzle-dev.herokuapp.com",
  firestore,
  buzzleAuthToken = null,
}) => {
  const Buzzle = BuzzleSdk.apiClient({
    baseUrl: buzzleUrl,
    authToken: buzzleAuthToken,
  });

  return {
    Admin: Admin(firestore),
    Category: Category(firestore),
    Order: Order(firestore),
    VideoInvite: VideoInvite(firestore, Buzzle),
    VideoTemplate: VideoTemplate(firestore, Buzzle),
    User: User(firestore),
    ImageTemplate: ImageTemplate(firestore),
    ImageInvite: ImageInvite(firestore),
  };
};

export default main;