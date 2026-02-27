# The Iridologist - Technical Handover & README

## Project Overview
"The Iridologist" is a multi-language (EN/FR/AR/RTL), mobile-first progressive web application built for Dr. Philippe Hadashy's clinical iridology practice. The stack leverages Vite, React, TypeScript, and Vanilla CSS with CSS Variables for premium Glassmorphism and Light/Dark mode aesthetics without bulky frameworks.

## Environment Variables & Configuration
To deploy the application to Production, the following mock environment variables represent the required backend service endpoints:

```env
# Server & API
VITE_API_URL=https://api.theiridologist.app/v1
VITE_ENV=production

# OTP Authentication Service (Simulated in AuthShell.tsx)
# Recommends Twilio or MessageBird for SMS Gateway
VITE_SMS_GATEWAY_API_KEY=your_production_key_here
VITE_SMS_SENDER_ID=DR.PHILIPPE

# Payment Receipt Verification (Simulated in ReceiptUpload.tsx)
# Recommends AWS S3 or Google Cloud Storage for immutable blob storage
VITE_S3_BUCKET_NAME=iridologist-receipts-prod
VITE_S3_REGION=me-central-1

# Push Notification Service (Simulated in NotificationCenter/PushNotificationAdmin)
# Recommends Firebase Cloud Messaging (FCM) or OneSignal
VITE_FCM_SERVER_KEY=your_fcm_server_key
```

## Static Assets & TOS
The application's static components like the Privacy Policy and Terms of Service are integrated into the React Router configuration (or as static modals) and localized based on the user's `i18n.language` state.

## Database Initialization
The `schema.sql` file located in the root directory contains the PostgreSQL initialization script. When migrating to a live database:
1. Ensure the `ENUM` types for Language, Subscription Tiers, and Methods match the TypeScript interfaces explicitly.
2. Use the provided CSV COPY command in the script to seed the `supplements` table from Dr. Philippe's initial inventory spreadsheet.

## Build Scripts
- `npm run dev`: Starts the local Vite server (use the 'Dev: Screen Toggle' to navigate).
- `npm run build`: Executes standard TypeScript compilation (`tsc -b`) and bundles using Vite. Verifies strict TS safety.
