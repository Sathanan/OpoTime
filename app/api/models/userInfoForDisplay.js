class UserInfoForDisplay {
    constructor(email, profile_image, username) {
      this.username = username;
      this.email = email;
      this.profile_image = profile_image;
    }
  }
  
  export default UserInfoForDisplay;
  
  export function convertJsonToUserInfoForDisplay(json) {
    if (Array.isArray(json)) {
      return json.map(item => new UserInfoForDisplay(
        item.username,
        item.email,
        item.profile_image
      ));
    }
    return new UserInfoForDisplay(
      json.username,
      json.email,
      json.profile_image
    );
  }