# Sehha - Healthcare Ecosystem Platform

**Sehha** is a comprehensive, multi-role healthcare management ecosystem designed to bridge the gap between patients, doctors, and pharmacies. By leveraging modern web technologies, it provides a seamless experience for booking appointments, managing medical records, ordering medicines, and real-time consultations.

---

## 🚀 Project Vision
To digitize and streamline the medical journey in Egypt, ensuring that patients have easy access to healthcare professionals and medications while providing doctors and pharmacists with powerful management tools.

---

## 👥 User Personas & Core Features

### 1. 🩸 Patients
- **Search & Filter**: Find doctors by specialty, location, and rating.
- **Appointment Booking**: Real-time scheduling with specialized doctors.
- **E-Pharmacy**: Browse medicines, manage a cart, and place orders.
- **Medical Dashboard**: View appointment history, notifications, and favorite doctors/pharmacies.
- **Real-time Chat**: Direct communication with doctors and pharmacists for inquiries.

### 2. 👨‍⚕️ Doctors
- **Practice Management**: Manage clinic information, working hours, and availability.
- **Appointment Schedule**: View and manage upcoming patient visits.
- **Patient Interaction**: Consult with patients via integrated chat.
- **Analytics**: Track appointment trends and patient demographics.

### 3. 💊 Pharmacists (Pharmacy Owners)
- **Inventory Management**: Add, update, and manage medicine stock, pricing, and composition.
- **Order Tracking**: Receive and process medicine orders from patients.
- **Consultation**: Answer patient queries through real-time chat.

### 4. 🔑 Admin
- **Verification System**: Approve or reject new doctor and pharmacy registrations to ensure quality.
- **System Overview**: High-level analytics and user management.
- **Platform Integrity**: Monitor transactions and system health.

---

## 🛠️ Technical Stack & Library Deep Dive

Sehha is built with a focus on performance, scalability, and developer experience.

### **Core Framework: Next.js 16 (React 19)**
- **Why?**: We use the App Router for efficient server-side rendering (SSR) and static site generation (SSG), ensuring fast load times and excellent SEO for doctor profiles and pharmacy listings.
- **Benefits**: Improved performance with React Server Components (RSC) and simplified routing.

### **State Management: Redux Toolkit**
- **Why?**: Handles the complex global state required for multi-role authentication, shopping carts, and persistent user preferences.
- **Benefits**: "Slices" organization makes the codebase maintainable as the project grows.

### **Real-time Communication: SignalR**
- **Why?**: Essential for the chat system and instant notifications (e.g., when a doctor confirms an appointment or a pharmacy accepts an order).
- **Benefits**: Low-latency, full-duplex communication without polling.

### **Form Management: React Hook Form & Zod**
- **Why?**: Healthcare data requires strict validation (dosage, IDs, medical history).
- **Benefits**: `react-hook-form` reduces re-renders, while `Zod` provides type-safe schema validation.

### **Visuals & UI: Tailwind CSS & Radix UI**
- **Why?**: We use **Shadcn UI** (built on Radix) for accessible components like dialogs, calendars, and dropdowns.
- **Benefits**: Consistent, professional look (Glassmorphism effects, Dark mode support) with rapid styling.

### **Data Visualization: Recharts**
- **Why?**: Used in Admin and Doctor dashboards to visualize medical data and business performance.
- **Benefits**: Responsive, declarative charts that integrate perfectly with React.

### **Mapping & Geolocation: Leaflet**
- **Why?**: Allows patients to find the nearest clinic or pharmacy on an interactive map.
- **Benefits**: Lightweight and highly customizable map integration.

### **Other Notable Mentions**:
- **Lucide React**: For a consistent, modern icon set.
- **React Hot Toast**: For non-intrusive, beautiful notifications.
- **Swiper**: For interactive carousels in the patient's search and pharmacy pages.
- **Fetch API**: Modern, lightweight alternative for API communication, replacing legacy libraries for better performance.

---

## 📁 Project Structure

```text
my-app/
├── app/                 # Next.js App Router (Pages & API Routes)
├── Components/          # UI Components
│   ├── ui/             # Reusable Shadcn/Radix components
│   ├── features/       # Feature-specific logic (Admin, Doctor, User, Pharmacy)
│   ├── common/         # Layouts, Loaders, and shared UI
├── Services/            # Business logic and API abstraction layers
├── hooks/               # Custom React hooks (useAuth, useCart, etc.)
├── store/               # Redux state configuration (Slices & Store)
├── types/               # TypeScript interfaces and types
├── public/              # Static assets (Images, Icons)
```

---

## ⚙️ Getting Started

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Setup Environment Variables**:
    Create a `.env.local` file and add your backend API URLs.
4.  **Run in Development**:
    ```bash
    npm run dev
    ```
5.  **Build for Production**:
    ```bash
    npm run build
    npm start
    ```
