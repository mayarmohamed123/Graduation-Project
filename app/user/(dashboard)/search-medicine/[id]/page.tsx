"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Medicine, Review } from "@/types";
import { medicineService } from "@/Services/medicineServices";
import { pharmacyService } from "@/Services/pharmaciesServices";
import { cartService } from "@/Services/cartService";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Heart, Minus, Plus, ShoppingCart, Zap, ShieldCheck, Truck, Lock, ChevronRight, Star } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserCart } from "@/store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import MedicineReviewsTab from "@/components/features/user/medicine/MedicineReviewsTab";
import Link from "next/link";

type TabType = "Description" | "How to Use" | "Side Effects" | "Reviews";

export default function MedicineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("Description");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [medicineData, reviewsData] = await Promise.all([
        medicineService.getMedicineById(Number(id)),
        pharmacyService.getMedicineReviews(Number(id)).catch(() => []),
      ]);
      setMedicine(medicineData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (err) {
      console.error("Error fetching medicine data:", err);
      toast.error("Failed to load medicine details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  const handleAddToCart = async () => {
    if (!medicine) return;

    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        medicationId: medicine.id,
        pharmacyId: medicine.pharmacy.id,
        quantity: quantity,
      });
      await dispatch(fetchUserCart());
      toast.success("Added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const isOutOfStock = medicine?.quantity === 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-[32px] p-12 shadow-xl text-center max-w-lg w-full border border-gray-100">
           <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💊</span>
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-2">Medicine Not Found</h2>
           <p className="text-gray-500 mb-8">The medication you&apos;re looking for might have been moved or removed.</p>
           <Button onClick={() => router.back()} className="rounded-2xl px-8 h-12 bg-primary font-bold">
              Go Back
           </Button>
        </div>
      </div>
    );
  }

  const imageUrl = medicine.imagePath?.startsWith("http")
    ? medicine.imagePath
    : medicine.imagePath?.startsWith("/") ? medicine.imagePath : `/${medicine.imagePath}`;

  const tabs: TabType[] = ["Description", "How to Use", "Side Effects", "Reviews"];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400">
          <Link href="/user" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/user/search-medicine" className="hover:text-primary transition-colors">Medicine</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary font-bold">{medicine.brandName}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-100 mb-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Image Gallery Mockup */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-[24px] bg-[#F8FDFF] border border-blue-50/50 p-8 transition-all hover:shadow-inner flex items-center justify-center overflow-hidden group">
                 <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center transition-all active:scale-95 group-hover:bg-red-50"
                 >
                   <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                 </button>

                 <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                    {medicine.imagePath ? (
                      <Image
                        src={imageUrl}
                        alt={medicine.brandName}
                        fill
                        className="object-contain"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-9xl">💊</div>
                    )}
                 </div>
              </div>

            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col h-full pt-4">
              <div className="flex items-center gap-3 mb-4">
                 <Badge className={`rounded-xl px-3 py-1 text-xs font-bold ${isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
                 </Badge>
                 <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{medicine.averageRating.toFixed(1)}</span>
                    <span className="text-gray-400 font-medium ml-1">({reviews.length} reviews)</span>
                 </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                {medicine.brandName} {medicine.strength}{medicine.strengthUnit}
              </h1>

              <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8 text-sm font-medium">
                 <div className="flex items-center gap-2">
                    <span className="text-gray-400">Brand:</span>
                    <span className="text-primary font-bold uppercase">{medicine.brandName}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-gray-400">Form:</span>
                    <span className="text-gray-900">{medicine.dosageFormType}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-gray-900">{medicine.medicationCategory}</span>
                 </div>
              </div>

              <div className="mb-6">
                 <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-bold text-[#2BBBC5]">EGP {medicine.price.toFixed(2)}</span>
                 </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3 mb-8">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</label>
                 <div className="flex items-center gap-6">
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                       <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary transition-all active:scale-90"
                       >
                         <Minus size={18} />
                       </button>
                       <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                       <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary transition-all active:scale-90"
                       >
                         <Plus size={18} />
                       </button>
                    </div>
                    <p className="text-xs text-gray-400 font-medium italic">Max 3 per order</p>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <Button 
                   onClick={handleAddToCart}
                   disabled={isOutOfStock || isAddingToCart}
                   className="h-14 rounded-2xl bg-[#2BBBC5] hover:bg-[#25a0a9] text-white font-bold text-base shadow-lg shadow-teal-500/10 flex items-center gap-2 active:scale-[0.98] transition-all"
                 >
                   <Zap className="w-4 h-4 fill-white" />
                   {isAddingToCart ? 'Adding...' : 'Buy Now'}
                 </Button>
                 <Button 
                   onClick={handleAddToCart}
                   disabled={isOutOfStock || isAddingToCart}
                   variant="outline"
                   className="h-14 rounded-2xl border-2 border-gray-100 bg-white text-gray-900 font-bold text-base hover:bg-gray-50 hover:border-primary/10 flex items-center gap-2 active:scale-[0.98] transition-all"
                 >
                   <ShoppingCart className="w-4 h-4" />
                   Add to Cart
                 </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-gray-50 flex flex-wrap gap-8">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Genuine Product</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fast Delivery</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Safe Payment</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs and Reviews */}
        <div className="space-y-10">
          <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab ? "text-primary" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
             {activeTab === "Description" && (
                <div className="space-y-8">
                   <div className="bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm leading-relaxed">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Product Overview</h3>
                      </div>
                      
                      <p className="text-gray-600 text-lg font-medium mb-10 leading-relaxed">
                        {medicine.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                         <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-[#2BBBC5] uppercase tracking-widest">Composition</h4>
                            <p className="text-gray-800 font-semibold text-lg">{medicine.composition}</p>
                         </div>
                         <div className="space-y-3">
                            <h4 className="text-[10px] font-bold text-[#2BBBC5] uppercase tracking-widest">Active Ingredients</h4>
                            <p className="text-gray-800 font-semibold text-lg">{medicine.genericName} {medicine.strength}</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-emerald-50/50 rounded-[32px] p-8 border border-emerald-100/50">
                         <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">✓</div>
                            <span>SUITABLE FOR</span>
                         </div>
                         <p className="text-emerald-900 font-medium leading-relaxed">{medicine.suitableFor}</p>
                      </div>
                      <div className="bg-red-50/50 rounded-[32px] p-8 border border-red-100/50">
                         <div className="flex items-center gap-3 mb-4 text-red-600 font-bold">
                            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">✕</div>
                            <span>NOT SUITABLE FOR</span>
                         </div>
                         <p className="text-red-900 font-medium leading-relaxed">{medicine.notSuitableFor}</p>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "How to Use" && (
                <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-amber-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Recommended Usage</h3>
                   </div>
                   <div className="space-y-6">
                      <div className="flex gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">1</div>
                         <p className="text-gray-700 text-lg font-medium pt-2">{medicine.directionsForUse}</p>
                      </div>
                      <div className="pl-18 border-l-2 border-dashed border-gray-100 py-2">
                         <p className="text-gray-400 text-sm italic">Always follow your doctor&apos;s instructions or the guidance on the prescription label.</p>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "Side Effects" && (
                <div className="bg-white rounded-[32px] p-8 md:p-12 border border-red-50 shadow-sm">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-[20px] bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
                         <ShieldCheck className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Safety Information & Warnings</h3>
                   </div>
                   <div className="bg-red-50/30 rounded-3xl p-6 border border-red-100/50 mb-8">
                      <p className="text-red-900 font-medium leading-relaxed italic uppercase tracking-wider text-[10px] mb-4">Urgent Warning</p>
                      <p className="text-gray-800 text-lg font-bold">{medicine.warning}</p>
                   </div>
                   <p className="text-gray-500 text-sm leading-relaxed px-6">
                      If you experience any unusual symptoms or severe side effects, stop taking the medication immediately and consult your physician or pharmacist. Keep out of reach of children. Store in a cool, dry place.
                   </p>
                </div>
             )}

             {activeTab === "Reviews" && (
                <MedicineReviewsTab 
                  medicineId={Number(id)}
                  reviews={reviews}
                  averageRating={medicine.averageRating}
                  onRefresh={fetchData}
                />
             )}
          </div>
        </div>

        {/* Footer Disclaimer Mockup */}
        <div className="mt-20 p-8 bg-amber-50 rounded-[32px] border border-amber-100 flex gap-6 items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-700 flex items-center justify-center font-bold shrink-0">!</div>
            <p className="text-amber-900 text-sm font-medium leading-relaxed">
               <strong>Medical Disclaimer:</strong> Always read the label. Use only as directed. If symptoms persist, see your healthcare professional. Incorrect use could be harmful. All brands are trademarks of their respective companies. Consult your doctor or pharmacist if you have any existing medical conditions or are taking other medications.
            </p>
        </div>
      </div>
    </div>
  );
}
