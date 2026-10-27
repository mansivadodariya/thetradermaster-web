import React, { Suspense } from 'react';
import Profile from '@/rendering/profile';
import ProfileSkeleton from '@/rendering/profile/components/ProfileSkeleton';

export default function Page() {
    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <Profile />
        </Suspense>
    );
}

