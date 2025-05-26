"use client";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  FolderOpen,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Plus,
  ArrowRight,
  Target,
  Activity,
  Timer,
} from "lucide-react";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeProjects, setActiveProjects] = useState(0);
  const [todayTasks, setTodayTasks] = useState(0);

  // Mock data für das Dashboard
  const stats = [
    {
      title: "Aktive Projekte",
      value: "12",
      change: "+2.5%",
      icon: <FolderOpen size={24} />,
      color: "#3B82F6",
      trend: "up",
    },
    {
      title: "Heute erledigt",
      value: "8/15",
      change: "53%",
      icon: <CheckCircle size={24} />,
      color: "#10B981",
      trend: "up",
    },
    {
      title: "Arbeitszeit heute",
      value: "6h 23m",
      change: "+45m",
      icon: <Clock size={24} />,
      color: "#8B5CF6",
      trend: "up",
    },
    {
      title: "Team Produktivität",
      value: "94%",
      change: "+12%",
      icon: <TrendingUp size={24} />,
      color: "#F59E0B",
      trend: "up",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Website Redesign",
      progress: 75,
      status: "active",
      timeToday: "2h 15m",
      deadline: "2025-06-15",
      color: "#3B82F6",
      isTimerRunning: true,
    },
    {
      id: 2,
      name: "Mobile App Development",
      progress: 45,
      status: "active",
      timeToday: "1h 30m",
      deadline: "2025-07-01",
      color: "#10B981",
      isTimerRunning: false,
    },
    {
      id: 3,
      name: "Marketing Campaign",
      progress: 90,
      status: "on-hold",
      timeToday: "0h 45m",
      deadline: "2025-05-30",
      color: "#F59E0B",
      isTimerRunning: false,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Team Meeting",
      time: "10:00",
      type: "meeting",
      color: "#3B82F6",
    },
    {
      id: 2,
      title: "Client Call",
      time: "14:30",
      type: "call",
      color: "#10B981",
    },
    {
      id: 3,
      title: "Project Deadline",
      time: "17:00",
      type: "deadline",
      color: "#EF4444",
    },
  ];

  const quickActions = [
    {
      title: "Neues Projekt",
      icon: <FolderOpen size={20} />,
      color: "#3B82F6",
      action: () => console.log("Neues Projekt"),
    },
    {
      title: "Termin hinzufügen",
      icon: <Calendar size={20} />,
      color: "#10B981",
      action: () => console.log("Termin hinzufügen"),
    },
    {
      title: "Timer starten",
      icon: <Play size={20} />,
      color: "#8B5CF6",
      action: () => console.log("Timer starten"),
    },
    {
      title: "Team einladen",
      icon: <Users size={20} />,
      color: "#F59E0B",
      action: () => console.log("Team einladen"),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Play size={14} />;
      case "completed":
        return <CheckCircle size={14} />;
      case "on-hold":
        return <Pause size={14} />;
      default:
        return <Activity size={14} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Aktiv";
      case "completed":
        return "Abgeschlossen";
      case "on-hold":
        return "Pausiert";
      default:
        return status;
    }
  };

  return (
    <div className={styles.dashboardPage}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>{getGreeting()}, Max! 👋</h1>
          <p className={styles.welcomeSubtitle}>
            Hier ist dein Überblick für heute,{" "}
            {currentTime.toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className={styles.timeDisplay}>
          <div className={styles.currentTime}>
            {currentTime.toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div
                className={styles.statIcon}
                style={{
                  backgroundColor: `${stat.color}20`,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </div>
              <div className={`${styles.statTrend} ${styles[stat.trend]}`}>
                <TrendingUp size={16} />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statTitle}>{stat.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Recent Projects */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>
              <FolderOpen size={20} />
              Aktuelle Projekte
            </h3>
            <button className={styles.viewAllButton}>
              Alle anzeigen <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.projectsList}>
            {recentProjects.map((project) => (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <div className={styles.projectHeader}>
                    <div
                      className={styles.projectColor}
                      style={{ backgroundColor: project.color }}
                    ></div>
                    <h4 className={styles.projectName}>{project.name}</h4>
                    <div className={styles.projectStatus}>
                      {getStatusIcon(project.status)}
                      <span>{getStatusLabel(project.status)}</span>
                    </div>
                  </div>
                  <div className={styles.projectProgress}>
                    <div className={styles.progressInfo}>
                      <span>Fortschritt</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: project.color,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className={styles.projectMeta}>
                    <div className={styles.timeToday}>
                      <Timer size={14} />
                      <span>Heute: {project.timeToday}</span>
                      {project.isTimerRunning && (
                        <div className={styles.runningIndicator}></div>
                      )}
                    </div>
                    <div className={styles.deadline}>
                      <Calendar size={14} />
                      <span>
                        {new Date(project.deadline).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>
              <Calendar size={20} />
              Heute geplant
            </h3>
            <button className={styles.viewAllButton}>
              Kalender <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.eventsList}>
            {upcomingEvents.map((event) => (
              <div key={event.id} className={styles.eventItem}>
                <div className={styles.eventTime}>
                  <Clock size={14} />
                  <span>{event.time}</span>
                </div>
                <div className={styles.eventContent}>
                  <div
                    className={styles.eventIndicator}
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className={styles.eventInfo}>
                    <h4 className={styles.eventTitle}>{event.title}</h4>
                    <span className={styles.eventType}>{event.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>
              <Target size={20} />
              Schnellaktionen
            </h3>
          </div>
          <div className={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={styles.actionButton}
                onClick={action.action}
                style={{
                  "--action-color": action.color,
                  backgroundColor: `${action.color}15`,
                  borderColor: `${action.color}30`,
                }}
              >
                <div
                  className={styles.actionIcon}
                  style={{ color: action.color }}
                >
                  {action.icon}
                </div>
                <span className={styles.actionTitle}>{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className={styles.widgetCard}>
          <div className={styles.widgetHeader}>
            <h3 className={styles.widgetTitle}>
              <BarChart3 size={20} />
              Wöchentliche Übersicht
            </h3>
            <button className={styles.viewAllButton}>
              Details <ArrowRight size={14} />
            </button>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.chartBars}>
              {[65, 85, 45, 92, 78, 56, 88].map((height, index) => (
                <div
                  key={index}
                  className={styles.chartBar}
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className={styles.chartLabels}>
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day, index) => (
                <span key={index} className={styles.chartLabel}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
