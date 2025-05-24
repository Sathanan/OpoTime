"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Target,
  Activity,
  Zap,
  Award,
  ChevronDown,
  ChevronRight,
  PieChart,
  LineChart,
} from "lucide-react";
import styles from "./reports.module.css";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedProject, setSelectedProject] = useState("all");
  const [expandedSection, setExpandedSection] = useState("overview");

  // Mock data for reports
  const periods = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const projects = [
    "All Projects",
    "Web Development",
    "Mobile App",
    "Design System",
    "Marketing",
  ];

  const overviewStats = {
    totalTime: 28800, // 8 hours in seconds
    sessions: 12,
    productivity: 87,
    focusTime: 25200, // 7 hours
    avgSessionTime: 2400, // 40 minutes
    completedTasks: 8,
  };

  const weeklyData = [
    { day: "Mon", time: 7200, sessions: 3, productivity: 92 },
    { day: "Tue", time: 6300, sessions: 2, productivity: 85 },
    { day: "Wed", time: 8100, sessions: 4, productivity: 88 },
    { day: "Thu", time: 5400, sessions: 2, productivity: 82 },
    { day: "Fri", time: 7900, sessions: 3, productivity: 90 },
    { day: "Sat", time: 3600, sessions: 1, productivity: 75 },
    { day: "Sun", time: 4500, sessions: 2, productivity: 80 },
  ];

  const projectData = [
    { project: "Web Development", time: 12600, percentage: 35, sessions: 6 },
    { project: "Mobile App", time: 9000, percentage: 25, sessions: 4 },
    { project: "Design System", time: 7200, percentage: 20, sessions: 3 },
    { project: "Marketing", time: 5400, percentage: 15, sessions: 2 },
    { project: "General", time: 1800, percentage: 5, sessions: 1 },
  ];

  const topTasks = [
    { task: "API Integration", time: 7200, project: "Web Development" },
    { task: "UI Design Review", time: 5400, project: "Mobile App" },
    { task: "Component Library", time: 4800, project: "Design System" },
    { task: "User Research", time: 3600, project: "Marketing" },
    { task: "Code Refactoring", time: 3200, project: "Web Development" },
  ];

  const insights = [
    {
      type: "positive",
      title: "Great Focus Sessions",
      description: "Your average session length increased by 15% this week",
      icon: TrendingUp,
    },
    {
      type: "neutral",
      title: "Consistent Schedule",
      description: "You maintained regular working hours throughout the week",
      icon: Clock,
    },
    {
      type: "improvement",
      title: "Weekend Activity",
      description: "Consider taking more breaks on weekends for better work-life balance",
      icon: TrendingDown,
    },
  ];

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDecimalTime = (seconds) => {
    return (seconds / 3600).toFixed(1) + "h";
  };

  const getMaxTime = () => {
    return Math.max(...weeklyData.map(d => d.time));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const exportReport = () => {
    // Mock export functionality
    console.log("Exporting report...");
    alert("Report exported successfully!");
  };

  return (
    <div className={styles.reportsCont}>
      <div className={styles.reportsContainer}>
        {/* Header */}
        <div className={styles.reportsHeader}>
          <div className={styles.headerOverlay} />
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              <BarChart3 size={32} />
              <h1 className={styles.titleText}>Analytics & Reports</h1>
            </div>
            <p className={styles.titleSubtext}>
              Insights into your productivity and time management
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controlsSection}>
          <div className={styles.filtersGroup}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className={styles.filterSelect}
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Project</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className={styles.filterSelect}
              >
                {projects.map((project) => (
                  <option key={project} value={project.toLowerCase().replace(' ', '-')}>
                    {project}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={exportReport} className={styles.exportButton}>
            <Download size={20} />
            Export Report
          </button>
        </div>

        {/* Overview Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.timeIcon}`}>
              <Clock size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {formatTime(overviewStats.totalTime)}
              </h3>
              <p className={styles.statLabel}>Total Time</p>
              <div className={styles.statTrend}>
                <TrendingUp size={16} className={styles.trendUp} />
                <span>+12% vs last week</span>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.sessionsIcon}`}>
              <Target size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{overviewStats.sessions}</h3>
              <p className={styles.statLabel}>Sessions</p>
              <div className={styles.statTrend}>
                <TrendingUp size={16} className={styles.trendUp} />
                <span>+3 vs last week</span>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.productivityIcon}`}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{overviewStats.productivity}%</h3>
              <p className={styles.statLabel}>Productivity</p>
              <div className={styles.statTrend}>
                <TrendingDown size={16} className={styles.trendDown} />
                <span>-2% vs last week</span>
              </div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.focusIcon}`}>
              <Zap size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>
                {formatTime(overviewStats.avgSessionTime)}
              </h3>
              <p className={styles.statLabel}>Avg Session</p>
              <div className={styles.statTrend}>
                <TrendingUp size={16} className={styles.trendUp} />
                <span>+8 min vs last week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className={styles.chartSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Weekly Activity</h2>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.timeColor}`}></div>
                <span>Time Tracked</span>
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.chart}>
              {weeklyData.map((day, index) => (
                <div key={day.day} className={styles.chartBar}>
                  <div
                    className={styles.barFill}
                    style={{
                      height: `${(day.time / getMaxTime()) * 100}%`,
                    }}
                  >
                    <div className={styles.barTooltip}>
                      <strong>{formatTime(day.time)}</strong>
                      <br />
                      {day.sessions} sessions
                      <br />
                      {day.productivity}% productive
                    </div>
                  </div>
                  <div className={styles.barLabel}>{day.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className={styles.expandableSections}>
          {/* Project Breakdown */}
          <div className={styles.expandableSection}>
            <button
              onClick={() => toggleSection("projects")}
              className={styles.sectionToggle}
            >
              <div className={styles.toggleLeft}>
                <PieChart size={20} />
                <span>Project Breakdown</span>
              </div>
              {expandedSection === "projects" ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>

            {expandedSection === "projects" && (
              <div className={styles.sectionContent}>
                <div className={styles.projectList}>
                  {projectData.map((project, index) => (
                    <div key={project.project} className={styles.projectItem}>
                      <div className={styles.projectInfo}>
                        <div className={styles.projectName}>{project.project}</div>
                        <div className={styles.projectMeta}>
                          {project.sessions} sessions • {formatTime(project.time)}
                        </div>
                      </div>
                      <div className={styles.projectStats}>
                        <div className={styles.projectPercentage}>
                          {project.percentage}%
                        </div>
                        <div className={styles.projectBar}>
                          <div
                            className={styles.projectBarFill}
                            style={{ width: `${project.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Tasks */}
          <div className={styles.expandableSection}>
            <button
              onClick={() => toggleSection("tasks")}
              className={styles.sectionToggle}
            >
              <div className={styles.toggleLeft}>
                <Activity size={20} />
                <span>Top Tasks</span>
              </div>
              {expandedSection === "tasks" ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>

            {expandedSection === "tasks" && (
              <div className={styles.sectionContent}>
                <div className={styles.tasksList}>
                  {topTasks.map((task, index) => (
                    <div key={task.task} className={styles.taskItem}>
                      <div className={styles.taskRank}>{index + 1}</div>
                      <div className={styles.taskInfo}>
                        <div className={styles.taskName}>{task.task}</div>
                        <div className={styles.taskProject}>{task.project}</div>
                      </div>
                      <div className={styles.taskTime}>
                        {formatTime(task.time)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Insights */}
          <div className={styles.expandableSection}>
            <button
              onClick={() => toggleSection("insights")}
              className={styles.sectionToggle}
            >
              <div className={styles.toggleLeft}>
                <Award size={20} />
                <span>Insights & Recommendations</span>
              </div>
              {expandedSection === "insights" ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>

            {expandedSection === "insights" && (
              <div className={styles.sectionContent}>
                <div className={styles.insightsList}>
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`${styles.insightItem} ${styles[insight.type]}`}
                    >
                      <div className={styles.insightIcon}>
                        <insight.icon size={20} />
                      </div>
                      <div className={styles.insightContent}>
                        <h4 className={styles.insightTitle}>{insight.title}</h4>
                        <p className={styles.insightDescription}>
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}