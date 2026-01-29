# Project Requirements Document (PRD): Sehha Healthcare Ecosystem

**Version**: 1.0.0  
**Status**: Draft for Development Team  
**Date**: January 11, 2026  
**Project Name**: Sehha (صحة)

---

## 1. Executive Summary
**Sehha** is a large-scale, multi-tenant healthcare platform built to modernize medical interactions in Egypt. It serves four distinct user segments: Patients, Doctors, Pharmacists, and Administrators. The system integrates real-time scheduling, an E-Pharmacy marketplace, interactive mapping, and a SignalR-based real-time consultation engine.

The goal is to provide a "Single Source of Truth" for medical data, appointments, and medication procurement, ensuring a seamless digital transition for both providers and seekers of healthcare.

---

## 2. Strategic Context & Goals
### 2.1 The Problem
- Fragmented medical records and manual appointment booking.
- Difficulty in locating specialized doctors or specific medications.
- Lack of real-time communication between patients and pharmacies.

### 2.2 The Solution
- **Centralized Platform**: One app for all medical needs.
- **Verification Layer**: Admin-monitored registration for trust.
- **Real-time Efficiency**: Instant notifications and chat for immediate care.

---

## 3. Targeted User Personas

### 3.1 Patient (The Seeker)
*   **Need**: Transparent search for doctors, reliable medicine delivery, and organized health history.
*   **Key Behavior**: Frequent use of search filters, favorites, and cart management.

### 3.2 Doctor (The Provider)
*   **Need**: Efficient clinic management and digitized patient appointments.
*   **Key Behavior**: Managing availability slots and communicating with patients via chat.

### 3.3 Pharmacist (The Seller)
*   **Need**: Inventory digitization and order fulfillment.
*   **Key Behavior**: Monitoring stock levels and processing delivery requests.

### 3.4 Administrator (The Gatekeeper)
*   **Need**: Oversight, verification, and system-wide analytics.
*   **Key Behavior**: Approving documents and monitoring platform performance.

---

## 4. Functional Requirements & Feature Matrix

| Feature Area | Patient | Doctor | Pharmacist | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Auth & Security** | Register/Login/OAuth | Professional Verification | Business Verification | Role-Based Access |
| **Search & Discovery** | Advanced Filters | - | - | User Audit |
| **Appointments** | Book/Cancel/Rate | Accept/Reschedule | - | - |
| **E-Pharmacy** | Cart/Orders/Upload | - | Inventory/Stocks | Order Monitoring |
| **Messaging** | Chat with Dr/Pharm | Patient Consultation | Customer Support | Support |
| **Notifications** | Real-time Updates | Schedule Alerts | Stock/Order Alerts | System Alerts |
| **Analytics** | - | Patient Trends | Sales Analytics | Global Stats |

---

## 5. Technical Ecosystem (Development Team Specs)

### 5.1 Frontend Architecture
- **Framework**: Next.js 16 (App Router) with React 19.
- **Styling**: Tailwind CSS + Shadcn UI (Radix UI primitives).
- **Icons**: Lucide React.
- **Animations**: CSS transitions + Custom effects.

### 5.2 State Management & Performance
- **Redux Toolkit**: Used for global persistence (Auth, User Profile, Chat threads, Cart).
- **TanStack React Query**: Manages server state, providing efficient caching, background refetching, and simplified data synchronization.
- **Custom Hooks**: Centralized logic for `useAuth`, `useCart`, `useNotifications`.
- **Optimization**: Server-side rendering (SSR) for SEO-critical pages (Doctor profiles); Client-side hydration for interactive boards.

### 5.3 Real-time Layer (SignalR)
- **Implementation**: `HubConnectionBuilder` used for chat and system notifications.
- **Configuration**: Automatic reconnecting, cookie-based authentication, and thread-specific hub URLs (`/chat?threadId=...`).

### 5.4 Geolocation & Maps
- **Leaflet**: Integrated for clinic and pharmacy locations.
- **Features**: Custom markers, interactive selection, and geocoding.

---

## 6. API Strategy & Data Architecture

### 6.1 Standardized API Request Utility (`Services/api.ts`)
- **Automated Refresh**: Integrated `401 Unauthorized` handling that triggers `authService.refreshToken()`.
- **Flexible Body Handling**: Supports both standard JSON and `FormData` (for image/prescription uploads).
- **Silent Retries**: Original request is retried seamlessly after a successful token refresh.

### 6.2 Key Data Models (`types/`)
- **User**: ID (string), Email, Roles, Specialty (optional).
- **Appointment**: StartAt (ISO), EndAt (ISO), Status (Pending/Confirmed/etc.).
- **Order**: items (OrderItem[]), status (Status), totalPrice (number).
- **Notification**: Category-based (Appointment/Order), IsRead status.

---

## 7. Non-Functional Requirements

### 7.1 Security
- **JWT Authentication**: Secure tokens stored in HTTP-only cookies.
- **Refresh Flow**: Refresh tokens used to maintain sessions without re-login.
- **Verification**: Strict document approval process for Doctors and Pharmacists.

### 7.2 Performance
- **Server-Side Optimization**: Dashboards (Admin, Doctor, Pharmacy) leverage Server Components to fetch initial data, reducing client-side waterfalls and improving Largest Contentful Paint (LCP).
- **Caching Strategy**: `no-store` for real-time critical data; Static generation for informational pages; Explicit `force-dynamic` for authenticated server-side routes.
- **Image Optimization**: `next/image` with strict `remotePatterns` for responsive, fast-loading, and secure assets.
- **Absolute Fetching**: Standardized absolute URL construction in the `apiRequest` utility to support robust server-side data fetching during both runtime and build-time (SSR/SSG).

---

## 8. UX/UI Principles
- **Modernity**: Glassmorphism, subtle gradients, and sleek dark mode support.
- **Accessibility**: ARIA-compliant components via Radix UI.
- **Responsiveness**: Mobile-first design for patient on-the-go usage.

---

## 9. Roadmap & Future Scope
- **Phase 1 (Current)**: Core MVP with multi-role auth, booking, and pharmacy basics.
- **Phase 2**: AI-powered symptom checker and medicine interaction alerts.
- **Phase 3**: Integration with insurance providers and specialized lab tests.

---

**Developed by**: Sehha Development Team  
**Confidentiality**: Internal Development Use Only
