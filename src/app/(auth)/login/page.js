import Login from '@/rendering/login';
import React, { Suspense } from 'react';

export const metadata = {
    title: 'Log In | ChronosX',
    description: 'Log in to your ChronosX AI trading terminal to access live signals, chart recognition, and algorithmic market insights.',
};

const page = () => {
    return (
        <Suspense>
            <Login />
        </Suspense>
    );
}

export default page;
