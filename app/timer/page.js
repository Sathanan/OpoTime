"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  Clock,
  Target,
  Calendar,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Activity,
  TrendingUp,
  Award,
  Zap,
  List,
  LayoutGrid,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  MoreVertical,
} from "lucide-react";
import styles from "./timer.module.css";

const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftTasks, setShiftTasks] = useState([]);
  const [viewMode, setViewMode] = useState("timeline");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isShiftEndModalOpen, setIsShiftEndModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", project: "General", startTime: 0 });
  const [activeTaskId, setActiveTaskId] = useState(null);

  // Mock data for projects
  const [projects] = useState([
    "General",
    "Web Development",
    "Mobile App",
    "Design System",
    "Marketing",
  ]);

  const [recentSessions] = useState([
    {
      id: 1,
      task: "API Integration",
      project: "Web Development",
      duration: 7200,
      date: "2024-05-24",
      startTime: Date.now() - 7200000,
    },
    {
      id: 2,
      task: "UI Design",
      project: "Mobile App",
      duration: 5400,
      date: "2024-05-24",
      startTime: Date.now() - 5400000,
    },
    {
      id: 3,
      task: "Code Review",
      project: "Web Development",
      duration: 3600,
      date: "2024-05-23",
      startTime: Date.now() - 3600000,
    },
  ]);

  const [todayStats] = useState({
    totalTime: 16200,
    sessions: 6,
    productivity: 94,
    focusTime: 12600,
  });

  // Timer logic for shift
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
        if (activeTaskId) {
          setShiftTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === activeTaskId
                ? { ...task, duration: (task.duration || 0) + 1 }
                : task
            )
          );
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeTaskId]);

  const startShift = () => {
    setCurrentShift({
      startTime: Date.now(),
      tasks: [],
    });
    setIsRunning(true);
  };

  const pauseShift = () => {
    setIsRunning(false);
    setActiveTaskId(null);
  };

  const endShift = () => {
    setIsRunning(false);
    setActiveTaskId(null);
    setIsShiftEndModalOpen(true);
  };

  const finalizeShift = () => {
    console.log("Shift saved:", {
        duration: currentTime,
      tasks: shiftTasks,
      });
    setCurrentTime(0);
    setCurrentShift(null);
    setShiftTasks([]);
    setActiveTaskId(null);
    setIsShiftEndModalOpen(false);
  };

  const addTaskToShift = () => {
    if (newTask.name.trim()) {
      const task = {
        id: Date.now(),
        name: newTask.name,
        project: newTask.project,
        startTime: Date.now(),
        duration: 0,
        isRunning: false,
      };
      setShiftTasks([...shiftTasks, task]);
      setNewTask({ name: "", project: "General", startTime: 0 });
      setIsAddingTask(false);
    }
  };

  const toggleTaskTimer = (taskId) => {
    if (!isRunning) {
      setIsRunning(true);
    }

    setShiftTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, isRunning: !task.isRunning }
          : { ...task, isRunning: false }
      )
    );

    setActiveTaskId(prevId => prevId === taskId ? null : taskId);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Render task item based on view mode
  const renderTaskItem = (task) => {
    const taskControls = (
      <div className={styles.taskControls}>
        <button
          onClick={() => toggleTaskTimer(task.id)}
          className={`${styles.taskControlButton} ${task.isRunning ? styles.running : ''}`}
          title={task.isRunning ? "Pause Task" : "Start Task"}
        >
          {task.isRunning ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <span className={styles.taskDuration}>
          {formatTime(task.duration || 0)}
        </span>
      </div>
    );

    if (viewMode === "timeline") {
      return (
        <div key={task.id} className={`${styles.timelineItem} ${task.isRunning ? styles.activeTask : ''}`}>
          <div className={styles.timelinePoint} />
          <div className={styles.timelineContent}>
            <div className={styles.timelineHeader}>
              <h4 className={styles.timelineTaskName}>{task.name}</h4>
              {taskControls}
            </div>
            <p className={styles.timelineTaskProject}>{task.project}</p>
            <span className={styles.timelineTime}>
              {new Date(task.startTime).toLocaleTimeString()}
            </span>
          </div>
        </div>
      );
    }

    if (viewMode === "list") {
      return (
        <div key={task.id} className={`${styles.listItem} ${task.isRunning ? styles.activeTask : ''}`}>
          <div className={styles.listItemContent}>
            <h4 className={styles.listItemName}>{task.name}</h4>
            <p className={styles.listItemProject}>{task.project}</p>
          </div>
          {taskControls}
        </div>
      );
    }

    return (
      <div key={task.id} className={`${styles.gridItem} ${task.isRunning ? styles.activeTask : ''}`}>
        <div className={styles.gridItemIcon}>
          <Activity size={24} />
        </div>
        <h4 className={styles.gridItemName}>{task.name}</h4>
        <p className={styles.gridItemProject}>{task.project}</p>
        <div className={styles.gridItemFooter}>
          <span className={styles.gridItemTime}>
            {new Date(task.startTime).toLocaleTimeString()}
          </span>
          {taskControls}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.timerCont}>
      <div className={styles.timerContainer}>
        {/* Header */}
        <div className={styles.timerHeader}>
          <div className={styles.headerOverlay} />
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              <Clock size={32} />
              <h1 className={styles.titleText}>Shift Timer</h1>
            </div>
            <p className={styles.titleSubtext}>
              Track your shifts and tasks efficiently
            </p>
          </div>
        </div>

        {/* Main Timer Section */}
        <div className={styles.timerSection}>
          <div className={styles.timerDisplay}>{formatTime(currentTime)}</div>

          {/* Timer Controls */}
          <div className={styles.timerControls}>
            {!isRunning ? (
              <button
                onClick={currentShift ? pauseShift : startShift}
                className={`${styles.controlButton} ${styles.startButton}`}
              >
                <Play size={24} />
                {currentShift ? "Resume Shift" : "Start Shift"}
              </button>
            ) : (
              <button
                onClick={pauseShift}
                className={`${styles.controlButton} ${styles.pauseButton}`}
              >
                <Pause size={24} />
                Pause Shift
              </button>
            )}

            {currentShift && (
              <button
                onClick={endShift}
                className={`${styles.controlButton} ${styles.stopButton}`}
              >
                <Square size={24} />
                End Shift
              </button>
            )}
          </div>
        </div>

        {/* View Mode Selector */}
        {currentShift && (
          <div className={styles.viewModeSelector}>
            <button
              className={`${styles.viewModeButton} ${
                viewMode === "timeline" ? styles.active : ""
              }`}
              onClick={() => setViewMode("timeline")}
            >
              <AlignLeft size={20} />
              Timeline
            </button>
            <button
              className={`${styles.viewModeButton} ${
                viewMode === "list" ? styles.active : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={20} />
              List
            </button>
                    <button
              className={`${styles.viewModeButton} ${
                viewMode === "grid" ? styles.active : ""
              }`}
              onClick={() => setViewMode("grid")}
                    >
              <LayoutGrid size={20} />
              Grid
                    </button>
                  </div>
        )}

        {/* Tasks Section */}
        {currentShift && (
          <div className={styles.tasksSection}>
            <div className={styles.tasksSectionHeader}>
              <h2 className={styles.sectionTitle}>Current Shift Tasks</h2>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className={styles.addTaskButton}
                  >
                    <Plus size={20} />
                    Add Task
                  </button>
              </div>

            {/* Task Input Form */}
            {isAddingTask && (
              <div className={styles.taskForm}>
                <input
                  type="text"
                  placeholder="Enter task name..."
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
                <div className={styles.taskFormActions}>
                  <button onClick={addTaskToShift} className={styles.saveTaskButton}>
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => setIsAddingTask(false)}
                    className={styles.cancelTaskButton}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tasks Timeline/List/Grid View */}
            <div className={styles.tasksView}>
              {viewMode === "timeline" && (
                <div className={styles.timelineView}>
                  {shiftTasks.map(renderTaskItem)}
                </div>
              )}

              {viewMode === "list" && (
                <div className={styles.listView}>
                  {shiftTasks.map(renderTaskItem)}
                </div>
              )}

              {viewMode === "grid" && (
                <div className={styles.gridView}>
                  {shiftTasks.map(renderTaskItem)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shift End Modal */}
        {isShiftEndModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2 className={styles.modalTitle}>Shift Summary</h2>
              <div className={styles.modalBody}>
                <div className={styles.summaryStats}>
                  <div className={styles.summaryStat}>
                    <Clock size={20} />
                    <div className={styles.summaryStatContent}>
                      <span className={styles.summaryStatLabel}>Total Time</span>
                      <span className={styles.summaryStatValue}>
                        {formatTime(currentTime)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.summaryStat}>
                    <Target size={20} />
                    <div className={styles.summaryStatContent}>
                      <span className={styles.summaryStatLabel}>Tasks</span>
                      <span className={styles.summaryStatValue}>
                        {shiftTasks.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.summaryTasks}>
                  <h3 className={styles.summaryTasksTitle}>Tasks Overview</h3>
                  {shiftTasks.map((task) => (
                    <div key={task.id} className={styles.summaryTask}>
                      <div className={styles.summaryTaskInfo}>
                        <h4 className={styles.summaryTaskName}>{task.name}</h4>
                        <p className={styles.summaryTaskProject}>{task.project}</p>
                      </div>
                      <div className={styles.summaryTaskTime}>
                        {formatTime(task.duration || 0)}
                      </div>
                    </div>
                  ))}
          </div>

                <div className={styles.modalActions}>
              <button
                    onClick={finalizeShift}
                    className={styles.finishShiftButton}
              >
                    <Save size={20} />
                    Save & Finish Shift
              </button>
              <button
                    onClick={() => setIsShiftEndModalOpen(false)}
                    className={styles.cancelButton}
              >
                    <X size={20} />
                    Continue Shift
            </button>
          </div>
        </div>
            </div>
          </div>
        )}

        {/* Today's Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.timeIcon}`}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {formatDuration(todayStats.totalTime)}
              </h3>
              <p className={styles.statLabel}>Today's Total</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.sessionsIcon}`}>
              <Target size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{todayStats.sessions}</h3>
              <p className={styles.statLabel}>Shifts</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.productivityIcon}`}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{todayStats.productivity}%</h3>
              <p className={styles.statLabel}>Productivity</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.focusIcon}`}>
              <Zap size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {formatDuration(todayStats.focusTime)}
              </h3>
              <p className={styles.statLabel}>Focus Time</p>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className={styles.sessionsSection}>
          <h2 className={styles.sectionTitle}>Recent Shifts</h2>
          <div className={styles.sessionsList}>
            {recentSessions.map((session) => (
              <div key={session.id} className={styles.sessionItem}>
                <div className={styles.sessionLeft}>
                  <div className={styles.sessionIcon}>
                    <Activity size={18} />
                  </div>
                  <div className={styles.sessionInfo}>
                    <p className={styles.sessionTask}>{session.task}</p>
                    <p className={styles.sessionMeta}>
                      {session.project} •{" "}
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={styles.sessionDuration}>
                  {formatDuration(session.duration)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
