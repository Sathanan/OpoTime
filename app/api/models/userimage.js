export class UserImage {
  constructor({ id, user, image_url, image_id, type, uploaded_at }) {
    this.id = id;
    this.user = user;
    this.imageUrl = image_url;
    this.imageId = image_id;
    this.type = type;
    this.uploadedAt = new Date(uploaded_at);
  }
}

export function convertJsonToUserImage(json) {
  return new UserImage(json);
}