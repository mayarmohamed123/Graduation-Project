import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";

interface PharmaciesFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filter: "all" | "approved" | "pending" | "rejected";
    onFilterChange: (value: "all" | "approved" | "pending" | "rejected") => void;
}

export function PharmaciesFilters({ searchTerm, onSearchChange, filter, onFilterChange }: PharmaciesFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                    type="text"
                    placeholder="Search by name, email or city..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 h-10 ring-offset-background focus-visible:ring-primary/20"
                />
            </div>
            <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as "all" | "approved" | "pending" | "rejected")}
                className="h-10 px-3 py-2 border rounded-md text-sm ring-offset-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-background transition-colors"
            >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
            </select>
        </div>
    );
}
