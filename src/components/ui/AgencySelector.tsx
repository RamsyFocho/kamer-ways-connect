import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
// Define a type for the agency data for better type safety
type Agency = {
  id: string;
  name: string;
};

type FormattedAgency = {
  value: string;
  label: string;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const fetchAgencies = async (): Promise<Agency[]> => {
  try {
    const response = await fetch(`${backendUrl}/api/agencies`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched agencies:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch agencies:", error);
    return []; // Return an empty array on error
  }
};
// const agencies = fetchAgencies.map((agency) => ({
//   value: agency.id,
//   label: agency.name,
// }));

export function AgencySelector({
  onSelect,
}: {
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // State to hold the agencies fetched from the API
  const [agencies, setAgencies] = useState<FormattedAgency[]>([]);
// useEffect to fetch data when the component mounts
  useEffect(() => {
    const loadAgencies = async () => {
      const fetchedData = await fetchAgencies();
      // Format the data for the combobox
      const formattedData = fetchedData.map(agency => ({
        value: agency.id,
        label: agency.name,
      }));
      setAgencies(formattedData);
    };

    loadAgencies();
  }, []); // Empty dependency array means this runs once on mount
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? agencies.find((agency) => agency.value === value)?.label
            : "Select agency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search agency..." />
          <CommandEmpty>No agency found.</CommandEmpty>
          <CommandGroup>
            {agencies.map((agency) => (
              <CommandItem
                key={agency.value}
                onSelect={() => {
                  onSelect(agency.value);
                  setValue(agency.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === agency.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {agency.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
