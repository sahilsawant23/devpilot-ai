import { db } from '@/lib/db';

export type NotificationType = 'security' | 'agent' | 'system' | 'docs' | 'activity';

export async function createNotification({
  userId,
  title,
  type = 'system',
}: {
  userId: string;
  title: string;
  type?: NotificationType;
}) {
  try {
    return await db.notification.create({
      data: {
        userId,
        title: `[${type.toUpperCase()}] ${title}`,
        read: false,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}
