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
        const [tasksData, projectsData] = await Promise.all([
          getAllTask(),
          getAllProjects()
        ]);

        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else if (tasksData && typeof tasksData === "object") {
          setTasks([tasksData]); // Wrap single task object in array
        } else {
          setTasks([]); // Default to empty array
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
  }, []);


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

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.text || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.project && 
       projects.find(p => p.id === task.project)?.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filter === "all") return matchesSearch;
    if (filter === "completed") return task.status === "completed" && matchesSearch;
    if (filter === "pending") return task.status !== "completed" && matchesSearch;
    if (filter === "overdue") {
      const today = new Date().toISOString().split("T")[0];
      return task.status !== "completed" && task.due_date && task.due_date < today && matchesSearch;
    }
    return matchesSearch;
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
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.totalIcon}`}>
              <Activity size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.total}</h3>
              <p className={styles.statLabel}>Total Tasks</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.completedIcon}`}>
              <CheckCircle size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.completed}</h3>
              <p className={styles.statLabel}>Completed</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.pendingIcon}`}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stats.pending}</h3>
              <p className={styles.statLabel}>Pending</p>
            </div>
          </div>

          <div className={styles.statCard}>
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

            <div className={styles.filterButtons}>
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "completed", label: "Completed" },
                { key: "overdue", label: "Overdue" },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
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
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
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
              <div className={styles.emptyState}>
                <Target size={48} />
                <h3>No tasks found</h3>
                <p>
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter"
                    : "Create your first task to get started"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const project = projects.find(p => p.id === task.project);
                return (
                  <div key={task.id} className={styles.taskItem}>
                    <div className={styles.taskLeft}>
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={styles.checkButton}
                      >
                        {task.status === "completed" ? (
                          <CheckCircle
                            size={20}
                            className={styles.completedCheck}
                          />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>

                      <div className={styles.taskInfo}>
                        <h4
                          className={`${styles.taskName} ${
                            task.status === "completed" ? styles.completedTask : ""
                          }`}
                        >
                          {task.text}
                        </h4>
                        <div className={styles.taskMeta}>
                          {project && (
                            <span className={styles.taskProject}>
                              {project.name}
                            </span>
                          )}
                          {task.priority && (
                            <span
                              className={styles.taskPriority}
                              style={{
                                backgroundColor: getPriorityColor(task.priority),
                              }}
                            >
                              {
                                priorities.find((p) => p.value === task.priority)
                                  ?.label
                              }
                            </span>
                          )}
                          {task.estimatedTime && (
                            <span className={styles.taskTime}>
                              <Clock size={12} />
                              {formatTime(task.estimatedTime)}
                            </span>
                          )}
                          {task.due_date && (
                            <span className={styles.taskDue}>
                              <Calendar size={12} />
                              {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                          <span className={styles.taskStatus}>
                            {task.status.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.taskActions}>
                      <button
                        onClick={() => setEditingTask(task.id)}
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