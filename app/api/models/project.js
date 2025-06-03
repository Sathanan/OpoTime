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

export function convertJsonToProject(json) {
  if (Array.isArray(json)) {
    return json.map(projectData => new Project(
      projectData.id,
      projectData.user,
      projectData.name,
      projectData.invited_users,
      projectData.description,
      projectData.status,
      projectData.progress,
      projectData.total_time,
      projectData.today_time,
      projectData.deadline,
      projectData.color,
      projectData.tasks,
      projectData.isTimerRunning
    ));
  }
  
  return new Project(
    json.id,
    json.user,
    json.name,
    json.invited_users,
    json.description,
    json.status,
    json.progress,
    json.total_time,
    json.today_time,
    json.deadline,
    json.color,
    json.tasks,
    json.isTimerRunning
  );
}

export default Project;