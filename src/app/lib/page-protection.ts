import { redirect } from 'next/navigation';
import Role from '@/types/prisma';

// Define a proper session type
type Session = {
  user: {
    email: string;
    id: string;
    role: Role; // Changed from randomKey to role
  }
} | null;
/**
 * Redirects to the login page if the user is not logged in.
 */
export const loggedInProtectedPage = (session: Session) => {
  if (!session) {
    redirect('/auth/signin');
  }
};
/**
 * Redirects to the login page if the user is not logged in.
 * Redirects to the not-authorized page if the user is not an admin.
 */
export const adminProtectedPage = (session: Session) => {
  loggedInProtectedPage(session);
  if (session && session.user.role !== Role.ADMIN) { // Changed from randomKey to role
    redirect('/not-authorized');
  }
};
