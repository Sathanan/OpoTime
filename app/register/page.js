"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../auth.module.css";
import { register } from "../api/auth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  async function handleRegister(name, email, password, confirmPassword) {
    if (password == confirmPassword) {
      await register(name, email, password);
    }
    else {
      alert("Die Passwörter stimmen nicht überein")
    }
  }
  return (
    <main className={styles.mainAuth}>
      <div className={styles.authContContext}>
        <div className={styles.authContCard}>
          <div className={styles.authContTitle}>
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
            <p>Opo Time</p>
          </div>
          <div className={styles.authContDescrip}>
            <p>Join us today and start tracking your productivity.</p>
          </div>
        </div>
      </div>

      <div className={styles.authContFormCont}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Create your Account</h2>

          <form>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>
                Username
              </label>
              <input
                type="text"
                id="username"
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>
                Password
              </label>
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
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password
              </label>
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

            <button
              className={styles.loginButton}
              onClick={(e) => {
                e.preventDefault();
                const name = document.getElementById("username").value;
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                const confirmPassword = document.getElementById("confirmPassword").value;
                handleRegister(name, email, password, confirmPassword);
              }}
            >
              Create Account
            </button>
            <div className={styles.registerLink}>
              Already have an account? <a href="../login">Login</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}