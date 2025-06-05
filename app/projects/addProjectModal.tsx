'use client';
import React, { useState } from 'react';
import {
  X,
  Calendar,
  Users,
  Target,
  FileText,
  Palette,
  Clock,
  Plus,
  Minus,
  Activity,
  ClipboardList,
  Flag
} from 'lucide-react';
import styles from './css/addProjectModal.module.css';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: any) => void;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    deadline: '',
    progress: "",
    today_time: 0,
    total_time: '',
    color: '#3B82F6',
    invited_users: [],
    priority: 'medium',
  });

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    { color: '#3B82F6', name: 'Blau' },
    { color: '#10B981', name: 'Grün' },
    { color: '#8B5CF6', name: 'Lila' },
    { color: '#F59E0B', name: 'Orange' },
    { color: '#EF4444', name: 'Rot' },
    { color: '#6B7280', name: 'Grau' },
    { color: '#EC4899', name: 'Pink' },
    { color: '#14B8A6', name: 'Türkis' }
  ];

  const statusOptions = [
    { value: 'completed', label: 'Abgeschlossen', color: '#6B7280' },
    { value: 'active', label: 'Aktiv', color: '#10B981' },
    { value: 'paused', label: 'Pausiert', color: '#F59E0B' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Niedrig', color: '#10B981' },
    { value: 'medium', label: 'Mittel', color: '#F59E0B' },
    { value: 'high', label: 'Hoch', color: '#EF4444' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Projektname ist erforderlich';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Beschreibung ist erforderlich';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline ist erforderlich';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline muss in der Zukunft liegen';
      }
    }

    if (!formData.total_time || parseInt(formData.total_time) <= 0) {
      newErrors.estimatedHours = 'Geschätzte Stunden müssen größer als 0 sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addTeamMember = () => {
    if (newMemberName.trim() && newMemberEmail.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
        email: newMemberEmail.trim()
      };

      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.invited_users, newMember]
      }));

      setNewMemberName('');
      setNewMemberEmail('');
    }
  };

  const removeTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.invited_users.filter(member => member.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const projectData = {
        ...formData,
        progress: 0,
        totalTime: '00:00:00',
        todayTime: '00:00:00',
        tasks: { total: 0, completed: 0 },
        createdAt: new Date().toISOString()
      };

      onSubmit(projectData);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      progress:"",
      today_time: 0,
      status: 'planning',
      deadline: '',
      total_time: '',
      color: '#3B82F6',
      invited_users: [],
      priority: 'medium'
    });
    setErrors({});
    setNewMemberName('');
    setNewMemberEmail('');
    setNewTag('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay} 
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Plus size={24} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Neues Projekt erstellen</h2>
              <p className={styles.modalSubtitle}>Fügen Sie alle wichtigen Projektdetails hinzu</p>
            </div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalBody}>
          <div className={styles.formGrid}>
            {/* Projekt Name */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <ClipboardList size={16} />
                Projektname *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="z.B. Website Redesign"
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            {/* Beschreibung */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FileText size={16} />
                Beschreibung *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                placeholder="Beschreiben Sie das Projekt..."
                rows={3}
              />
              {errors.description && <span className={styles.errorText}>{errors.description}</span>}
            </div>

            {/* Status und Priorität */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Activity size={16} />
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={styles.select}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className={styles.select}
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deadline und Geschätzte Stunden */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Calendar size={16} />
                  Deadline *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className={`${styles.input} ${errors.deadline ? styles.inputError : ''}`}
                />
                {errors.deadline && <span className={styles.errorText}>{errors.deadline}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Clock size={16} />
                  Geschätzte Stunden *
                </label>
                <input
                  type="number"
                  value={formData.total_time}
                  onChange={(e) => handleInputChange('total_time', e.target.value)}
                  className={`${styles.input} ${errors.total_time ? styles.inputError : ''}`}
                  placeholder="z.B. 40"
                  min="1"
                />
                {errors.estimatedHours && <span className={styles.errorText}>{errors.total_time}</span>}
              </div>
            </div>

            {/* Projektfarbe */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Palette size={16} />
                Projektfarbe
              </label>
              <div className={styles.colorPickerContainer}>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={styles.colorPicker}
                />
                <span className={styles.currentColor}>{formData.color}</span>
              </div>
            </div>
            </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className={styles.submitButton}
            >
              <Plus size={16} />
              Projekt erstellen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;