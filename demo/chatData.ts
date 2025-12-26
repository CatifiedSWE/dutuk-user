export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  hasFile?: boolean;
  fileName?: string;
  fileSize?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  status?: 'online' | 'away' | 'offline';
  isActive?: boolean;
}

export const demoConversations: Conversation[] = [
  {
    id: '1',
    name: 'Victor George',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwGFtDIo4M2Jqeh5tUIFEyILW7CcFvulgob0-ajImHiJN1mvLVMAoJ5egqHEAyHLerGKw9KI_L5Ic2zjwDsa1-6bR28qBMHnhjIWXiIVMjStdh28P7iTYMRuVU6Y7llGnlb4VMph4vMrKwtS49zvoflryb1eqHy8htE3GJenJV7u4Ik6HCZq_gRQ7fNPjIg_ycx9_FUz0mnBPYK0qIJf-HaHDFH17fGBh5W36LcFE_cUvjxXsR0-4hyVArK_77hZ_3CH3OG1bwzsZ8',
    lastMessage: 'Just sent the details for the venue.',
    lastMessageTime: 'Now',
    unreadCount: 0,
    isOnline: true,
    status: 'online',
    isActive: true,
  },
  {
    id: '2',
    name: 'Mary Johns',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6_Kpbz_bmWlNqYocqUUgoBY6KLqRVffDbSw51zSz67RlBqTQOlCCr7xoPxgWZvOHDQTbB1N9O6W22NYxHf621d_pABgGe_KklbVagh8KyilijE4PZIrDviXpuWlZ4SQgrvL-5E-_IKRgZeXALrSW7qyssUbR4cnu-aI5W2O5lO_z5O82RETnermvFVfS5iGqkL-CdxHfZBod582SgQsFOB-XSezN7TYiNmVhcHe92r0CcIbx3fSJIWsUQQOZ4ZGt4gARJbixjcmhE',
    lastMessage: 'Perfect, thanks for the info!',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    isOnline: false,
    status: 'offline',
  },
  {
    id: '3',
    name: 'Maddy',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO0ObPGFIgIQAJsOE0pfHE6Weyu9tXnnq9GgBV_f3D7bgBj06bEYP9RxGLaqsdrbSrjhKMSC6IpMO1eequ56TSB02pQoxvQZ9b0G9U1vMPhRvYfV3GbaNhKZFITFdoPTqrUFg6f8XW45I5qzh42byBcKxsSXiN5JbDRZ1vP7xdaM3M7SThskAU7Q_DA2A-FfYIZlAz72Hvt3CDWQZCWbVWTOkX3najF8a6wQxUL9MyktqTynFdiZC7JZzuh4_iDBksS2XGhNCRIPvX',
    lastMessage: 'Are we still on for the meeting?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    status: 'offline',
  },
  {
    id: '4',
    name: 'Lavin JD',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7olxoeaztIi72pRZFxa-OPc289e4M9yJ45uoxxeHkTmTtqKazWOFiHBZrqJAjkyuh0rjbHnBzHIDztKtCGwcpn1alpEXP3Wcq36EMtYH9k58HkGJ403wUOnrZ055GzwNAZ3QCxrevQbmAE2THsAGo6DqwBX9TeMgeuWtqdt4-79XgU4_4_mXG_yH1ZRsvHe09vg8ap4lnqFKyDywLic7eD3zGsz2nMKpGLpLY1B9ZRP1rP2nYUtRoy1f4IvVyJK5iXTFNUX7LOSuZ',
    lastMessage: 'Let me check the schedule.',
    lastMessageTime: 'Mon',
    unreadCount: 0,
    isOnline: false,
    status: 'away',
  },
];

export const demoMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    text: 'Hey bro, are you free to DJ for a house party next Saturday night? 🎧',
    timestamp: '4:30 PM',
    isOwn: false,
  },
  {
    id: '2',
    senderId: 'me',
    text: "Hey! Next Saturday should be fine. What time is the party and where's the venue?",
    timestamp: '4:32 PM',
    isOwn: true,
  },
  {
    id: '3',
    senderId: '1',
    text: "It's at my place near Anna Nagar, from around 7:30 pm to 11:30 pm. Just a small crowd, around 30-40 people.",
    timestamp: '4:35 PM',
    isOwn: false,
  },
  {
    id: '4',
    senderId: 'me',
    text: 'Got it. Here is my rate card for private events.',
    timestamp: '4:36 PM',
    isOwn: true,
    hasFile: true,
    fileName: 'Rate_Card_2024.pdf',
    fileSize: '2.4 MB',
  },
];
