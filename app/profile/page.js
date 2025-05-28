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
  CheckCircle
} from 'lucide-react';

import styles from './profile.module.css';

import { getUserInformation, updateUserInformation } from '../services/userInformationService'; 

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserInformation();
        console.log("DEBUG: Daten im Profile-Component erhalten:", data);

        if (!data) {
          setError("Keine Profildaten erhalten.");
          setProfileData(null);
          return;
        }

        // Falls data ein Array ist, nimm das erste Element
        const user = Array.isArray(data) ? data[0] : data;

        setProfileData({
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
          joined: user.joined_at || '',
          bio: user.bio || '',
          avatar: user.profile_picture || '/api/placeholder/150/150',
          timezone: user.user_timezone || '',
          language: Array.isArray(user.languages) ? user.languages[0] : user.languages || 'English',
          notifications: true,
          darkMode: true
        });
      } catch (err) {
        console.error("DEBUG: Fehler beim Laden des Profils:", err);
        setError("Fehler beim Laden des Profils.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
  if (!profileData) return;

  const updates = [
    ['first_name', profileData.name.split(' ')[0]],
    ['last_name', profileData.name.split(' ')[1] || ''],
    ['email', profileData.email],
    ['phone', profileData.phone],
    ['location', profileData.location],
    ['user_timezone', profileData.timezone],
    ['languages', profileData.language], // Hier: String statt Array
    ['bio', profileData.bio]
  ];

  for (let [key, value] of updates) {
    await updateUserInformation(key, value);
  }

  setIsEditing(false);
};


  const handleCancel = () => {
    setIsEditing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const recentActivity = [
    { type: 'project', title: 'Completed "Mobile App UI"', time: '2 hours ago', color: 'success' },
    { type: 'task', title: 'Updated project requirements', time: '4 hours ago', color: 'info' },
    { type: 'timer', title: 'Worked on development task', time: '6 hours ago', color: 'primary' }
  ];

  if (loading) return <div>Lade Profil...</div>;
  if (error) return <div style={{ color: "red" }}>Fehler: {error}</div>;
  if (!profileData) return <div>Keine Profildaten vorhanden.</div>;

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
                <h1 className={styles.userName}>{profileData.name || "Nutzer"}</h1>
                <p className={styles.userTitle}></p>
                <div className={styles.userMeta}>
                  <span className={styles.metaItem}>
                    <MapPin size={14} />
                    {profileData.location || "-"}
                  </span>
                  <span className={styles.metaItem}>
                    <Calendar size={14} />
                    Joined {profileData.joined ? new Date(profileData.joined).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.headerActions}>
              {!isEditing ? (
                <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} /> Edit Profile
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button className={styles.saveButton} onClick={handleSave}>
                    <Save size={16} /> Save
                  </button>
                  <button className={styles.cancelButton} onClick={handleCancel}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
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
                  {[
                    ['Full Name', 'name', 'text'],
                    ['Email', 'email', 'email'],
                    ['Phone', 'phone', 'tel'],
                    ['Location', 'location', 'text']
                  ].map(([label, field, type]) => (
                    <div key={field} className={styles.formGroup}>
                      <label className={styles.label}>{label}</label>
                      {isEditing ? (
                        <input
                          type={type}
                          value={profileData[field]}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <p className={styles.value}>{profileData[field]}</p>
                      )}
                    </div>
                  ))}

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

          {activeTab === 'settings' && (
            <div className={styles.settingsContent}>
              <h2 className={styles.sectionTitle}>Preferences</h2>
              <div className={styles.settingsGrid}>
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