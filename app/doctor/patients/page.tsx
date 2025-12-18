"use client"

import { Input } from "@/Components/ui/input"
import { Search } from "lucide-react"
import { PatientCard } from "@/Components/features/doctor/PatientCard"
import { useEffect, useState } from "react"
import { doctorService } from "@/Services/doctorService"
import { PatientAppointment } from "@/types/doctors"
import { toast } from "react-hot-toast"
import LoadingSpinner from "@/Components/common/LoadingSpinner"

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const data = await doctorService.getAllPatients()
        setPatients(data)
      } catch (error) {
        console.error("Failed to load patients:", error)
        toast.error(
          error instanceof Error ? error.message : "Failed to load patients"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <LoadingSpinner />
  }

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery
              ? "No patients found matching your search"
              : "No patients yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard 
              key={patient.appointmentId} 
              id={patient.appointmentId.toString()}
              name={patient.patientName}
              age={patient.patientAge}
              gender={patient.patientGender}
              phone={patient.patientPhone}
              status={patient.status as "Active" | "Recovered"}
              lastVisit={new Date(patient.startAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })}
              image={`https://ui-avatars.com/api/?name=${encodeURIComponent(patient.patientName)}&background=2BBBC5&color=fff&size=400`}
              symptoms={`Appointment at ${patient.clinicName}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}