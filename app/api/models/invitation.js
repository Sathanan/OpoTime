class Invitation {
  constructor(id, fromUser, toUser, project, timestamp, status) {
    this.id = id,
    this.fromUser = fromUser;
    this.toUser = toUser;
    this.project = project;
    this.timestamp = timestamp;
    this.status = status;
  }
}

export default Invitation;