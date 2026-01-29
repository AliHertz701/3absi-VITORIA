export const colorMap: Record<string, string> = {
  // Neutral Colors
  'white': '#FFFFFF',
  'black': '#000000',
  'charcoal': '#36454F',
  'slate': '#708090',
  'graphite': '#2F353B',
  
  // Gray Scale
  'gray': '#6B7280',
  'light-gray': '#D1D5DB',
  'dark-gray': '#374151',
  'silver': '#C0C0C0',
  'platinum': '#E5E4E2',
  
  // Warm Browns
  'brown': '#92400E',
  'dark-brown': '#5C4033',
  'light-brown': '#A52A2A',
  'tan': '#D2B48C',
  'taupe': '#483C32',
  'camel': '#C19A6B',
  'beige': '#F5F5DC',
  'khaki': '#C3B091',
  'sand': '#F4A460',
  'coffee': '#6F4E37',
  
  // Burgundy/Wine
  'burgundy': '#800020',
  'maroon': '#800000',
  'wine': '#722F37',
  'ruby': '#E0115F',
  'mahogany': '#C04000',
  
  // Red Scale
  'red': '#DC2626',
  'crimson': '#DC143C',
  'scarlet': '#FF2400',
  'coral': '#FF7F50',
  'rose': '#FF007F',
  
  // Pink Scale
  'pink': '#EC4899',
  'blush': '#DE5D83',
  'mauve': '#E0B0FF',
  'fuchsia': '#FF00FF',
  'hot-pink': '#FF69B4',
  
  // Purple Scale
  'purple': '#9333EA',
  'lavender': '#E6E6FA',
  'violet': '#8F00FF',
  'lilac': '#C8A2C8',
  'amethyst': '#9966CC',
  
  // Blue Scale
  'blue': '#2563EB',
  'navy': '#1E3A8A',
  'royal-blue': '#4169E1',
  'sky-blue': '#87CEEB',
  'teal': '#008080',
  'aqua': '#00FFFF',
  'turquoise': '#40E0D0',
  'sapphire': '#0F52BA',
  'cobalt': '#0047AB',
  'indigo': '#4B0082',
  
  // Green Scale
  'green': '#16A34A',
  'forest-green': '#228B22',
  'emerald': '#50C878',
  'mint': '#98FF98',
  'olive': '#808000',
  'sage': '#9CAF88',
  'jade': '#00A86B',
  'lime': '#00FF00',
  'moss': '#8A9A5B',
  
  // Yellow/Orange
  'yellow': '#F59E0B',
  'gold': '#FFD700',
  'mustard': '#FFDB58',
  'orange': '#F97316',
  'amber': '#FFBF00',
  'peach': '#FFE5B4',
  'apricot': '#FBCEB1',
  
  // Metallics
  'gold-metallic': '#D4AF37',
  'silver-metallic': '#C0C0C0',
  'bronze': '#CD7F32',
  'copper': '#B87333',
  'brass': '#B5A642',
  
  // Cream/Ivory
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'eggshell': '#F0EAD6',
  'vanilla': '#F3E5AB',
  'parchment': '#F1E9D2',
  
  // Multi/Pattern (will use gradient or pattern)
  'striped': 'linear-gradient(45deg, #000 25%, #fff 25%, #fff 50%, #000 50%, #000 75%, #fff 75%)',
  'checkered': 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px',
  'camo': 'linear-gradient(45deg, #556B2F 25%, #8B4513 25%, #8B4513 50%, #556B2F 50%, #556B2F 75%, #8B4513 75%)',
  'animal-print': 'radial-gradient(circle at 30% 30%, #000 2%, transparent 2%), radial-gradient(circle at 70% 70%, #000 2%, transparent 2%)',
  
  // Special/Textured
  'denim': '#1560BD',
  'leather': '#6D4C41',
  'suede': '#8B7355',
  'velvet': '#6C3082',
  'satin': '#F8F4FF',
};

// Helper function to get color by name (case insensitive)
export function getColorCode(colorName: string): string {
  const normalized = colorName.toLowerCase().trim();
  return colorMap[normalized] || '#6B7280'; // Default gray if not found
}

// Get all available color names
export function getAvailableColors(): string[] {
  return Object.keys(colorMap);
}

// Check if color is multi-color/pattern
export function isPatternColor(colorName: string): boolean {
  const patternColors = ['striped', 'checkered', 'camo', 'animal-print'];
  return patternColors.includes(colorName.toLowerCase());
}

// Get readable display name for colors
export function getColorDisplayName(colorName: string): string {
  const names: Record<string, string> = {
    'burgundy': 'Burgundy',
    'navy': 'Navy Blue',
    'charcoal': 'Charcoal',
    'graphite': 'Graphite',
    'platinum': 'Platinum',
    'camel': 'Camel',
    'taupe': 'Taupe',
    'wine': 'Wine Red',
    'ruby': 'Ruby Red',
    'mahogany': 'Mahogany',
    'crimson': 'Crimson',
    'scarlet': 'Scarlet',
    'blush': 'Blush Pink',
    'mauve': 'Mauve',
    'fuchsia': 'Fuchsia',
    'hot-pink': 'Hot Pink',
    'lavender': 'Lavender',
    'lilac': 'Lilac',
    'amethyst': 'Amethyst',
    'royal-blue': 'Royal Blue',
    'sky-blue': 'Sky Blue',
    'sapphire': 'Sapphire',
    'cobalt': 'Cobalt Blue',
    'indigo': 'Indigo',
    'forest-green': 'Forest Green',
    'emerald': 'Emerald',
    'sage': 'Sage Green',
    'jade': 'Jade Green',
    'moss': 'Moss Green',
    'mustard': 'Mustard Yellow',
    'amber': 'Amber',
    'peach': 'Peach',
    'apricot': 'Apricot',
    'gold-metallic': 'Gold Metallic',
    'silver-metallic': 'Silver Metallic',
    'bronze': 'Bronze',
    'copper': 'Copper',
    'brass': 'Brass',
    'eggshell': 'Eggshell',
    'vanilla': 'Vanilla',
    'parchment': 'Parchment',
    'animal-print': 'Animal Print',
    'denim': 'Denim Blue',
    'leather': 'Leather Brown',
    'suede': 'Suede',
    'velvet': 'Velvet Purple',
    'satin': 'Satin White',
  };
  
  return names[colorName.toLowerCase()] || colorName.charAt(0).toUpperCase() + colorName.slice(1);
}