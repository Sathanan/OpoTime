class UserInfoForDisplay {
    constructor(email, username, profile_image) {
      this.username = username;
      this.email = email;
      this.profile_image = profile_image;
    }
  }
  
  export default UserInfoForDisplay;
  
  export function convertJsonToUserInfoForDisplay(json) {
    if (Array.isArray(json)) {
      return json.map(item => new UserInfoForDisplay(
        item.email,
        item.username,
        item.profile_image
      ));
    }
    return new UserInfoForDisplay(
      json.email,
      json.username,
      json.profile_image
    );
  }