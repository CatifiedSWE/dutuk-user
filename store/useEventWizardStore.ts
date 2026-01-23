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

    // Progress tracking
    currentStep: number;
    lastUpdated: number;

    // Actions
    setOccasion: (occasion: string, id?: string) => void;
    setEventDate: (date: Date | undefined) => void;
    setGuestCount: (count: number) => void;
    setBudget: (min: number, max: number) => void;
    setCurrentStep: (step: number) => void;

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
            currentStep: 1,
            lastUpdated: Date.now(),

            setOccasion: (occasion, id) => set({ 
                occasion, 
                occasionId: id,
                lastUpdated: Date.now()
            }),
            
            setEventDate: (date) => set({ 
                eventDate: date,
                lastUpdated: Date.now()
            }),
            
            setGuestCount: (count) => set({ 
                guestCount: count,
                lastUpdated: Date.now()
            }),
            
            setBudget: (min, max) => set({ 
                budgetMin: min, 
                budgetMax: max,
                lastUpdated: Date.now()
            }),
            
            setCurrentStep: (step) => set({ 
                currentStep: step,
                lastUpdated: Date.now()
            }),

            addItem: (item) =>
                set((state) => {
                    // Prevent duplicates (same vendor)
                    const exists = state.selectedItems.find((i) => i.vendorId === item.vendorId);
                    if (exists) return state;
                    return { 
                        selectedItems: [...state.selectedItems, item],
                        lastUpdated: Date.now()
                    };
                }),

            removeItem: (vendorId) =>
                set((state) => ({
                    selectedItems: state.selectedItems.filter((i) => i.vendorId !== vendorId),
                    lastUpdated: Date.now()
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
                    currentStep: 1,
                    lastUpdated: Date.now()
                }),
        }),
        {
            name: 'dutuk-event-wizard-storage',
        }
    )
);