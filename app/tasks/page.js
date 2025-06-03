"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Tag,
  Filter,
  Search,
  Target,
  Activity,
  AlertCircle,
} from "lucide-react";
import styles from "./tasks.module.css";
import {
  getAllTask,
  getAllTaskByProject,
  getTaskByID,
  getTaskByPriority,
  createTask,
  updateTask,
  deleteTask as deleteTaskApi,
} from "../services/taskService.js";
import { getAllProjects } from "../services/projectService.js";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]); // Changed from ["General"] to empty array
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [editingTaskData, setEditingTaskData] = useState(null);

  const [newTask, setNewTask] = useState({
    name: "",
    project: "",
    priority: "medium",
    status: "new",
    dueDate: "",
    estimatedTime: 3600, // 1 hour in seconds
  });

  const priorities = [
    { value: "low", label: "Low", color: "#10b981" },
    { value: "medium", label: "Medium", color: "#f59e0b" },
    { value: "high", label: "High", color: "#ef4444" },
  ];

  // Fetch tasks and projects on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        let tasksData;
        const projectsData = await getAllProjects();

        if (selectedProject) {
          tasksData = await getAllTaskByProject(selectedProject);
        } else if (selectedPriority !== "all") {
          tasksData = await getTaskByPriority(selectedPriority);
        } else {
          tasksData = await getAllTask();
        }

        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else if (tasksData && typeof tasksData === "object") {
          setTasks([tasksData]);
        } else {
          setTasks([]);
        }

        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
        } else if (projectsData && typeof projectsData === "object") {
          setProjects([projectsData]);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTasks([]);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [selectedProject, selectedPriority]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPriorityColor = (priority) => {
    return priorities.find((p) => p.value === priority)?.color || "#10b981";
  };

  const startEditingTask = (task) => {
    setEditingTaskData({
      id: task.id,
      text: task.text || "",
      name: task.text || "",
      status: task.status || "new",
      priority: task.priority || "medium",
      project: task.project || "",
      due_date: task.due_date || "",
      progress: task.progress || 0,
      assigned_to: task.assigned_to
    });
    setEditingTask(task.id);
  };

  const cancelEditTask = () => {
    setEditingTask(null);
    setEditingTaskData(null);
  };

  const saveEditedTask = async () => {
    if (editingTaskData && editingTask) {
      try {
        const result = await updateTask(
          editingTask,
          editingTaskData.status || "new",
          editingTaskData.name,
          editingTaskData.priority || "medium",
          editingTaskData.due_date || null,
          editingTaskData.progress || 0
        );

        if (result) {
          setTasks(tasks.map(task =>
            task.id === editingTask ? {
              ...task,
              text: editingTaskData.name,
              status: editingTaskData.status || "new",
              priority: editingTaskData.priority || "medium",
              project: editingTaskData.project,
              due_date: editingTaskData.due_date,
              progress: editingTaskData.progress || 0
            } : task
          ));
          setEditingTask(null);
          setEditingTaskData(null);
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.text || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.project && 
       projects.find(p => p.id === task.project)?.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = 
      filter === "all" ? true :
      filter === "completed" ? task.status === "completed" :
      filter === "pending" ? task.status !== "completed" :
      filter === "overdue" ? (task.status !== "completed" && task.due_date && task.due_date < new Date().toISOString().split("T")[0]) :
      true;

    return matchesSearch && matchesFilter;
  });

  const toggleTaskCompletion = async (taskId) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      const newStatus = taskToUpdate.status === "completed" ? "todo" : "completed";
      
      const result = await updateTask(taskId, newStatus, taskToUpdate.text);
      if (result) {
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const result = await deleteTaskApi(taskId);
      if (result) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const addTask = async () => {
    if (newTask.name.trim()) {
      try {
        const createdTask = await createTask(
          newTask.project || null,
          newTask.status,
          newTask.name,
          newTask.priority,       
          newTask.dueDate || null,
          newTask.estimatedTime || 0
        );

        if (createdTask) {
          setTasks([...tasks, createdTask]);
          setNewTask({
            name: "",
            project: selectedProject || "",
            priority: "medium",  
            status: "new",
            dueDate: "",
            estimatedTime: 3600,
          });
          setIsAddingTask(false);
        }
      } catch (error) {
        console.error("Fehler beim Erstellen der Aufgabe:", error);
      }
    }
  };

  const cancelAddTask = () => {
    setNewTask({
      name: "",
      project: selectedProject || "", // Reset to selected project or empty
      priority: "medium",
      status: "new",
      dueDate: "",
      estimatedTime: 3600,
    });
    setIsAddingTask(false);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => {
      const today = new Date().toISOString().split("T")[0];
      return t.status !== "completed" && t.due_date && t.due_date < today;
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();

  if (isLoading) {
    return (
      <div className={styles.tasksCont}>
        <div className={styles.loadingState}>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tasksCont}>
      <div className={styles.tasksContainer}>
        {/* Header */}
        <div className={styles.tasksHeader}>
          <div className={styles.headerOverlay} />
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              <Target size={32} />
              <h1 className={styles.titleText}>Task Management</h1>
            </div>
            <p className={styles.titleSubtext}>
              Organize your work, achieve your goals
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          <div key="total" className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.totalIcon}`}>
              <Activity size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.total}</h3>
              <p className={styles.statLabel}>Total Tasks</p>
            </div>
          </div>

          <div key="completed" className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.completedIcon}`}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.completed}</h3>
              <p className={styles.statLabel}>Completed</p>
            </div>
          </div>

          <div key="pending" className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.pendingIcon}`}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.pending}</h3>
              <p className={styles.statLabel}>Pending</p>
            </div>
          </div>

          <div key="overdue" className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.overdueIcon}`}>
              <AlertCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.overdue}</h3>
              <p className={styles.statLabel}>Overdue</p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className={styles.controlsSection}>
          <div className={styles.searchAndFilter}>
            <div className={styles.searchBox}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterControls}>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className={styles.filterSelect}
              >
                <option key="all-projects" value="">All Projects</option>
                {projects.map((project) => (
                  <option key={`project-${project.id}`} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className={styles.filterSelect}
              >
                <option key="all-priorities" value="all">All Priorities</option>
                {priorities.map((priority) => (
                  <option key={`priority-${priority.value}`} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>

              <div className={styles.filterButtons}>
                {[
                  { key: "all", label: "All" },
                  { key: "pending", label: "Pending" },
                  { key: "completed", label: "Completed" },
                  { key: "overdue", label: "Overdue" },
                ].map((filterOption) => (
                  <button
                    key={`filter-${filterOption.key}`}
                    onClick={() => setFilter(filterOption.key)}
                    className={`${styles.filterButton} ${
                      filter === filterOption.key ? styles.activeFilter : ""
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddingTask(true)}
            className={styles.addTaskButton}
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <div className={styles.taskForm}>
            <h3 className={styles.formTitle}>Add New Task</h3>
            <div className={styles.formGrid}>
              <input
                type="text"
                placeholder="Task name..."
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                className={styles.taskInput}
                autoFocus
              />
              
              {/* Improved Project Select */}
              <select
                value={newTask.project}
                onChange={(e) =>
                  setNewTask({ ...newTask, project: e.target.value })
                }
                className={styles.projectSelect}
              >
                <option key="select-project" value="">Select Project</option>
                {projects.map((project) => (
                  <option key={`new-project-${project.id}`} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className={styles.prioritySelect}
              >
                <option value="low">Niedrig</option>
                <option value="medium">Mittel</option>
                <option value="high">Hoch</option>
              </select>

              <select
                value={newTask.status}
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                className={styles.statusSelect}
              >
                <option value="new">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Completed</option>
              </select>

              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className={styles.dateInput}
              />

              <input
                type="number"
                placeholder="Estimated hours"
                value={newTask.estimatedTime / 3600}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    estimatedTime: e.target.value * 3600,
                  })
                }
                className={styles.timeInput}
                min="0.5"
                max="24"
                step="0.5"
              />
            </div>

            <div className={styles.formActions}>
              <button onClick={addTask} className={styles.saveButton}>
                <Save size={16} />
                Save Task
              </button>
              <button onClick={cancelAddTask} className={styles.cancelButton}>
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className={styles.tasksSection}>
          <h2 className={styles.sectionTitle}>
            Tasks ({filteredTasks.length})
          </h2>

          <div className={styles.tasksList}>
            {filteredTasks.length === 0 ? (
              <div key="empty-state" className={styles.emptyState}>
                <Target size={48} />
                <h3>No tasks found</h3>
                <p>
                  {searchTerm || filter !== "all" || selectedProject || selectedPriority !== "all"
                    ? "Try adjusting your search or filters"
                    : "Create your first task to get started"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const project = projects.find(p => p.id === task.project);
                return (
                  <div key={`task-${task.id}`} className={styles.taskItem}>
                    {editingTask === task.id ? (
                      <div className={styles.taskForm}>
                        <div className={styles.formGrid}>
                          <input
                            type="text"
                            placeholder="Task name..."
                            value={editingTaskData.name}
                            onChange={(e) =>
                              setEditingTaskData({ ...editingTaskData, name: e.target.value, text: e.target.value })
                            }
                            className={styles.taskInput}
                            autoFocus
                          />
                          
                          <select
                            value={editingTaskData.project || ""}
                            onChange={(e) =>
                              setEditingTaskData({ ...editingTaskData, project: e.target.value })
                            }
                            className={styles.projectSelect}
                          >
                            <option key="edit-select-project" value="">Select Project</option>
                            {projects.map((project) => (
                              <option key={`edit-project-${project.id}`} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={editingTaskData.status || "new"}
                            onChange={(e) =>
                              setEditingTaskData({ ...editingTaskData, status: e.target.value })
                            }
                            className={styles.statusSelect}
                          >
                            <option key="edit-status-new" value="new">New</option>
                            <option key="edit-status-progress" value="in_progress">In Progress</option>
                            <option key="edit-status-completed" value="completed">Completed</option>
                          </select>

                          <select
                            value={editingTaskData.priority || "medium"}
                            onChange={(e) =>
                              setEditingTaskData({ ...editingTaskData, priority: e.target.value })
                            }
                            className={styles.prioritySelect}
                          >
                            {priorities.map((priority) => (
                              <option key={`edit-priority-${priority.value}`} value={priority.value}>
                                {priority.label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="date"
                            value={editingTaskData.due_date || ""}
                            onChange={(e) =>
                              setEditingTaskData({ ...editingTaskData, due_date: e.target.value })
                            }
                            className={styles.dateInput}
                          />

                          <input
                            type="number"
                            placeholder="Progress (hours)"
                            value={(editingTaskData.progress || 0) / 3600}
                            onChange={(e) =>
                              setEditingTaskData({
                                ...editingTaskData,
                                progress: e.target.value * 3600,
                              })
                            }
                            className={styles.timeInput}
                            min="0"
                            max="24"
                            step="0.5"
                          />
                        </div>

                        <div className={styles.formActions}>
                          <button onClick={saveEditedTask} className={styles.saveButton}>
                            <Save size={16} />
                            Save Changes
                          </button>
                          <button onClick={cancelEditTask} className={styles.cancelButton}>
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.taskLeft}>
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={styles.checkButton}
                          >
                            {(task.status || "new") === "completed" ? (
                              <CheckCircle size={20} className={styles.completedCheck} />
                            ) : (
                              <Circle size={20} />
                            )}
                          </button>

                          <div className={styles.taskInfo}>
                            <h4
                              className={`${styles.taskName} ${
                                (task.status || "new") === "completed" ? styles.completedTask : ""
                              }`}
                            >
                              {task.text || "Untitled Task"}
                            </h4>
                            <div className={styles.taskMeta}>
                              {project && (
                                <span key={`task-${task.id}-project`} className={styles.taskProject}>
                                  {project.name}
                                </span>
                              )}
                              {task.priority && (
                                <span
                                  key={`task-${task.id}-priority`}
                                  className={styles.taskPriority}
                                  style={{
                                    backgroundColor: getPriorityColor(task.priority),
                                  }}
                                >
                                  {priorities.find((p) => p.value === task.priority)?.label || "Medium"}
                                </span>
                              )}
                              {task.progress > 0 && (
                                <span key={`task-${task.id}-time`} className={styles.taskTime}>
                                  <Clock size={12} />
                                  {formatTime(task.progress)}
                                </span>
                              )}
                              {task.due_date && (
                                <span key={`task-${task.id}-due`} className={styles.taskDue}>
                                  <Calendar size={12} />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                              <span key={`task-${task.id}-status`} className={styles.taskStatus}>
                                {(task.status || "new").replace(/_/g, " ")}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.taskActions}>
                          <button
                            onClick={() => startEditingTask(task)}
                            className={styles.editButton}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className={styles.deleteButton}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}