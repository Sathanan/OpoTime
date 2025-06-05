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
import { getInvitedUserByProjectID } from '../api/utilis/user';
import AddProjectModal from './addProjectModal';
import Project from '../api/models/project';
import { getCookies } from '../api/utilis/cookieManager';
import { getUserByID } from '../api/utilis/user';
import { getAllUsers } from '../api/utilis/user';
import { createInvitation } from '../services/invitationService';

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const [projects, setProjects] = useState([]);

  // User Management States
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [projectUsers, setProjectUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'init',
    priority: 'medium',
    deadline: '',
    color: '#6B7280'
  });

  const [originalFormData, setOriginalFormData] = useState(null);
  
  useEffect(() => {
    if (selectedProject) {
      const initialData = {
        name: selectedProject.name || '',
        description: selectedProject.description || '',
        status: selectedProject.status || 'init',
        priority: selectedProject.priority || 'medium',
        deadline: selectedProject.deadline ? new Date(selectedProject.deadline).toISOString().split('T')[0] : '',
        color: selectedProject.color || '#3B82F6'
      };
      setFormData(initialData);
      setOriginalFormData(initialData);
    }
  }, [selectedProject]);

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
        return '#6B7280'; // Grau
      case 'planning':
        return '#8B5CF6'; // Violett
      case 'in_progress':
        return '#3B82F6'; // Blau
      case 'paused':
        return '#F59E0B'; // Orange
      case 'cancelled':
        return '#EF4444'; // Rot
      case 'completed':
        return '#10B981'; // Grün
      default:
        return '#6B7280'; // Grau
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

  const toggleProjectTimer = async (projectId) => {
    //Timestamp creation
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

  const hasChanges = () => {
    if (!originalFormData) return false;
    return Object.keys(formData).some(key => formData[key] !== originalFormData[key]);
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
                  <span>{project.totalTime || "0h"}</span>
                </div>
                <div className={styles.stat}>
                  <Users size={14} />
                  <span>1/1</span>
                </div>
                <div className={styles.stat}>
                  <CheckCircle2 size={14} />
                  <span>{project.tasks.completed}/{project.tasks.total}</span>
                </div>
              </div>

              <div className={styles.projectFooter}>
                <div className={styles.deadline}>
                  <Calendar size={14} />
                  <span>{new Date(project.deadline).toLocaleDateString('de-DE')}</span>
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
                    <div className={styles.statusIconWrapper} style={{ color: getStatusColor(selectedProject.status) }}>
                      {getStatusIcon(selectedProject.status)}
                    </div>
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

            <div className={styles.modalTabs}>
              <button
                className={`${styles.modalTab} ${activeTab === 'details' ? styles.active : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <Eye size={16} />
                Übersicht
              </button>
              <button
                className={`${styles.modalTab} ${activeTab === 'edit' ? styles.active : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                <Edit size={16} />
                Bearbeiten
              </button>
            </div>

            <div className={styles.modalBody}>
              {activeTab === 'details' ? (
                <>
                  <div className={styles.innerModalContent}>
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

                    <div className={styles.userManagementSection}>
                      <h4>Team-Mitglieder verwalten</h4>

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
                  </div>
                  
                  <div className={styles.modalActions}>
                    <button
                      className={`${styles.actionButton} ${styles.timerAction} ${selectedProject.isTimerRunning ? styles.running : ''}`}
                      onClick={() => toggleProjectTimer(selectedProject.id)}
                    >
                      {selectedProject.isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                      {selectedProject.isTimerRunning ? 'Timer stoppen' : 'Timer starten'}
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    // Ensure status is a valid choice
                    if (!Object.keys(Project.STATUS_CHOICES).includes(formData.status)) {
                      throw new Error('Invalid status value');
                    }
                    
                    // Ensure priority is a valid choice
                    if (!Object.keys(Project.PRIORITY_CHOICES).includes(formData.priority)) {
                      throw new Error('Invalid priority value');
                    }

                    const updatedProject = new Project(
                      selectedProject.id,
                      selectedProject.user,
                      formData.name,
                      formData.description || '',  // description
                      formData.status,            // status
                      formData.priority,          // priority
                      selectedProject.progress || 0,
                      selectedProject.total_time || '0h',
                      selectedProject.today_time || '0h',
                      formData.deadline,
                      selectedProject.invited_users || [], // invited_users
                      formData.color,             // color
                      selectedProject.tasks || { total: 0, completed: 0 }
                    );

                    await updateProject(updatedProject);
                    await fetchData();
                    setActiveTab('details');
                  } catch (err) {
                    console.error("Fehler beim Aktualisieren:", err);
                    alert('Fehler beim Aktualisieren des Projekts. Bitte überprüfen Sie die eingegebenen Daten.');
                  }
                }}>
                  <div className={styles.formContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <FileText size={16} />
                        Projektname
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className={styles.input}
                        placeholder="Gib einen Projektnamen ein..."
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>
                        <FileText size={16} />
                        Beschreibung
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className={styles.textarea}
                        placeholder="Beschreibe dein Projekt..."
                        rows={4}
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          <Activity size={16} />
                          Status
                        </label>
                        <select
                          value={formData.status}
                          onChange={e => setFormData({ ...formData, status: e.target.value })}
                          className={styles.select}
                        >
                          {Object.entries(Project.STATUS_CHOICES).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          <Flag size={16} />
                          Priorität
                        </label>
                        <select
                          value={formData.priority}
                          onChange={e => setFormData({ ...formData, priority: e.target.value })}
                          className={styles.select}
                        >
                          {Object.entries(Project.PRIORITY_CHOICES).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          <Calendar size={16} />
                          Deadline
                        </label>
                        <input
                          type="date"
                          value={formData.deadline}
                          onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                          className={styles.input}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>
                          <Palette size={16} />
                          Projektfarbe
                        </label>
                        <input
                          type="color"
                          value={formData.color}
                          onChange={e => setFormData({ ...formData, color: e.target.value })}
                          className={styles.colorInput}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.modalFooter}>
                    <button 
                      type="submit" 
                      className={`${styles.submitButton} ${!hasChanges() ? styles.disabled : ''}`}
                      disabled={!hasChanges()}
                    >
                      <Save size={16} />
                      Änderungen speichern
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;