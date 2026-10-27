import Signup from '@/rendering/signup';
import React, { Suspense } from 'react';

export const metadata = {
    title: 'Create Account | TraderMaster',
    description: 'Sign up for TraderMaster to start trading with neural AI chart pattern recognition, automated setups, and institutional market analytics.',
};

const page = () => {
    return (
        <Suspense>
            <Signup />
        </Suspense>
    );
}

export default page;
