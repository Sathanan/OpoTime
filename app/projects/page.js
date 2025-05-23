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
  CheckCircle,
  AlertCircle,
  Circle
} from 'lucide-react';
import styles from './projects.module.css';
import { getAllProjects } from '../api/projectService';
import AddProjectModal from '../components/addProjectModal';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - in einer echten App würde das aus einer API kommen
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await getAllProjects();
        setProjects(result || []);
      } catch (err) {
        console.error("Projekte konnten nicht geladen werden:", err);
      }
    }

    fetchProjects();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'active':
        return <Play size={16} />;
      case 'on-hold':
        return <Pause size={16} />;
      case 'planning':
        return <Circle size={16} />;
      default:
        return <Circle size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Abgeschlossen';
      case 'active':
        return 'Aktiv';
      case 'on-hold':
        return 'Pausiert';
      case 'planning':
        return 'Planung';
      default:
        return status;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleProjectTimer = (projectId) => {
    setProjects(projects.map(project =>
      project.id === projectId
        ? { ...project, isTimerRunning: !project.isTimerRunning }
        : project
    ));
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleAddProjectClick = async (callback) => {
    setShowAddModal(true);
  }

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
              <option value="active">Aktiv</option>
              <option value="completed">Abgeschlossen</option>
              <option value="on-hold">Pausiert</option>
              <option value="planning">Planung</option>
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
                {getStatusIcon(project.status)}
                <span>{getStatusLabel(project.status)}</span>
              </div>
              <button
                className={styles.projectMenu}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical size={16} />
              </button>
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
                      backgroundColor: project.color
                    }}
                  ></div>
                </div>
              </div>

              <div className={styles.projectStats}>
                <div className={styles.stat}>
                  <Clock size={14} />
                  <span>{project.totalTime}</span>
                </div>
                <div className={styles.stat}>
                  <Users size={14} />
                  <span>{project.teamMembers}</span>
                </div>
                <div className={styles.stat}>
                  <CheckCircle size={14} />
                  <span>{project.tasks.completed}/{project.tasks.total}</span>
                </div>
              </div>

              <div className={styles.projectFooter}>
                <div className={styles.deadline}>
                  <Calendar size={14} />
                  <span>{new Date(project.deadline).toLocaleDateString('de-DE')}</span>
                </div>
                <div className={styles.todayTime}>
                  Heute: {project.todayTime}
                  {project.isTimerRunning && <div className={styles.runningIndicator}></div>}
                </div>
              </div>
            </div>

            <div className={styles.projectActions}>
              <button
                className={`${styles.timerButton} ${project.isTimerRunning ? styles.running : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProjectTimer(project.id);
                }}
              >
                {project.isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showAddModal && (
        <AddProjectModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={(projectData) => {
            setShowAddModal(false);
          }}
        />
      )}

      {/* Project Details Modal */}
      {showProjectModal && selectedProject && (
        <div className={styles.modal} onClick={() => setShowProjectModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div
                  className={styles.projectColorLarge}
                  style={{ backgroundColor: selectedProject.color }}
                ></div>
                <div>
                  <h2>{selectedProject.name}</h2>
                  <div className={styles.modalStatus}>
                    {getStatusIcon(selectedProject.status)}
                    {getStatusLabel(selectedProject.status)}
                  </div>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setShowProjectModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.projectDetail}>
                <h4>Beschreibung</h4>
                <p>{selectedProject.description}</p>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <h4>Fortschritt</h4>
                  <div className={styles.progressSection}>
                    <div className={styles.progressCircle}>
                      <div className={styles.progressText}>
                        {selectedProject.progress}%
                      </div>
                    </div>
                    <div className={styles.taskProgress}>
                      <span>{selectedProject.tasks.completed} von {selectedProject.tasks.total} Aufgaben</span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h4>Zeiterfassung</h4>
                  <div className={styles.timeStats}>
                    <div className={styles.timeStat}>
                      <span className={styles.timeLabel}>Gesamt</span>
                      <span className={styles.timeValue}>{selectedProject.totalTime}</span>
                    </div>
                    <div className={styles.timeStat}>
                      <span className={styles.timeLabel}>Heute</span>
                      <span className={styles.timeValue}>{selectedProject.todayTime}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h4>Team & Deadline</h4>
                  <div className={styles.teamInfo}>
                    <div className={styles.teamStat}>
                      <Users size={16} />
                      <span>{selectedProject.teamMembers} Mitglieder</span>
                    </div>
                    <div className={styles.deadlineStat}>
                      <Calendar size={16} />
                      <span>{new Date(selectedProject.deadline).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.actionButton}>
                  <Edit size={16} />
                  Bearbeiten
                </button>
                <button className={styles.actionButton}>
                  <BarChart3 size={16} />
                  Berichte
                </button>
                <button
                  className={`${styles.actionButton} ${styles.timerAction} ${selectedProject.isTimerRunning ? styles.running : ''}`}
                  onClick={() => toggleProjectTimer(selectedProject.id)}
                >
                  {selectedProject.isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {selectedProject.isTimerRunning ? 'Timer stoppen' : 'Timer starten'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;