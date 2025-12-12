export type AccountTab = "profile" | "security";

export type DeviceInfo = {
  type: "desktop" | "mobile";
  name: string;
  lastActive: string;
  current: boolean;
};

export type SocialProvider = {
  name: string;
  connected: boolean;
};
