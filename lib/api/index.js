import BuzzleSdk from "buzzle-sdk";

import User from "./user";
import Order from "./order";
import Admin from "./admin";
import Category from "./category";
import VideoInvite from "./videoInvite";
import ImageInvite from "./imageInvite";
import VideoTemplate from "./videoTemplate";
import ImageTemplate from "./imageTemplate";

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
