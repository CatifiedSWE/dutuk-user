import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WizardVendorItem {
    vendorId: string;
    vendorName: string;
    serviceId?: string;
    serviceName?: string;
    quotedPrice: number;
    avatarUrl?: string; // For UI display
}

interface EventWizardState {
    // Step 1: Occasion
    occasion: string;
    occasionId?: string;

    // Step 2: Date & Filters
    eventDate: Date | undefined;
    guestCount: number;
    budgetMin: number;
    budgetMax: number;

    // Step 3: Bundle Selection
    selectedItems: WizardVendorItem[];

    // Actions
    setOccasion: (occasion: string, id?: string) => void;
    setEventDate: (date: Date | undefined) => void;
    setGuestCount: (count: number) => void;
    setBudget: (min: number, max: number) => void;

    addItem: (item: WizardVendorItem) => void;
    removeItem: (vendorId: string) => void;
    clearWizard: () => void;
}

export const useEventWizardStore = create<EventWizardState>()(
    persist(
        (set) => ({
            occasion: '',
            eventDate: undefined,
            guestCount: 50,
            budgetMin: 10000,
            budgetMax: 500000,
            selectedItems: [],

            setOccasion: (occasion, id) => set({ occasion, occasionId: id }),
            setEventDate: (date) => set({ eventDate: date }),
            setGuestCount: (count) => set({ guestCount: count }),
            setBudget: (min, max) => set({ budgetMin: min, budgetMax: max }),

            addItem: (item) =>
                set((state) => {
                    // Prevent duplicates (same vendor)
                    const exists = state.selectedItems.find((i) => i.vendorId === item.vendorId);
                    if (exists) return state;
                    return { selectedItems: [...state.selectedItems, item] };
                }),

            removeItem: (vendorId) =>
                set((state) => ({
                    selectedItems: state.selectedItems.filter((i) => i.vendorId !== vendorId),
                })),

            clearWizard: () =>
                set({
                    occasion: '',
                    occasionId: undefined,
                    eventDate: undefined,
                    guestCount: 50,
                    budgetMin: 10000,
                    budgetMax: 500000,
                    selectedItems: [],
                }),
        }),
        {
            name: 'dutuk-event-wizard-storage',
            // Custom serialization for Date object if needed, but standard JSON usually fine for basic persistence
            // Note: Date objects become strings in JSON. Needs hydration usage or transformation.
        }
    )
);
