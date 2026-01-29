import { Search } from "lucide-react";

interface DoctorsFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filter: "all" | "approved" | "pending";
    onFilterChange: (value: "all" | "approved" | "pending") => void;
}

export function DoctorsFilters({ searchTerm, onSearchChange, filter, onFilterChange }: DoctorsFiltersProps) {
    return (
        <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                />
            </div>
            <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as "all" | "approved" | "pending")}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
            >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
            </select>
        </div>
    );
}
