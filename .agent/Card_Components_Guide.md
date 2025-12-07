# 🎯 Card Components System - Complete Guide

## 📋 Overview

We've created a unified card system where **each card component can work in two modes**:

1. **Search Mode** - For displaying items in search/browse pages with "Add to Favorites" functionality
2. **Favorite Mode** - For displaying items in the favorites page with "Remove from Favorites" functionality

---

## 📦 Components Created/Updated

### 1️⃣ **DoctorCard** (`Components/shared/DoctorCard.tsx`)

- ✅ Works with both `Doctor` and `FavoriteDoctor` types
- ✅ Add/Remove from favorites with real API calls
- ✅ Rating badge display
- ✅ Chat functionality (optional)
- ✅ Extra info display (optional)
- ✅ Premium design with hover effects

### 2️⃣ **MedicineCard** (`Components/shared/MedicineCard.tsx`)

- ✅ Works with both `Medicine` and `FavoriteMedicine` types
- ✅ Add/Remove from favorites with real API calls
- ✅ Add to cart functionality
- ✅ Out of stock handling
- ✅ Rating badge display
- ✅ Premium design with hover effects

### 3️⃣ **ClinicCard** (`Components/shared/ClinicCard.tsx`) - NEW!

- ✅ Works with `FavoriteClinic` type
- ✅ Add/Remove from favorites with real API calls
- ✅ Location and contact info display
- ✅ Premium design with hover effects

---

## 🎨 Component Props

### **DoctorCard Props**

```typescript
interface DoctorCardProps {
  doctor: Doctor | FavoriteDoctor; // The doctor data
  showChat?: boolean; // Show chat button (default: false)
  showExtraInfo?: boolean; // Show clinic info (default: false)
  variant?: "search" | "favorite"; // Mode (default: "search")
  onRemoveFavorite?: (id: number) => void; // Callback for remove
  initialFavoriteState?: boolean; // Is favorited? (default: false)
}
```

### **MedicineCard Props**

```typescript
interface MedicineCardProps {
  medicine: Medicine | FavoriteMedicine; // The medicine data
  variant?: "search" | "favorite"; // Mode (default: "search")
  onRemoveFavorite?: (id: number) => void; // Callback for remove
  initialFavoriteState?: boolean; // Is favorited? (default: false)
}
```

### **ClinicCard Props**

```typescript
interface ClinicCardProps {
  clinic: FavoriteClinic; // The clinic data
  variant?: "search" | "favorite"; // Mode (default: "search")
  onRemoveFavorite?: (id: number) => void; // Callback for remove
  initialFavoriteState?: boolean; // Is favorited? (default: false)
}
```

---

## 🚀 Usage Examples

### **1. In Search Pages (Search Mode)**

```tsx
import { DoctorCard, MedicineCard, ClinicCard } from "@/Components/shared";

// Doctor Card
<DoctorCard
  doctor={doctor}
  showExtraInfo={true}
  showChat={true}
/>

// Medicine Card
<MedicineCard
  medicine={medicine}
/>

// Clinic Card
<ClinicCard
  clinic={clinic}
/>
```

**Behavior:**

- ❤️ Heart icon is **empty** by default
- Clicking heart → **Adds to favorites** (API call)
- Heart fills red after adding
- Toast notification: "Added to favorites"

---

### **2. In Favorites Page (Favorite Mode)**

```tsx
import { DoctorCard, MedicineCard, ClinicCard } from "@/Components/shared";

// Doctor Card
<DoctorCard
  doctor={doctor}
  variant="favorite"
  initialFavoriteState={true}
  onRemoveFavorite={handleRemoveDoctor}
  showExtraInfo={true}
/>

// Medicine Card
<MedicineCard
  medicine={medicine}
  variant="favorite"
  initialFavoriteState={true}
  onRemoveFavorite={handleRemoveMedicine}
/>

// Clinic Card
<ClinicCard
  clinic={clinic}
  variant="favorite"
  initialFavoriteState={true}
  onRemoveFavorite={handleRemoveClinic}
/>
```

**Behavior:**

- ❤️ Heart icon is **filled red** (initialFavoriteState={true})
- Clicking heart → **Removes from favorites** (API call)
- Calls `onRemoveFavorite(id)` callback
- Toast notification: "Removed from favorites"

---

## 🔄 How It Works

### **Search Mode Flow:**

```
User clicks heart (empty)
  ↓
favoritesService.addDoctorToFavorites(id)
  ↓
API Call: POST /DoctorFavourite/AddDoctorToMyFavourite/{id}
  ↓
Success → Heart fills red
  ↓
toast.success("Doctor added to favorites")
```

### **Favorite Mode Flow:**

```
User clicks heart (filled)
  ↓
favoritesService.removeDoctorFromFavorites(id)
  ↓
API Call: DELETE /DoctorFavourite/RemoveDoctorFromMyFavourite/{id}
  ↓
Success → onRemoveFavorite(id) callback
  ↓
Parent removes item from state
  ↓
toast.success("Doctor removed from favorites")
```

---

## 📝 Complete Example: Favorites Page

```tsx
"use client";

import { useState, useEffect } from "react";
import { DoctorCard, MedicineCard, ClinicCard } from "@/Components/shared";
import { favoritesService } from "@/Services/favoritesService";
import { toast } from "react-hot-toast";

export default function FavoritesPage() {
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    // Fetch all favorites
    const fetchFavorites = async () => {
      const [docs, meds, clins] = await Promise.all([
        favoritesService.getFavoriteDoctors(),
        favoritesService.getFavoriteMedicines(),
        favoritesService.getFavoriteClinics(),
      ]);
      setDoctors(docs);
      setMedicines(meds);
      setClinics(clins);
    };
    fetchFavorites();
  }, []);

  const handleRemoveDoctor = async (id: number) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const handleRemoveMedicine = async (id: number) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRemoveClinic = async (id: number) => {
    setClinics((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      {/* Doctors */}
      <div className="grid grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            variant="favorite"
            initialFavoriteState={true}
            onRemoveFavorite={handleRemoveDoctor}
            showExtraInfo={true}
          />
        ))}
      </div>

      {/* Medicines */}
      <div className="grid grid-cols-3 gap-6">
        {medicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
            variant="favorite"
            initialFavoriteState={true}
            onRemoveFavorite={handleRemoveMedicine}
          />
        ))}
      </div>

      {/* Clinics */}
      <div className="grid grid-cols-3 gap-6">
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            variant="favorite"
            initialFavoriteState={true}
            onRemoveFavorite={handleRemoveClinic}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Design Features

All cards share these design features:

### **Visual**

- ✨ 2px primary border
- ✨ Rounded corners (rounded-2xl)
- ✨ Gradient background for image section
- ✨ Hover effects: shadow-xl + translate-y-1
- ✨ Smooth transitions (300ms)

### **Favorite Button**

- 📍 Position: Top-right corner
- 🎯 White background with shadow
- 🔄 Scale animation on hover (110%)
- ❤️ Red fill when favorited
- 🔒 Disabled state while processing

### **Rating Badge** (Doctors & Medicines)

- 📍 Position: Top-left corner
- ⭐ Yellow star icon
- 📊 Shows average rating (e.g., 4.8)
- 🎨 White background with shadow

### **Content Section**

- 🎨 Light gray background (bg-gray-50)
- 📝 Title: text-xl font-semibold
- 📝 Subtitle: text-sm text-gray-600
- 📊 Organized information with icons
- 🔘 Primary action button at bottom

---

## 🔧 API Integration

All cards use `favoritesService` for API calls:

```typescript
// Add to favorites
await favoritesService.addDoctorToFavorites(id);
await favoritesService.addMedicineToFavorites(id);
await favoritesService.addClinicToFavorites(id);

// Remove from favorites
await favoritesService.removeDoctorFromFavorites(id);
await favoritesService.removeMedicineFromFavorites(id);
await favoritesService.removeClinicFromFavorites(id);
```

---

## ⚠️ Important Notes

1. **Type Compatibility**: Cards accept both regular types (Doctor, Medicine) and favorite types (FavoriteDoctor, FavoriteMedicine, FavoriteClinic)

2. **Callback Pattern**: In favorite mode, the card calls `onRemoveFavorite(id)` after successful API call. The parent component is responsible for updating the state.

3. **Toast Notifications**: All favorite operations show toast notifications for user feedback.

4. **Loading States**: The favorite button is disabled while processing to prevent double-clicks.

5. **Error Handling**: All API calls have try/catch blocks with error toast notifications.

---

## 🎯 Benefits of This Approach

✅ **Reusable**: Same card works in search and favorites pages
✅ **Type-safe**: Accepts multiple types with TypeScript unions
✅ **Consistent**: Same design and behavior across all cards
✅ **Maintainable**: Single source of truth for each card type
✅ **User-friendly**: Clear feedback with toast notifications
✅ **Performance**: Optimistic UI updates (state changes immediately)

---

## 🚀 Next Steps

You can now:

1. ✅ Use these cards in search pages
2. ✅ Use these cards in favorites page
3. ✅ Add more features (e.g., share, compare)
4. ✅ Customize styling as needed
5. ✅ Add animations for card removal

---

## 📚 Files Modified

- ✅ `Components/shared/DoctorCard.tsx` - Updated
- ✅ `Components/shared/MedicineCard.tsx` - Updated
- ✅ `Components/shared/ClinicCard.tsx` - Created
- ✅ `Components/shared/index.ts` - Updated exports
- ✅ `app/user/favorites/page.tsx` - Updated to use new cards

---

**The card system is now complete and ready to use!** 🎉
