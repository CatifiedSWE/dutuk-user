import { Suspense } from 'react';
import { LoginScreen } from '@/modules/auth/screens';

function LoginPageContent() {
    return <LoginScreen />;
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B0000] border-r-transparent"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}
