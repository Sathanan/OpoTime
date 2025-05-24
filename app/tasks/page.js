"use client";

import React, { useState } from "react";
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

export default function Tasks() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      name: "Complete API integration",
      project: "Web Development",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-05-25",
      estimatedTime: 7200, // 2 hours in seconds
      completed: false,
    },
    {
      id: 2,
      name: "Design mobile mockups",
      project: "Mobile App",
      priority: "medium",
      status: "todo",
      dueDate: "2024-05-26",
      estimatedTime: 5400, // 1.5 hours
      completed: false,
    },
    {
      id: 3,
      name: "Code review for login feature",
      project: "Web Development",
      priority: "high",
      status: "completed",
      dueDate: "2024-05-24",
      estimatedTime: 3600, // 1 hour
      completed: true,
    },
    {
      id: 4,
      name: "User research analysis",
      project: "Design System",
      priority: "low",
      status: "todo",
      dueDate: "2024-05-28",
      estimatedTime: 9000, // 2.5 hours
      completed: false,
    },
  ]);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newTask, setNewTask] = useState({
    name: "",
    project: "General",
    priority: "medium",
    dueDate: "",
    estimatedTime: 3600,
  });

  const projects = [
    "General",
    "Web Development",
    "Mobile App",
    "Design System",
    "Marketing",
  ];

  const priorities = [
    { value: "low", label: "Low", color: "#10b981" },
    { value: "medium", label: "Medium", color: "#f59e0b" },
    { value: "high", label: "High", color: "#ef4444" },
  ];

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
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "completed") return task.completed && matchesSearch;
    if (filter === "pending") return !task.completed && matchesSearch;
    if (filter === "overdue") {
      const today = new Date().toISOString().split("T")[0];
      return !task.completed && task.dueDate < today && matchesSearch;
    }
    return matchesSearch;
  });

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? "completed" : "todo",
            }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addTask = () => {
    if (newTask.name.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        status: "todo",
        completed: false,
      };
      setTasks([...tasks, task]);
      setNewTask({
        name: "",
        project: "General",
        priority: "medium",
        dueDate: "",
        estimatedTime: 3600,
      });
      setIsAddingTask(false);
    }
  };

  const cancelAddTask = () => {
    setNewTask({
      name: "",
      project: "General",
      priority: "medium",
      dueDate: "",
      estimatedTime: 3600,
    });
    setIsAddingTask(false);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => {
      const today = new Date().toISOString().split("T")[0];
      return !t.completed && t.dueDate < today;
    }).length;

    return { total, completed, pending, overdue };
  };

  const stats = getTaskStats();

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
              <select
                value={newTask.project}
                onChange={(e) =>
                  setNewTask({ ...newTask, project: e.target.value })
                }
                className={styles.projectSelect}
              >
                {projects.map((project) => (
                  <option key={project} value={project}>
                    {project}
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
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
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
              filteredTasks.map((task) => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={styles.taskLeft}>
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={styles.checkButton}
                    >
                      {task.completed ? (
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
                          task.completed ? styles.completedTask : ""
                        }`}
                      >
                        {task.name}
                      </h4>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskProject}>
                          {task.project}
                        </span>
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
                        <span className={styles.taskTime}>
                          <Clock size={12} />
                          {formatTime(task.estimatedTime)}
                        </span>
                        {task.dueDate && (
                          <span className={styles.taskDue}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
