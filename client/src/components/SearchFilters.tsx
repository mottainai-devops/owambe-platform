import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  searchType: "events" | "venues" | "hotels" | "vendors";
  onSearch?: (filters: SearchFiltersState) => void;
  onClear?: () => void;
}

interface SearchFiltersState {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rating?: number;
  sortBy?: "relevance" | "price" | "rating" | "newest";
}

const categoryOptions = {
  events: ["concert", "conference", "wedding", "party", "sports", "festival", "other"],
  venues: ["banquet", "conference", "wedding", "outdoor", "indoor"],
  hotels: ["luxury", "budget", "boutique", "resort"],
  vendors: ["catering", "photography", "entertainment", "decoration", "planning", "equipment"],
};

const sortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "price", label: "Price: Low to High" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

export default function SearchFilters({
  searchType,
  onSearch,
  onClear,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFiltersState>({
    query: "",
    sortBy: "relevance",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    onSearch?.(filters);
  };

  const handleClear = () => {
    setFilters({ query: "", sortBy: "relevance" });
    onClear?.();
  };

  const handleFilterChange = (key: keyof SearchFiltersState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "relevance").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>Find exactly what you're looking for</CardDescription>
          </div>
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Query */}
        <div>
          <Label htmlFor="search-query">Search</Label>
          <div className="flex gap-2">
            <Input
              id="search-query"
              placeholder={`Search ${searchType}...`}
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} className="flex-shrink-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Toggle Advanced Filters */}
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {isExpanded ? "Hide" : "Show"} Advanced Filters
        </Button>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Category Filter */}
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">All Categories</option>
                {categoryOptions[searchType].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City or region"
                value={filters.location || ""}
                onChange={(e) => handleFilterChange("location", e.target.value || undefined)}
              />
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="min-price">Min Price (₦)</Label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>
              <div>
                <Label htmlFor="max-price">Max Price (₦)</Label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="1000000"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value ? parseInt(e.target.value) : undefined)
                  }
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <Label htmlFor="rating">Minimum Rating</Label>
              <select
                id="rating"
                value={filters.rating || ""}
                onChange={(e) => handleFilterChange("rating", e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <select
                id="sort"
                value={filters.sortBy || "relevance"}
                onChange={(e) =>
                  handleFilterChange("sortBy", e.target.value as any)
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <Button onClick={handleSearch} className="w-full">
              Apply Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

