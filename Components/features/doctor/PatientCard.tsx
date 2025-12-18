import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { CalendarDays, Link as LinkIcon, MessageSquare, Phone } from "lucide-react"
import Link from "next/link"

interface PatientCardProps {
  name: string
  image: string
  age: number
  gender: string
  phone: string
  symptoms: string
  status: "Active" | "Recovered"
  lastVisit: string
  id: string
}

export function PatientCard({
  name,
  image,
  age,
  gender,
  phone,
  symptoms,
  status,
  lastVisit,
  id,
}: PatientCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow rounded-2xl border border-primary">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={image} alt={name} className="object-cover" />
            <AvatarFallback>{name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
              <span className="font-light text-xl text-gray-300">|</span> 
              <span>{age} years, {gender}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-gray-500">
            <Phone className="h-4 w-4" />
            <span className="text-sm">{phone}</span>
          </div>
          <div className="flex items-start gap-3 text-gray-500">
            <CalendarDays className="h-4 w-4 mt-0.5" />
            <span className="text-sm line-clamp-2">{symptoms}</span>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 text-primary border-primary" asChild>
            <Link href={`/doctor/patients/${id}/prescriptions`}>
              <LinkIcon className="h-4 w-4 mr-2" />
              View Prescriptions
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="text-primary border-primary shrink-0" asChild>
             <Link href={`/doctor/messages?userId=${id}`}>
                <MessageSquare className="h-4 w-4" />
             </Link>
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t">
          <Badge 
            variant="secondary" 
            className={`${
              status === "Active" 
                ? "bg-green-100 text-green-700 hover:bg-green-200" 
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
            } font-normal px-4 py-1 rounded-full`}
          >
            {status}
          </Badge>
          <span className="text-xs text-gray-400">Last Visit: {lastVisit}</span>
        </div>
      </CardContent>
    </Card>
  )
}
