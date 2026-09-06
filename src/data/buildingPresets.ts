import { BUILDING_GRID_TOTAL, BUILDING_GRID_COLS } from '../components/BuildingZone';

export interface BlueprintPreset {
  id: string;
  nameZh: string;
  nameEn: string;
  icon: string;
  badge: string;
  descriptionZh: string;
  descriptionEn: string;
}

export const BLUEPRINT_PRESETS: BlueprintPreset[] = [
  {
    id: 'creeper',
    nameZh: '苦力怕肖像',
    nameEn: 'Creeper Face',
    icon: '🟩',
    badge: '156 Blocks',
    descriptionZh: '經典綠色苦力怕肖像，需消耗綠寶石礦與煤炭礦。',
    descriptionEn: 'Iconic Minecraft Creeper face using Emerald and Coal ores.'
  },
  {
    id: 'heart',
    nameZh: '經典像素心',
    nameEn: 'Pixel Heart',
    icon: '❤️',
    badge: '106 Blocks',
    descriptionZh: '象徵滿滿生命值的愛心像素圖案，需消耗紅石礦。',
    descriptionEn: 'Full health pixel heart crafted purely from Redstone ore.'
  },
  {
    id: 'sword',
    nameZh: '傳奇鑽石劍',
    nameEn: 'Diamond Sword',
    icon: '⚔️',
    badge: '27 Blocks',
    descriptionZh: '斜貫畫布的冒險者鑽石劍，需消耗鑽石礦、金礦、木材與鐵礦。',
    descriptionEn: 'Diagonal diamond blade with golden guard and wooden hilt.'
  },
  {
    id: 'castle',
    nameZh: '雄偉黑曜要塞',
    nameEn: 'Fortress Castle',
    icon: '🏰',
    badge: '287 Blocks',
    descriptionZh: '堅不可摧的黑曜石雙塔防禦城堡，需消耗石頭、黑曜石與金礦。',
    descriptionEn: 'Impenetrable twin-tower fortress of obsidian, stone, and gold.'
  },
  {
    id: 'star',
    nameZh: '光芒星辰',
    nameEn: 'Star of Destiny',
    icon: '✨',
    badge: '61 Blocks',
    descriptionZh: '璀璨耀眼的命運之星，需消耗螢石、金礦與鑽石礦。',
    descriptionEn: 'Radiant destiny star glowing with Glowstone, Gold, and Diamond ores.'
  }
];

/**
 * Generates the 1,000-cell grid layout for a given preset
 */
export function generatePresetGrid(presetId: string): (string | null)[] {
  const newGrid = Array(BUILDING_GRID_TOTAL).fill(null);
  const cols = BUILDING_GRID_COLS;

  if (presetId === 'creeper') {
    const rOffset = 6;
    const cOffset = 6;
    const creeperMask = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,0,0,1,1,1,0,0,1,1,0],
      [0,1,1,0,0,1,1,1,0,0,1,1,0],
      [0,1,1,1,1,0,0,0,1,1,1,1,0],
      [0,1,1,1,0,0,0,0,0,1,1,1,0],
      [0,1,1,1,0,0,0,0,0,1,1,1,0],
      [0,1,1,0,0,1,0,1,0,0,1,1,0],
      [0,1,1,0,0,1,0,1,0,0,1,1,0],
      [0,1,1,1,1,1,0,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];
    for (let r = 0; r < creeperMask.length; r++) {
      for (let c = 0; c < creeperMask[r].length; c++) {
        const idx = (r + rOffset) * cols + (c + cOffset);
        if (idx < BUILDING_GRID_TOTAL) {
          if (creeperMask[r][c] === 1) newGrid[idx] = 'emerald_ore';
          else newGrid[idx] = 'coal_ore';
        }
      }
    }
  } else if (presetId === 'heart') {
    const rOffset = 8;
    const cOffset = 4;
    const heartPattern = [
      "  #####   #####  ",
      " ####### ####### ",
      "#################",
      "#################",
      " ############### ",
      "  #############  ",
      "   ###########   ",
      "    #########    ",
      "     #######     ",
      "      #####      ",
      "       ###       ",
      "        #        "
    ];
    heartPattern.forEach((rowStr, r) => {
      for (let c = 0; c < rowStr.length; c++) {
        if (rowStr[c] === '#') {
          const idx = (r + rOffset) * cols + (c + cOffset);
          if (idx < BUILDING_GRID_TOTAL) newGrid[idx] = 'redstone_ore';
        }
      }
    });
  } else if (presetId === 'sword') {
    for (let i = 0; i < 20; i++) {
      const r = 4 + i;
      const c = 2 + Math.floor(i * 0.9);
      const idx = r * cols + c;
      if (idx < BUILDING_GRID_TOTAL && c < cols) {
        newGrid[idx] = i < 14 ? 'diamond_ore' : (i < 17 ? 'gold_ore' : 'wood');
      }
    }
    const guardR = 19;
    const guardC = 16;
    for (let g = -3; g <= 3; g++) {
      const idx = (guardR + g) * cols + (guardC - g);
      if (idx >= 0 && idx < BUILDING_GRID_TOTAL) {
        newGrid[idx] = 'iron_ore';
      }
    }
  } else if (presetId === 'castle') {
    for (let r = 18; r <= 32; r++) {
      for (let c = 2; c <= 22; c++) {
        const idx = r * cols + c;
        if (r >= 26 && c >= 10 && c <= 14) continue;
        newGrid[idx] = (r === 18 || c === 2 || c === 22) ? 'obsidian' : 'stone';
      }
    }
    for (let c = 2; c <= 22; c += 2) {
      newGrid[17 * cols + c] = 'stone';
    }
    for (let r = 10; r <= 17; r++) {
      for (let c = 1; c <= 4; c++) newGrid[r * cols + c] = 'obsidian';
      for (let c = 20; c <= 23; c++) newGrid[r * cols + c] = 'obsidian';
    }
    [1, 3, 20, 22].forEach(c => {
      newGrid[9 * cols + c] = 'gold_ore';
    });
    newGrid[22 * cols + 7] = 'gold_ore';
    newGrid[22 * cols + 17] = 'gold_ore';
  } else if (presetId === 'star') {
    const centerR = 18;
    const centerC = 12;
    for (let dr = -7; dr <= 7; dr++) {
      for (let dc = -7; dc <= 7; dc++) {
        const dist = Math.abs(dr) + Math.abs(dc);
        if (dist <= 7 && (Math.abs(dr) === 0 || Math.abs(dc) === 0 || Math.abs(dr) === Math.abs(dc))) {
          const idx = (centerR + dr) * cols + (centerC + dc);
          if (idx >= 0 && idx < BUILDING_GRID_TOTAL) {
            newGrid[idx] = dist <= 2 ? 'diamond_ore' : (dist <= 4 ? 'gold_ore' : 'glowstone');
          }
        }
      }
    }
  }

  return newGrid;
}

/**
 * Calculates the exact material counts required to build a preset
 */
export function getPresetMaterialRequirements(presetId: string): Record<string, number> {
  const grid = generatePresetGrid(presetId);
  const requirements: Record<string, number> = {};
  for (const block of grid) {
    if (block) {
      requirements[block] = (requirements[block] || 0) + 1;
    }
  }
  return requirements;
}
