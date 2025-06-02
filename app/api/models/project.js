class Project {
  constructor(
    id,
    user,
    name,
    invited_users,
    description,
    status,
    progress,
    total_time,
    today_time,
    deadline,
    color,
    tasks = [],
    isTimerRunning = false,
  ) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.invited_users = invited_users;
    this.description = description;
    this.status = status;
    this.progress = progress;
    this.total_time = total_time;
    this.today_time = today_time;
    this.deadline = deadline;
    this.color = color;
    this.tasks = tasks; 
    this.isTimerRunning = isTimerRunning;
  }
}


export default Project;

export function convertJsonToProject(json) {
  return new Project(json);
}