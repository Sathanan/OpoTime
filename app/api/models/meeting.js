class Meeting {
  constructor(
    id,
    creator,
    invited_users,
    text,
    from_date,
    to_date
  ) {
    this.id = id;
    this.creator = creator;
    this.invited_users = invited_users;
    this.text = text;
    this.from_date = from_date;
    this.to_date = to_date;
  }
}

export function convertJsonToMeeting(json) {
  if (Array.isArray(json)) {
    return json.map(meetingData => new Meeting(
      meetingData.id,
      meetingData.creator,
      meetingData.invited_users,
      meetingData.text,
      meetingData.from_date,
      meetingData.to_date
    ));
  }
  
  return new Meeting(
    json.id,
    json.creator,
    json.invited_users,
    json.text,
    json.from_date,
    json.to_date
  );
}

export default Meeting;
