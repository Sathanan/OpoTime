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
  Circle,
  UserPlus,
  X
} from 'lucide-react';
import styles from './css/projects.module.css';
import { getAllProjects } from '../services/projectService';
import { getInvitedUserByProjectID } from '../api/utilis/user';
import AddProjectModal from './addProjectModal';
import Project from '../api/models/project';
import { getCookies } from '../api/utilis/cookieManager';
import { createProject, updateProjectStatus } from '../services/projectService';
import { getUserByID } from '../api/utilis/user';
import { getAllUsers } from '../api/utilis/user';
import { createInvitation } from '../services/invitationService';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [projects, setProjects] = useState([]);

  // User Management States
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [projectUsers, setProjectUsers] = useState([]);

  async function fetchData() {
      try {
        const result = await getAllProjects();
        setProjects(result || []);

        const users = await getAllUsers();
        setAvailableUsers(users);
      } catch (err) {
        console.error("Fehler beim Laden:", err);
      }
    }

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    async function fetchProjectUsers() {
      if (!selectedProject) return;
      try {
        const users = await getInvitedUserByProjectID(selectedProject.id);
        console.log(users);
        setProjectUsers(users);
      } catch (err) {
        console.error("Fehler beim Laden der Projektbenutzer:", err);
      }
    }

    fetchProjectUsers();
  }, [selectedProject]);


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

  const toggleProjectTimer = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    const newStatus = !project.isTimerRunning;

    setProjects(projects.map(p =>
      p.id === projectId ? { ...p, isTimerRunning: newStatus } : p
    ));

    try {
      await updateProjectStatus(projectId, newStatus);
    } catch (error) {
      console.error("Timer-Status konnte nicht aktualisiert werden:", error);
    }
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleAddProjectClick = async (callback) => {
    setShowAddModal(true);
  }

  const clickCreateProject = async (projectData) => {
    const project = new Project(projectData.id, projectData.user, projectData.name, projectData.invited_users, projectData.description, projectData.status, projectData.progress, projectData.total_time, projectData.today_time, projectData.deadline, projectData.color);
    const created = await createProject(project);
    if (created) {
      await fetchData();
    }
  }

  // User Management Functions
  const handleAddUser = async () => {
    if (!selectedUserId) return;

    const userToAdd = availableUsers.find(user => user.id === parseInt(selectedUserId));
    if (!userToAdd) return;

    // Check if user is already in project
    if (projectUsers.find(user => user.id === userToAdd.id)) {
      alert('Benutzer ist bereits im Projekt');
      return;
    }
    //Create Invitation
    const invitation = await createInvitation(selectedProject.id, selectedUserId);
    console.log(invitation);
    const newUser = {
      ...userToAdd,
      InvitationState: "pending"
    };

    setProjectUsers([...projectUsers, newUser]);
    setSelectedUserId('');

    // Here you would typically make an API call to add the user to the project
    // await addUserToProject(selectedProject.id, userToAdd.id);
  };

  const handleRemoveUser = (userId) => {
    setProjectUsers(projectUsers.filter(user => user.id !== userId));
    // Here you would typically make an API call to remove the user from the project
    // await removeUserFromProject(selectedProject.id, userId);
  };

  const getAvailableUsersForDropdown = () => {
    return availableUsers.filter(user =>
      !projectUsers.find(projectUser => projectUser.id === user.id)
    );
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
            clickCreateProject(projectData);
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
                      <span>{projectUsers.length} Mitglieder</span>
                    </div>
                    <div className={styles.deadlineStat}>
                      <Calendar size={16} />
                      <span>{new Date(selectedProject.deadline).toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Management Section */}
              <div className={styles.userManagementSection}>
                <h4>Team-Mitglieder verwalten</h4>

                {/* Add User Form */}
                <div className={styles.addUserForm}>
                  <div className={styles.userDropdownContainer}>
                    <UserPlus size={18} />
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className={styles.userDropdown}
                    >
                      <option value="">Benutzer auswählen...</option>
                      {getAvailableUsersForDropdown().map(user => (
                        <option key={user.id} value={user.id}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className={styles.addUserButton}
                    onClick={handleAddUser}
                    disabled={!selectedUserId}
                  >
                    Hinzufügen
                  </button>
                </div>

                {/* Project Users List */}
                <div className={styles.projectUsersList}>
                  {projectUsers.map(user => (
                    <div key={user.id} className={styles.userItem}>
                      <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                          {user.email?.substring(0, 2).toUpperCase()}
                        </div>
                        <div className={styles.userDetails}>
                          <span className={styles.userName}>{user.name}</span>
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                        <span className={styles.userRole}>{user.invitation_status}</span>
                      </div>
                      <button
                        className={styles.removeUserButton}
                        onClick={() => handleRemoveUser(user.id)}
                        title="Benutzer entfernen"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.actionButton}>
                  <Edit size={16} />
                  Bearbeiten
                </button>
                <button className={styles.actionButton}>
                  <BarChart3 size={16} />
                  Statistiken
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