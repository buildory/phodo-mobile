export type SupportRole = "photographer" | "model";
export type UserType = "male" | "female" | "self";

const markerMap = {
  bubble: {
    photographer: {
      male: require("@/assets/images/markers/photographer_male_bubble.png"),
      female: require("@/assets/images/markers/photographer_female_bubble.png"),
      self: require("@/assets/images/markers/photographer_self_bubble.png"),
    },
    model: {
      male: require("@/assets/images/markers/model_male_bubble.png"),
      female: require("@/assets/images/markers/model_female_bubble.png"),
      self: require("@/assets/images/markers/model_self_bubble.png"),
    },
  },
  always: {
    photographer: {
      male: require("@/assets/images/markers/photographer_male.png"),
      female: require("@/assets/images/markers/photographer_female.png"),
      self: require("@/assets/images/markers/photographer_self.png"),
    },
    model: {
      male: require("@/assets/images/markers/model_male.png"),
      female: require("@/assets/images/markers/model_female.png"),
      self: require("@/assets/images/markers/model_self.png"),
    },
  },
};

export const getMarkerImage = (
  recruitType: "bubble" | "default",
  role: SupportRole,
  userType: UserType
): any => {
  return markerMap[recruitType][role][userType];
};
