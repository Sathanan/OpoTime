"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import styles from "../auth.module.css";
import { login } from "../api/auth";
import { useRouter  } from 'next/navigation';
import Cookies from "js-cookie";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");

    if (accessToken && refreshToken) {
      router.push("/dashboard");
    }
  }, [router]); 
  async function handleLogin(email, password) {
    const success = await login(email, password);
     if (success) {
      router.push('/dashboard')
    }
  }

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

            <button
              className={styles.loginButton}
              onClick={(e) => {
                 e.preventDefault();
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                handleLogin(email, password);
              }}
            >
              Login
            </button>
            <div className={styles.registerLink}>
              Don't have an account? <a href="../register">Register</a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
