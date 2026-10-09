import React from 'react';
import { BuildingLotId } from '../data/buildingLots';

export type LotStage = 'empty' | 'building' | 'done';

/** 依已放置的方塊數決定施工進度:0 = 空地、1~49 = 施工中、50+ = 完工 */
export const getLotStage = (placed: number): LotStage => {
  if (placed <= 0) return 'empty';
  if (placed < 50) return 'building';
  return 'done';
};

interface LotIllustrationProps {
  lotId: BuildingLotId;
  stage?: LotStage;
  className?: string;
}

const GROUND_FILL: Record<BuildingLotId, string> = {
  cabin: '#3f7d2c',
  castle: '#4b5563',
  lighthouse: '#0369a1',
  windmill: '#a3a23a',
  temple: '#57534e'
};

const Cabin = () => (
  <g>
    {/* 煙囪與煙 */}
    <rect x="78" y="20" width="9" height="20" fill="#78716c" stroke="#292524" strokeWidth="1.5" />
    <circle cx="82" cy="14" r="4" fill="#e7e5e4" opacity="0.7">
      <animate attributeName="cy" values="16;4" dur="3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.7;0" dur="3s" repeatCount="indefinite" />
    </circle>
    <circle cx="86" cy="18" r="3" fill="#e7e5e4" opacity="0.6">
      <animate attributeName="cy" values="18;6" dur="4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0" dur="4s" repeatCount="indefinite" />
    </circle>
    {/* 牆 */}
    <rect x="28" y="48" width="64" height="40" fill="#a16207" stroke="#451a03" strokeWidth="2" />
    {[56, 64, 72, 80].map(y => (
      <line key={y} x1="28" y1={y} x2="92" y2={y} stroke="#78350f" strokeWidth="1" />
    ))}
    {/* 屋頂 */}
    <polygon points="18,52 60,16 102,52" fill="#b91c1c" stroke="#450a0a" strokeWidth="2" />
    <polygon points="30,52 60,26 90,52" fill="#dc2626" opacity="0.5" />
    {/* 門窗 */}
    <rect x="52" y="64" width="16" height="24" fill="#451a03" stroke="#1c0a02" strokeWidth="1.5" />
    <circle cx="65" cy="77" r="1.4" fill="#fbbf24" />
    <rect x="34" y="58" width="12" height="12" fill="#7dd3fc" stroke="#451a03" strokeWidth="2" />
    <rect x="74" y="58" width="12" height="12" fill="#7dd3fc" stroke="#451a03" strokeWidth="2" />
    <line x1="40" y1="58" x2="40" y2="70" stroke="#451a03" strokeWidth="1" />
    <line x1="80" y1="58" x2="80" y2="70" stroke="#451a03" strokeWidth="1" />
    {/* 小樹 */}
    <rect x="104" y="76" width="4" height="12" fill="#78350f" />
    <circle cx="106" cy="72" r="9" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
  </g>
);

const Castle = () => (
  <g>
    {/* 主牆 */}
    <rect x="26" y="44" width="68" height="44" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    {[52, 60, 68, 76].map(y => (
      <line key={y} x1="26" y1={y} x2="94" y2={y} stroke="#64748b" strokeWidth="1" />
    ))}
    {/* 主牆垛口 */}
    {[26, 40, 54, 68, 82].map(x => (
      <rect key={x} x={x} y="38" width="8" height="7" fill="#94a3b8" stroke="#1e293b" strokeWidth="1.5" />
    ))}
    {/* 兩座塔 */}
    {[12, 84].map(x => (
      <g key={x}>
        <rect x={x} y="26" width="24" height="62" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
        {[0, 8, 16].map(dx => (
          <rect key={dx} x={x + dx} y="19" width="8" height="8" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.5" />
        ))}
        <rect x={x + 9} y="38" width="6" height="12" fill="#1e293b" />
        <rect x={x + 9} y="60" width="6" height="12" fill="#1e293b" />
      </g>
    ))}
    {/* 城門 */}
    <path d="M50 88 L50 68 Q60 56 70 68 L70 88 Z" fill="#422006" stroke="#1c0a02" strokeWidth="2" />
    <line x1="60" y1="62" x2="60" y2="88" stroke="#78350f" strokeWidth="1.5" />
    {/* 旗幟 */}
    <line x1="60" y1="44" x2="60" y2="22" stroke="#292524" strokeWidth="2" />
    <polygon points="60,22 78,27 60,32" fill="#dc2626" stroke="#450a0a" strokeWidth="1">
      <animate attributeName="points" values="60,22 78,27 60,32;60,22 76,25 60,32;60,22 78,27 60,32" dur="2s" repeatCount="indefinite" />
    </polygon>
  </g>
);

const Lighthouse = () => (
  <g>
    {/* 岩石基座 */}
    <polygon points="22,92 34,82 86,82 100,92" fill="#78716c" stroke="#292524" strokeWidth="2" />
    {/* 光束 */}
    <polygon points="60,22 0,8 0,36" fill="#fde047" opacity="0.28">
      <animate attributeName="opacity" values="0.28;0.05;0.28" dur="3s" repeatCount="indefinite" />
    </polygon>
    <polygon points="60,22 120,8 120,36" fill="#fde047" opacity="0.05">
      <animate attributeName="opacity" values="0.05;0.28;0.05" dur="3s" repeatCount="indefinite" />
    </polygon>
    {/* 紅白條紋塔身 */}
    <polygon points="44,34 76,34 78,46.5 42,46.5" fill="#ef4444" />
    <polygon points="42,46.5 78,46.5 80,59 40,59" fill="#f8fafc" />
    <polygon points="40,59 80,59 82,71.5 38,71.5" fill="#ef4444" />
    <polygon points="38,71.5 82,71.5 84,84 36,84" fill="#f8fafc" />
    <polygon points="44,34 76,34 84,84 36,84" fill="none" stroke="#1e293b" strokeWidth="2" />
    {/* 平台與燈室 */}
    <rect x="42" y="31" width="36" height="4" fill="#334155" />
    <rect x="48" y="20" width="24" height="12" fill="#fde047" stroke="#1e293b" strokeWidth="2" />
    <line x1="60" y1="20" x2="60" y2="32" stroke="#a16207" strokeWidth="1.5" />
    <polygon points="45,20 60,8 75,20" fill="#7f1d1d" stroke="#1e293b" strokeWidth="2" />
    <circle cx="60" cy="6" r="2.5" fill="#fbbf24" />
    {/* 門與窗 */}
    <rect x="55" y="70" width="10" height="14" fill="#422006" stroke="#1c0a02" strokeWidth="1.5" />
    <circle cx="60" cy="53" r="3.5" fill="#7dd3fc" stroke="#1e293b" strokeWidth="1.5" />
    {/* 海浪 */}
    <path d="M0 90 Q10 84 20 90 T40 90 T60 90 T80 90 T100 90 T120 90" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.8">
      <animate attributeName="d" dur="3s" repeatCount="indefinite"
        values="M0 90 Q10 84 20 90 T40 90 T60 90 T80 90 T100 90 T120 90;M0 90 Q10 96 20 90 T40 90 T60 90 T80 90 T100 90 T120 90;M0 90 Q10 84 20 90 T40 90 T60 90 T80 90 T100 90 T120 90" />
    </path>
  </g>
);

const Windmill = () => {
  const blade = (rot: number) => (
    <g key={rot} transform={`rotate(${rot})`}>
      <rect x="-2.5" y="-36" width="5" height="36" fill="#78350f" stroke="#451a03" strokeWidth="1" />
      <rect x="2.5" y="-35" width="13" height="20" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />
      <line x1="2.5" y1="-28" x2="15.5" y2="-28" stroke="#78350f" strokeWidth="1" />
      <line x1="2.5" y1="-21" x2="15.5" y2="-21" stroke="#78350f" strokeWidth="1" />
    </g>
  );
  return (
    <g>
      {/* 塔身 */}
      <polygon points="40,46 80,46 87,88 33,88" fill="#d6b88a" stroke="#78350f" strokeWidth="2" />
      {[56, 66, 76].map(y => (
        <line key={y} x1={40 - (y - 46) * 0.16} y1={y} x2={80 + (y - 46) * 0.16} y2={y} stroke="#a16207" strokeWidth="1" />
      ))}
      {/* 屋頂 */}
      <polygon points="35,48 60,26 85,48" fill="#92400e" stroke="#451a03" strokeWidth="2" />
      {/* 門窗 */}
      <rect x="54" y="68" width="12" height="20" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
      <circle cx="60" cy="58" r="5" fill="#7dd3fc" stroke="#451a03" strokeWidth="1.5" />
      {/* 旋轉風扇 */}
      <g transform="translate(60 40)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="14s" repeatCount="indefinite" />
          {[0, 90, 180, 270].map(blade)}
        </g>
        <circle r="4" fill="#451a03" />
      </g>
      {/* 麥穗 */}
      {[8, 16, 24, 98, 106, 114].map(x => (
        <g key={x}>
          <line x1={x} y1="88" x2={x} y2="76" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx={x} cy="75" rx="2" ry="4" fill="#facc15" />
        </g>
      ))}
    </g>
  );
};

const Temple = () => (
  <g>
    {/* 台基 */}
    <rect x="12" y="86" width="96" height="6" fill="#78716c" stroke="#292524" strokeWidth="1.5" />
    <rect x="18" y="82" width="84" height="5" fill="#a8a29e" stroke="#292524" strokeWidth="1.5" />
    {/* 第一層 */}
    <rect x="30" y="66" width="60" height="16" fill="#b91c1c" stroke="#450a0a" strokeWidth="2" />
    {[36, 48, 72, 84].map(x => (
      <rect key={x} x={x - 1.5} y="66" width="3" height="16" fill="#7f1d1d" />
    ))}
    <rect x="54" y="68" width="12" height="14" fill="#451a03" stroke="#1c0a02" strokeWidth="1.5" />
    <path d="M8 68 Q30 64 40 56 L80 56 Q90 64 112 68 Z" fill="#1e293b" stroke="#020617" strokeWidth="2" />
    {/* 第二層 */}
    <rect x="44" y="44" width="32" height="12" fill="#b91c1c" stroke="#450a0a" strokeWidth="2" />
    <rect x="52" y="47" width="5" height="7" fill="#fbbf24" />
    <rect x="63" y="47" width="5" height="7" fill="#fbbf24" />
    <path d="M24 46 Q40 44 48 36 L72 36 Q80 44 96 46 Z" fill="#1e293b" stroke="#020617" strokeWidth="2" />
    {/* 第三層 */}
    <rect x="50" y="27" width="20" height="9" fill="#b91c1c" stroke="#450a0a" strokeWidth="2" />
    <path d="M34 29 Q46 27 52 20 L68 20 Q74 27 86 29 Z" fill="#1e293b" stroke="#020617" strokeWidth="2" />
    {/* 金色塔尖 */}
    <rect x="58" y="8" width="4" height="12" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
    <circle cx="60" cy="7" r="3" fill="#fde047" stroke="#92400e" strokeWidth="1" />
    {/* 燈籠 */}
    {[16, 104].map(x => (
      <g key={x}>
        <line x1={x} y1="62" x2={x} y2="68" stroke="#292524" strokeWidth="1.5" />
        <ellipse cx={x} cy="73" rx="4" ry="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5">
          <animate attributeName="opacity" values="1;0.65;1" dur="2.4s" repeatCount="indefinite" />
        </ellipse>
      </g>
    ))}
  </g>
);

const DRAWINGS: Record<BuildingLotId, React.FC> = {
  cabin: Cabin,
  castle: Castle,
  lighthouse: Lighthouse,
  windmill: Windmill,
  temple: Temple
};

const Scaffold = () => (
  <g stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.9">
    <line x1="14" y1="10" x2="14" y2="90" />
    <line x1="106" y1="10" x2="106" y2="90" />
    {[28, 52, 76].map(y => (
      <line key={y} x1="14" y1={y} x2="106" y2={y} />
    ))}
    <line x1="14" y1="76" x2="106" y2="52" strokeWidth="1.2" />
    <line x1="14" y1="52" x2="106" y2="28" strokeWidth="1.2" />
  </g>
);

const Stakes = () => (
  <g>
    <rect x="18" y="30" width="84" height="58" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" />
    {[18, 102].map(x =>
      [30, 88].map(y => (
        <g key={`${x}-${y}`}>
          <rect x={x - 2} y={y - 8} width="4" height="12" fill="#92400e" />
          <rect x={x - 2} y={y - 8} width="4" height="3" fill="#fbbf24" />
        </g>
      ))
    )}
    <text x="60" y="62" textAnchor="middle" fontSize="11" fill="#fde68a" fontWeight="bold">
      🚧 空地
    </text>
  </g>
);

const Sparkles = () => (
  <g fill="#fde047">
    {[
      [14, 20, 0],
      [104, 26, 0.6],
      [96, 10, 1.2]
    ].map(([x, y, delay], i) => (
      <polygon
        key={i}
        points={`${x},${y - 5} ${x + 1.6},${y - 1.6} ${x + 5},${y} ${x + 1.6},${y + 1.6} ${x},${y + 5} ${x - 1.6},${y + 1.6} ${x - 5},${y} ${x - 1.6},${y - 1.6}`}
      >
        <animate attributeName="opacity" values="1;0.15;1" dur="1.8s" begin={`${delay}s`} repeatCount="indefinite" />
      </polygon>
    ))}
  </g>
);

export const LotIllustration: React.FC<LotIllustrationProps> = ({ lotId, stage = 'done', className }) => {
  const Drawing = DRAWINGS[lotId];
  const opacity = stage === 'empty' ? 0.16 : stage === 'building' ? 0.72 : 1;

  return (
    <svg viewBox="0 0 120 100" className={className} role="img" aria-label={lotId} preserveAspectRatio="xMidYMax meet">
      {/* 地面 */}
      <rect x="0" y="88" width="120" height="12" fill={GROUND_FILL[lotId]} />
      <g opacity={opacity}>
        <Drawing />
      </g>
      {stage === 'empty' && <Stakes />}
      {stage === 'building' && <Scaffold />}
      {stage === 'done' && <Sparkles />}
    </svg>
  );
};
