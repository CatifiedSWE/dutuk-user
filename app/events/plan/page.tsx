'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Check, Calendar, Users, Wallet,
    Building2, Sparkles, Heart, Briefcase, Cake, Music,
    Camera, UtensilsCrossed, Flower2, Loader2
} from 'lucide-react';
import { useEventWizardStore, WizardVendorItem } from '@/store/useEventWizardStore';
import { useFlowEvents } from '@/hooks/useFlowEvents';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const OCCASIONS = [
    { id: 'wedding', name: 'Wedding', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { id: 'birthday', name: 'Birthday', icon: Cake, color: 'from-amber-500 to-orange-500' },
    { id: 'corporate', name: 'Corporate Event', icon: Briefcase, color: 'from-blue-500 to-indigo-500' },
    { id: 'party', name: 'Party', icon: Music, color: 'from-purple-500 to-violet-500' },
    { id: 'other', name: 'Other', icon: Sparkles, color: 'from-teal-500 to-emerald-500' },
];

const SERVICES = [
    { id: 'photography', name: 'Photography', icon: Camera },
    { id: 'catering', name: 'Catering', icon: UtensilsCrossed },
    { id: 'decor', name: 'Decoration', icon: Flower2 },
    { id: 'venue', name: 'Venue', icon: Building2 },
    { id: 'music', name: 'Music & DJ', icon: Music },
];

const STEPS = [
    { id: 1, title: 'Occasion', description: 'What are you celebrating?' },
    { id: 2, title: 'Date & Guests', description: 'When and how many?' },
    { id: 3, title: 'Budget', description: 'Set your range' },
    { id: 4, title: 'Services', description: 'What do you need?' },
    { id: 5, title: 'Review', description: 'Confirm your event' },
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
            // Check if user is authenticated
            const supabase = (await import('@/lib/supabase/client')).createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast.error('Please log in to create an event');
                router.push('/auth/login?redirect=/events/plan');
                return;
            }

            // Create event with empty items initially
            // Users will add vendors later from the dashboard
            const eventId = await createEventBundle({
                title: `${occasion} Event`,
                event_date: hydratedDate?.toISOString().split('T')[0] || '',
                items: [], // Empty for now - vendors added later
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
            {/* Progress Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => router.push('/events')}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#4F0000] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>
                        <span className="text-sm text-gray-500">
                            Step {currentStep} of {STEPS.length}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step.id <= currentStep ? 'bg-[#4F0000]' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Step Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#4F0000] mb-2">
                                {STEPS[currentStep - 1].title}
                            </h1>
                            <p className="text-gray-600">{STEPS[currentStep - 1].description}</p>
                        </div>

                        {/* Step 1: Occasion */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {OCCASIONS.map((occ) => (
                                    <button
                                        key={occ.id}
                                        onClick={() => setOccasion(occ.name, occ.id)}
                                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${occasion === occ.name
                                            ? 'border-[#4F0000] bg-[#4F0000]/5 scale-105'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {occasion === occ.name && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-[#4F0000] rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${occ.color} flex items-center justify-center mb-3`}>
                                            <occ.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="font-medium text-gray-800">{occ.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Date & Guests */}
                        {currentStep === 2 && (
                            <div className="space-y-8">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-[#4F0000]" />
                                        Select Date
                                    </h3>
                                    <CalendarComponent
                                        mode="single"
                                        selected={hydratedDate}
                                        onSelect={(date) => {
                                            setHydratedDate(date);
                                            if (date) setEventDate(date);
                                        }}
                                        disabled={(date) => date < new Date()}
                                        className="rounded-lg border mx-auto"
                                    />
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-[#4F0000]" />
                                        Expected Guests: <span className="text-[#4F0000]">{guestCount}</span>
                                    </h3>
                                    <Slider
                                        value={[guestCount]}
                                        onValueChange={(value) => setGuestCount(value[0])}
                                        min={10}
                                        max={500}
                                        step={10}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>10</span>
                                        <span>500+</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Budget */}
                        {currentStep === 3 && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-[#4F0000]" />
                                    Budget Range
                                </h3>

                                <div className="text-center mb-8">
                                    <span className="text-4xl font-bold text-[#4F0000]">
                                        {formatBudget(budgetMin)} - {formatBudget(budgetMax)}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">Minimum Budget</label>
                                        <Slider
                                            value={[budgetMin]}
                                            onValueChange={(value) => setBudget(value[0], budgetMax)}
                                            min={10000}
                                            max={budgetMax - 10000}
                                            step={5000}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600 mb-2 block">Maximum Budget</label>
                                        <Slider
                                            value={[budgetMax]}
                                            onValueChange={(value) => setBudget(budgetMin, value[0])}
                                            min={budgetMin + 10000}
                                            max={1000000}
                                            step={10000}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Services */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <p className="text-center text-gray-600 mb-6">
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
                                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedServices.includes(service.id)
                                            ? 'border-[#4F0000] bg-[#4F0000]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedServices.includes(service.id)
                                            ? 'bg-[#4F0000]'
                                            : 'bg-gray-100'
                                            }`}>
                                            <service.icon className={`w-6 h-6 ${selectedServices.includes(service.id) ? 'text-white' : 'text-gray-600'
                                                }`} />
                                        </div>
                                        <span className="font-medium text-gray-800 flex-1 text-left">
                                            {service.name}
                                        </span>
                                        {selectedServices.includes(service.id) && (
                                            <Check className="w-5 h-5 text-[#4F0000]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 5: Review */}
                        {currentStep === 5 && (
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                                <h3 className="font-semibold text-xl text-gray-800 mb-4">Event Summary</h3>

                                <div className="space-y-4">
                                    <SummaryRow label="Occasion" value={occasion || 'Not selected'} />
                                    <SummaryRow
                                        label="Date"
                                        value={hydratedDate?.toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) || 'Not selected'}
                                    />
                                    <SummaryRow label="Expected Guests" value={`${guestCount} people`} />
                                    <SummaryRow
                                        label="Budget"
                                        value={`${formatBudget(budgetMin)} - ${formatBudget(budgetMax)}`}
                                    />
                                    <SummaryRow
                                        label="Services Needed"
                                        value={selectedServices.map(s =>
                                            SERVICES.find(svc => svc.id === s)?.name
                                        ).join(', ') || 'None selected'}
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 text-center">
                                        After creating your event, you'll be able to browse and select specific vendors for each service.
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
                <div className="container mx-auto max-w-3xl flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>

                    {currentStep < STEPS.length ? (
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="gap-2 bg-[#4F0000] hover:bg-[#3A0000]"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !canProceed()}
                            className="gap-2 bg-[#4F0000] hover:bg-[#3A0000]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
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

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-800">{value}</span>
        </div>
    );
}
