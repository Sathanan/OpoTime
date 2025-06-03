class TaskTimeEntry {
    constructor(id, user, task, shift, start_time, end_time) {
        this.id = id;
        this.user = user;
        this.task = task;
        this.shift = shift;
        this.start_time = start_time;
        this.end_time = end_time;
    }
  }
  
  export default TaskTimeEntry;
  
  export function convertJsonToTaskTimeEntry(json) {
    if (Array.isArray(json)) {
      return json.map(item => new TaskTimeEntry(
        item.id,
        item.user,
        item.task,
        item.shift,
        item.start_time,
        item.end_time
      ));
    }
    return new TaskTimeEntry(
      json.id,
      json.user,
      json.task,
      json.shift,
      json.start_time,
      json.end_time
    );
  }