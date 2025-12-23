export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'vendor';
  createdAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  preferences?: {
    eventCategories: string[];
    notifications: boolean;
  };
}
