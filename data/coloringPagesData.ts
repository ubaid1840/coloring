import coloringMandala from "@/assets/coloring-mandala.jpg";
import coloringLotusMandala from "@/assets/coloring-lotus-mandala.jpg";
import coloringZenMandala from "@/assets/coloring-zen-mandala.jpg";
import coloringCelestialMandala from "@/assets/coloring-celestial-mandala.jpg";
import coloringGeometric from "@/assets/coloring-geometric.jpg";
import coloringSacredGeometry from "@/assets/coloring-sacred-geometry.jpg";
import coloringTessellation from "@/assets/coloring-tessellation.jpg";
import coloringCubic from "@/assets/coloring-cubic.jpg";
import coloringFloral from "@/assets/coloring-floral.jpg";
import coloringRoseBouquet from "@/assets/coloring-rose-bouquet.jpg";
import coloringWildflower from "@/assets/coloring-wildflower.jpg";
import coloringTropicalFlowers from "@/assets/coloring-tropical-flowers.jpg";
import coloringAnimal from "@/assets/coloring-animal.jpg";
import coloringLion from "@/assets/coloring-lion.jpg";
import coloringButterfly from "@/assets/coloring-butterfly.jpg";
import coloringOcean from "@/assets/coloring-ocean.jpg";
import coloringAbstract from "@/assets/coloring-abstract.jpg";
import coloringPaisley from "@/assets/coloring-paisley.jpg";
import coloringDoodle from "@/assets/coloring-doodle.jpg";
import coloringZentangle from "@/assets/coloring-zentangle.jpg";

export type Category = "all" | "mandala" | "geometric" | "floral" | "animals" | "abstract" | "nature" | "fantasy" | "patterns";

export const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All Designs" },
  { id: "mandala", label: "Mandalas" },
  { id: "geometric", label: "Geometric" },
  { id: "floral", label: "Floral" },
  { id: "animals", label: "Animals" },
  { id: "abstract", label: "Abstract" },
  { id: "nature", label: "Nature" },
  { id: "fantasy", label: "Fantasy" },
  { id: "patterns", label: "Patterns" },
];

const mandalaImages = [coloringMandala, coloringLotusMandala, coloringZenMandala, coloringCelestialMandala];
const geometricImages = [coloringGeometric, coloringSacredGeometry, coloringTessellation, coloringCubic];
const floralImages = [coloringFloral, coloringRoseBouquet, coloringWildflower, coloringTropicalFlowers];
const animalImages = [coloringAnimal, coloringLion, coloringButterfly, coloringOcean];
const abstractImages = [coloringAbstract, coloringPaisley, coloringDoodle, coloringZentangle];

const difficulties = ["Easy", "Medium", "Hard"] as const;

const mandalaNames = [
  "Peaceful Mandala", "Lotus Mandala", "Zen Circle Mandala", "Celestial Mandala"
];

const geometricNames = [
  "Honeycomb Pattern", "Sacred Geometry", "Tessellation Art", "Cubic Dreams"
];

const floralNames = [
  "Garden Blooms", "Rose Bouquet", "Wildflower Meadow", "Tropical Flowers"
];

const animalNames = [
  "Wise Owl", "Majestic Lion", "Butterfly Garden", "Ocean Friends"
];

const abstractNames = [
  "Flowing Waves", "Paisley Dreams", "Doodle Art", "Zentangle Fusion"
];

const natureNames = [
  "Garden Blooms", "Rose Bouquet", "Wildflower Meadow", "Tropical Flowers",
  "Flowing Waves", "Paisley Dreams", "Doodle Art", "Zentangle Fusion"
];

const fantasyNames = [
  "Wise Owl", "Majestic Lion", "Butterfly Garden", "Ocean Friends",
  "Peaceful Mandala", "Lotus Mandala", "Zen Circle Mandala", "Celestial Mandala"
];

const patternNames = [
  "Honeycomb Pattern", "Sacred Geometry", "Tessellation Art", "Cubic Dreams",
  "Flowing Waves", "Paisley Dreams", "Doodle Art", "Zentangle Fusion"
];

const createPages = (
  category: string,
  names: string[],
  images: string[],
  startId: number
) => {
  return names.map((name, index) => ({
    id: startId + index,
    title: name,
    category,
    difficulty: difficulties[index % 3],
    image: images[index % images.length],
    description: `Beautiful ${name.toLowerCase()} design perfect for relaxation and creativity.`,
  }));
};

export const coloringPages = [
  ...createPages("mandala", mandalaNames, mandalaImages, 1),
  ...createPages("geometric", geometricNames, geometricImages, 26),
  ...createPages("floral", floralNames, floralImages, 51),
  ...createPages("animals", animalNames, animalImages, 76),
  ...createPages("abstract", abstractNames, abstractImages, 101),
  ...createPages("nature", natureNames, [...floralImages, ...abstractImages], 126),
  ...createPages("fantasy", fantasyNames, [...animalImages, ...mandalaImages], 151),
  ...createPages("patterns", patternNames, [...geometricImages, ...abstractImages], 176),
];
