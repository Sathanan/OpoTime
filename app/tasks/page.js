"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Search,
  Target,
  Activity,
  AlertCircle,
  LayoutGrid,
  List,
} from "lucide-react";
import styles from "./tasks.module.css";
import {
  getAllTask,
  getAllTaskByProject,
  getTaskByPriority,
  createTask,
  updateTask,
  deleteTask as deleteTaskApi,
} from "../services/taskService.js";
import { getAllProjects } from "../services/projectService.js";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TASK_STATUSES = {
  new: "To Do",
  in_progress: "In Progress",
  completed: "Completed"
};

const PRIORITIES = [
  { value: "low", label: "Low", color: "#10b981" },
  { value: "medium", label: "Medium", color: "#f59e0b" },
  { value: "high", label: "High", color: "#ef4444" },
];

export default function Tasks() {
  // Core states
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // UI states
  const [viewMode, setViewMode] = useState("list");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingTaskData, setEditingTaskData] = useState(null);

  // Filter states
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Form state
  const [newTask, setNewTask] = useState({
    name: "",
    project: "",
    priority: "medium",
    status: "new",
    dueDate: "",
    estimatedTime: 3600,
  });

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [tasksData, projectsData] = await Promise.all([
        selectedProject ? getAllTaskByProject(selectedProject) :
        selectedPriority !== "all" ? getTaskByPriority(selectedPriority) :
        getAllTask(),
        getAllProjects()
      ]);

      setTasks(Array.isArray(tasksData) ? tasksData : tasksData ? [tasksData] : []);
      setProjects(Array.isArray(projectsData) ? projectsData : projectsData ? [projectsData] : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load tasks. Please try again later.");
      setTasks([]);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, selectedPriority]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Task operations
  const handleAddTask = async () => {
    if (!newTask.name.trim()) return;

    try {
      setIsLoading(true);
      const createdTask = await createTask(
        newTask.project || null,
        newTask.status,
        newTask.name,
        newTask.priority,
        newTask.dueDate || null,
        newTask.estimatedTime || 0
      );

      if (createdTask) {
        setTasks(prev => [...prev, createdTask]);
        setIsAddingTask(false);
        resetNewTaskForm();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTaskData || !editingTask) return;

    try {
      setIsLoading(true);
      const result = await updateTask(
        editingTask,
        editingTaskData.status,
        editingTaskData.name,
        editingTaskData.priority,
        editingTaskData.due_date,
        editingTaskData.progress
      );

      if (result) {
        setTasks(prev => prev.map(task =>
          task.id === editingTask ? {
            ...task,
            text: editingTaskData.name,
            status: editingTaskData.status,
            priority: editingTaskData.priority,
            project: editingTaskData.project,
            due_date: editingTaskData.due_date,
            progress: editingTaskData.progress
          } : task
        ));
        setEditingTask(null);
        setEditingTaskData(null);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setIsLoading(true);
      const result = await deleteTaskApi(taskId);
      if (result) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Optimistic update helper
  const updateTaskOptimistically = (taskId, updates) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  // Update the handleDragEnd function
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    const task = tasks.find(t => t.id === taskId);

    if (!task) return;

    // Optimistically update the UI
    updateTaskOptimistically(taskId, { status: newStatus });

    try {
      setIsUpdating(true);
      const result = await updateTask(
        taskId,
        newStatus,
        task.text,
        task.priority,
        task.due_date,
        task.progress
      );

      if (!result) {
        // Revert the optimistic update if the API call fails
        updateTaskOptimistically(taskId, { status: task.status });
        setError("Failed to update task status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert the optimistic update
      updateTaskOptimistically(taskId, { status: task.status });
      setError("Failed to update task status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper functions
  const resetNewTaskForm = () => {
    setNewTask({
      name: "",
      project: selectedProject || "",
      priority: "medium",
      status: "new",
      dueDate: "",
      estimatedTime: 3600,
    });
  };

  const getTasksByStatus = () => {
    const columns = Object.keys(TASK_STATUSES).reduce((acc, status) => {
      acc[status] = {
        title: TASK_STATUSES[status],
        tasks: [],
      };
      return acc;
    }, {});

    filteredTasks.forEach(task => {
      const status = task.status || "new";
      if (columns[status]) {
        columns[status].tasks.push(task);
      }
    });

    return columns;
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getPriorityColor = (priority) => {
    return PRIORITIES.find(p => p.value === priority)?.color || "#10b981";
  };

  // Enhance the search functionality
  const searchTask = (task, term) => {
    if (!term) return true;
    
    const searchTerm = term.toLowerCase();
    const project = projects.find(p => p.id === task.project);
    const priorityLabel = PRIORITIES.find(p => p.value === task.priority)?.label;
    const statusLabel = TASK_STATUSES[task.status || 'new'];
    
    // Format the date for searching if it exists
    const formattedDate = task.due_date 
      ? new Date(task.due_date).toLocaleDateString()
      : '';

    // Format estimated time for searching
    const formattedTime = task.progress
      ? formatTime(task.progress)
      : '';

    // Search in all task attributes
    return (
      // Task name/text
      (task.text || '').toLowerCase().includes(searchTerm) ||
      // Project name
      (project?.name || '').toLowerCase().includes(searchTerm) ||
      // Priority
      (priorityLabel || '').toLowerCase().includes(searchTerm) ||
      // Status
      (statusLabel || '').toLowerCase().includes(searchTerm) ||
      // Due date
      formattedDate.toLowerCase().includes(searchTerm) ||
      // Time
      formattedTime.toLowerCase().includes(searchTerm) ||
      // Priority level keywords
      (searchTerm === 'high' && task.priority === 'high') ||
      (searchTerm === 'medium' && task.priority === 'medium') ||
      (searchTerm === 'low' && task.priority === 'low') ||
      // Status keywords
      (searchTerm === 'todo' && task.status === 'new') ||
      (searchTerm === 'in progress' && task.status === 'in_progress') ||
      (searchTerm === 'done' && task.status === 'completed') ||
      // Special searches
      (searchTerm === 'overdue' && task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed') ||
      (searchTerm === 'today' && task.due_date && new Date(task.due_date).toDateString() === new Date().toDateString()) ||
      (searchTerm === 'completed' && task.status === 'completed') ||
      (searchTerm === 'pending' && task.status !== 'completed')
    );
  };

  // Update the filtered tasks logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTask(task, searchTerm);
    
    const matchesFilter = filter === "all" ? true :
      filter === "completed" ? task.status === "completed" :
      filter === "pending" ? task.status !== "completed" :
      filter === "overdue" ? (task.status !== "completed" && task.due_date && new Date(task.due_date) < new Date()) :
      true;

    return matchesSearch && matchesFilter;
  });

  // Stats calculation
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = total - completed;
    const overdue = tasks.filter(t => {
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
          <div className={styles.loadingSpinner} />
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.tasksCont}>
        <div className={styles.errorState}>
          <AlertCircle size={48} />
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchData} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tasksCont}>
      {isUpdating && <div className={styles.updateIndicator} />}
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
                placeholder="Search by name, project, priority, status, date... (try: overdue, today, high, done)"
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
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Priorities</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
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
          </div>

          <button
            onClick={() => setIsAddingTask(true)}
            className={styles.addTaskButton}
            disabled={isUpdating}
          >
            <Plus size={20} />
            Add Task
          </button>

          <div className={styles.viewSwitcher}>
            <button
              onClick={() => setViewMode("list")}
              className={`${styles.viewButton} ${viewMode === "list" ? styles.activeView : ""}`}
            >
              <List size={20} />
              List
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`${styles.viewButton} ${viewMode === "kanban" ? styles.activeView : ""}`}
            >
              <LayoutGrid size={20} />
              Kanban
            </button>
          </div>
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
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className={styles.taskInput}
                autoFocus
              />
              
              <select
                value={newTask.project}
                onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
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
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className={styles.prioritySelect}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>

              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className={styles.statusSelect}
              >
                {Object.entries(TASK_STATUSES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className={styles.dateInput}
              />

              <input
                type="number"
                placeholder="Estimated hours"
                value={newTask.estimatedTime / 3600}
                onChange={(e) => setNewTask({
                  ...newTask,
                  estimatedTime: e.target.value * 3600,
                })}
                className={styles.timeInput}
                min="0.5"
                max="24"
                step="0.5"
              />
            </div>

            <div className={styles.formActions}>
              <button
                onClick={handleAddTask}
                className={styles.saveButton}
                disabled={isUpdating || !newTask.name.trim()}
              >
                <Save size={16} />
                Save Task
              </button>
              <button
                onClick={() => {
                  setIsAddingTask(false);
                  resetNewTaskForm();
                }}
                className={styles.cancelButton}
                disabled={isUpdating}
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Tasks Section */}
        <div className={styles.tasksSection}>
          <h2 className={styles.sectionTitle}>
            Tasks ({filteredTasks.length})
          </h2>

          {filteredTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <Target size={48} />
              <h3>No tasks found</h3>
              <p>
                {searchTerm || filter !== "all" || selectedProject || selectedPriority !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first task to get started"}
              </p>
            </div>
          ) : viewMode === "list" ? (
            <div className={styles.tasksList}>
              {filteredTasks.map((task) => {
                const project = projects.find(p => p.id === task.project);
                return (
                  <div key={task.id} className={styles.taskItem}>
                    {editingTask === task.id ? (
                      <div className={styles.taskForm}>
                        <div className={styles.formGrid}>
                          <input
                            type="text"
                            placeholder="Task name..."
                            value={editingTaskData.name}
                            onChange={(e) =>
                              setEditingTaskData({
                                ...editingTaskData,
                                name: e.target.value,
                                text: e.target.value,
                              })
                            }
                            className={styles.taskInput}
                            autoFocus
                          />
                          
                          <select
                            value={editingTaskData.project || ""}
                            onChange={(e) =>
                              setEditingTaskData({
                                ...editingTaskData,
                                project: e.target.value,
                              })
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
                            value={editingTaskData.status || "new"}
                            onChange={(e) =>
                              setEditingTaskData({
                                ...editingTaskData,
                                status: e.target.value,
                              })
                            }
                            className={styles.statusSelect}
                          >
                            {Object.entries(TASK_STATUSES).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>

                          <select
                            value={editingTaskData.priority || "medium"}
                            onChange={(e) =>
                              setEditingTaskData({
                                ...editingTaskData,
                                priority: e.target.value,
                              })
                            }
                            className={styles.prioritySelect}
                          >
                            {PRIORITIES.map((priority) => (
                              <option key={priority.value} value={priority.value}>
                                {priority.label}
                              </option>
                            ))}
                          </select>

                          <input
                            type="date"
                            value={editingTaskData.due_date || ""}
                            onChange={(e) =>
                              setEditingTaskData({
                                ...editingTaskData,
                                due_date: e.target.value,
                              })
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
                          <button
                            onClick={handleUpdateTask}
                            className={styles.saveButton}
                            disabled={isUpdating}
                          >
                            <Save size={16} />
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEditingTask(null);
                              setEditingTaskData(null);
                            }}
                            className={styles.cancelButton}
                            disabled={isUpdating}
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.taskLeft}>
                          <button
                            onClick={() => {
                              const newStatus = task.status === "completed" ? "new" : "completed";
                              handleUpdateTask({
                                ...task,
                                status: newStatus,
                              });
                            }}
                            className={styles.checkButton}
                            disabled={isUpdating}
                          >
                            {task.status === "completed" ? (
                              <CheckCircle size={20} className={styles.completedCheck} />
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
                              {task.text || "Untitled Task"}
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
                                  {PRIORITIES.find(p => p.value === task.priority)?.label}
                                </span>
                              )}
                              {task.progress > 0 && (
                                <span className={styles.taskTime}>
                                  <Clock size={12} />
                                  {formatTime(task.progress)}
                                </span>
                              )}
                              {task.due_date && (
                                <span className={styles.taskDue}>
                                  <Calendar size={12} />
                                  {new Date(task.due_date).toLocaleDateString()}
                                </span>
                              )}
                              <span className={styles.taskStatus}>
                                {TASK_STATUSES[task.status || "new"]}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={styles.taskActions}>
                          <button
                            onClick={() => {
                              setEditingTaskData({
                                id: task.id,
                                text: task.text || "",
                                name: task.text || "",
                                status: task.status || "new",
                                priority: task.priority || "medium",
                                project: task.project || "",
                                due_date: task.due_date || "",
                                progress: task.progress || 0,
                              });
                              setEditingTask(task.id);
                            }}
                            className={styles.editButton}
                            disabled={isUpdating}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className={styles.deleteButton}
                            disabled={isUpdating}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className={styles.kanbanBoard}>
                {Object.entries(getTasksByStatus()).map(([status, column]) => (
                  <div key={status} className={styles.kanbanColumn}>
                    <div className={styles.columnHeader}>
                      <h3>{column.title}</h3>
                      <span className={styles.taskCount}>{column.tasks.length}</span>
                    </div>
                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`${styles.columnContent} ${
                            snapshot.isDraggingOver ? styles.draggingOver : ""
                          }`}
                        >
                          {column.tasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                              isDragDisabled={isUpdating}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${styles.kanbanTask} ${
                                    snapshot.isDragging ? styles.dragging : ""
                                  }`}
                                  data-completed={task.status === "completed"}
                                >
                                  <div className={styles.kanbanTaskContent}>
                                    <h4 className={`${styles.taskName} ${
                                      task.status === "completed" ? styles.completedTask : ""
                                    }`}>
                                      {task.text || "Untitled Task"}
                                    </h4>
                                    <div className={`${styles.taskMeta} ${
                                      task.status === "completed" ? styles.completedMeta : ""
                                    }`}>
                                      {task.project && (
                                        <span className={styles.taskProject}>
                                          {projects.find(p => p.id === task.project)?.name}
                                        </span>
                                      )}
                                      {task.priority && (
                                        <span
                                          className={styles.taskPriority}
                                          style={{
                                            backgroundColor: getPriorityColor(task.priority),
                                            opacity: task.status === "completed" ? 0.6 : 1
                                          }}
                                        >
                                          {PRIORITIES.find(p => p.value === task.priority)?.label}
                                        </span>
                                      )}
                                      {task.due_date && (
                                        <span className={styles.taskDue}>
                                          <Calendar size={12} />
                                          {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className={styles.kanbanTaskActions}>
                                    <button
                                      onClick={() => {
                                        setEditingTaskData({
                                          id: task.id,
                                          text: task.text || "",
                                          name: task.text || "",
                                          status: task.status || "new",
                                          priority: task.priority || "medium",
                                          project: task.project || "",
                                          due_date: task.due_date || "",
                                          progress: task.progress || 0,
                                        });
                                        setEditingTask(task.id);
                                      }}
                                      className={styles.editButton}
                                      disabled={isUpdating}
                                    >
                                      <Edit2 size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className={styles.deleteButton}
                                      disabled={isUpdating}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                  {/* Add edit form for Kanban tasks */}
                                  {editingTask === task.id && (
                                    <div className={styles.kanbanEditForm}>
                                      <div className={styles.formGrid}>
                                        <input
                                          type="text"
                                          placeholder="Task name..."
                                          value={editingTaskData.name}
                                          onChange={(e) =>
                                            setEditingTaskData({
                                              ...editingTaskData,
                                              name: e.target.value,
                                              text: e.target.value,
                                            })
                                          }
                                          className={styles.taskInput}
                                          autoFocus
                                        />
                                        
                                        <select
                                          value={editingTaskData.project || ""}
                                          onChange={(e) =>
                                            setEditingTaskData({
                                              ...editingTaskData,
                                              project: e.target.value,
                                            })
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
                                          value={editingTaskData.status || "new"}
                                          onChange={(e) =>
                                            setEditingTaskData({
                                              ...editingTaskData,
                                              status: e.target.value,
                                            })
                                          }
                                          className={styles.statusSelect}
                                        >
                                          {Object.entries(TASK_STATUSES).map(([value, label]) => (
                                            <option key={value} value={value}>
                                              {label}
                                            </option>
                                          ))}
                                        </select>

                                        <select
                                          value={editingTaskData.priority || "medium"}
                                          onChange={(e) =>
                                            setEditingTaskData({
                                              ...editingTaskData,
                                              priority: e.target.value,
                                            })
                                          }
                                          className={styles.prioritySelect}
                                        >
                                          {PRIORITIES.map((priority) => (
                                            <option key={priority.value} value={priority.value}>
                                              {priority.label}
                                            </option>
                                          ))}
                                        </select>

                                        <input
                                          type="date"
                                          value={editingTaskData.due_date || ""}
                                          onChange={(e) =>
                                            setEditingTaskData({
                                              ...editingTaskData,
                                              due_date: e.target.value,
                                            })
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
                                        <button
                                          onClick={handleUpdateTask}
                                          className={styles.saveButton}
                                          disabled={isUpdating}
                                        >
                                          <Save size={16} />
                                          Save Changes
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingTask(null);
                                            setEditingTaskData(null);
                                          }}
                                          className={styles.cancelButton}
                                          disabled={isUpdating}
                                        >
                                          <X size={16} />
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
}