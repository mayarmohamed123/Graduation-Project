# ✅ Favorites Service - Updated API Endpoints

## 📋 Summary of Changes

The `favoritesService.ts` has been updated to match the actual backend API endpoints as shown in your API documentation.

---

## 🔗 API Endpoints Mapping

### **Doctors (DoctorFavourite)**

| Method | Endpoint                                                  | Description                  |
| ------ | --------------------------------------------------------- | ---------------------------- |
| GET    | `/DoctorFavourite/ShowMyFavouriteDoctor`                  | Get all favorite doctors     |
| POST   | `/DoctorFavourite/AddDoctorToMyFavourite/{doctorId}`      | Add doctor to favorites      |
| DELETE | `/DoctorFavourite/RemoveDoctorFromMyFavourite/{doctorId}` | Remove doctor from favorites |

### **Medicines (MedicineFavourite)**

| Method | Endpoint                                                        | Description                    |
| ------ | --------------------------------------------------------------- | ------------------------------ |
| GET    | `/MedicineFavourite/ShowMyFavouritMedicine`                     | Get all favorite medicines     |
| POST   | `/MedicineFavourite/AddMedicineToMyFavourite/{medicineId}`      | Add medicine to favorites      |
| DELETE | `/MedicineFavourite/RemoveMedicineFromMyFavourite/{medicineId}` | Remove medicine from favorites |

### **Clinics (ClinicFavourite)**

| Method | Endpoint                                                  | Description                  |
| ------ | --------------------------------------------------------- | ---------------------------- |
| GET    | `/ClinicFavourite/ShowMyFavoriteClinic`                   | Get all favorite clinics     |
| POST   | `/ClinicFavourite/AddClinicToMyFavourite/{clinicId}`      | Add clinic to favorites      |
| DELETE | `/ClinicFavourite/RemoveClinicFromMyFavourite/{clinicId}` | Remove clinic from favorites |

---

## 📝 Service Methods

### **Get Favorites**

```typescript
// Get all favorite doctors
favoritesService.getFavoriteDoctors();
// → GET /DoctorFavourite/ShowMyFavouriteDoctor

// Get all favorite medicines
favoritesService.getFavoriteMedicines();
// → GET /MedicineFavourite/ShowMyFavouritMedicine

// Get all favorite clinics
favoritesService.getFavoriteClinics();
// → GET /ClinicFavourite/ShowMyFavoriteClinic
```

### **Add to Favorites**

```typescript
// Add doctor to favorites
favoritesService.addDoctorToFavorites(doctorId);
// → POST /DoctorFavourite/AddDoctorToMyFavourite/{doctorId}

// Add medicine to favorites
favoritesService.addMedicineToFavorites(medicineId);
// → POST /MedicineFavourite/AddMedicineToMyFavourite/{medicineId}

// Add clinic to favorites
favoritesService.addClinicToFavorites(clinicId);
// → POST /ClinicFavourite/AddClinicToMyFavourite/{clinicId}
```

### **Remove from Favorites**

```typescript
// Remove doctor from favorites
favoritesService.removeDoctorFromFavorites(doctorId);
// → DELETE /DoctorFavourite/RemoveDoctorFromMyFavourite/{doctorId}

// Remove medicine from favorites
favoritesService.removeMedicineFromFavorites(medicineId);
// → DELETE /MedicineFavourite/RemoveMedicineFromMyFavourite/{medicineId}

// Remove clinic from favorites
favoritesService.removeClinicFromFavorites(clinicId);
// → DELETE /ClinicFavourite/RemoveClinicFromMyFavourite/{clinicId}
```

---

## ⚠️ Important Notes

1. **Authentication Required**: All endpoints require authentication token (handled automatically by `fetchWithAuth` and `postWithAuth`)

2. **No Cache**: Favorites are fetched with `revalidate: 0` to ensure fresh data

3. **Check Methods Removed**: The `isDoctorFavorite`, `isMedicineFavorite`, and `isClinicFavorite` methods were removed as they don't exist in the current API. If you need to check if an item is favorited, you can:

   - Fetch all favorites and search for the ID
   - Or ask the backend team to add these endpoints

4. **Error Handling**: All methods use try/catch blocks in the page component to handle errors gracefully

---

## 🎯 Usage Example

```typescript
import { favoritesService } from "@/Services/favoritesService";

// Fetch all favorite doctors
const doctors = await favoritesService.getFavoriteDoctors();

// Add a doctor to favorites
await favoritesService.addDoctorToFavorites(123);

// Remove a doctor from favorites
await favoritesService.removeDoctorFromFavorites(123);
```

---

## 🚀 Ready to Use!

The service is now fully configured and ready to work with your backend API. Just make sure your backend is running and the endpoints are accessible.

---

## 📊 Expected Response Format

### GET Requests (Show Favorites)

```json
[
  {
    "id": 1,
    "username": "Dr. Sarah Johnson",
    "specialty": "Cardiologist"
    // ... other fields
  }
  // ... more items
]
```

### POST/DELETE Requests (Add/Remove)

```json
{
  "message": "Doctor added to favorites successfully"
}
```

Or simply a success status code (200/201/204).
