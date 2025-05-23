'use client';
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Target, 
  TrendingUp,
  Edit2,
  Camera,
  Save,
  X,
  Settings,
  Bell,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  Star,
  Trophy,
  Zap,
  BarChart3
} from 'lucide-react';
import styles from './profile.module.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joined: '2023-01-15',
    bio: 'Passionate developer and time management enthusiast. Always looking for ways to optimize productivity and create amazing user experiences.',
    avatar: '/api/placeholder/150/150',
    timezone: 'PST (UTC-8)',
    language: 'English',
    notifications: true,
    darkMode: true
  });

  const [stats, setStats] = useState({
    totalHours: 1247,
    projectsCompleted: 42,
    averageDaily: 6.5,
    currentStreak: 15,
    achievements: 28,
    efficiency: 94
  });

  const achievements = [
    { icon: Trophy, name: 'First Project', description: 'Completed your first project', earned: true },
    { icon: Target, name: '100 Hours', description: 'Tracked 100 hours of work', earned: true },
    { icon: Zap, name: 'Speed Demon', description: 'Completed 10 tasks in one day', earned: true },
    { icon: Star, name: 'Consistent', description: '30-day tracking streak', earned: false },
    { icon: BarChart3, name: 'Analyzer', description: 'Generated 50 reports', earned: false },
    { icon: CheckCircle, name: 'Perfectionist', description: '95% task completion rate', earned: true }
  ];

  const recentActivity = [
    { type: 'project', title: 'Completed "Mobile App UI"', time: '2 hours ago', color: 'success' },
    { type: 'task', title: 'Updated project requirements', time: '4 hours ago', color: 'info' },
    { type: 'timer', title: 'Worked on development task', time: '6 hours ago', color: 'primary' },
    { type: 'achievement', title: 'Earned "Speed Demon" badge', time: '1 day ago', color: 'warning' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset any changes
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className={styles.profileCont}>
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.headerContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              <img src={profileData.avatar} alt="" className={styles.avatar} />
              <button className={styles.avatarEdit} title="Change photo">
                <Camera size={16} />
              </button>
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>{profileData.name}</h1>
              <p className={styles.userTitle}>Senior Developer</p>
              <div className={styles.userMeta}>
                <span className={styles.metaItem}>
                  <MapPin size={14} />
                  {profileData.location}
                </span>
                <span className={styles.metaItem}>
                  <Calendar size={14} />
                  Joined {new Date(profileData.joined).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            {!isEditing ? (
              <button 
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            ) : (
              <div className={styles.editActions}>
                <button 
                  className={styles.saveButton}
                  onClick={handleSave}
                >
                  <Save size={16} />
                  Save
                </button>
                <button 
                  className={styles.cancelButton}
                  onClick={handleCancel}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalHours.toLocaleString()}</h3>
            <p className={styles.statLabel}>Total Hours</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Target size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.projectsCompleted}</h3>
            <p className={styles.statLabel}>Projects Completed</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.averageDaily}h</h3>
            <p className={styles.statLabel}>Daily Average</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Award size={24} />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.currentStreak}</h3>
            <p className={styles.statLabel}>Day Streak</p>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewContent}>
            <div className={styles.profileSection}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{profileData.name}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{profileData.email}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{profileData.phone}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{profileData.location}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Timezone</label>
                  {isEditing ? (
                    <select
                      value={profileData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className={styles.select}
                    >
                      <option value="PST (UTC-8)">PST (UTC-8)</option>
                      <option value="EST (UTC-5)">EST (UTC-5)</option>
                      <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                      <option value="CET (UTC+1)">CET (UTC+1)</option>
                    </select>
                  ) : (
                    <p className={styles.value}>{profileData.timezone}</p>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Language</label>
                  {isEditing ? (
                    <select
                      value={profileData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      className={styles.select}
                    >
                      <option value="English">English</option>
                      <option value="German">German</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  ) : (
                    <p className={styles.value}>{profileData.language}</p>
                  )}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Bio</label>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className={styles.textarea}
                    rows={4}
                  />
                ) : (
                  <p className={styles.value}>{profileData.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className={styles.activityContent}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <div className={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <div key={index} className={`${styles.activityItem} ${styles[activity.color]}`}>
                  <div className={styles.activityIcon}>
                    {activity.type === 'project' && <Target size={18} />}
                    {activity.type === 'task' && <CheckCircle size={18} />}
                    {activity.type === 'timer' && <Clock size={18} />}
                    {activity.type === 'achievement' && <Award size={18} />}
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityTitle}>{activity.title}</p>
                    <span className={styles.activityTime}>{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className={styles.achievementsContent}>
            <h2 className={styles.sectionTitle}>Achievements</h2>
            <div className={styles.achievementsGrid}>
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <div
                    key={index}
                    className={`${styles.achievementCard} ${achievement.earned ? styles.earned : styles.locked}`}
                  >
                    <div className={styles.achievementIcon}>
                      <IconComponent size={24} />
                    </div>
                    <div className={styles.achievementContent}>
                      <h3 className={styles.achievementName}>{achievement.name}</h3>
                      <p className={styles.achievementDescription}>{achievement.description}</p>
                    </div>
                    {achievement.earned && (
                      <div className={styles.achievementBadge}>
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className={styles.settingsContent}>
            <h2 className={styles.sectionTitle}>Preferences</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h3 className={styles.settingName}>Email Notifications</h3>
                  <p className={styles.settingDescription}>Receive updates about your projects and tasks</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={profileData.notifications}
                    onChange={(e) => handleInputChange('notifications', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
              <div className={styles.settingItem}>
                <div className={styles.settingInfo}>
                  <h3 className={styles.settingName}>Dark Mode</h3>
                  <p className={styles.settingDescription}>Toggle between light and dark themes</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={profileData.darkMode}
                    onChange={(e) => handleInputChange('darkMode', e.target.checked)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;