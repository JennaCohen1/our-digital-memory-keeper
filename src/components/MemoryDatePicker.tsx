import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

interface MemoryDatePickerProps {
  month?: string;
  year?: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
}

const MemoryDatePicker = ({ month, year, onMonthChange, onYearChange }: MemoryDatePickerProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex-1">
        <Select value={month || ""} onValueChange={onMonthChange}>
          <SelectTrigger>
            <SelectValue placeholder="Month (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No month</SelectItem>
            {months.map((m, i) => (
              <SelectItem key={m} value={String(i + 1).padStart(2, "0")}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-28">
        <Select value={year || ""} onValueChange={onYearChange}>
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MemoryDatePicker;
