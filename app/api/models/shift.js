class Shift {
    constructor(id, user, start_time, end_time, task_time_entries, project_time_entries) {
        this.id = id;
        this.user = user;
        this.start_time = start_time;
        this.end_time = end_time;
        this.task_time_entries = task_time_entries;
        this.project_time_entries = project_time_entries;
    }
  }
  
  export default Shift;
  
  export function convertJsonToShift(json) {
    if (Array.isArray(json)) {
      return json.map(item => new Shift(
        item.id,
        item.user,
        item.start_time,
        item.end_time,
        item.task_time_entries,
        item.project_time_entries   
      ));
    }
    return new Shift(
      json.id,
      json.user,
      json.start_time,
      json.end_time,
      json.task_time_entries,
      json.project_time_entries 
    );
  }