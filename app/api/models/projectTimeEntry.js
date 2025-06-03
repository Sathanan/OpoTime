class ProjectTimeEntry {
    constructor(id, user, project, shift, start_time, end_time, description) {
        this.id = id;
        this.user = user;
        this.project = project;
        this.shift = shift;
        this.start_time = start_time;
        this.end_time = end_time;
        this.description = description;
    }
  }
  
  export default ProjectTimeEntry;
  
  export function convertJsonToProjectTimeEntry(json) {
    if (Array.isArray(json)) {
      return json.map(item => new ProjectTimeEntry(
        item.id,
        item.user,
        item.project,
        item.shift,
        item.start_time,
        item.end_time,
        item.description
      ));
    }
    return new ProjectTimeEntry(
        json.id,
        json.user,
        json.project,
        json.shift,
        json.start_time,
        json.end_time,
        json.description
    );
  }