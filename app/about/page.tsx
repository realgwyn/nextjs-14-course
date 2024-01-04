export const dynamic = 'force-static';

import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'About us',
    description: 'Welcome to premium nextjs 14 course!',
};

export default async function About() {
    return (
        <main>
            <h1>About us</h1>
            <p>Welcome to premium nextjs 14 course!</p>
        </main>
    );
}
