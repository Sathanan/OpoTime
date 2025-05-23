"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./css/requireAuth.module.css";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      setAuthenticated(true);
    } else {
      router.push("/login");
    }

    setAuthChecked(true);
  }, [router]);

  if (!authChecked) {
    return <div className={styles.loadingDiv}>Lade...</div>;
  }

  if (!authenticated) {
    return null;
  }

  return children;
}
