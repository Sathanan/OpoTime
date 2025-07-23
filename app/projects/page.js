'use client';
import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Clock,
  Calendar,
  Users,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Circle,
  UserPlus,
  X,
  Target,
  Loader2,
  FileSpreadsheet,
  Ban,
  PlayCircle,
  Flag,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  FileText,
  Activity,
  Palette,
  Save
} from 'lucide-react';
import styles from './css/projects.module.css';
import { getAllProjects, createProject, updateProjectStatus, updateProject } from '../services/projectService';
import { createProjectTimeEntry, getAllProjectTimeEntries, updateProjectTimeEntry } from '../services/projectTimeEntryService';
import { createShift } from '../services/shiftService';
import AddProjectModal from './addProjectModal';
import Project from '../api/models/project';
import ProjectModal from './detailsEditProjectModal';
import { checkDeadline } from '../utillity/deadlineChecker';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [projects, setProjects] = useState([]);

  async function fetchData() {
    try {
      const result = await getAllProjects();
      setProjects(result || []);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'init':
        return <FileSpreadsheet size={16} className={styles.statusIcon} />;
      case 'planning':
        return <Loader2 size={16} className={styles.statusIcon} />;
      case 'in_progress':
        return <PlayCircle size={16} className={styles.statusIcon} />;
      case 'paused':
        return <Pause size={16} className={styles.statusIcon} />;
      case 'cancelled':
        return <Ban size={16} className={styles.statusIcon} />;
      case 'completed':
        return <CheckCircle2 size={16} className={styles.statusIcon} />;
      default:
        return <Circle size={16} className={styles.statusIcon} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'init':
        return '#6B7280';
      case 'planning':
        return '#8B5CF6';
      case 'in_progress':
        return '#3B82F6';
      case 'paused':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      case 'completed':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    return Project.STATUS_CHOICES[status] || status;
  };

  const getPriorityLabel = (priority) => {
    return Project.PRIORITY_CHOICES[priority] || priority;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#FB923C'; 
      case 'low':
        return '#60A5FA'; 
      default:
        return '#6B7280';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedFilter === 'all' || project.status === selectedFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || project.priority === selectedPriorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleAddProjectClick = async () => {
    setShowAddModal(true);
  }

  const clickCreateProject = async (projectData) => {
    const project = new Project(
      projectData.id,
      projectData.user,
      projectData.name,
      projectData.description,
      projectData.status,
      projectData.priority,
      projectData.progress,
      projectData.total_time,
      projectData.today_time,
      projectData.deadline,
      projectData.invited_users,
      projectData.color
    );
    const created = await createProject(project);
    if (created) {
      await fetchData();
    }
  }

  const toggleProjectTimer = async (projectId) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      if (!project.isTimerRunning) {
        // Start timer
        const shift = await createShift();
        if (!shift) return;

        const timeEntry = {
          project: projectId,
          shift: shift.id,
          start_time: new Date().toISOString(),
          end_time: null,
          description: `Time tracking for ${project.name}`
        };

        const createdEntry = await createProjectTimeEntry(timeEntry);
        if (createdEntry) {
          await fetchData(); // Refresh projects to update timer status
        }
      } else {
        // Stop timer
        const timeEntries = await getAllProjectTimeEntries(null, projectId);
        const activeEntry = timeEntries?.find(entry => entry.start_time && !entry.end_time);
        
        if (activeEntry) {
          activeEntry.end_time = new Date().toISOString();
          await updateProjectTimeEntry(activeEntry);
          await fetchData(); // Refresh projects to update timer status
        }
      }
    } catch (error) {
      console.error("Error toggling project timer:", error);
    }
  };

  return (
    <div className={styles.projectsPage}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>
              <FolderOpen size={28} />
              Projekte
            </h1>
            <p className={styles.pageSubtitle}>
              Verwalte und überwache deine Projekte
            </p>
          </div>
          <button className={styles.newProjectButton} onClick={() => handleAddProjectClick()}>
            <Plus size={18} />
            Neues Projekt
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Projekte durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterBox}>
            <Filter size={18} />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Alle Status</option>
              <option value="init">Initiiert</option>
              <option value="planning">Planung</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="paused">Pausiert</option>
              <option value="cancelled">Abgebrochen</option>
              <option value="completed">Abgeschlossen</option>
            </select>
          </div>

          <div className={styles.filterBox}>
            <Target size={18} />
            <select
              value={selectedPriorityFilter}
              onChange={(e) => setSelectedPriorityFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">Alle Prioritäten</option>
              <option value="high">Hoch</option>
              <option value="medium">Mittel</option>
              <option value="low">Niedrig</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.projectsGrid}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={styles.projectCard}
            onClick={() => openProjectDetails(project)}
          >
            <div className={styles.projectHeader}>
              <div
                className={styles.projectColor}
                style={{ backgroundColor: project.color }}
              ></div>
              <div className={styles.projectStatus}>
                <div className={styles.statusIconWrapper} style={{ color: getStatusColor(project.status) }}>
                  {getStatusIcon(project.status)}
                </div>
                <span>{getStatusLabel(project.status)}</span>
              </div>
              <div
                className={styles.projectPriority}
                style={{ color: getPriorityColor(project.priority) }}
              >
                <span>{getPriorityLabel(project.priority)}</span>
              </div>
            </div>

            <div className={styles.projectContent}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <p className={styles.projectDescription}>{project.description}</p>

              <div className={styles.projectProgress}>
                <div className={styles.progressHeader}>
                  <span>Fortschritt</span>
                  <span>{project.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${project.progress}%`,
                      background: `linear-gradient(90deg, 
                        ${project.color}CC 0%,
                        ${project.color} 100%
                      )`
                    }}
                  ></div>
                </div>
              </div>

              <div className={styles.projectStats}>
                <div className={styles.stat}>
                  <Clock size={14} />
                  <span>{project.total_time || "0h"}</span>
                </div>
                <div className={styles.stat}>
                  <Users size={14} />
                  <span>{(project.invited_users?.length || 0) + 1}</span>
                </div>
                <div className={styles.stat}>
                  <CheckCircle2 size={14} />
                  <span>{project.tasks.completed}/{project.tasks.total}</span>
                </div>
              </div>

              <div className={styles.projectFooter}>
                <div className={`${styles.deadline} ${
                  checkDeadline(project.deadline) === 'warning' ? styles.deadlineWarning : 
                  checkDeadline(project.deadline) === 'overdue' ? styles.deadlineOverdue : ''
                }`}>
                  <Calendar size={14} />
                  <span>{project.deadline ? new Date(project.deadline).toLocaleDateString('de-DE') : 'Kein Datum'}</span>
                </div>
                <div className={styles.projectActions}>
                  <button
                    className={`${styles.timerButton} ${project.isTimerRunning ? styles.running : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleProjectTimer(project.id);
                    }}
                    title={project.isTimerRunning ? 'Timer stoppen' : 'Timer starten'}
                  >
                    {project.isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showAddModal && (
        <AddProjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={(projectData) => {
            clickCreateProject(projectData);
            setShowAddModal(false);
          }}
        />
      )}

      <ProjectModal
        project={selectedProject}
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onProjectUpdate={fetchData}
      />
    </div>
  );
};

export default ProjectsPage;