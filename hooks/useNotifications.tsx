'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './useAuth';

// =====================================================
// TYPES
// =====================================================

export interface Notification {
    id: string;
    type: 'message' | 'booking_update' | 'booking_accepted' | 'booking_rejected';
    title: string;
    message: string;
    link?: string;
    read: boolean;
    created_at: string;
    metadata?: {
        conversation_id?: string;
        order_id?: string;
        vendor_name?: string;
        sender_name?: string;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    unreadMessageCount: number;
    loading: boolean;
    markAsRead: (notificationId: string) => void;
    markAllAsRead: () => void;
    refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// =====================================================
// PROVIDER
// =====================================================

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Fetch notifications (unread messages + booking updates)
    const fetchNotifications = useCallback(async () => {
        if (!user) {
            setNotifications([]);
            setUnreadMessageCount(0);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const notificationsList: Notification[] = [];

            // Fetch unread messages count per conversation
            const { data: unreadData } = await supabase
                .rpc('get_unread_count', { user_id_param: user.id });

            let totalUnread = 0;
            if (unreadData) {
                // Get conversation details for notifications
                const conversationIds = unreadData.map((u: any) => u.conversation_id);

                if (conversationIds.length > 0) {
                    const { data: convData } = await supabase
                        .from('conversations_with_users')
                        .select('*')
                        .in('id', conversationIds);

                    unreadData.forEach((item: any) => {
                        if (item.unread_count > 0) {
                            totalUnread += item.unread_count;
                            const conv = convData?.find((c: any) => c.id === item.conversation_id);
                            const senderName = conv?.customer_id === user.id
                                ? conv?.vendor_company || 'Vendor'
                                : conv?.customer_name || 'Customer';

                            notificationsList.push({
                                id: `msg-${item.conversation_id}`,
                                type: 'message',
                                title: 'New Message',
                                message: `${item.unread_count} unread message${item.unread_count > 1 ? 's' : ''} from ${senderName}`,
                                link: `/chat?id=${item.conversation_id}`,
                                read: false,
                                created_at: new Date().toISOString(),
                                metadata: {
                                    conversation_id: item.conversation_id,
                                    sender_name: senderName,
                                },
                            });
                        }
                    });
                }
            }

            setUnreadMessageCount(totalUnread);

            // Fetch recent booking updates (orders with status changes in last 24 hours)
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const { data: ordersData } = await supabase
                .from('orders')
                .select('id, status, title, updated_at, vendor_id, companies!orders_vendor_id_fkey(company)')
                .eq('customer_id', user.id)
                .in('status', ['approved', 'rejected'])
                .gte('updated_at', yesterday.toISOString())
                .order('updated_at', { ascending: false })
                .limit(10);

            if (ordersData) {
                ordersData.forEach((order: any) => {
                    const vendorName = order.companies?.company || 'Vendor';
                    notificationsList.push({
                        id: `order-${order.id}`,
                        type: order.status === 'approved' ? 'booking_accepted' : 'booking_rejected',
                        title: order.status === 'approved' ? 'Booking Accepted! 🎉' : 'Booking Update',
                        message: order.status === 'approved'
                            ? `${vendorName} accepted your booking "${order.title}"`
                            : `${vendorName} declined your booking "${order.title}"`,
                        link: '/bookings',
                        read: false,
                        created_at: order.updated_at,
                        metadata: {
                            order_id: order.id,
                            vendor_name: vendorName,
                        },
                    });
                });
            }

            // Sort by created_at descending
            notificationsList.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setNotifications(notificationsList);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Realtime subscription for new messages and order updates
    useEffect(() => {
        if (!user) return;

        // Subscribe to new messages
        const messagesChannel = supabase
            .channel('notifications-messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        // Subscribe to order status changes
        const ordersChannel = supabase
            .channel('notifications-orders')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    const order = payload.new as any;
                    if (order.customer_id === user.id) {
                        fetchNotifications();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messagesChannel);
            supabase.removeChannel(ordersChannel);
        };
    }, [user, supabase, fetchNotifications]);

    const markAsRead = useCallback((notificationId: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                unreadMessageCount,
                loading,
                markAsRead,
                markAllAsRead,
                refetch: fetchNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

// =====================================================
// HOOK
// =====================================================

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
