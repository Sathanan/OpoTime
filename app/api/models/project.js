class Project {
  static STATUS_CHOICES = {
    init: "Initiated",
    planning: "Planning",
    in_progress: "In Progress",
    paused: "Paused",
    cancelled: "Cancelled",
    completed: "Completed"
  };

  static PRIORITY_CHOICES = {
    high: "Hoch",
    medium: "Mittel",
    low: "Niedrig"
  };

  constructor(
    id,
    creator,
    name,
    description = "",
    status = "init",
    priority = "low",
    progress = 0,
    total_time = "00:00:00",
    today_time = "00:00:00",
    deadline = null,
    invited_users = [],
    color = "#3B82F6",
    tasks = { total: 0, completed: 0 },
  ) {
    this.id = id;
    this.creator = creator;
    this.name = name;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.progress = progress;
    this.total_time = total_time;
    this.today_time = today_time;
    this.deadline = deadline;
    this.invited_users = invited_users;
    this.color = color;
    this.tasks = tasks;
  }

  static getStatusLabel(status) {
    return this.STATUS_CHOICES[status] || status;
  }

  static getPriorityLabel(priority) {
    return this.PRIORITY_CHOICES[priority] || priority;
  }

  static parseInvitedUsers(backendInvitedUsers) {
    return backendInvitedUsers || [];
  }

  toBackendFormat() {
    return {
      id: this.id,
      creator: this.creator,
      name: this.name,
      description: this.description,
      status: this.status,
      priority: this.priority,
      progress: this.progress,
      total_time: this.total_time,
      today_time: this.today_time,
      deadline: this.deadline,
      invited_users: this.invited_users,
      color: this.color
    };
  }
}

export function convertJsonToProject(json) {
  if (Array.isArray(json)) {
    return json.map(projectData => new Project(
      projectData.id,
      projectData.creator,
      projectData.name,
      projectData.description,
      projectData.status,
      projectData.priority,
      projectData.progress,
      projectData.total_time,
      projectData.today_time,
      projectData.deadline,
      Project.parseInvitedUsers(projectData.invited_users),
      projectData.color,
      projectData.tasks || { total: 0, completed: 0 },
      projectData.isTimerRunning
    ));
  }
  
  return new Project(
    json.id,
    json.creator,
    json.name,
    json.description,
    json.status,
    json.priority,
    json.progress,
    json.total_time,
    json.today_time,
    json.deadline,
    Project.parseInvitedUsers(json.invited_users),
    json.color,
    json.tasks || { total: 0, completed: 0 },
    json.isTimerRunning
  );
}

export default Project;