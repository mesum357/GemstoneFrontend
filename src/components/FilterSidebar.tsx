import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar = ({ isOpen, onClose }: FilterSidebarProps) => {
  const [priceRange, setPriceRange] = useState([100, 10000]);
  const [caratRange, setCaratRange] = useState([0.5, 10]);

  const gemstoneTypes = ["Ruby", "Sapphire", "Emerald", "Diamond", "Topaz", "Tourmaline", "Peridot"];
  const shapes = ["Round", "Oval", "Cushion", "Emerald", "Princess", "Pear", "Marquise"];
  const treatments = ["Untreated", "Minor Treatment", "Moderate Treatment"];
  const origins = ["Pakistan", "Kashmir", "Burma", "Ceylon", "Afghanistan"];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border shadow-xl
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      overflow-y-auto
    `}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-luxury text-xl font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <Label className="text-elegant text-sm font-medium mb-3 block">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000}
            min={100}
            step={100}
            className="mb-3"
          />
        </div>

        {/* Carat Weight */}
        <div className="mb-6">
          <Label className="text-elegant text-sm font-medium mb-3 block">
            Carat Weight: {caratRange[0]} - {caratRange[1]} ct
          </Label>
          <Slider
            value={caratRange}
            onValueChange={setCaratRange}
            max={20}
            min={0.1}
            step={0.1}
            className="mb-3"
          />
        </div>

        {/* Gemstone Type */}
        <div className="mb-6">
          <Label className="text-elegant text-sm font-medium mb-3 block">
            Gemstone Type
          </Label>
          <div className="space-y-2">
            {gemstoneTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={type} />
                <Label htmlFor={type} className="text-sm cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Shape */}
        <div className="mb-6">
          <Label className="text-elegant text-sm font-medium mb-3 block">
            Shape
          </Label>
          <div className="flex flex-wrap gap-2">
            {shapes.map((shape) => (
              <Badge
                key={shape}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {shape}
              </Badge>
            ))}
          </div>
        </div>

        {/* Treatment */}
        <div className="mb-6">
          <Label className="text-elegant text-sm font-medium mb-3 block">
            Treatment
          </Label>
          <div className="space-y-2">
            {treatments.map((treatment) => (
              <div key={treatment} className="flex items-center space-x-2">
                <Checkbox id={treatment} />
                <Label htmlFor={treatment} className="text-sm cursor-pointer">
                  {treatment}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Origin */}
        <div className="mb-6">
          <Label className="text-elegant text-sm font-medium mb-3 block">
            Origin
          </Label>
          <div className="space-y-2">
            {origins.map((origin) => (
              <div key={origin} className="flex items-center space-x-2">
                <Checkbox id={origin} />
                <Label htmlFor={origin} className="text-sm cursor-pointer">
                  {origin}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button className="w-full btn-emerald">
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;