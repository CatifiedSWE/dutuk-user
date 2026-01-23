import { Suspense } from 'react';
import { SignupScreen } from '@/modules/auth/screens';

function SignupPageContent() {
    return <SignupScreen />;
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B0000] border-r-transparent"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <SignupPageContent />
        </Suspense>
    );
}
