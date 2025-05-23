class Project {
  constructor(
    id,
    user,
    name,
    invitedUsers,
    description,
    status,
    progress,
    totalTime,
    todayTime,
    deadline,
    teamMembers,
    color,
    tasks,
    isTimerRunning
  ) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.invitedUsers = invitedUsers;
    this.description = description;
    this.status = status;
    this.progress = progress;
    this.totalTime = totalTime;
    this.todayTime = todayTime;
    this.deadline = deadline;
    this.teamMembers = teamMembers;
    this.color = color;
    this.tasks = tasks; 
    this.isTimerRunning = isTimerRunning;
  }
}


export default Project;