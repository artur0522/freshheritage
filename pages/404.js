import * as Sentry from "@sentry/nextjs";

// pages/404.js
export default function Custom404() {

    Sentry.captureMessage("404 Error");
    return <h1>404 - Page Not Found</h1>

}