export type SupportRole = "photographer" | "model";
export type UserType = "male" | "female" | "prefer_not_to_say" | "self" | "admin";

const markerMap = {
  bubble: {
    photographer: {
      male: require("@/assets/images/markers/photographer_male_bubble.png"),
      female: require("@/assets/images/markers/photographer_female_bubble.png"),
      prefer_not_to_say: require("@/assets/images/markers/photographer_none_bubble.png"),
      self: require("@/assets/images/markers/photographer_self_bubble.png"),
      admin: require("@/assets/images/markers/photographer_admin_bubble.png"),
    },
    model: {
      male: require("@/assets/images/markers/model_male_bubble.png"),
      female: require("@/assets/images/markers/model_female_bubble.png"),
      prefer_not_to_say: require("@/assets/images/markers/model_none_bubble.png"),
      self: require("@/assets/images/markers/model_self_bubble.png"),
      admin: require("@/assets/images/markers/model_admin_bubble.png"),
    },
  },
  always: {
    photographer: {
      male: require("@/assets/images/markers/photographer_male_always.png"),
      female: require("@/assets/images/markers/photographer_female_always.png"),
      prefer_not_to_say: require("@/assets/images/markers/photographer_none_always.png"),
      self: require("@/assets/images/markers/photographer_self_always.png"),
      admin: require("@/assets/images/markers/photographer_admin_always.png"),
    },
    model: {
      male: require("@/assets/images/markers/model_male_always.png"),
      female: require("@/assets/images/markers/model_female_always.png"),
      prefer_not_to_say: require("@/assets/images/markers/model_none_always.png"),
      self: require("@/assets/images/markers/model_self_always.png"),
      admin: require("@/assets/images/markers/model_admin_always.png"),
    },
  },
};

export const getMarkerImage = (
  display: "bubble" | "always",
  role: SupportRole,
  userType: UserType
): any => {
  return markerMap[display][role][userType];
};
