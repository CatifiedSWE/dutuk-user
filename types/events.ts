export type EventStatus = 'PLANNING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type InquiryStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CONFIRMED';

export interface PlannedEvent {
    id: string;
    user_id: string;
    title: string;
    event_date: string; // ISO Date String
    status: EventStatus;
    created_at: string;
    updated_at: string;
}

export interface EventInquiryItem {
    id: string;
    event_id: string;
    vendor_id: string;
    service_id?: string;
    quoted_price: number | null;
    status: InquiryStatus;
    conversation_id?: string;
    created_at: string;
    updated_at: string;

    // Optional Join Fields (for UI display)
    vendor?: {
        id: string;
        description: string | null;
        company_name: string | null;
        avatar_url: string | null;
    };
    service?: {
        id: string;
        name: string;
    };
}

export interface CreateEventBundlePayload {
    title: string;
    event_date: string; // YYYY-MM-DD
    items: {
        vendor_id: string;
        service_id?: string;
        quoted_price: number;
    }[];
}
