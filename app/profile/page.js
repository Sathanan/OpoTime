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
  CheckCircle,
  Globe
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

import styles from './profile.module.css';

import { getUserInformation, updateUserInformation } from '../services/userInformationService'; 
import { getUserImage, uploadUserImage } from '../services/userImageService';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, setCurrentLanguage, translate, languages } = useLanguage();

  const [profileData, setProfileData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(profileData?.avatar || null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserInformation();
        console.log("DEBUG: Daten im Profile-Component erhalten:", data);

        const userImage = await getUserImage("profile");

        if (!data) {
          setError("Keine Profildaten erhalten.");
          setProfileData(null);
          return;
        }

        // Falls data ein Array ist, nimm das erste Element
        const user = Array.isArray(data) ? data[0] : data;

        setProfileData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          job: user.job || '',
          location: user.location || '',
          joined: user.joined_at || '',
          bio: user.bio || '',
          avatar: userImage.imageUrl || '/default-avatar.png',
          timezone: user.user_timezone || '',
          language: Array.isArray(user.languages) ? user.languages[0] : user.languages || 'English',
          notifications: true,
          darkMode: isDarkMode
        });
      } catch (err) {
        console.error("DEBUG: Fehler beim Laden des Profils:", err);
        setError("Fehler beim Laden des Profils.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isDarkMode]);

  const handleInputChange = (field, value) => {
    if (field === 'darkMode') {
      toggleTheme();
    }
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!profileData) return;

    const updates = [
      ['first_name', profileData.first_name],
      ['last_name', profileData.last_name],
      ['email', profileData.email],
      ['phone', profileData.phone],
      ['job', profileData.job],
      ['location', profileData.location],
      ['user_timezone', profileData.timezone],
      ['languages', profileData.language],
      ['bio', profileData.bio],
    ];

    for (let [key, value] of updates) {
      await updateUserInformation(key, value);
    }
    await uploadUserImage(profileData.avatar, "profile");

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

const handleFileChange = async (event) => {
  setError(null);
  const file = event.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);
  setPreview(previewUrl);
  setUploading(true);

  try {
    const userinfo = await uploadUserImage(file, "profile");
    setImageUrl(userinfo.profile_picture);
    setProfileData(prev => ({
      ...prev,
      avatar: userinfo.profile_picture
    }));
  } catch (err) {
    setError('Upload fehlgeschlagen');
  } finally {
    setUploading(false);
  }
};


  const tabs = [
    { id: 'overview', label: translate('Overview'), icon: User },
    { id: 'activity', label: translate('Activity'), icon: Clock },
    { id: 'settings', label: translate('Settings'), icon: Settings }
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
                <img src={preview || profileData.avatar} alt="" className={styles.avatar} />
                <label className={styles.avatarEdit} title="Change photo" htmlFor="avatarUpload">
                  <Camera size={16} />
                </label>
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
              <div className={styles.userInfo}>
                <h1 className={styles.userName}>{`${profileData?.first_name || ''} ${profileData?.last_name || ''}`}</h1>
                <p className={styles.userTitle}>{profileData?.job || ''}</p>
                <div className={styles.userMeta}>
                  <span className={styles.metaItem}>
                    <MapPin size={14} />
                    {profileData?.location || "-"}
                  </span>
                  <span className={styles.metaItem}>
                    <Calendar size={14} />
                    Joined {profileData?.joined ? new Date(profileData.joined).toLocaleDateString() : "-"}
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
                <h2 className={styles.sectionTitle}>{translate('Personal Information')}</h2>
                <div className={styles.formGrid}>
                  {[
                    ['First Name', 'first_name', 'text'],
                    ['Last Name', 'last_name', 'text'],
                    ['Email', 'email', 'email'],
                    ['Phone', 'phone', 'tel'],
                    ['Job Title', 'job', 'text'],
                    ['Location', 'location', 'text']
                  ].map(([label, field, type]) => (
                    <div key={field} className={styles.formGroup}>
                      <label className={styles.label}>{translate(label)}</label>
                      {isEditing ? (
                        <input
                          type={type}
                          value={profileData[field] || ''}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          className={styles.input}
                        />
                      ) : (
                        <p className={styles.value}>{profileData?.[field] || ''}</p>
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
              <h2 className={styles.sectionTitle}>{translate('Preferences')}</h2>
              <div className={styles.settingsGrid}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingName}>{translate('Dark Mode')}</h3>
                    <p className={styles.settingDescription}>
                      {translate('Toggle between light and dark themes')}
                    </p>
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

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h3 className={styles.settingName}>{translate('Language Settings')}</h3>
                    <p className={styles.settingDescription}>
                      {translate('Choose your preferred language')}
                    </p>
                  </div>
                  <div className={styles.languageSelect}>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLanguage(lang.code)}
                        className={`${styles.languageButton} ${
                          currentLanguage === lang.code ? styles.activeLanguage : ''
                        }`}
                      >
                        <Globe size={16} />
                        {lang.label}
                      </button>
                    ))}
                  </div>
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
