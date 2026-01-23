'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Check, Calendar, Users, Wallet,
    Building2, Sparkles, Heart, Briefcase, Cake, Music,
    Camera, UtensilsCrossed, Flower2, Loader2, Star
} from 'lucide-react';
import { useEventWizardStore, WizardVendorItem } from '@/store/useEventWizardStore';
import { useFlowEvents } from '@/hooks/useFlowEvents';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import AuthRequiredModal from '@/components/modals/AuthRequiredModal';
import { 
    isReturningFromAuth, 
    getStepFromUrl, 
    clearWizardReturnPath 
} from '@/lib/utils/wizardRedirect';

const OCCASIONS = [
    { id: 'wedding', name: 'Wedding', icon: Heart },
    { id: 'birthday', name: 'Birthday', icon: Cake },
    { id: 'corporate', name: 'Corporate Event', icon: Briefcase },
    { id: 'party', name: 'Party', icon: Music },
    { id: 'other', name: 'Other', icon: Sparkles },
];

const SERVICES = [
    { id: 'photography', name: 'Photography', icon: Camera, description: 'Capture every moment' },
    { id: 'catering', name: 'Catering', icon: UtensilsCrossed, description: 'Delicious food & drinks' },
    { id: 'decor', name: 'Decoration', icon: Flower2, description: 'Beautiful ambiance' },
    { id: 'venue', name: 'Venue', icon: Building2, description: 'The perfect location' },
    { id: 'music', name: 'Music & DJ', icon: Music, description: 'Entertainment & vibes' },
];

const STEPS = [
    { id: 1, title: 'Occasion', description: 'What are you celebrating?', icon: Sparkles },
    { id: 2, title: 'Date & Guests', description: 'When and how many?', icon: Calendar },
    { id: 3, title: 'Budget', description: 'Set your range', icon: Wallet },
    { id: 4, title: 'Services', description: 'What do you need?', icon: Star },
    { id: 5, title: 'Review', description: 'Confirm your event', icon: Check },
];

const BUDGET_TIERS = [
    { name: 'Budget', max: 50000 },
    { name: 'Mid-Range', max: 150000 },
    { name: 'Premium', max: 500000 },
    { name: 'Luxury', max: 1000000 },
];

const GUEST_MILESTONES = [
    { count: 50, label: 'Intimate' },
    { count: 100, label: 'Small' },
    { count: 200, label: 'Medium' },
    { count: 350, label: 'Large' },
    { count: 500, label: 'Grand' },
];

export default function EventPlanWizard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const {
        occasion, eventDate, guestCount, budgetMin, budgetMax, selectedItems,
        currentStep: storedStep,
        setOccasion, setEventDate, setGuestCount, setBudget, setCurrentStep: setStoredStep, clearWizard
    } = useEventWizardStore();

    const { user, loading: authLoading } = useAuth();
    const { createEventBundle, loading, error } = useFlowEvents();

    // Hydrate date from store (zustand persist stores as string)
    const [hydratedDate, setHydratedDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (eventDate) {
            setHydratedDate(new Date(eventDate));
        }
    }, [eventDate]);

    // Handle returning from auth
    useEffect(() => {
        if (isReturningFromAuth(searchParams)) {
            // Get step from URL or use stored step
            const urlStep = getStepFromUrl(searchParams);
            const stepToRestore = urlStep || storedStep || 5;
            
            // Restore step
            setCurrentStep(stepToRestore);
            
            // Show success message
            toast.success('Welcome back! Resuming your event planning...', {
                duration: 3000,
            });
            
            // Clear return path
            clearWizardReturnPath();
            
            // Clean URL
            router.replace('/events/plan', { scroll: false });
        } else if (storedStep && storedStep !== currentStep) {
            // Restore from stored step on initial mount
            setCurrentStep(storedStep);
        }
    }, [searchParams, storedStep]);

    const canProceed = () => {
        switch (currentStep) {
            case 1: return !!occasion;
            case 2: return !!hydratedDate;
            case 3: return budgetMin > 0 && budgetMax > budgetMin;
            case 4: return selectedServices.length > 0;
            case 5: return true;
            default: return false;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length && canProceed()) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setStoredStep(nextStep); // Save to store
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            const prevStep = currentStep - 1;
            setCurrentStep(prevStep);
            setStoredStep(prevStep); // Save to store
        }
    };

    const handleSubmit = async () => {
        // Check authentication first
        if (!user && !authLoading) {
            // User not authenticated - show auth modal
            setStoredStep(currentStep); // Save current step
            setShowAuthModal(true);
            return;
        }

        // User is authenticated, proceed with submission
        setIsSubmitting(true);

        try {
            const eventId = await createEventBundle({
                title: `${occasion} Event`,
                event_date: hydratedDate?.toISOString().split('T')[0] || '',
                items: [],
            });

            if (eventId) {
                toast.success('Event created successfully!');
                clearWizard();
                router.push(`/events/${eventId}`);
            } else {
                toast.error(error || 'Failed to create event. Please try again.');
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            toast.error(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatBudget = (value: number) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(1)}L`;
        }
        return `₹${(value / 1000).toFixed(0)}K`;
    };

    const getBudgetTier = () => {
        const avgBudget = (budgetMin + budgetMax) / 2;
        for (let i = BUDGET_TIERS.length - 1; i >= 0; i--) {
            if (avgBudget >= BUDGET_TIERS[i].max * 0.5) {
                return BUDGET_TIERS[i];
            }
        }
        return BUDGET_TIERS[0];
    };

    const getGuestCategory = () => {
        for (let i = GUEST_MILESTONES.length - 1; i >= 0; i--) {
            if (guestCount >= GUEST_MILESTONES[i].count) {
                return GUEST_MILESTONES[i].label;
            }
        }
        return 'Intimate';
    };

    return (
        <div className="min-h-screen bg-[#FDF5E6] overflow-x-hidden">
            {/* Auth Required Modal */}
            <AuthRequiredModal
                open={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                currentStep={currentStep}
            />

            {/* Clean Progress Header */}
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => router.push('/events')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#4F0000] transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium font-poppins">Back</span>
                        </button>
                        <div className="flex items-center gap-2 bg-[#FDF5E6] px-4 py-2 rounded-full border border-[#4F0000]/10">
                            <span className="text-sm font-semibold font-poppins text-[#4F0000]">
                                Step {currentStep}
                            </span>
                            <span className="text-gray-400">/</span>
                            <span className="text-sm font-poppins text-gray-500">{STEPS.length}</span>
                        </div>
                    </div>

                    {/* Clean Progress Bar */}
                    <div className="flex items-center gap-2">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div
                                    className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                                        step.id < currentStep
                                            ? 'bg-[#4F0000] shadow-md'
                                            : step.id === currentStep
                                                ? 'bg-[#4F0000] shadow-md ring-2 ring-[#FFC13C]'
                                                : 'bg-gray-200'
                                    }`}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <step.icon className={`w-5 h-5 ${step.id <= currentStep ? 'text-white' : 'text-gray-400'}`} />
                                    )}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className="flex-1 h-1 rounded-full overflow-hidden bg-gray-200">
                                        <div
                                            className="h-full bg-[#4F0000] transition-all duration-200"
                                            style={{ width: step.id < currentStep ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Clean Step Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4F0000] mb-4 shadow-lg">
                                {React.createElement(STEPS[currentStep - 1].icon, { className: 'w-8 h-8 text-white' })}
                            </div>
                            <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl font-bold text-[#4F0000] mb-2">
                                {STEPS[currentStep - 1].title}
                            </h1>
                            <p className="font-poppins text-base text-gray-600">{STEPS[currentStep - 1].description}</p>
                        </div>

                        {/* Step 1: Occasion - Clean Cards */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {OCCASIONS.map((occ, index) => (
                                    <button
                                        key={occ.id}
                                        onClick={() => setOccasion(occ.name, occ.id)}
                                        className={`relative p-6 rounded-2xl border-2 transition-all duration-150 ${
                                            occasion === occ.name
                                                ? 'border-[#4F0000] bg-[#FDF5E6] shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        {/* Selection checkmark */}
                                        {occasion === occ.name && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-[#4F0000] rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        <div className="flex flex-col items-center text-center">
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${
                                                occasion === occ.name ? 'bg-[#4F0000]' : 'bg-gray-100'
                                            }`}>
                                                <occ.icon className={`w-7 h-7 ${occasion === occ.name ? 'text-white' : 'text-gray-600'}`} />
                                            </div>
                                            <span className="font-poppins font-semibold text-gray-800">{occ.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Date & Guests - Clean Design */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                {/* Calendar Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F0000] flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-poppins font-bold text-gray-800">Select Date</h3>
                                            <p className="font-poppins text-sm text-gray-500">Choose your event date</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <CalendarComponent
                                            mode="single"
                                            selected={hydratedDate}
                                            onSelect={(date) => {
                                                setHydratedDate(date);
                                                if (date) setEventDate(date);
                                            }}
                                            disabled={(date) => date < new Date()}
                                            className="rounded-xl border-0 p-3"
                                            classNames={{
                                                months: "flex flex-col space-y-4",
                                                month: "space-y-4",
                                                caption: "flex justify-center pt-1 relative items-center mb-3",
                                                caption_label: "font-poppins text-base font-bold text-[#4F0000]",
                                                nav: "space-x-1 flex items-center",
                                                nav_button: "h-8 w-8 bg-gray-100 hover:bg-[#4F0000] hover:text-white p-0 rounded-lg transition-all duration-150",
                                                nav_button_previous: "absolute left-1",
                                                nav_button_next: "absolute right-1",
                                                table: "w-full border-collapse space-y-1",
                                                head_row: "flex",
                                                head_cell: "text-gray-500 rounded-md w-9 font-poppins font-semibold text-xs",
                                                row: "flex w-full mt-2",
                                                cell: "relative p-0 text-center text-sm",
                                                day: "h-9 w-9 p-0 font-poppins font-medium rounded-lg hover:bg-[#FDF5E6] transition-all duration-150",
                                                day_selected: "bg-[#4F0000] text-white hover:bg-[#4F0000] hover:text-white shadow-md",
                                                day_today: "bg-[#FFC13C]/20 text-[#4F0000] font-bold",
                                                day_outside: "text-gray-300 opacity-50",
                                                day_disabled: "text-gray-300 opacity-50 line-through",
                                                day_hidden: "invisible",
                                            }}
                                        />
                                    </div>
                                    {hydratedDate && (
                                        <div className="mt-4 text-center p-3 bg-[#FDF5E6] rounded-xl">
                                            <p className="font-poppins text-xs text-gray-500">Selected Date</p>
                                            <p className="font-poppins text-sm font-bold text-[#4F0000]">
                                                {hydratedDate.toLocaleDateString('en-IN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Guest Count Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#4F0000] flex items-center justify-center">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-poppins font-bold text-gray-800">Expected Guests</h3>
                                            <p className="font-poppins text-sm text-gray-500">How many people?</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-poppins text-3xl font-bold text-[#4F0000]">
                                                {guestCount}
                                            </span>
                                            <p className="font-poppins text-xs text-gray-400">{getGuestCategory()} Event</p>
                                        </div>
                                    </div>

                                    <div className="py-3">
                                        <Slider
                                            value={[guestCount]}
                                            onValueChange={(value) => setGuestCount(value[0])}
                                            min={10}
                                            max={500}
                                            step={10}
                                            className="w-full [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-[#4F0000] [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-md"
                                        />
                                        {/* Milestones */}
                                        <div className="flex justify-between mt-4">
                                            {GUEST_MILESTONES.map((milestone) => (
                                                <div
                                                    key={milestone.count}
                                                    className={`text-center transition-all duration-150 ${
                                                        guestCount >= milestone.count ? 'opacity-100' : 'opacity-40'
                                                    }`}
                                                >
                                                    <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 ${
                                                        guestCount >= milestone.count ? 'bg-[#4F0000]' : 'bg-gray-300'
                                                    }`} />
                                                    <span className="font-poppins text-xs font-medium text-gray-500">{milestone.count}</span>
                                                    <p className="font-poppins text-xs text-gray-400">{milestone.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Budget - Clean Design */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#4F0000] flex items-center justify-center">
                                        <Wallet className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-poppins font-bold text-gray-800">Set Your Budget</h3>
                                        <p className="font-poppins text-sm text-gray-500">Define your spending range</p>
                                    </div>
                                </div>

                                {/* Budget Display */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-4 bg-[#FDF5E6] px-6 py-4 rounded-xl">
                                        <span className="font-poppins text-2xl md:text-3xl font-bold text-[#4F0000]">
                                            {formatBudget(budgetMin)}
                                        </span>
                                        <span className="text-xl text-gray-400">—</span>
                                        <span className="font-poppins text-2xl md:text-3xl font-bold text-[#4F0000]">
                                            {formatBudget(budgetMax)}
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <span className="font-poppins font-semibold text-[#FFC13C]">{getBudgetTier().name}</span>
                                    </div>
                                </div>

                                {/* Budget Sliders */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-poppins text-sm font-medium text-gray-600">Minimum Budget</label>
                                            <span className="font-poppins text-sm font-bold text-[#4F0000]">{formatBudget(budgetMin)}</span>
                                        </div>
                                        <Slider
                                            value={[budgetMin]}
                                            onValueChange={(value) => setBudget(value[0], budgetMax)}
                                            min={10000}
                                            max={budgetMax - 10000}
                                            step={5000}
                                            className="[&_[role=slider]]:bg-[#4F0000] [&_[role=slider]]:border-0"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="font-poppins text-sm font-medium text-gray-600">Maximum Budget</label>
                                            <span className="font-poppins text-sm font-bold text-[#4F0000]">{formatBudget(budgetMax)}</span>
                                        </div>
                                        <Slider
                                            value={[budgetMax]}
                                            onValueChange={(value) => setBudget(budgetMin, value[0])}
                                            min={budgetMin + 10000}
                                            max={1000000}
                                            step={10000}
                                            className="[&_[role=slider]]:bg-[#4F0000] [&_[role=slider]]:border-0"
                                        />
                                    </div>
                                </div>

                                {/* Budget Tiers */}
                                <div className="grid grid-cols-4 gap-2 mt-6">
                                    {BUDGET_TIERS.map((tier) => (
                                        <div
                                            key={tier.name}
                                            className={`text-center p-2 rounded-lg transition-all duration-150 ${
                                                getBudgetTier().name === tier.name
                                                    ? 'bg-[#FDF5E6] ring-1 ring-[#FFC13C]'
                                                    : 'bg-gray-50'
                                            }`}
                                        >
                                            <span className="font-poppins text-xs font-medium text-gray-600">{tier.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Services - Clean Design */}
                        {currentStep === 4 && (
                            <div className="space-y-3">
                                <p className="font-poppins text-center text-gray-500 mb-4">
                                    Select the services you need for your event
                                </p>
                                {SERVICES.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedServices(prev =>
                                                prev.includes(service.id)
                                                    ? prev.filter(s => s !== service.id)
                                                    : [...prev, service.id]
                                            );
                                        }}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-150 ${
                                            selectedServices.includes(service.id)
                                                ? 'border-[#4F0000] bg-[#FDF5E6] shadow-md'
                                                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-150 ${
                                            selectedServices.includes(service.id)
                                                ? 'bg-[#4F0000]'
                                                : 'bg-gray-100'
                                        }`}>
                                            <service.icon className={`w-6 h-6 ${
                                                selectedServices.includes(service.id) ? 'text-white' : 'text-gray-500'
                                            }`} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <span className="font-poppins font-semibold text-gray-800 block">{service.name}</span>
                                            <span className="font-poppins text-sm text-gray-500">{service.description}</span>
                                        </div>
                                        {selectedServices.includes(service.id) && (
                                            <div className="w-7 h-7 bg-[#4F0000] rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 5: Review - Clean Design */}
                        {currentStep === 5 && (
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#4F0000] flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-poppins font-bold text-gray-800">Event Summary</h3>
                                        <p className="font-poppins text-sm text-gray-500">Review your event details</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <SummaryRow
                                        icon={<Sparkles className="w-5 h-5" />}
                                        label="Occasion"
                                        value={occasion || 'Not selected'}
                                    />
                                    <SummaryRow
                                        icon={<Calendar className="w-5 h-5" />}
                                        label="Date"
                                        value={hydratedDate?.toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) || 'Not selected'}
                                    />
                                    <SummaryRow
                                        icon={<Users className="w-5 h-5" />}
                                        label="Expected Guests"
                                        value={`${guestCount} people (${getGuestCategory()})`}
                                    />
                                    <SummaryRow
                                        icon={<Wallet className="w-5 h-5" />}
                                        label="Budget Range"
                                        value={`${formatBudget(budgetMin)} - ${formatBudget(budgetMax)}`}
                                    />
                                    <SummaryRow
                                        icon={<Star className="w-5 h-5" />}
                                        label="Services"
                                        value={selectedServices.map(s =>
                                            SERVICES.find(svc => svc.id === s)?.name
                                        ).join(', ') || 'None selected'}
                                    />
                                </div>

                                <div className="mt-6 p-4 bg-[#FDF5E6] rounded-xl">
                                    <p className="font-poppins text-sm text-gray-600 text-center">
                                        ✨ After creating your event, you'll be able to browse and select specific vendors for each service.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Clean Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 shadow-lg">
                <div className="container mx-auto max-w-3xl flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="gap-2 font-poppins text-gray-600 hover:text-[#4F0000] hover:bg-[#FDF5E6] disabled:opacity-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    {currentStep < STEPS.length ? (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="btn-gradient gap-2 flex items-center text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 font-poppins font-semibold"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !canProceed()}
                            className="btn-gradient gap-2 flex items-center text-white px-8 py-3 rounded-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 font-poppins font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Create Event
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm text-[#4F0000]">
                {icon}
            </div>
            <div className="flex-1">
                <span className="font-poppins text-sm text-gray-500">{label}</span>
                <p className="font-poppins font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
}
