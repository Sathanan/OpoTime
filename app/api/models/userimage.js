export class UserImage {
  constructor({ image, type, uploaded_at }) {
    this.imageUrl = image; // This will now be the base64 data URL
    this.type = type;
    this.uploadedAt = new Date(uploaded_at);
  }
}

export function convertJsonToUserImage(json) {
  return new UserImage(json);
}