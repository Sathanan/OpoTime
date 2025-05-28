import { prisma } from '@/lib/prisma'; // Passe das an deine DB-Instanz an
import { getServerSession } from 'next-auth'; // falls du NextAuth nutzt

export async function PUT(req) {
  const session = await getServerSession(); // Passe an deine Auth an
  if (!session) {
    return new Response(JSON.stringify({ message: 'Nicht authentifiziert' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const userId = session.user.id; // oder andere ID
  const body = await req.json();
  const { profile_picture } = body;

  if (!profile_picture) {
    return new Response(JSON.stringify({ message: 'Kein Bild angegeben' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const updatedProfile = await prisma.profile.update({
      where: { user: userId },
      data: { profile_picture },
    });

    return new Response(JSON.stringify(updatedProfile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren:', error);
    return new Response(JSON.stringify({ message: 'Fehler beim Speichern' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
