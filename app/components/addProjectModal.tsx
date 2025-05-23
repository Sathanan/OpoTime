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
  Minus
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
    status: 'planning',
    deadline: '',
    estimatedHours: '',
    color: '#3B82F6',
    teamMembers: [] as TeamMember[],
    priority: 'medium',
    tags: [] as string[]
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
    { value: 'planning', label: 'Planung', color: '#6B7280' },
    { value: 'active', label: 'Aktiv', color: '#10B981' },
    { value: 'on-hold', label: 'Pausiert', color: '#F59E0B' }
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

    if (!formData.estimatedHours || parseInt(formData.estimatedHours) <= 0) {
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
        teamMembers: [...prev.teamMembers, newMember]
      }));

      setNewMemberName('');
      setNewMemberEmail('');
    }
  };

  const removeTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== id)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const projectData = {
        ...formData,
        id: Date.now().toString(),
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
      status: 'planning',
      deadline: '',
      estimatedHours: '',
      color: '#3B82F6',
      teamMembers: [],
      priority: 'medium',
      tags: []
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
    <div className={styles.modalOverlay} onClick={handleClose}>
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
                <FileText size={16} />
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
                  <Target size={16} />
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
                  <Target size={16} />
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
                  value={formData.estimatedHours}
                  onChange={(e) => handleInputChange('estimatedHours', e.target.value)}
                  className={`${styles.input} ${errors.estimatedHours ? styles.inputError : ''}`}
                  placeholder="z.B. 40"
                  min="1"
                />
                {errors.estimatedHours && <span className={styles.errorText}>{errors.estimatedHours}</span>}
              </div>
            </div>

            {/* Projektfarbe */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Palette size={16} />
                Projektfarbe
              </label>
              <div className={styles.colorPicker}>
                {colorOptions.map(option => (
                  <button
                    key={option.color}
                    type="button"
                    className={`${styles.colorOption} ${formData.color === option.color ? styles.colorSelected : ''}`}
                    style={{ backgroundColor: option.color }}
                    onClick={() => handleInputChange('color', option.color)}
                    title={option.name}
                  />
                ))}
              </div>
            </div>

            {/* Team Mitglieder */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Users size={16} />
                Team Mitglieder
              </label>
              
              <div className={styles.teamMemberInput}>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className={styles.input}
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className={styles.input}
                  placeholder="E-Mail"
                />
                <button
                  type="button"
                  onClick={addTeamMember}
                  className={styles.addButton}
                  disabled={!newMemberName.trim() || !newMemberEmail.trim()}
                >
                  <Plus size={16} />
                </button>
              </div>

              {formData.teamMembers.length > 0 && (
                <div className={styles.teamMembersList}>
                  {formData.teamMembers.map(member => (
                    <div key={member.id} className={styles.teamMember}>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.name}</span>
                        <span className={styles.memberEmail}>{member.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className={styles.removeButton}
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Tags
              </label>
              
              <div className={styles.tagInput}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className={styles.input}
                  placeholder="Tag hinzufügen..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className={styles.addButton}
                  disabled={!newTag.trim()}
                >
                  <Plus size={16} />
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className={styles.tagsList}>
                  {formData.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className={styles.tagRemove}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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