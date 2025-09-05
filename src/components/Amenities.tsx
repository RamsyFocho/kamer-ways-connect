import { Wifi, Armchair, Tv, Coffee, Maximize, Snowflake, Shield, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, React.ElementType> = {
  WiFi: Wifi,
  "Premium Seats": Armchair,
  "Personal Entertainment": Tv,
  Refreshments: Coffee,
  "Extra Legroom": Maximize,
  "Standard Seats": Armchair,
  "Air Conditioning": Snowflake,
  "Business Class Seats": Armchair,
  "Priority Boarding": Users,
  "Lounge Access": Shield,
};

interface AmenitiesProps {
  amenities: string[];
}

export const Amenities: React.FC<AmenitiesProps> = ({ amenities }) => {
  const visibleAmenities = amenities.slice(0, 4);
  const hiddenAmenities = amenities.slice(4);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visibleAmenities.map((amenity) => {
        const Icon = amenityIcons[amenity] || Shield;
        return (
          <div
            key={amenity}
            className="flex items-center space-x-1 text-xs px-2 py-1 rounded-full border shadow-md"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{amenity}</span>
          </div>
        );
      })}

      {hiddenAmenities.length > 0 && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer text-accent-foreground text-xs px-2 py-1 rounded-full border shadow-md">
                +{hiddenAmenities.length}
              </div>
            </TooltipTrigger>
            <TooltipContent className=" shadow-md rounded-lg p-2 max-w-xs">
              <div className="grid grid-cols-1 gap-1">
                {hiddenAmenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Shield;
                  return (
                    <div
                      key={amenity}
                      className="flex items-center space-x-1 text-sm "
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
