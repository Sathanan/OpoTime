class Task {
  constructor(id, project, assigned_to, text, status, priority, due_date, progress) {
    this.id = id;
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
  if (Array.isArray(json)) {
    return json.map(item => new Task(
      item.id,
      item.project,
      item.assigned_to,
      item.text,
      item.status,
      item.priority,
      item.due_date,
      item.progress
    ));
  }
  return new Task(
    json.id,
    json.project,
    json.assigned_to,
    json.text,
    json.status,
    json.priority,
    json.due_date,
    json.progress
  );
}