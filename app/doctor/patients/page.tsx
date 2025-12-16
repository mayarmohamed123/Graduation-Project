"use client"

import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Plus, Search } from "lucide-react"
import { PatientCard } from "@/Components/features/doctor/PatientCard"

const MOCK_PATIENTS = [
  {
    id: "1",
    name: "mayar mohamed",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80",
    age: 24,
    gender: "Female",
    phone: "+2012345678976",
    symptoms: "Skin rash and allergic reaction symptoms",
    status: "Active" as const,
    lastVisit: "oct 12, 2025"
  },
  {
    id: "2",
    name: "mayar mohamed",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&q=80",
    age: 24,
    gender: "Female",
    phone: "+2012345678976",
    symptoms: "Skin rash and allergic reaction symptoms",
    status: "Recovered" as const,
    lastVisit: "oct 12, 2025"
  },
  {
    id: "3",
    name: "mayar mohamed",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80",
    age: 24,
    gender: "Female",
    phone: "+2012345678976",
    symptoms: "Skin rash and allergic reaction symptoms",
    status: "Active" as const,
    lastVisit: "oct 12, 2025"
  },
  {
    id: "4",
    name: "mayar mohamed",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80",
    age: 24,
    gender: "Female",
    phone: "+2012345678976",
    symptoms: "Skin rash and allergic reaction symptoms",
    status: "Recovered" as const,
    lastVisit: "oct 12, 2025"
  },
  {
    id: "5",
    name: "mayar mohamed",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&q=80",
    age: 24,
    gender: "Female",
    phone: "+2012345678976",
    symptoms: "Skin rash and allergic reaction symptoms",
    status: "Active" as const,
    lastVisit: "oct 12, 2025"
  },
  {
    id: "6",
    name: "mayar mohamed",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80",
    age: 24,
    gender: "Female",
    phone: "+2012345678976",
    symptoms: "Skin rash and allergic reaction symptoms",
    status: "Active" as const,
    lastVisit: "oct 12, 2025"
  },
  
]

export default function PatientsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground mt-1">Manage your patient records</p>
        </div>
        
        <div className="flex w-full sm:w-auto items-center gap-4">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search Patients..." 
              className="pl-10 rounded-full bg-white"
            />
          </div>
          <Button className="bg-primary hover:bg-teal-600 text-white rounded-full px-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PATIENTS.map((patient) => (
          <PatientCard key={patient.id} {...patient} />
        ))}
      </div>
    </div>
  )
}