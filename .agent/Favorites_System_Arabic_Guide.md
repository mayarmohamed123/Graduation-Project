# شرح نظام المفضلة (Favorites System) 🌟

## 📋 نظرة عامة

قمنا ببناء نظام متكامل لإدارة المفضلة في التطبيق، يشمل:

- ✅ جلب البيانات من الـ API
- ✅ عرض الدكاترة، الأدوية، والعيادات المفضلة
- ✅ حذف عناصر من المفضلة
- ✅ حالات التحميل والأخطاء
- ✅ إشعارات للمستخدم (Toast notifications)

---

## 📁 الملفات التي تم إنشاؤها/تعديلها

### 1️⃣ **Services/favoritesService.ts** (جديد)

ملف الـ API service الخاص بالمفضلة

### 2️⃣ **Components/shared/FavoriteCard.tsx** (محدّث)

كومبوننت الكارد الذي يعرض عنصر واحد من المفضلة

### 3️⃣ **app/user/favorites/page.tsx** (محدّث)

صفحة المفضلة الرئيسية

### 4️⃣ **types/favorites.ts** (محدّث)

إضافة `FavoriteCardProps` interface

---

## 🔧 شرح favoritesService.ts

```typescript
export const favoritesService = {
  // جلب الدكاترة المفضلين
  getFavoriteDoctors: async (): Promise<FavoriteDoctor[]> => {...}

  // جلب الأدوية المفضلة
  getFavoriteMedicines: async (): Promise<FavoriteMedicine[]> => {...}

  // جلب العيادات المفضلة
  getFavoriteClinics: async (): Promise<FavoriteClinic[]> => {...}

  // إضافة دكتور للمفضلة
  addDoctorToFavorites: async (doctorId: number) => {...}

  // حذف دكتور من المفضلة
  removeDoctorFromFavorites: async (doctorId: number) => {...}

  // ... نفس الشيء للأدوية والعيادات
}
```

### 📌 ملاحظات مهمة:

- كل الدوال بتستخدم `fetchWithAuth` أو `postWithAuth` علشان تبعت الـ token تلقائياً
- الـ `revalidate: 0` معناها إننا مش بنعمل cache للمفضلة (علشان تتحدث دايماً)
- لو الـ token expired ← الـ service هيعمل logout تلقائي

---

## 📄 شرح صفحة المفضلة (page.tsx)

### **State Management**

```typescript
const [activeTab, setActiveTab] = useState("doctors");
const [favoriteDoctors, setFavoriteDoctors] = useState<FavoriteDoctor[]>([]);
const [favoriteMedicines, setFavoriteMedicines] = useState<FavoriteMedicine[]>(
  []
);
const [favoriteClinics, setFavoriteClinics] = useState<FavoriteClinic[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**الشرح:**

- `activeTab` ← التاب النشط حالياً (doctors/medicine/clinics)
- `favoriteDoctors/Medicines/Clinics` ← البيانات المجلوبة من الـ API
- `isLoading` ← حالة التحميل
- `error` ← رسالة الخطأ (لو حصل)

---

### **جلب البيانات عند فتح الصفحة**

```typescript
useEffect(() => {
  fetchAllFavorites();
}, []);
```

**الشرح:**

- `useEffect` مع array فاضي `[]` ← معناها الكود ده يتنفذ مرة واحدة بس لما الصفحة تفتح
- بننادي على `fetchAllFavorites()` علشان نجيب كل البيانات

---

### **دالة جلب كل المفضلة**

```typescript
const fetchAllFavorites = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const [doctors, medicines, clinics] = await Promise.all([
      favoritesService.getFavoriteDoctors(),
      favoritesService.getFavoriteMedicines(),
      favoritesService.getFavoriteClinics(),
    ]);
    setFavoriteDoctors(doctors);
    setFavoriteMedicines(medicines);
    setFavoriteClinics(clinics);
  } catch (err) {
    console.error("Failed to fetch favorites:", err);
    setError(err instanceof Error ? err.message : "Failed to load favorites");
    toast.error("Failed to load favorites");
  } finally {
    setIsLoading(false);
  }
};
```

**الشرح:**

1. **`setIsLoading(true)`** ← بنبدأ التحميل
2. **`Promise.all([...])`** ← بنجيب الـ 3 أنواع في نفس الوقت (أسرع من واحدة واحدة)
3. **`try/catch`** ← لو حصل خطأ، بنمسكه ونعرض رسالة
4. **`toast.error(...)`** ← إشعار للمستخدم
5. **`finally`** ← في كل الأحوال، بنوقف التحميل

---

### **دوال الحذف**

```typescript
const handleRemoveDoctor = async (id: number) => {
  try {
    await favoritesService.removeDoctorFromFavorites(id);
    setFavoriteDoctors((prev) => prev.filter((doc) => doc.id !== id));
    toast.success("Doctor removed from favorites");
  } catch (err) {
    console.error("Failed to remove doctor:", err);
    toast.error("Failed to remove doctor from favorites");
  }
};
```

**الشرح:**

1. **`removeDoctorFromFavorites(id)`** ← بننادي على الـ API علشان نحذف من الـ backend
2. **`filter((doc) => doc.id !== id)`** ← بنشيل الدكتور من الـ state (بدون ما نعيد تحميل الصفحة)
3. **`toast.success(...)`** ← إشعار نجاح
4. لو فشل ← بنعرض `toast.error(...)`

---

### **الـ JSX - الجزء المرئي**

#### **حالة التحميل**

```typescript
{
  isLoading && (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
```

- دايرة بتلف (spinner) لما بنحمّل البيانات

#### **حالة الخطأ**

```typescript
{
  error && !isLoading && (
    <div className="text-center py-12">
      <p className="text-red-500 text-lg mb-4">{error}</p>
      <button onClick={fetchAllFavorites}>Try Again</button>
    </div>
  );
}
```

- رسالة خطأ + زرار "Try Again" لو حصلت مشكلة

#### **عرض البيانات**

```typescript
{
  !isLoading && !error && (
    <div className="mt-6">
      {activeTab === "doctors" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteDoctors.length > 0 ? (
            favoriteDoctors.map((doctor) => (
              <FavoriteCard
                key={doctor.id}
                item={doctor}
                type="doctor"
                onRemove={handleRemoveDoctor}
              />
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <Image src={noFavorites} alt="No favorites" />
              <p>Your favorite doctors list is empty</p>
            </div>
          )}
        </div>
      )}
      {/* نفس الشيء للأدوية والعيادات */}
    </div>
  );
}
```

**الشرح:**

- لو مافيش تحميل ومافيش خطأ ← نعرض البيانات
- لو فيه دكاترة ← نعرضهم في `FavoriteCard`
- لو القائمة فاضية ← نعرض صورة "No favorites"

---

## 🎯 كيفية عمل الـ Flow الكامل

### **1. المستخدم يفتح صفحة المفضلة**

```
page.tsx → useEffect() → fetchAllFavorites()
```

### **2. جلب البيانات من الـ API**

```
fetchAllFavorites() → Promise.all([
    favoritesService.getFavoriteDoctors(),
    favoritesService.getFavoriteMedicines(),
    favoritesService.getFavoriteClinics()
])
```

### **3. عرض البيانات**

```
setFavoriteDoctors(doctors)
setFavoriteMedicines(medicines)
setFavoriteClinics(clinics)
↓
الصفحة تعرض الـ FavoriteCard لكل عنصر
```

### **4. المستخدم يحذف عنصر**

```
FavoriteCard → handleRemoveFavorite() → onRemove(item.id)
↓
page.tsx → handleRemoveDoctor(id)
↓
favoritesService.removeDoctorFromFavorites(id) → API Call
↓
setFavoriteDoctors(prev => prev.filter(...)) → تحديث الـ UI
↓
toast.success("Doctor removed from favorites")
```

---

## 🔗 API Endpoints المتوقعة

يجب أن يكون الـ backend عنده الـ endpoints دي:

### **GET Requests**

- `GET /favorites/doctors` ← جلب الدكاترة المفضلين
- `GET /favorites/medicines` ← جلب الأدوية المفضلة
- `GET /favorites/clinics` ← جلب العيادات المفضلة

### **POST Requests (إضافة)**

- `POST /favorites/doctors/{doctorId}` ← إضافة دكتور للمفضلة
- `POST /favorites/medicines/{medicineId}` ← إضافة دواء للمفضلة
- `POST /favorites/clinics/{clinicId}` ← إضافة عيادة للمفضلة

### **DELETE Requests (حذف)**

- `DELETE /favorites/doctors/{doctorId}` ← حذف دكتور من المفضلة
- `DELETE /favorites/medicines/{medicineId}` ← حذف دواء من المفضلة
- `DELETE /favorites/clinics/{clinicId}` ← حذف عيادة من المفضلة

### **GET Requests (فحص)**

- `GET /favorites/doctors/check/{doctorId}` ← فحص إذا كان الدكتور في المفضلة
- `GET /favorites/medicines/check/{medicineId}` ← فحص إذا كان الدواء في المفضلة
- `GET /favorites/clinics/check/{clinicId}` ← فحص إذا كانت العيادة في المفضلة

---

## ⚠️ ملاحظات مهمة

### **1. التوكن (Authentication)**

- كل الطلبات بتبعت الـ token تلقائياً عن طريق `fetchWithAuth`
- لو الـ token expired ← المستخدم هيتوجه لصفحة الـ login

### **2. Error Handling**

- كل خطأ بيتعرض للمستخدم عن طريق `toast.error()`
- فيه زرار "Try Again" لو فشل تحميل البيانات

### **3. Performance**

- استخدمنا `Promise.all()` علشان نجيب الـ 3 أنواع في نفس الوقت (أسرع)
- مافيش caching للمفضلة (`revalidate: 0`) علشان تتحدث دايماً

### **4. UX (تجربة المستخدم)**

- Loading spinner أثناء التحميل
- رسائل واضحة للأخطاء
- إشعارات عند النجاح/الفشل
- صورة جميلة لما القائمة فاضية

---

## 🚀 الخطوات القادمة (اختياري)

1. **Optimistic UI Updates** ← تحديث الـ UI قبل ما الـ API يرد (أسرع)
2. **Pagination** ← لو عندك مفضلة كتير جداً
3. **Search/Filter** ← بحث في المفضلة
4. **Animations** ← حركات عند الحذف/الإضافة
5. **Offline Support** ← حفظ المفضلة محلياً

---

## 📝 ملخص سريع

✅ **تم إنشاء:**

- `favoritesService.ts` ← API service للمفضلة
- تحديث `page.tsx` ← جلب وعرض البيانات
- تحديث `FavoriteCard.tsx` ← تبسيط الحذف

✅ **المميزات:**

- جلب البيانات من الـ API
- حذف من المفضلة
- حالات التحميل والأخطاء
- إشعارات للمستخدم
- تصميم responsive وجميل

✅ **الاستخدام:**
فقط افتح صفحة `/user/favorites` والكود هيشتغل تلقائياً! 🎉
