"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface ShadcnDatePickerProps {
  startYear: number;
  endYear: number;
  selected: Date;
  onSelect: (date: Date) => void;
}

const DatePicker: React.FC<ShadcnDatePickerProps> = ({
  startYear,
  endYear,
  selected,
  onSelect,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleMonthChange = (month: string) => {
    const year = selected.getFullYear();
    const day = selected.getDate();
    const newDate = new Date(year, months.indexOf(month), day);

    if (newDate.getMonth() !== months.indexOf(month)) {
      setError("Invalid date selected");
    } else {
      setError(null);
      onSelect(newDate);
    }
  };

  const handleYearChange = (year: string) => {
    const month = selected.getMonth();
    const day = selected.getDate();
    const newDate = new Date(parseInt(year), month, day);

    if (newDate.getFullYear() !== parseInt(year)) {
      setError("Invalid date selected");
    } else {
      setError(null);
      onSelect(newDate);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i,
  );
  return (
    <div className="grid max-w-[360px] grid-cols-2 gap-4 dark:text-white ">
      <Select onValueChange={handleMonthChange}>
        <SelectTrigger className="h-auto  shadow-sm focus:outline-0 focus:ring-0 focus:ring-offset-0">
          <SelectValue
            placeholder={
              <div className="flex flex-col items-start">
                <span className="text-[0.65rem] font-semibold uppercase text-muted-foreground dark:text-white">
                  Month
                </span>
                <span className="font-normal dark:text-white">
                  {months[selected.getMonth()] || "-"}
                </span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-48">
            {months.map((month, index) => (
              <SelectItem key={index} value={month}>
                {month}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
      <Select onValueChange={handleYearChange}>
        <SelectTrigger className="h-auto shadow-sm focus:outline-0 focus:ring-0 focus:ring-offset-0">
          <SelectValue
            placeholder={
              <div className="flex flex-col items-start">
                <span className="text-[0.65rem] font-semibold uppercase text-muted-foreground dark:text-white">
                  Year
                </span>
                <span className="font-normal dark:text-white">
                  {selected.getFullYear() || "-"}
                </span>
              </div>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea className="h-48">
            {Array.from({ length: endYear - startYear + 1 }, (_, i) => (
              <SelectItem
                key={i + startYear}
                value={(i + startYear).toString()}
              >
                {i + startYear}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default DatePicker;
