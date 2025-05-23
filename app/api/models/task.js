class Task {
  constructor(id, project, assigned_to, text, status) {
    this.id = id,
    this.project = project;
    this.assigned_to = assigned_to;
    this.text = text;
    this.status = status;
  }
}

export default Task;