'use client';
import { useEffect, useState } from 'react';
import { makeApiCall } from '../../../api/utilis/basefunctions';

const ConfirmInvitationPage = ({ params }) => {
  const { token } = params;
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) return;

    const confirmInvitation = async () => {
      try {
        const response = await makeApiCall(`invitations/confirm/${token}`, "GET", null, false);
        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Fehler beim Bestätigen:", error);
        setStatus("error");
      }
    };

    confirmInvitation();
  }, [token]);

  if (status === "loading") return <p>🔄 Einladung wird überprüft...</p>;
  if (status === "success") return <p>✅ Einladung erfolgreich bestätigt! Du kannst jetzt dem Projekt beitreten.</p>;
  return <p>❌ Ungültige oder abgelaufene Einladung.</p>;
};

export default ConfirmInvitationPage;
