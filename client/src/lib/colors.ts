// lib/colors.ts

export const colorMap: Record<string, string> = {
  // ==================== NEUTRALS & GRAYS (20) ====================
  'white': '#FFFFFF',
  'off-white': '#FAFAFA',
  'snow': '#FFFAFA',
  'ghost-white': '#F8F8FF',
  'alice-blue': '#F0F8FF',
  'black': '#000000',
  'ink-black': '#0D0D0D',
  'soft-black': '#1A1A1A',
  'charcoal': '#36454F',
  'gunmetal': '#2A3439',
  'slate': '#708090',
  'graphite': '#2F353B',
  'gray': '#6B7280',
  'light-gray': '#D1D5DB',
  'medium-gray': '#9CA3AF',
  'dark-gray': '#374151',
  'dim-gray': '#696969',
  'silver': '#C0C0C0',
  'platinum': '#E5E4E2',
  'smoke': '#848884',
  
  // ==================== WHITES & CREAMS (15) ====================
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'eggshell': '#F0EAD6',
  'vanilla': '#F3E5AB',
  'parchment': '#F1E9D2',
  'almond': '#EADDCA',
  'bone': '#E3DAC9',
  'ecru': '#C2B280',
  'linen': '#E9DCC9',
  'seashell': '#FFF5EE',
  'old-lace': '#FDF5E6',
  'floral-white': '#FFFAF0',
  'antique-white': '#FAEBD7',
  'champagne': '#F7E7CE',
  'pearl': '#FDEEF4',
  
  // ==================== BROWNS & TANS (25) ====================
  'brown': '#92400E',
  'dark-brown': '#5C4033',
  'light-brown': '#A52A2A',
  'chocolate': '#7B3F00',
  'cocoa': '#D2691E',
  'coffee': '#6F4E37',
  'espresso': '#3C2A21',
  'mocha': '#8B5A2B',
  'caramel': '#FFD59A',
  'toffee': '#C68E17',
  'tan': '#D2B48C',
  'taupe': '#483C32',
  'camel': '#C19A6B',
  'beige': '#F5F5DC',
  'khaki': '#C3B091',
  'sand': '#F4A460',
  'wheat': '#F5DEB3',
  'burlywood': '#DEB887',
  'sienna': '#A0522D',
  'saddle-brown': '#8B4513',
  'peru': '#CD853F',
  'sandy-brown': '#F4A460',
  'nude': '#F2D2BD',
  'hazelnut': '#D4C4B0',
  'walnut': '#5C4A3A',
  
  // ==================== REDS & BURGUNDIES (20) ====================
  'red': '#DC2626',
  'bright-red': '#FF0000',
  'fire-engine': '#CE2029',
  'crimson': '#DC143C',
  'cardinal': '#C41E3A',
  'ruby': '#E0115F',
  'cherry': '#DE3163',
  'scarlet': '#FF2400',
  'vermillion': '#E34234',
  'tomato': '#FF6347',
  'burgundy': '#800020',
  'maroon': '#800000',
  'wine': '#722F37',
  'bordeaux': '#800020',
  'merlot': '#73343A',
  'cabernet': '#720238',
  'claret': '#7F1734',
  'oxblood': '#800000',
  'mahogany': '#C04000',
  'rust': '#B7410E',
  
  // ==================== CORALS & ORANGES (15) ====================
  'coral': '#FF7F50',
  'salmon': '#FA8072',
  'coral-pink': '#F88379',
  'light-coral': '#F08080',
  'dark-coral': '#CD5B45',
  'orange': '#F97316',
  'tangerine': '#F28500',
  'mandarin': '#F37A48',
  'pumpkin': '#FF7518',
  'burnt-orange': '#CC5500',
  'amber': '#FFBF00',
  'apricot': '#FBCEB1',
  'peach': '#FFE5B4',
  'papaya': '#FFEFD5',
  'mango': '#F4BB44',
  
  // ==================== YELLOWS & GOLDS (15) ====================
  'yellow': '#F59E0B',
  'lemon': '#FFF44F',
  'canary': '#FFEF00',
  'goldenrod': '#DAA520',
  'gold': '#FFD700',
  'old-gold': '#CFB53B',
  'mustard': '#FFDB58',
  'honey': '#EB9605',
  'daffodil': '#FFFA42',
  'butter': '#FFF8C9',
  'corn': '#FBEC5D',
  'sunflower': '#FFC512',
  'school-bus': '#FFD800',
  'tuscan': '#FAD6A5',
  'cream-gold': '#F3E5AB',
  
  // ==================== GREENS (25) ====================
  'green': '#16A34A',
  'forest-green': '#228B22',
  'dark-green': '#006400',
  'hunter-green': '#355E3B',
  'pine': '#01796F',
  'spruce': '#2C5F4B',
  'emerald': '#50C878',
  'jade': '#00A86B',
  'mint': '#98FF98',
  'seafoam': '#93E9BE',
  'sage': '#9CAF88',
  'olive': '#808000',
  'moss': '#8A9A5B',
  'fern': '#4F7942',
  'lime': '#00FF00',
  'chartreuse': '#7FFF00',
  'grass': '#7CFC00',
  'kelly': '#4CBB17',
  'neon-green': '#39FF14',
  'apple': '#6CC04A',
  'avocado': '#568203',
  'pickle': '#597D35',
  'teal': '#008080',
  'turquoise': '#40E0D0',
  'aquamarine': '#7FFFD4',
  
  // ==================== BLUES (25) ====================
  'blue': '#2563EB',
  'navy': '#1E3A8A',
  'midnight-blue': '#191970',
  'dark-blue': '#00008B',
  'royal-blue': '#4169E1',
  'cobalt': '#0047AB',
  'sapphire': '#0F52BA',
  'azure': '#007FFF',
  'sky-blue': '#87CEEB',
  'baby-blue': '#89CFF0',
  'light-blue': '#ADD8E6',
  'powder-blue': '#B0E0E6',
  'steel-blue': '#4682B4',
  'cadet-blue': '#5F9EA0',
  'slate-blue': '#6A5ACD',
  'indigo': '#4B0082',
  'blueberry': '#4F86F7',
  'denim': '#1560BD',
  'ocean': '#006994',
  'sea-blue': '#006994',
  'cerulean': '#007BA7',
  'cyan': '#00FFFF',
  'aqua': '#00FFFF',
  'ice-blue': '#D6EAF8',
  ' Arctic': '#B0E0E6',
  
  // ==================== PURPLES (20) ====================
  'purple': '#9333EA',
  'lavender': '#E6E6FA',
  'lilac': '#C8A2C8',
  'mauve': '#E0B0FF',
  'orchid': '#DA70D6',
  'plum': '#8E4585',
  'violet': '#8F00FF',
  'amethyst': '#9966CC',
  'wisteria': '#C9A0DC',
  'mulberry': '#C54B8C',
  'magenta': '#FF00FF',
  'fuchsia': '#FF00FF',
  'electric-purple': '#BF00FF',
  'grape': '#6F2DA8',
  'eggplant': '#5D3A58',
  'dark-violet': '#9400D3',
  'blue-violet': '#8A2BE2',
  'indigo-dye': '#4B0082',
  'royal-purple': '#7851A9',
  'heliotrope': '#DF73FF',
  
  // ==================== PINKS & ROSES (15) ====================
  'pink': '#EC4899',
  'hot-pink': '#FF69B4',
  'blush': '#DE5D83',
  'bashful-pink': '#C9A1A1',
  'dusty-rose': '#DCAE96',
  'rose-gold': '#B76E79',
  'old-rose': '#C08081',
  'tea-rose': '#F4C2C2',
  'salmon-pink': '#FF91A4',
  'carnation': '#F95A61',
  'bubblegum': '#FFC1CC',
  'pastel-pink': '#FADADD',
  'millennial-pink': '#F7CAC9',
  'neon-pink': '#FF6EC7',
  'french-rose': '#F64A8A',
  
  // ==================== METALLICS (10) ====================
  'gold-metallic': '#D4AF37',
  'silver-metallic': '#C0C0C0',
  'bronze': '#CD7F32',
  'copper': '#B87333',
  'brass': '#B5A642',
  'rose-gold-metallic': '#B76E79',
  'gunmetal-metallic': '#2A3439',
  'platinum-metallic': '#E5E4E2',
  'titanium': '#878681',
  'chrome': '#DBE4EB',
};

// Helper function to get color by name (case insensitive)
export function getColorCode(colorName: string): string {
  const normalized = colorName.toLowerCase().trim().replace(/ /g, '-');
  return colorMap[normalized] || '#6B7280'; // Default gray if not found
}

// Get all available color names
export function getAvailableColors(): string[] {
  return Object.keys(colorMap);
}

// Check if color is multi-color/pattern
export function isPatternColor(colorName: string): boolean {
  const patternColors = ['striped', 'checkered', 'camo', 'camouflage', 'animal-print', 
                         'leopard', 'zebra', 'tiger', 'snake', 'cheetah', 'polka-dot',
                         'geometric', 'abstract', 'floral', 'paisley', 'plaid', 'tartan',
                         'houndstooth', 'tweed', 'tie-dye', 'ombre', 'gradient'];
  return patternColors.includes(colorName.toLowerCase());
}

// Check if color is metallic
export function isMetallicColor(colorName: string): boolean {
  const metallicColors = ['gold-metallic', 'silver-metallic', 'bronze', 'copper', 
                          'brass', 'rose-gold-metallic', 'gunmetal-metallic', 
                          'platinum-metallic', 'titanium', 'chrome'];
  return metallicColors.includes(colorName.toLowerCase());
}

// Get readable display name for colors
export function getColorDisplayName(colorName: string): string {
  // If it's already a translation key, return it
  if (colorName.startsWith('color.')) {
    return colorName;
  }
  
  // Map color names to translation keys
  const translationKeys: Record<string, string> = {
    // Neutrals
    'off-white': 'color.off_white',
    'snow': 'color.snow',
    'ghost-white': 'color.ghost_white',
    'alice-blue': 'color.alice_blue',
    'ink-black': 'color.ink_black',
    'soft-black': 'color.soft_black',
    'gunmetal': 'color.gunmetal',
    'medium-gray': 'color.medium_gray',
    'dim-gray': 'color.dim_gray',
    'smoke': 'color.smoke',
    
    // Whites/Creams
    'almond': 'color.almond',
    'bone': 'color.bone',
    'ecru': 'color.ecru',
    'linen': 'color.linen',
    'seashell': 'color.seashell',
    'old-lace': 'color.old_lace',
    'floral-white': 'color.floral_white',
    'antique-white': 'color.antique_white',
    'champagne': 'color.champagne',
    'pearl': 'color.pearl',
    
    // Browns
    'chocolate': 'color.chocolate',
    'cocoa': 'color.cocoa',
    'espresso': 'color.espresso',
    'mocha': 'color.mocha',
    'caramel': 'color.caramel',
    'toffee': 'color.toffee',
    'wheat': 'color.wheat',
    'burlywood': 'color.burlywood',
    'sienna': 'color.sienna',
    'saddle-brown': 'color.saddle_brown',
    'peru': 'color.peru',
    'sandy-brown': 'color.sandy_brown',
    'nude': 'color.nude',
    'hazelnut': 'color.hazelnut',
    'walnut': 'color.walnut',
    
    // Reds
    'bright-red': 'color.bright_red',
    'fire-engine': 'color.fire_engine',
    'cardinal': 'color.cardinal',
    'cherry': 'color.cherry',
    'vermillion': 'color.vermillion',
    'tomato': 'color.tomato',
    'bordeaux': 'color.bordeaux',
    'merlot': 'color.merlot',
    'cabernet': 'color.cabernet',
    'claret': 'color.claret',
    'oxblood': 'color.oxblood',
    'rust': 'color.rust',
    
    // Oranges/Corals
    'salmon': 'color.salmon',
    'coral-pink': 'color.coral_pink',
    'light-coral': 'color.light_coral',
    'dark-coral': 'color.dark_coral',
    'tangerine': 'color.tangerine',
    'mandarin': 'color.mandarin',
    'pumpkin': 'color.pumpkin',
    'burnt-orange': 'color.burnt_orange',
    'papaya': 'color.papaya',
    'mango': 'color.mango',
    
    // Yellows
    'lemon': 'color.lemon',
    'canary': 'color.canary',
    'goldenrod': 'color.goldenrod',
    'old-gold': 'color.old_gold',
    'honey': 'color.honey',
    'daffodil': 'color.daffodil',
    'butter': 'color.butter',
    'corn': 'color.corn',
    'sunflower': 'color.sunflower',
    'school-bus': 'color.school_bus',
    'tuscan': 'color.tuscan',
    'cream-gold': 'color.cream_gold',
    
    // Greens
    'dark-green': 'color.dark_green',
    'hunter-green': 'color.hunter_green',
    'pine': 'color.pine',
    'spruce': 'color.spruce',
    'seafoam': 'color.seafoam',
    'fern': 'color.fern',
    'kelly': 'color.kelly',
    'neon-green': 'color.neon_green',
    'apple': 'color.apple',
    'avocado': 'color.avocado',
    'pickle': 'color.pickle',
    'aquamarine': 'color.aquamarine',
    
    // Blues
    'midnight-blue': 'color.midnight_blue',
    'dark-blue': 'color.dark_blue',
    'azure': 'color.azure',
    'baby-blue': 'color.baby_blue',
    'light-blue': 'color.light_blue',
    'powder-blue': 'color.powder_blue',
    'steel-blue': 'color.steel_blue',
    'cadet-blue': 'color.cadet_blue',
    'slate-blue': 'color.slate_blue',
    'blueberry': 'color.blueberry',
    'ocean': 'color.ocean',
    'sea-blue': 'color.sea_blue',
    'cerulean': 'color.cerulean',
    'ice-blue': 'color.ice_blue',
    'arctic': 'color.arctic',
    
    // Purples
    'orchid': 'color.orchid',
    'plum': 'color.plum',
    'wisteria': 'color.wisteria',
    'mulberry': 'color.mulberry',
    'magenta': 'color.magenta',
    'electric-purple': 'color.electric_purple',
    'grape': 'color.grape',
    'eggplant': 'color.eggplant',
    'dark-violet': 'color.dark_violet',
    'blue-violet': 'color.blue_violet',
    'indigo-dye': 'color.indigo_dye',
    'royal-purple': 'color.royal_purple',
    'heliotrope': 'color.heliotrope',
    
    // Pinks
    'bashful-pink': 'color.bashful_pink',
    'dusty-rose': 'color.dusty_rose',
    'rose-gold': 'color.rose_gold',
    'old-rose': 'color.old_rose',
    'tea-rose': 'color.tea_rose',
    'salmon-pink': 'color.salmon_pink',
    'carnation': 'color.carnation',
    'bubblegum': 'color.bubblegum',
    'pastel-pink': 'color.pastel_pink',
    'millennial-pink': 'color.millennial_pink',
    'neon-pink': 'color.neon_pink',
    'french-rose': 'color.french_rose',
    
    // Metallics
    'rose-gold-metallic': 'color.rose_gold_metallic',
    'gunmetal-metallic': 'color.gunmetal_metallic',
    'platinum-metallic': 'color.platinum_metallic',
    'titanium': 'color.titanium',
    'chrome': 'color.chrome',
    
    // Basic fallbacks
    'red': 'color.red',
    'orange': 'color.orange',
    'yellow': 'color.yellow',
    'green': 'color.green',
    'blue': 'color.blue',
    'purple': 'color.purple',
    'pink': 'color.pink',
    'brown': 'color.brown',
    'black': 'color.black',
    'white': 'color.white',
    'gray': 'color.gray',
    'grey': 'color.gray',
    'gold': 'color.gold',
    'silver': 'color.silver',
    'beige': 'color.beige',
    'cream': 'color.cream',
    'ivory': 'color.ivory',
    'burgundy': 'color.burgundy',
    'navy': 'color.navy',
    'charcoal': 'color.charcoal',
    'teal': 'color.teal',
    'turquoise': 'color.turquoise',
    'coral': 'color.coral',
    'mauve': 'color.mauve',
    'khaki': 'color.khaki',
    'lavender': 'color.lavender',
    'maroon': 'color.maroon',
    'olive': 'color.olive',
    'tan': 'color.tan',
  };
  
  const normalized = colorName.toLowerCase().trim().replace(/ /g, '-');
  
  return translationKeys[normalized] || `color.${normalized.replace(/-/g, '_')}`;
}

// Get colors by category
export function getColorsByCategory(): Record<string, string[]> {
  return {
    'Neutrals': ['white', 'black', 'off-white', 'snow', 'charcoal', 'slate', 'graphite', 'gray', 'light-gray', 'dark-gray', 'smoke', 'silver', 'platinum'],
    'Whites & Creams': ['cream', 'ivory', 'eggshell', 'vanilla', 'parchment', 'almond', 'bone', 'ecru', 'linen', 'seashell', 'old-lace', 'floral-white', 'antique-white', 'champagne', 'pearl'],
    'Browns & Tans': ['brown', 'dark-brown', 'light-brown', 'chocolate', 'cocoa', 'coffee', 'espresso', 'mocha', 'caramel', 'toffee', 'tan', 'taupe', 'camel', 'beige', 'khaki', 'sand', 'wheat', 'burlywood', 'sienna', 'saddle-brown', 'peru', 'sandy-brown', 'nude', 'hazelnut', 'walnut'],
    'Reds & Burgundies': ['red', 'bright-red', 'fire-engine', 'crimson', 'cardinal', 'ruby', 'cherry', 'scarlet', 'vermillion', 'tomato', 'burgundy', 'maroon', 'wine', 'bordeaux', 'merlot', 'cabernet', 'claret', 'oxblood', 'mahogany', 'rust'],
    'Pinks & Roses': ['pink', 'hot-pink', 'blush', 'bashful-pink', 'dusty-rose', 'rose-gold', 'old-rose', 'tea-rose', 'salmon-pink', 'carnation', 'bubblegum', 'pastel-pink', 'millennial-pink', 'neon-pink', 'french-rose', 'mauve', 'fuchsia', 'rose'],
    'Oranges & Corals': ['orange', 'coral', 'salmon', 'coral-pink', 'light-coral', 'dark-coral', 'tangerine', 'mandarin', 'pumpkin', 'burnt-orange', 'amber', 'apricot', 'peach', 'papaya', 'mango'],
    'Yellows & Golds': ['yellow', 'lemon', 'canary', 'gold', 'goldenrod', 'old-gold', 'mustard', 'honey', 'daffodil', 'butter', 'corn', 'sunflower', 'school-bus', 'tuscan', 'cream-gold'],
    'Greens': ['green', 'forest-green', 'dark-green', 'hunter-green', 'pine', 'spruce', 'emerald', 'jade', 'mint', 'seafoam', 'sage', 'olive', 'moss', 'fern', 'lime', 'chartreuse', 'grass', 'kelly', 'neon-green', 'apple', 'avocado', 'pickle', 'teal', 'turquoise', 'aquamarine', 'khaki'],
    'Blues': ['blue', 'navy', 'midnight-blue', 'dark-blue', 'royal-blue', 'cobalt', 'sapphire', 'azure', 'sky-blue', 'baby-blue', 'light-blue', 'powder-blue', 'steel-blue', 'cadet-blue', 'slate-blue', 'indigo', 'blueberry', 'denim', 'ocean', 'sea-blue', 'cerulean', 'cyan', 'aqua', 'ice-blue', 'arctic'],
    'Purples': ['purple', 'lavender', 'lilac', 'mauve', 'orchid', 'plum', 'violet', 'amethyst', 'wisteria', 'mulberry', 'magenta', 'fuchsia', 'electric-purple', 'grape', 'eggplant', 'dark-violet', 'blue-violet', 'indigo-dye', 'royal-purple', 'heliotrope'],
    'Metallics': ['gold-metallic', 'silver-metallic', 'bronze', 'copper', 'brass', 'rose-gold-metallic', 'gunmetal-metallic', 'platinum-metallic', 'titanium', 'chrome']
  };
}