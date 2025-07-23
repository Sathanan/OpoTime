import React, { useState, useEffect } from 'react';
import {
  Eye,
  Edit,
  Save,
  FileText,
  Activity,
  Flag,
  Calendar,
  Palette,
  Clock,
  Users,
  CheckCircle2,
  UserPlus,
  X,
  Play,
  Pause,
  ListTodo,
  Plus,
  CheckCircle,
  Circle
} from 'lucide-react';
import styles from './css/detailsEditProjectModal.module.css';
import Project from '../api/models/project';
import { updateProject } from '../services/projectService';
import { getInvitedUserByProjectID, getAllUsers } from '../api/utilis/user';
import { createInvitation } from '../services/invitationService';
import { checkDeadline, DeadlineStatus } from '../utillity/deadlineChecker';
import { getUserInfoForProfileDisplay } from '../services/userInformationService';
import { getAllTaskByProject, createTask, updateTask, deleteTask } from '../services/taskService';
import Task from '../api/models/task';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdate: () => Promise<void>;
}

const TASK_STATUSES = {
  new: "To Do",
  in_progress: "In Progress",
  completed: "Completed"
};

const PRIORITIES = [
  { value: "low", label: "Niedrig", color: "#10b981" },
  { value: "medium", label: "Mittel", color: "#f59e0b" },
  { value: "high", label: "Hoch", color: "#ef4444" },
];

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onProjectUpdate
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'init',
    priority: 'medium',
    deadline: '',
    color: '#6B7280'
  });
  const [originalFormData, setOriginalFormData] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectCreator, setProjectCreator] = useState(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<any>(null);
  const [newTask, setNewTask] = useState({
    text: '',
    status: 'new',
    priority: 'medium',
    due_date: '',
    progress: 0,
    estimatedTime: 3600
  });

  useEffect(() => {
    if (project) {
      const loadProjectData = async () => {
        const initialData = {
          name: project.name || '',
          description: project.description || '',
          status: project.status || 'init',
          priority: project.priority || 'medium',
          deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
          color: project.color || '#3B82F6'
        };
        const creator = await getUserInfoForProfileDisplay(project.creator);
        setProjectCreator(creator);
        setFormData(initialData);
        setOriginalFormData(initialData);
      };
      loadProjectData();
    }
  }, [project]);

  useEffect(() => {
    async function fetchUsers() {
      if (!project) return;
      try {
        const users = await getInvitedUserByProjectID(project.id);
        setProjectUsers(Array.isArray(users) ? users : users ? [users] : []);
        const allUsers = await getAllUsers();
        setAvailableUsers(Array.isArray(allUsers) ? allUsers : allUsers ? [allUsers] : []);
      } catch (err) {
        console.error("Fehler beim Laden der Benutzer:", err);
      }
    }
    fetchUsers();
  }, [project]);

  useEffect(() => {
    async function fetchTasks() {
      if (!project) return;
      try {
        const projectTasks = await getAllTaskByProject(project.id);
        setTasks(Array.isArray(projectTasks) ? projectTasks : projectTasks ? [projectTasks] : []);
      } catch (err) {
        console.error("Error loading tasks:", err);
      }
    }
    fetchTasks();
  }, [project]);

  const hasChanges = () => {
    if (!originalFormData) return false;
    return Object.keys(formData).some(key => formData[key] !== originalFormData[key]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'init':
        return <FileText size={16} className={styles.statusIcon} />;
      case 'planning':
        return <Activity size={16} className={styles.statusIcon} />;
      case 'in_progress':
        return <Play size={16} className={styles.statusIcon} />;
      case 'paused':
        return <Pause size={16} className={styles.statusIcon} />;
      case 'cancelled':
        return <X size={16} className={styles.statusIcon} />;
      case 'completed':
        return <CheckCircle2 size={16} className={styles.statusIcon} />;
      default:
        return null;
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

  const handleAddUser = async () => {
    if (!selectedUserId || !project) return;

    const userToAdd = availableUsers.find(user => user.id === parseInt(selectedUserId));
    if (!userToAdd) return;

    if (projectUsers.find(user => user.id === userToAdd.id)) {
      alert('Benutzer ist bereits im Projekt');
      return;
    }

    const invitation = await createInvitation(project.id, parseInt(selectedUserId));
    const newUser = {
      ...userToAdd,
      InvitationState: "pending"
    };

    setProjectUsers([...projectUsers, newUser]);
    setSelectedUserId('');
  };

  const handleRemoveUser = (userId) => {
    setProjectUsers(projectUsers.filter(user => user.id !== userId));
  };

  const getAvailableUsersForDropdown = () => {
    return availableUsers.filter(user =>
      !projectUsers.find(projectUser => projectUser.id === user.id)
    );
  };

  const getDeadlineStatus = (deadline: string): DeadlineStatus => {
    return checkDeadline(deadline);
  };

  const handleAddTask = async () => {
    if (!newTask.text.trim() || !project) return;

    try {
      const createdTask = await createTask(
        project.id,
        newTask.status,
        newTask.text,
        newTask.priority,
        newTask.due_date,
        newTask.estimatedTime
      );

      if (createdTask) {
        setTasks(prev => [...prev, ...(Array.isArray(createdTask) ? createdTask : [createdTask])]);
        setIsAddingTask(false);
        setNewTask({
          text: '',
          status: 'new',
          priority: 'medium',
          due_date: '',
          progress: 0,
          estimatedTime: 3600
        });
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTaskData || !editingTask) return;

    try {
      const updatedTask = await updateTask(
        editingTask,
        editingTaskData.status,
        editingTaskData.text,
        editingTaskData.priority,
        editingTaskData.due_date,
        editingTaskData.progress
      );

      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === editingTask ? (Array.isArray(updatedTask) ? updatedTask[0] : updatedTask) : task
        ));
        setEditingTask(null);
        setEditingTaskData(null);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const updatedTask = await updateTask(taskId, newStatus);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? (Array.isArray(updatedTask) ? updatedTask[0] : updatedTask) : task
        ));
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const success = await deleteTask(taskId);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!isOpen || !project) return null;

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            <div
              className={styles.projectColorLarge}
              style={{ backgroundColor: project.color }}
            ></div>
            <div>
              <h2>{project.name}</h2>
              <div className={styles.modalStatus}>
                <div className={styles.statusIconWrapper} style={{ color: getStatusColor(project.status) }}>
                  {getStatusIcon(project.status)}
                </div>
                {Project.STATUS_CHOICES[project.status]}
              </div>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalTabs}>
          <button
            className={`${styles.modalTab} ${activeTab === 'details' ? styles.active : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Eye size={16} />
            Details
          </button>
          <button
            className={`${styles.modalTab} ${activeTab === 'tasks' ? styles.active : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <ListTodo size={16} />
            Aufgaben
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
            <div className={styles.innerModalContent}>
              <div className={styles.projectDetail}>
                <h4>Beschreibung</h4>
                <p>{project.description}</p>
                {projectCreator && (
                  <div className={styles.projectCreator}>
                    <div className={styles.creatorAvatar}>
                      {projectCreator.profile_image ? (
                        <img 
                          src={projectCreator.profile_image} 
                          alt={`${projectCreator.username}'s profile`}
                          className={styles.avatarImage}
                        />
                      ) : (
                        projectCreator.email?.substring(0, 2).toUpperCase() || 'UN'
                      )}
                    </div>
                    <div className={styles.creatorInfo}>
                      <span className={styles.creatorName}>{projectCreator.username +" ("+projectCreator.email+")" || 'Unbekannter Nutzer'}</span>
                      <span className={styles.creatorRole}>Projekt-Ersteller</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailCard}>
                  <h4>Fortschritt</h4>
                  <div className={styles.progressSection}>
                    <div className={styles.progressCircle}>
                      <div className={styles.progressText}>
                        {project.progress}%
                      </div>
                    </div>
                    <div className={styles.taskProgress}>
                      <span>{project.tasks.completed} von {project.tasks.total} Aufgaben</span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h4>Zeiterfassung</h4>
                  <div className={styles.timeStats}>
                    <div className={styles.timeStat}>
                      <span className={styles.timeLabel}>Gesamt</span>
                      <span className={styles.timeValue}>{project.total_time}</span>
                    </div>
                    <div className={styles.timeStat}>
                      <span className={styles.timeLabel}>Heute</span>
                      <span className={styles.timeValue}>{project.today_time}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.detailCard}>
                  <h4>Team & Deadline</h4>
                  <div className={styles.teamInfo}>
                    <div className={styles.teamStat}>
                      <Users size={16} />
                      <span>{projectUsers.length + 1} Mitglieder</span>
                    </div>
                    <div className={`${styles.deadlineStat} ${
                      getDeadlineStatus(project.deadline) === 'warning' ? styles.deadlineWarning : 
                      getDeadlineStatus(project.deadline) === 'overdue' ? styles.deadlineOverdue : ''
                    }`}>
                      <Calendar size={16} />
                      <span>{new Date(project.deadline).toLocaleDateString('de-DE')}</span>
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
          ) : activeTab === 'tasks' ? (
            <div className={styles.tasksTab}>
              <div className={styles.tasksHeader}>
                <h3>Projektaufgaben</h3>
                <button
                  className={styles.addTaskButton}
                  onClick={() => setIsAddingTask(true)}
                >
                  <Plus size={16} />
                  Neue Aufgabe
                </button>
              </div>

              {isAddingTask && (
                <div className={styles.taskForm}>
                  <div className={styles.formGrid}>
                    <input
                      type="text"
                      placeholder="Aufgabenbeschreibung..."
                      value={newTask.text}
                      onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                      className={styles.taskInput}
                    />
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
                    <input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                      className={styles.dateInput}
                    />
                    <input
                      type="number"
                      placeholder="Geschätzte Zeit (Stunden)"
                      value={newTask.estimatedTime / 3600}
                      onChange={(e) => setNewTask({
                        ...newTask,
                        estimatedTime: parseFloat(e.target.value) * 3600
                      })}
                      className={styles.timeInput}
                      min="0.5"
                      max="24"
                      step="0.5"
                    />
                  </div>
                  <div className={styles.taskFormActions}>
                    <button
                      className={styles.saveTaskButton}
                      onClick={handleAddTask}
                    >
                      <Save size={16} />
                      Speichern
                    </button>
                    <button
                      className={styles.cancelTaskButton}
                      onClick={() => setIsAddingTask(false)}
                    >
                      <X size={16} />
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.tasksList}>
                {tasks.map((task) => (
                  <div key={task.id} className={styles.taskItem}>
                    {editingTask === task.id ? (
                      <div className={styles.taskForm}>
                        <div className={styles.formGrid}>
                          <input
                            type="text"
                            placeholder="Aufgabenbeschreibung..."
                            value={editingTaskData.text}
                            onChange={(e) => setEditingTaskData({
                              ...editingTaskData,
                              text: e.target.value
                            })}
                            className={styles.taskInput}
                          />
                          <select
                            value={editingTaskData.status}
                            onChange={(e) => setEditingTaskData({
                              ...editingTaskData,
                              status: e.target.value
                            })}
                            className={styles.statusSelect}
                          >
                            {Object.entries(TASK_STATUSES).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={editingTaskData.priority}
                            onChange={(e) => setEditingTaskData({
                              ...editingTaskData,
                              priority: e.target.value
                            })}
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
                            value={editingTaskData.due_date || ''}
                            onChange={(e) => setEditingTaskData({
                              ...editingTaskData,
                              due_date: e.target.value
                            })}
                            className={styles.dateInput}
                          />
                          <input
                            type="number"
                            placeholder="Fortschritt (Stunden)"
                            value={(editingTaskData.progress || 0) / 3600}
                            onChange={(e) => setEditingTaskData({
                              ...editingTaskData,
                              progress: parseFloat(e.target.value) * 3600
                            })}
                            className={styles.timeInput}
                            min="0"
                            max="24"
                            step="0.5"
                          />
                        </div>
                        <div className={styles.taskFormActions}>
                          <button
                            className={styles.saveTaskButton}
                            onClick={handleUpdateTask}
                          >
                            <Save size={16} />
                            Speichern
                          </button>
                          <button
                            className={styles.cancelTaskButton}
                            onClick={() => {
                              setEditingTask(null);
                              setEditingTaskData(null);
                            }}
                          >
                            <X size={16} />
                            Abbrechen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.taskContent}>
                        <button
                          className={styles.taskStatusToggle}
                          onClick={() => handleUpdateTaskStatus(
                            task.id,
                            task.status === 'completed' ? 'new' : 'completed'
                          )}
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle size={18} className={styles.completedIcon} />
                          ) : (
                            <Circle size={18} className={styles.todoIcon} />
                          )}
                        </button>
                        <div className={styles.taskDetails}>
                          <span className={`${styles.taskText} ${task.status === 'completed' ? styles.completed : ''}`}>
                            {task.text}
                          </span>
                          <div className={styles.taskMeta}>
                            <span className={styles.taskStatus}>
                              {TASK_STATUSES[task.status || 'new']}
                            </span>
                            <span className={`${styles.taskPriority} ${styles[task.priority]}`}>
                              {PRIORITIES.find(p => p.value === task.priority)?.label}
                            </span>
                            {task.due_date && (
                              <span className={styles.taskDueDate}>
                                <Calendar size={14} />
                                {new Date(task.due_date).toLocaleDateString('de-DE')}
                              </span>
                            )}
                            {task.progress > 0 && (
                              <span className={styles.taskProgress}>
                                <Clock size={14} />
                                {formatTime(task.progress)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.taskActions}>
                          <button
                            className={styles.editTaskButton}
                            onClick={() => {
                              setEditingTaskData({
                                ...task,
                                text: task.text || ''
                              });
                              setEditingTask(task.id);
                            }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={styles.deleteTaskButton}
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (!Object.keys(Project.STATUS_CHOICES).includes(formData.status)) {
                  throw new Error('Invalid status value');
                }
                
                if (!Object.keys(Project.PRIORITY_CHOICES).includes(formData.priority)) {
                  throw new Error('Invalid priority value');
                }

                const updatedProject = new Project(
                  project.id,
                  project.creator,
                  formData.name,
                  formData.description || '',
                  formData.status,
                  formData.priority,
                  project.progress || 0,
                  project.total_time || '0h',
                  project.today_time || '0h',
                  formData.deadline,
                  project.invited_users || [],
                  formData.color,
                  project.tasks || { total: 0, completed: 0 }
                );

                await updateProject(updatedProject);
                await onProjectUpdate();
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

        {activeTab === 'details' && (
          <div className={styles.modalFooter}>
            <button
              className={`${styles.actionButton} ${styles.timerAction} ${isTimerRunning ? styles.running : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsTimerRunning(!isTimerRunning);
                // Timer toggle logic will be implemented later
              }}
            >
              {isTimerRunning ? (
                <>
                  <Pause size={16} />
                  Timer stoppen
                </>
              ) : (
                <>
                  <Play size={16} />
                  Timer starten
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal; 

