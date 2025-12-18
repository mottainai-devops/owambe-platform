import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isBefore,
} from "date-fns";

interface AvailabilityCalendarProps {
  resourceType: "venue" | "hotel";
  resourceId: string;
  onDateSelect?: (date: Date) => void;
}

export default function AvailabilityCalendar({
  resourceType,
  resourceId,
  onDateSelect,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: availability, isLoading } = trpc.availability.getByResource.useQuery({
    resourceType,
    resourceId,
    month: format(currentMonth, "yyyy-MM"),
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAvailabilityStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const slot = availability?.find((a) => format(new Date(a.date), "yyyy-MM-dd") === dateStr);
    return slot;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfWeek = monthStart.getDay();
  const emptyDays = Array(firstDayOfWeek).fill(null);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading calendar...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Availability Calendar</CardTitle>
            <CardDescription>Select dates to check availability</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-40 text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Blocked</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="border rounded-lg p-4">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}

              {/* Days of the month */}
              {daysInMonth.map((date) => {
                const availability = getAvailabilityStatus(date);
                const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
                const isPast = isBefore(date, new Date()) && !isToday(date);
                const isTodayDate = isToday(date);

                let bgColor = "bg-white";
                let borderColor = "border-gray-200";
                let textColor = "text-gray-900";

                if (availability) {
                  if (availability.status === "available") {
                    bgColor = "bg-green-50";
                    borderColor = "border-green-300";
                  } else if (availability.status === "booked") {
                    bgColor = "bg-red-50";
                    borderColor = "border-red-300";
                    textColor = "text-red-600";
                  } else if (availability.status === "blocked") {
                    bgColor = "bg-gray-100";
                    borderColor = "border-gray-300";
                    textColor = "text-gray-500";
                  }
                }

                if (isSelected) {
                  bgColor = "bg-blue-100";
                  borderColor = "border-blue-400";
                }

                if (isPast) {
                  textColor = "text-gray-400";
                  bgColor = "bg-gray-50";
                }

                return (
                  <button
                    key={format(date, "yyyy-MM-dd")}
                    onClick={() => !isPast && handleDateSelect(date)}
                    disabled={isPast || availability?.status === "booked" || availability?.status === "blocked"}
                    className={`aspect-square rounded border-2 flex flex-col items-center justify-center text-sm font-medium transition-all ${bgColor} ${borderColor} ${textColor} disabled:cursor-not-allowed ${
                      isTodayDate ? "ring-2 ring-offset-1 ring-blue-400" : ""
                    } hover:shadow-md disabled:hover:shadow-none`}
                  >
                    <div>{format(date, "d")}</div>
                    {availability && availability.availableSlots > 0 && (
                      <div className="text-xs text-gray-600">
                        {availability.availableSlots} left
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-sm mb-2">
                Selected: {format(selectedDate, "MMMM d, yyyy")}
              </p>
              {getAvailabilityStatus(selectedDate) ? (
                <div className="text-sm space-y-1">
                  <p>
                    Status:{" "}
                    <Badge variant="outline">
                      {getAvailabilityStatus(selectedDate)?.status}
                    </Badge>
                  </p>
                  <p>
                    Available Slots:{" "}
                    <span className="font-semibold">
                      {getAvailabilityStatus(selectedDate)?.availableSlots}
                    </span>
                  </p>
                  {getAvailabilityStatus(selectedDate)?.price && (
                    <p>
                      Price:{" "}
                      <span className="font-semibold">
                        ₦{((getAvailabilityStatus(selectedDate)?.price || 0) / 100).toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No availability data for this date</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

