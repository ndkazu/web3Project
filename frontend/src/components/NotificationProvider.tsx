import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Notification Container */}
      <div className="fixed top-8 right-8 z-50 space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="luxury-shadow animate-fade-in-up cursor-pointer"
            style={{
              backgroundColor: 'var(--color-luxury-white)',
              minWidth: '320px',
              maxWidth: '420px',
              animation: 'fadeInRight 0.4s ease-out'
            }}
            onClick={() => removeNotification(notification.id)}
          >
            <div
              className="flex items-start p-5 border-l-4"
              style={{
                borderColor: notification.type === 'success'
                  ? 'var(--color-luxury-gold)'
                  : notification.type === 'error'
                  ? '#dc2626'
                  : 'var(--color-luxury-gray)'
              }}
            >
              {/* Icon */}
              <div className="flex-shrink-0 mr-4">
                {notification.type === 'success' && (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="var(--color-luxury-gold)"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="#dc2626"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="var(--color-luxury-gray)"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              {/* Message */}
              <div className="flex-1">
                <p
                  className="text-sm font-light leading-relaxed"
                  style={{ color: 'var(--color-luxury-black)' }}
                >
                  {notification.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="flex-shrink-0 ml-4 opacity-50 hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="var(--color-luxury-gray)"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}
