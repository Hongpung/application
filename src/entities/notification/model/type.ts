interface NotificationType {
    notificationId: number;
    isRead: boolean,
    data: { title: string, body: string, data?: Record<string, any> },
    timestamp: string
}

export type { NotificationType };
