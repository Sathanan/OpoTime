class UserModel {
    constructor(id, name, email, invitation_status) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.invitation_status = invitation_status;
    }
}

export default UserModel;

export function convertJsonToUserModel(json) {
  return new UserModel(json);
}