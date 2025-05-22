import { BASE_URL } from "./utilis/config";
import Timestamp from "./models/timestamp";

import Cookies from 'js-cookie';

export async function getTimestampsByUser(since) {
    const token = Cookies.get('accessToken');

    const response = await fetch(`${BASE_URL}/time-entries/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },

        params: {
            since: since,
            user_id: 'USER_ID',
        }
    });

    if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Zeitstempel');
    }

    const timestampData = await response.json();
    return convertJsonToModel(timestampData);
}
export async function getTimestampsByProject(since, projectId) {
    const token = Cookies.get('accessToken');

    const response = await fetch(`${BASE_URL}/time-entries/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        params: {
            since: since,
            project_id: projectId,
        }
    });

    if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Zeitstempel');
    }

    const timestampData = await response.json();
    return convertJsonToModel(timestampData);
}

export async function createTimestamp(project, type) {
    const token = Cookies.get('accessToken');

    const response = await fetch(`${BASE_URL}/time-entries/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(project, type),
    });

    if (!response.ok) {
        throw new Error('Fehler beim Erstellen des Zeitstempels');
    }

    const timestampData = await response.json();
    return convertJsonToModel(timestampData);
}

export async function updateTimestamp(entryId, type) {
    const token = Cookies.get('accessToken');

    const response = await fetch(`${BASE_URL}/time-entries/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            entry_id: entryId,
            type,
        }),
    });

    if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Zeitstempels');
    }

    const timestampData = await response.json();
    return convertJsonToModel(timestampData);
}

export async function deleteTimestamp(entryId) {
    const token = Cookies.get('accessToken');

    const response = await fetch(`${BASE_URL}/time-entries/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        params: {
            entry_id: entryId,
        },
    });

    if (!response.ok) {
        throw new Error('Fehler beim Löschen des Zeitstempels');
    }

    return { message: 'Projekt erfolgreich gelöscht' };
}

function convertJsonToModel(data) {
    var convertedData = data.map(data => {
        return new Timestamp(
            data.id,
            data.user,
            data.project,
            data.timestamp,
            data.type
        );
    });
    return convertedData;
}