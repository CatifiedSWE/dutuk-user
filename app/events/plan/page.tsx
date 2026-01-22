'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Check, Calendar, Users, Wallet,
    Building2, Sparkles, Heart, Briefcase, Cake, Music,
    Camera, UtensilsCrossed, Flower2, Loader2, Star, Crown, Zap
} from 'lucide-react';
import { useEventWizardStore, WizardVendorItem } from '@/store/useEventWizardStore';
import { useFlowEvents } from '@/hooks/useFlowEvents';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const OCCASIONS = [
    { id: 'wedding', name: 'Wedding', icon: Heart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50' },
    { id: 'birthday', name: 'Birthday', icon: Cake, color: 'from-amber-500 to-orange-500', bgColor: 'bg-gradient-to-br from-amber-50 to-orange-50' },
    { id: 'corporate', name: 'Corporate Event', icon: Briefcase, color: 'from-blue-500 to-indigo-500', bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50' },
    { id: 'party', name: 'Party', icon: Music, color: 'from-purple-500 to-violet-500', bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50' },
    { id: 'other', name: 'Other', icon: Sparkles, color: 'from-teal-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-teal-50 to-emerald-50' },
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
    { name: 'Budget-Friendly', max: 50000, icon: Zap, color: 'text-green-600' },
    { name: 'Mid-Range', max: 150000, icon: Star, color: 'text-blue-600' },
    { name: 'Premium', max: 500000, icon: Crown, color: 'text-purple-600' },
    { name: 'Luxury', max: 1000000, icon: Sparkles, color: 'text-amber-600' },
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
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const {
        occasion, eventDate, guestCount, budgetMin, budgetMax, selectedItems,
        setOccasion, setEventDate, setGuestCount, setBudget, clearWizard
    } = useEventWizardStore();

    const { createEventBundle, loading, error } = useFlowEvents();

    // Hydrate date from store (zustand persist stores as string)
    const [hydratedDate, setHydratedDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (eventDate) {
            setHydratedDate(new Date(eventDate));
        }
    }, [eventDate]);

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
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const supabase = (await import('@/lib/supabase/client')).createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Please log in to create an event');
                router.push('/auth/login?redirect=/events/plan');
                return;
            }

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
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 overflow-x-hidden">
            {/* Enhanced Progress Header with Glassmorphism */}
            <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm">
                <div className="container mx-auto px-4 py-5">
                    <div className="flex items-center justify-between mb-5">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push('/events')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#4F0000] transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back</span>
                        </motion.button>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-[#4F0000]/10 to-rose-100 px-4 py-2 rounded-full">
                            <span className="text-sm font-semibold text-[#4F0000]">
                                Step {currentStep}
                            </span>
                            <span className="text-gray-400">/</span>
                            <span className="text-sm text-gray-500">{STEPS.length}</span>
                        </div>
                    </div>

                    {/* Enhanced Progress Bar with Step Icons */}
                    <div className="flex items-center gap-2">
                        {STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: step.id === currentStep ? 1.1 : 1,
                                    }}
                                    className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-500 ${step.id < currentStep
                                            ? 'bg-gradient-to-br from-[#4F0000] to-[#8B0000] shadow-lg shadow-[#4F0000]/30'
                                            : step.id === currentStep
                                                ? 'bg-gradient-to-br from-[#4F0000] to-[#8B0000] shadow-lg shadow-[#4F0000]/30 ring-4 ring-[#4F0000]/20'
                                                : 'bg-gray-200'
                                        }`}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <step.icon className={`w-5 h-5 ${step.id <= currentStep ? 'text-white' : 'text-gray-400'}`} />
                                    )}
                                    {step.id === currentStep && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-[#4F0000]/30"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}
                                </motion.div>
                                {index < STEPS.length - 1 && (
                                    <div className="flex-1 h-1 rounded-full overflow-hidden bg-gray-200">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-[#4F0000] to-[#8B0000]"
                                            initial={false}
                                            animate={{
                                                width: step.id < currentStep ? '100%' : '0%'
                                            }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="container mx-auto px-4 py-10 max-w-4xl pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        {/* Enhanced Step Header */}
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F0000] to-[#8B0000] mb-4 shadow-xl shadow-[#4F0000]/25"
                            >
                                {React.createElement(STEPS[currentStep - 1].icon, { className: 'w-8 h-8 text-white' })}
                            </motion.div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#4F0000] via-[#8B0000] to-[#4F0000] bg-clip-text text-transparent mb-3">
                                {STEPS[currentStep - 1].title}
                            </h1>
                            <p className="text-lg text-gray-500">{STEPS[currentStep - 1].description}</p>
                        </div>

                        {/* Step 1: Occasion - Enhanced Cards */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                {OCCASIONS.map((occ, index) => (
                                    <motion.button
                                        key={occ.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setOccasion(occ.name, occ.id)}
                                        className={`relative p-8 rounded-3xl border-2 transition-all duration-300 overflow-hidden group ${occasion === occ.name
                                                ? 'border-[#4F0000] shadow-xl shadow-[#4F0000]/20'
                                                : 'border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white'
                                            }`}
                                    >
                                        {/* Background gradient on selection */}
                                        <div className={`absolute inset-0 ${occ.bgColor} transition-opacity duration-300 ${occasion === occ.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                                            }`} />

                                        {/* Selection checkmark */}
                                        <AnimatePresence>
                                            {occasion === occ.name && (
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0, rotate: 180 }}
                                                    className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-[#4F0000] to-[#8B0000] rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <Check className="w-4 h-4 text-white" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="relative z-10">
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${occ.color} flex items-center justify-center mb-4 shadow-lg mx-auto`}
                                            >
                                                <occ.icon className="w-8 h-8 text-white" />
                                            </motion.div>
                                            <span className="font-semibold text-gray-800 text-lg">{occ.name}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Date & Guests - Enhanced */}
                        {currentStep === 2 && (
                            <div className="space-y-8">
                                {/* Calendar Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F0000] to-[#8B0000] flex items-center justify-center shadow-lg">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">Select Date</h3>
                                            <p className="text-sm text-gray-500">Choose your event date</p>
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
                                            className="rounded-2xl border-0 p-4"
                                            classNames={{
                                                months: "flex flex-col space-y-4",
                                                month: "space-y-4",
                                                caption: "flex justify-center pt-1 relative items-center mb-4",
                                                caption_label: "text-lg font-bold text-[#4F0000]",
                                                nav: "space-x-1 flex items-center",
                                                nav_button: "h-9 w-9 bg-gray-100 hover:bg-[#4F0000] hover:text-white p-0 rounded-xl transition-all duration-300",
                                                nav_button_previous: "absolute left-1",
                                                nav_button_next: "absolute right-1",
                                                table: "w-full border-collapse space-y-1",
                                                head_row: "flex",
                                                head_cell: "text-gray-500 rounded-md w-10 font-semibold text-[0.85rem]",
                                                row: "flex w-full mt-2",
                                                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent",
                                                day: "h-10 w-10 p-0 font-medium rounded-xl hover:bg-[#4F0000]/10 transition-all duration-200 aria-selected:opacity-100",
                                                day_selected: "bg-gradient-to-br from-[#4F0000] to-[#8B0000] text-white hover:bg-[#4F0000] hover:text-white focus:bg-[#4F0000] focus:text-white shadow-lg shadow-[#4F0000]/30",
                                                day_today: "bg-[#4F0000]/10 text-[#4F0000] font-bold ring-2 ring-[#4F0000]/30",
                                                day_outside: "text-gray-300 opacity-50",
                                                day_disabled: "text-gray-300 opacity-50 line-through",
                                                day_hidden: "invisible",
                                            }}
                                        />
                                    </div>
                                    {hydratedDate && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 text-center p-4 bg-gradient-to-r from-[#4F0000]/5 to-rose-50 rounded-2xl"
                                        >
                                            <p className="text-sm text-gray-500">Selected Date</p>
                                            <p className="text-lg font-bold text-[#4F0000]">
                                                {hydratedDate.toLocaleDateString('en-IN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Guest Count Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-lg">Expected Guests</h3>
                                            <p className="text-sm text-gray-500">How many people are coming?</p>
                                        </div>
                                        <div className="text-right">
                                            <motion.span
                                                key={guestCount}
                                                initial={{ scale: 1.2, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent"
                                            >
                                                {guestCount}
                                            </motion.span>
                                            <p className="text-sm text-gray-400">{getGuestCategory()} Event</p>
                                        </div>
                                    </div>

                                    <div className="relative py-4">
                                        <Slider
                                            value={[guestCount]}
                                            onValueChange={(value) => setGuestCount(value[0])}
                                            min={10}
                                            max={500}
                                            step={10}
                                            className="w-full [&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-gradient-to-br [&_[role=slider]]:from-purple-500 [&_[role=slider]]:to-violet-600 [&_[role=slider]]:border-0 [&_[role=slider]]:shadow-lg"
                                        />
                                        {/* Milestones */}
                                        <div className="flex justify-between mt-6">
                                            {GUEST_MILESTONES.map((milestone) => (
                                                <div
                                                    key={milestone.count}
                                                    className={`text-center transition-all duration-300 ${guestCount >= milestone.count ? 'opacity-100' : 'opacity-40'
                                                        }`}
                                                >
                                                    <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${guestCount >= milestone.count
                                                            ? 'bg-gradient-to-br from-purple-500 to-violet-600'
                                                            : 'bg-gray-300'
                                                        }`} />
                                                    <span className="text-xs font-medium text-gray-500">{milestone.count}</span>
                                                    <p className="text-xs text-gray-400">{milestone.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Step 3: Budget - Enhanced */}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                        <Wallet className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">Set Your Budget</h3>
                                        <p className="text-sm text-gray-500">Define your spending range</p>
                                    </div>
                                </div>

                                {/* Budget Display */}
                                <div className="text-center mb-10">
                                    <div className="inline-flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 rounded-2xl">
                                        <motion.span
                                            key={budgetMin}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className="text-3xl md:text-4xl font-bold text-emerald-600"
                                        >
                                            {formatBudget(budgetMin)}
                                        </motion.span>
                                        <span className="text-2xl text-gray-400">—</span>
                                        <motion.span
                                            key={budgetMax}
                                            initial={{ scale: 1.1 }}
                                            animate={{ scale: 1 }}
                                            className="text-3xl md:text-4xl font-bold text-teal-600"
                                        >
                                            {formatBudget(budgetMax)}
                                        </motion.span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-2">
                                        {React.createElement(getBudgetTier().icon, { className: `w-5 h-5 ${getBudgetTier().color}` })}
                                        <span className={`font-semibold ${getBudgetTier().color}`}>{getBudgetTier().name}</span>
                                    </div>
                                </div>

                                {/* Budget Sliders */}
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between mb-3">
                                            <label className="text-sm font-medium text-gray-600">Minimum Budget</label>
                                            <span className="text-sm font-bold text-emerald-600">{formatBudget(budgetMin)}</span>
                                        </div>
                                        <Slider
                                            value={[budgetMin]}
                                            onValueChange={(value) => setBudget(value[0], budgetMax)}
                                            min={10000}
                                            max={budgetMax - 10000}
                                            step={5000}
                                            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-emerald-500 [&_[role=slider]]:to-teal-500 [&_[role=slider]]:border-0"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-3">
                                            <label className="text-sm font-medium text-gray-600">Maximum Budget</label>
                                            <span className="text-sm font-bold text-teal-600">{formatBudget(budgetMax)}</span>
                                        </div>
                                        <Slider
                                            value={[budgetMax]}
                                            onValueChange={(value) => setBudget(budgetMin, value[0])}
                                            min={budgetMin + 10000}
                                            max={1000000}
                                            step={10000}
                                            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-teal-500 [&_[role=slider]]:to-emerald-500 [&_[role=slider]]:border-0"
                                        />
                                    </div>
                                </div>

                                {/* Budget Tiers */}
                                <div className="grid grid-cols-4 gap-3 mt-8">
                                    {BUDGET_TIERS.map((tier) => (
                                        <div
                                            key={tier.name}
                                            className={`text-center p-3 rounded-xl transition-all duration-300 ${getBudgetTier().name === tier.name
                                                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 ring-2 ring-emerald-500/30'
                                                    : 'bg-gray-50'
                                                }`}
                                        >
                                            <tier.icon className={`w-5 h-5 mx-auto mb-1 ${tier.color}`} />
                                            <span className="text-xs font-medium text-gray-600">{tier.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Services - Enhanced */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <p className="text-center text-gray-500 mb-6">
                                    Select the services you need for your event
                                </p>
                                {SERVICES.map((service, index) => (
                                    <motion.button
                                        key={service.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setSelectedServices(prev =>
                                                prev.includes(service.id)
                                                    ? prev.filter(s => s !== service.id)
                                                    : [...prev, service.id]
                                            );
                                        }}
                                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${selectedServices.includes(service.id)
                                                ? 'border-[#4F0000] bg-gradient-to-r from-[#4F0000]/5 to-rose-50 shadow-lg'
                                                : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${selectedServices.includes(service.id)
                                                ? 'bg-gradient-to-br from-[#4F0000] to-[#8B0000] shadow-lg'
                                                : 'bg-gray-100'
                                            }`}>
                                            <service.icon className={`w-7 h-7 ${selectedServices.includes(service.id) ? 'text-white' : 'text-gray-500'
                                                }`} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <span className="font-semibold text-gray-800 text-lg block">{service.name}</span>
                                            <span className="text-sm text-gray-500">{service.description}</span>
                                        </div>
                                        <AnimatePresence>
                                            {selectedServices.includes(service.id) && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    exit={{ scale: 0 }}
                                                    className="w-8 h-8 bg-gradient-to-br from-[#4F0000] to-[#8B0000] rounded-full flex items-center justify-center"
                                                >
                                                    <Check className="w-5 h-5 text-white" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {/* Step 5: Review - Enhanced */}
                        {currentStep === 5 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F0000] to-[#8B0000] flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-xl">Event Summary</h3>
                                        <p className="text-sm text-gray-500">Review your event details</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <SummaryRow
                                        icon={<Sparkles className="w-5 h-5" />}
                                        label="Occasion"
                                        value={occasion || 'Not selected'}
                                        color="text-pink-500"
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
                                        color="text-blue-500"
                                    />
                                    <SummaryRow
                                        icon={<Users className="w-5 h-5" />}
                                        label="Expected Guests"
                                        value={`${guestCount} people (${getGuestCategory()})`}
                                        color="text-purple-500"
                                    />
                                    <SummaryRow
                                        icon={<Wallet className="w-5 h-5" />}
                                        label="Budget Range"
                                        value={`${formatBudget(budgetMin)} - ${formatBudget(budgetMax)}`}
                                        color="text-emerald-500"
                                    />
                                    <SummaryRow
                                        icon={<Star className="w-5 h-5" />}
                                        label="Services"
                                        value={selectedServices.map(s =>
                                            SERVICES.find(svc => svc.id === s)?.name
                                        ).join(', ') || 'None selected'}
                                        color="text-amber-500"
                                    />
                                </div>

                                <div className="mt-8 p-4 bg-gradient-to-r from-[#4F0000]/5 to-rose-50 rounded-2xl">
                                    <p className="text-sm text-gray-600 text-center">
                                        ✨ After creating your event, you'll be able to browse and select specific vendors for each service.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Enhanced Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-4 shadow-2xl shadow-gray-200/50">
                <div className="container mx-auto max-w-3xl flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="gap-2 text-gray-600 hover:text-[#4F0000] hover:bg-[#4F0000]/5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="gap-2 bg-gradient-to-r from-[#4F0000] to-[#8B0000] hover:from-[#3A0000] hover:to-[#6B0000] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#4F0000]/30 transition-all duration-300 disabled:opacity-50"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !canProceed()}
                            className="gap-2 bg-gradient-to-r from-[#4F0000] to-[#8B0000] hover:from-[#3A0000] hover:to-[#6B0000] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#4F0000]/30 transition-all duration-300"
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
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function SummaryRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm ${color}`}>
                {icon}
            </div>
            <div className="flex-1">
                <span className="text-sm text-gray-500">{label}</span>
                <p className="font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
}
