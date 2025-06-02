class Timestamp {
  constructor(id, user, project, timestamp, type) {
    this.id = id;
    this.user = user;
    this.project = project;
    this.timestamp = timestamp;
    this.type = type;
  }
}

export default Timestamp;

export function convertJsonToTimestamp(json) {
  return new Timestamp(json);
}