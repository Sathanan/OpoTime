"use client";

import { useState } from "react";
import Image from 'next/image';
import styles from "../auth.module.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <main className={styles.mainAuth}>
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
            <p>Welcome back, log in and track your time.</p>
          </div>
        </div>
      </div>
      <div className={styles.authContFormCont}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Login to your Account</h2>

          <form>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Username / E-Mail</label>
              <input
                type="email"
                id="email"
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

            <div className={styles.checkboxContainer}>
              <div className={styles.checkboxGroup}>
                <input type="checkbox" id="remember" className={styles.checkbox} />
                <label htmlFor="remember" className={styles.checkboxLabel}>Remember me</label>
              </div>
              <a href="#" className={styles.forgotPassword}>Forgot password?</a>
            </div>

            <button type="submit" className={styles.loginButton}>Login</button>

            <div className={styles.registerLink}>
              Don't have an account? <a href="../register">Register</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
