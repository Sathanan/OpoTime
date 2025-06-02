class Task {
  constructor(id, project, assigned_to, text, status, priority, due_date, progress) {
    this.id = id,
    this.project = project;
    this.assigned_to = assigned_to;
    this.text = text;
    this.status = status;
    this.priority = priority;
    this.due_date = due_date;
    this.progress = progress;
  }
}

export default Task;

export function convertJsonToTask(json) {
  return new Task(json);
}