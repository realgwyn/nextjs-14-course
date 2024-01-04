'use client'

export default function BuggyPage() {
    if (Math.random() < 0.5) {
        console.log("time to fail!")
        throw new Error("server unavailable")
    }

    return (
        <div>
            This page fails from time to time, <a href={'/buggy-page'}>refresh</a> it few times to see the error.
        </div>
    );
}
