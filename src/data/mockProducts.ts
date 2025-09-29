import emeraldImage from "@/assets/emerald-sample.jpg";
import sapphireImage from "@/assets/sapphire-sample.jpg";
import rubyImage from "@/assets/ruby-sample.jpg";

export interface Product {
  id: string;
  name: string;
  type: string;
  image: string;
  price: number;
  carat: number;
  origin: string;
  certified: boolean;
  treatment: string;
  shape: string;
  color: string;
  clarity: string;
  description: string;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Kashmir Blue Sapphire",
    type: "Sapphire",
    image: sapphireImage,
    price: 15750,
    carat: 3.2,
    origin: "Kashmir, Pakistan",
    certified: true,
    treatment: "Untreated",
    shape: "Oval",
    color: "Royal Blue",
    clarity: "VVS1",
    description: "A magnificent Kashmir sapphire with exceptional cornflower blue color and remarkable clarity."
  },
  {
    id: "2", 
    name: "Swat Emerald Premium",
    type: "Emerald",
    image: emeraldImage,
    price: 8500,
    carat: 2.1,
    origin: "Swat Valley, Pakistan",
    certified: true,
    treatment: "Minor Treatment",
    shape: "Emerald Cut",
    color: "Vivid Green",
    clarity: "VS2",
    description: "Beautiful Swat Valley emerald with vibrant green color and excellent transparency."
  },
  {
    id: "3",
    name: "Hunza Ruby Deluxe",
    type: "Ruby",
    image: rubyImage,
    price: 12300,
    carat: 1.8,
    origin: "Hunza Valley, Pakistan",
    certified: true,
    treatment: "Untreated",
    shape: "Cushion",
    color: "Pigeon Blood Red",
    clarity: "VVS2",
    description: "Rare Hunza Valley ruby with exceptional pigeon blood red color."
  },
  {
    id: "4",
    name: "Gilgit Aquamarine",
    type: "Aquamarine",
    image: sapphireImage,
    price: 2400,
    carat: 5.5,
    origin: "Gilgit, Pakistan",
    certified: true,
    treatment: "Untreated",
    shape: "Emerald Cut",
    color: "Sea Blue",
    clarity: "VVS1",
    description: "Stunning aquamarine from Gilgit with exceptional clarity and blue color."
  },
  {
    id: "5",
    name: "Skardu Peridot",
    type: "Peridot",
    image: emeraldImage,
    price: 850,
    carat: 4.2,
    origin: "Skardu, Pakistan",
    certified: true,
    treatment: "Untreated",
    shape: "Oval",
    color: "Olive Green",
    clarity: "VS1",
    description: "Beautiful Skardu peridot with vibrant olive green color."
  },
  {
    id: "6",
    name: "Chitral Tourmaline",
    type: "Tourmaline",
    image: rubyImage,
    price: 3200,
    carat: 3.8,
    origin: "Chitral, Pakistan",
    certified: true,
    treatment: "Untreated",
    shape: "Rectangular",
    color: "Pink",
    clarity: "VVS1",
    description: "Exceptional pink tourmaline from Chitral with remarkable clarity."
  },
  {
    id: "7",
    name: "Balochistan Sapphire",
    type: "Sapphire", 
    image: sapphireImage,
    price: 6800,
    carat: 2.7,
    origin: "Balochistan, Pakistan",
    certified: true,
    treatment: "Minor Treatment",
    shape: "Round",
    color: "Ceylon Blue",
    clarity: "VS1",
    description: "Beautiful Balochistan sapphire with Ceylon blue color."
  },
  {
    id: "8",
    name: "Khyber Emerald",
    type: "Emerald",
    image: emeraldImage,
    price: 4500,
    carat: 1.5,
    origin: "Khyber, Pakistan",
    certified: false,
    treatment: "Moderate Treatment",
    shape: "Round",
    color: "Forest Green",
    clarity: "SI1",
    description: "Beautiful Khyber emerald with deep forest green color."
  }
];