"use client";
import { useState } from "react";
import Image from 'next/image';
import styles from "../auth.module.css";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <main className={styles.mainAuth}>
      <div className={styles.authContFormCont}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Create your Account</h2>
          <form>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">Password</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePassword}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="confirmPassword">Confirm Password</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className={styles.formInput}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={toggleConfirmPassword}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.loginButton}>Create Account</button>
            <div className={styles.registerLink}>
              Already have an account? <a href="../login">Login</a>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.authContContext}>
        <div className={styles.authContCard}>
          <div className={styles.authContTitle}>
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
            />
            <p>Opo Time</p>
          </div>
          <div className={styles.authContDescrip}>
            <p>Join us today and start tracking your productivity.</p>
          </div>
        </div>
      </div>
    </main>
  );
}