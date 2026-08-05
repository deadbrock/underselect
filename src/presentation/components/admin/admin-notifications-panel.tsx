'use client';

import { memo } from 'react';

import { Button } from '@presentation/components/ui';
import { useAdminStore } from '@presentation/stores/admin';
import { formatDateTime } from '@shared/utils/format';

export const AdminNotificationsPanel = memo(function AdminNotificationsPanel() {
  const notifications = useAdminStore((s) => s.notifications);
  const markRead = useAdminStore((s) => s.markNotificationRead);
  const markAllRead = useAdminStore((s) => s.markAllNotificationsRead);
  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="p-1">
      <div className="flex items-center justify-between px-2 py-1.5">
        <span className="text-sm font-medium">Notificações</span>
        {unread.length > 0 && (
          <Button
            type="button"
            variant="link"
            className="text-label h-auto p-0"
            onClick={markAllRead}
          >
            Marcar todas
          </Button>
        )}
      </div>
      <ul className="max-h-72 overflow-y-auto" aria-label="Notificações">
        {notifications.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              className="hover:bg-muted w-full px-2 py-2.5 text-left transition-colors"
              onClick={() => markRead(n.id)}
            >
              <div className="flex items-start gap-2">
                {!n.read && (
                  <span
                    className="bg-brand-bronze mt-1.5 size-2 shrink-0 rounded-full"
                    aria-hidden
                  />
                )}
                <div className={n.read ? 'pl-4' : undefined}>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-muted-foreground text-xs">{n.message}</p>
                  <time
                    className="text-muted-foreground mt-1 block text-[0.625rem]"
                    dateTime={n.createdAt}
                  >
                    {formatDateTime(n.createdAt)}
                  </time>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});
