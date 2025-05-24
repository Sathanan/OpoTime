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
} from "lucide-react";
import styles from "./timer.module.css";

const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTask, setCurrentTask] = useState("");
  const [currentProject, setCurrentProject] = useState("General");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", project: "General" });

  // Mock data for projects and recent sessions
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
    },
    {
      id: 2,
      task: "UI Design",
      project: "Mobile App",
      duration: 5400,
      date: "2024-05-24",
    },
    {
      id: 3,
      task: "Code Review",
      project: "Web Development",
      duration: 3600,
      date: "2024-05-23",
    },
    {
      id: 4,
      task: "User Research",
      project: "Design System",
      duration: 4800,
      date: "2024-05-23",
    },
  ]);

  const [todayStats] = useState({
    totalTime: 16200, // 4.5 hours in seconds
    sessions: 6,
    productivity: 94,
    focusTime: 12600,
  });

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && currentTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, currentTime]);

  const startTimer = () => {
    if (!currentTask.trim()) {
      alert("Please enter a task name");
      return;
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (currentTime > 0) {
      // Here you would save the session
      console.log("Session saved:", {
        task: currentTask,
        project: currentProject,
        duration: currentTime,
      });
    }
    setCurrentTime(0);
    setCurrentTask("");
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

  const addTask = () => {
    if (newTask.name.trim()) {
      setCurrentTask(newTask.name);
      setCurrentProject(newTask.project);
      setNewTask({ name: "", project: "General" });
      setIsAddingTask(false);
    }
  };

  const cancelAddTask = () => {
    setNewTask({ name: "", project: "General" });
    setIsAddingTask(false);
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
              <h1 className={styles.titleText}>Time Tracker</h1>
            </div>
            <p className={styles.titleSubtext}>
              Track your time, boost your productivity
            </p>
          </div>
        </div>

        {/* Main Timer Section */}
        <div className={styles.timerSection}>
          <div className={styles.timerDisplay}>{formatTime(currentTime)}</div>

          {/* Task Input */}
          <div className={styles.taskSection}>
            {!isAddingTask ? (
              <div>
                {currentTask ? (
                  <div className={styles.currentTask}>
                    <span className={styles.taskName}>{currentTask}</span>
                    <span className={styles.taskProject}>{currentProject}</span>
                    <button
                      onClick={() => setIsAddingTask(true)}
                      className={styles.editTaskButton}
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className={styles.addTaskButton}
                  >
                    <Plus size={20} />
                    Add Task
                  </button>
                )}
              </div>
            ) : (
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
                  <button onClick={addTask} className={styles.saveTaskButton}>
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={cancelAddTask}
                    className={styles.cancelTaskButton}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Timer Controls */}
          <div className={styles.timerControls}>
            {!isRunning ? (
              <button
                onClick={startTimer}
                disabled={!currentTask.trim()}
                className={`${styles.controlButton} ${styles.startButton} ${
                  !currentTask.trim() ? styles.disabled : ""
                }`}
              >
                <Play size={24} />
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className={`${styles.controlButton} ${styles.pauseButton}`}
              >
                <Pause size={24} />
                Pause
              </button>
            )}

            <button
              onClick={stopTimer}
              disabled={currentTime === 0}
              className={`${styles.controlButton} ${styles.stopButton} ${
                currentTime === 0 ? styles.disabled : ""
              }`}
            >
              <Square size={24} />
              Stop
            </button>
          </div>
        </div>

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
              <p className={styles.statLabel}>Sessions</p>
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
          <h2 className={styles.sectionTitle}>Recent Sessions</h2>

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
