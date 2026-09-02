import { useGameStore } from '../store/gameStore';
import {
  GOOD_COMBOS, BAD_COMBOS, FOOD_LIBRARY, THRESHOLD_RULES,
  type GoodCombo, type BadCombo
} from '../data/nutritionModels';
import { useState, useEffect } from 'react';

import Leaf0 from '../assets/plant-leaf-garden-0.svg';
import Leaf21 from '../assets/plant-leaf-garden-21.svg';
import Clover from '../assets/plant-leaf-garden-clover.svg';

const GOLD = '#D4AF37';

// Mapping limit IDs to representative food illustrations
const LIMIT_ILLUSTRATIONS: Record<string, string> = {
  'heavy-breakfast': 'croissant',
  'heavy-lunch': 'pork',
  'fat-dinner': 'beef',
  'heavy-snack': 'cake',
  'monotonous-meal': 'parmesan',
  'starvation-meal': 'apple',
  'carnivore-plate': 'chicken',
  'empty-carbs': 'pasta',
};

// Mapping limit IDs to large center text (string or array for crossed-out lists)
const LIMIT_BIG_TEXT: Record<string, string | string[]> = {
  'heavy-breakfast': '> 800 kcal',
  'heavy-lunch': '> 1000 kcal',
  'fat-dinner': '> 60g Fat',
  'heavy-snack': '> 200 kcal',
  'monotonous-meal': '2x Same Food',
  'starvation-meal': '< 200 kcal',
  'carnivore-plate': ['Veggies', 'Grains', 'Fruits'],
  'empty-carbs': ['Protein', 'Dairy', 'Nuts/Legumes'],
};

interface NutritionGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Main Component ────────────────────────────────────────────────
export function NutritionGuide({ isOpen, onClose }: NutritionGuideProps) {
  const { discoveredCombos } = useGameStore();
  const [page, setPage] = useState<'good' | 'bad' | 'limits'>('good');
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);
  const [limitsPage, setLimitsPage] = useState(0); // 0 = Excess, 1 = Imbalance

  // Keyboard listener for Limits carousel
  useEffect(() => {
    if (!isOpen || page !== 'limits') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLimitsPage(p => Math.min(p + 1, 1));
      if (e.key === 'ArrowLeft') setLimitsPage(p => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, page]);

  if (!isOpen) return null;

  const totalCombos = GOOD_COMBOS.length + BAD_COMBOS.length;
  const discoveredCount = discoveredCombos.filter(id =>
    [...GOOD_COMBOS, ...BAD_COMBOS].some(c => c.id === id)
  ).length;

  const activeCombos = page === 'good' ? GOOD_COMBOS : BAD_COMBOS;
  const selectedCombo = activeCombos.find(c => c.id === selectedComboId);

  const isGood = page === 'good';
  const isLimits = page === 'limits';
  const accentColor = isLimits ? 'var(--accent-orange)' : isGood ? 'var(--accent-green)' : 'var(--feedback-bad-text)';

  const leafSrc = isLimits ? Clover : isGood ? Leaf0 : Leaf21;

  const leafStyle: React.CSSProperties = {
    position: 'absolute', width: '120px', height: 'auto',
    opacity: 0.05, pointerEvents: 'none',
    filter: 'brightness(0) saturate(100%) invert(74%) sepia(21%) saturate(580%) hue-rotate(10deg) brightness(92%)',
    zIndex: 0,
  };

  const handleTabChange = (newPage: 'good' | 'bad' | 'limits') => {
    setPage(newPage);
    setSelectedComboId(null);
    setLimitsPage(0); // Reset carousel when switching tabs
  };

  const hideScrollStyle: React.CSSProperties = {
    overflowY: 'auto', overflowX: 'hidden',
    scrollbarWidth: 'none' as any,
    msOverflowStyle: 'none' as any,
  };

  // ─── Combo Card ────────────────────────────────────────────────
  const renderComboCard = (combo: GoodCombo | BadCombo) => {
    const isDiscovered = discoveredCombos.includes(combo.id);
    const isSelected = selectedComboId === combo.id;
    const coinAmount = isGood ? (combo as GoodCombo).coinsBonus : (combo as BadCombo).coinsPenalty;
    const coinVal = isGood ? `+${coinAmount}` : `-${coinAmount}`;

    return (
      <button
        key={combo.id}
        onClick={() => isDiscovered && setSelectedComboId(combo.id)}
        className="p-2.5 flex items-center gap-2 transition-all text-left relative"
        style={{
          backgroundColor: isSelected ? 'var(--bg-feedback)' : 'var(--bg-dark)',
          border: '1px solid var(--border-light)',
          borderRadius: '15px 4px 15px 4px',
          opacity: isDiscovered ? 1 : 0.5,
          cursor: isDiscovered ? 'pointer' : 'default',
        }}
        onMouseEnter={e => { if (isDiscovered) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
      >
        <span className="text-sm font-bold shrink-0 w-5 h-5 flex items-center justify-center rounded-full" style={{ backgroundColor: isGood ? 'var(--feedback-good-bg)' : 'var(--feedback-bad-bg)', color: accentColor }}>
          {isDiscovered ? (isGood ? '✓' : '⚠') : '?'}
        </span>
        <span className="text-xs font-bold truncate flex-1" style={{ color: isDiscovered ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {isDiscovered ? combo.shortLabel : 'Undiscovered'}
        </span>
        {isDiscovered && (
          <span className="text-xs font-bold shrink-0" style={{ color: accentColor }}>
            {coinVal} 💰
          </span>
        )}
      </button>
    );
  };

  // ─── Limit Card (Carousel Frame with Illustration & Big Text) ─
  const renderLimitCard = (rule: typeof THRESHOLD_RULES[0]) => {
    const illustrationId = LIMIT_ILLUSTRATIONS[rule.id] || 'water';
    const bigContent = LIMIT_BIG_TEXT[rule.id] || '';
    
    return (
      <div key={rule.id} className="p-4 flex flex-col gap-2 h-full relative overflow-hidden" style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)', borderRadius: '15px 4px 15px 4px' }}>
        
        {/* Background Watermark Illustration */}
        <img 
          src={`/food/${illustrationId}.svg`} 
          alt="illustration" 
          className="absolute pointer-events-none"
          style={{ 
            width: '140px', height: '140px', 
            bottom: '-25px', right: '-25px', 
            opacity: 0.06, 
            filter: 'grayscale(100%) brightness(0.8)' 
          }} 
        />

        {/* Top Row: Label & Penalty */}
        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: rule.type === 'max' ? 'var(--feedback-bad-text)' : 'var(--accent-orange)' }}></span>
            <span className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>{rule.label}</span>
          </div>
          <span className="text-xs font-bold shrink-0" style={{ color: 'var(--feedback-bad-text)' }}>-{rule.penalty} 💰</span>
        </div>
        
        {/* Center Big Text / Crossed List */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-2 gap-1">
          {Array.isArray(bigContent) ? (
            bigContent.map((text, i) => (
              <span key={i} className="text-lg font-bold tracking-wide line-through" style={{ color: 'var(--text-secondary)', fontFamily: "'Fraunces', serif", opacity: 0.8 }}>
                {text}
              </span>
            ))
          ) : (
            <span className="text-2xl font-bold tracking-wide" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif", opacity: 0.9 }}>
              {bigContent}
            </span>
          )}
        </div>

        {/* Bottom Explanation */}
        <p className="text-xs leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>{rule.explanation}</p>
      </div>
    );
  };

  // ─── Circle basket ─────────────────────────────────────────────
  const renderCircleBasket = (items: string[], radius = 65, centerLabel?: string) => {
    const n = items.length;

    if (n <= 2) {
      const smallRadius = 30;
      const containerSize = smallRadius * 2 + 44;
      const center = containerSize / 2;

      return (
        <div style={{ position: 'relative', width: containerSize, height: containerSize, margin: '0 auto' }}>
          <div style={{
            position: 'absolute', top: 22, left: 22,
            width: smallRadius * 2, height: smallRadius * 2,
            borderRadius: '50%',
            backgroundColor: 'var(--bg-interactive)',
            border: '1px solid var(--border-light)',
            opacity: 0.5,
          }} />
          {items.map((foodId, i) => {
            const food = FOOD_LIBRARY.find(f => f.id === foodId);
            if (!food) return null;
            const angle = n === 1 ? -Math.PI / 2 : (i === 0 ? 0 : Math.PI);
            const x = center + smallRadius * Math.cos(angle);
            const y = center + smallRadius * Math.sin(angle);
            return (
              <img key={foodId} src={`/food/${food.id}.svg`} alt={food.shortName} className="absolute" style={{ left: x, top: y, width: '24px', height: '24px', transform: 'translate(-50%, -50%)', zIndex: 2 }} />
            );
          })}
        </div>
      );
    }

    const containerSize = radius * 2 + 44;
    const center = containerSize / 2;

    return (
      <div style={{ position: 'relative', width: containerSize, height: containerSize, margin: '0 auto' }}>
        <div style={{
          position: 'absolute', top: 22, left: 22,
          width: radius * 2, height: radius * 2,
          borderRadius: '50%',
          backgroundColor: 'var(--bg-interactive)',
          border: '1px solid var(--border-light)',
          opacity: 0.5,
        }} />
        {items.map((foodId, i) => {
          const food = FOOD_LIBRARY.find(f => f.id === foodId);
          if (!food) return null;
          const angle = (2 * Math.PI * i / n) - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <img key={foodId} src={`/food/${food.id}.svg`} alt={food.shortName} className="absolute" style={{ left: x, top: y, width: '24px', height: '24px', transform: 'translate(-50%, -50%)', zIndex: 2 }} />
          );
        })}
        {centerLabel && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', maxWidth: radius * 1.4,
            zIndex: 1,
          }}>
            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>
              {centerLabel}
            </span>
          </div>
        )}
      </div>
    );
  };

  // ─── Limits Data ───────────────────────────────────────────────
  const maxLimits = THRESHOLD_RULES.filter(r => r.type === 'max');
  const minLimits = THRESHOLD_RULES.filter(r => r.type === 'min');
  const currentLimits = limitsPage === 0 ? maxLimits : minLimits;

  return (
    <>
      <style>{`.codex-scroll::-webkit-scrollbar { display: none; }`}</style>

      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(20, 18, 15, 0.85)' }} onClick={onClose}>
        <div
          className="relative w-[80vw] max-w-5xl h-[90vh] max-h-[800px] flex flex-col shadow-2xl"
          style={{ backgroundColor: 'var(--bg-interactive)', border: '1px solid var(--border-light)', borderRadius: '15px 4px 15px 4px', fontFamily: "'Nunito', sans-serif" }}
          onClick={e => e.stopPropagation()}
        >
          {/* ═══ HEADER ═══ */}
          <div className="flex items-center justify-between p-4 shrink-0" style={{ borderBottom: '1px solid var(--border-light)' }}>
            <h2 className="text-xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>
              The Dietary Codex
              {!isLimits && (
                <span className="text-xs font-bold px-2.5 py-1" style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-secondary)', borderRadius: '12px 4px 12px 4px' }}>
                  {discoveredCount} / {totalCombos}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              {([
                { key: 'good' as const, label: 'Synergies', color: 'var(--accent-green)' },
                { key: 'bad' as const, label: 'Antagonists', color: 'var(--feedback-bad-text)' },
                { key: 'limits' as const, label: 'Limits', color: 'var(--accent-orange)' },
              ]).map(tab => (
                <button key={tab.key} onClick={() => handleTabChange(tab.key)} className="px-4 py-1.5 text-xs font-bold transition-all"
                  style={{ 
                    backgroundColor: page === tab.key ? 'var(--bg-dark)' : 'transparent', 
                    color: page === tab.key ? tab.color : 'var(--text-secondary)', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: '12px 4px 12px 4px' 
                  }}
                >{tab.label}</button>
              ))}
              <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center text-sm font-bold transition-all ml-2"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                onMouseEnter={e => { e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >✕</button>
            </div>
          </div>

          {/* ═══ CONTENT ═══ */}
          <div className="flex-1 relative overflow-hidden min-h-0">
            <img src={leafSrc} style={{ ...leafStyle, top: '12px', right: '12px', transform: 'scale(-1, 1)' }} alt="" />
            <img src={leafSrc} style={{ ...leafStyle, bottom: '12px', left: '12px', transform: 'scale(1, -1)' }} alt="" />

            {isLimits ? (
              <div className="h-full flex flex-col p-4" style={{ position: 'relative', zIndex: 1 }}>
                {/* Title & Arrows */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button 
                    onClick={() => setLimitsPage(p => Math.max(p - 1, 0))} 
                    disabled={limitsPage === 0}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{ 
                      backgroundColor: 'var(--bg-dark)', 
                      border: '1px solid var(--border-light)', 
                      color: limitsPage === 0 ? 'var(--text-secondary)' : 'var(--accent-orange)', 
                      opacity: limitsPage === 0 ? 0.3 : 1, 
                      cursor: limitsPage === 0 ? 'default' : 'pointer' 
                    }}
                  >←</button>

                  <h4 className="text-base font-bold uppercase tracking-wide flex items-center gap-2" style={{ color: limitsPage === 0 ? 'var(--feedback-bad-text)' : 'var(--accent-orange)', fontFamily: "'Fraunces', serif" }}>
                    {limitsPage === 0 ? '⚠ Excess' : '⚖ Imbalance'}
                  </h4>

                  <button 
                    onClick={() => setLimitsPage(p => Math.min(p + 1, 1))} 
                    disabled={limitsPage === 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                    style={{ 
                      backgroundColor: 'var(--bg-dark)', 
                      border: '1px solid var(--border-light)', 
                      color: limitsPage === 1 ? 'var(--text-secondary)' : 'var(--accent-orange)', 
                      opacity: limitsPage === 1 ? 0.3 : 1, 
                      cursor: limitsPage === 1 ? 'default' : 'pointer' 
                    }}
                  >→</button>
                </div>

                {/* 4-Column Grid Frames */}
                <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
                  {currentLimits.map(rule => renderLimitCard(rule))}
                </div>
              </div>
            ) : (
              <div className="h-full grid grid-cols-[3fr_2fr] gap-3 p-3 min-h-0" style={{ position: 'relative', zIndex: 1 }}>
                {/* LEFT: Combo list */}
                <div className="overflow-y-auto pr-2 min-h-0 codex-scroll" style={hideScrollStyle}>
                  <div className="grid grid-cols-2 gap-1.5">
                    {activeCombos.map(combo => renderComboCard(combo))}
                  </div>
                </div>

                {/* RIGHT: Detail panel */}
                <div className="min-h-0 relative" style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)', borderRadius: '15px 4px 15px 4px', overflow: 'hidden' }}>
                  <div className="p-3 h-full codex-scroll" style={{ ...hideScrollStyle, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
                    {selectedCombo ? (
                      <div className="flex flex-col min-h-full">
                        {/* Title */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0" style={{ backgroundColor: isGood ? 'var(--feedback-good-bg)' : 'var(--feedback-bad-bg)', color: accentColor }}>{isGood ? '✓' : '⚠'}</span>
                          <h3 className="text-lg font-bold" style={{ color: accentColor, fontFamily: "'Fraunces', serif" }}>
                            {selectedCombo.shortLabel}
                          </h3>
                        </div>

                        {/* Explanation */}
                        <p className="text-xs mb-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                          {selectedCombo.explanation}
                        </p>

                        {/* ── Food groups ── */}
                        <div className="pb-4 flex-1 flex flex-col items-center justify-center" style={{ borderTop: '1px solid var(--border-light)' }}>                          
                          {selectedCombo.requiredGroups.length > 1 ? (
                          (() => {
                            const g1 = selectedCombo.requiredGroups[0];
                            const g2 = selectedCombo.requiredGroups[1];
                            const g1LabelAbove = g1.length === 2 ? 'Group 1' : undefined;
                            const g1LabelInside = g1.length >= 3 ? 'Group 1' : undefined;
                            const g2LabelAbove = g2.length === 2 ? 'Group 2' : undefined;
                            const g2LabelInside = g2.length >= 3 ? 'Group 2' : undefined;

                            return (
                              <div className="flex items-center justify-center gap-3 pt-3">
                                <div className="text-center">
                                  {g1LabelAbove && (
                                    <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>{g1LabelAbove}</p>
                                  )}
                                  {renderCircleBasket(g1, 50, g1LabelInside)}
                                  <p className="text-[12px] leading-tight mt-1" style={{ color: 'var(--text-secondary)', maxWidth: 150, margin: '4px auto 0' }}>
                                    {g1.map(id => FOOD_LIBRARY.find(f => f.id === id)?.shortName).filter(Boolean).join(' · ')}
                                  </p>
                                </div>
                                <span className="text-lg font-bold" style={{ color: accentColor }}>+</span>
                                <div className="text-center">
                                  {g2LabelAbove && (
                                    <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>{g2LabelAbove}</p>
                                  )}
                                  {renderCircleBasket(g2, 50, g2LabelInside)}
                                  <p className="text-[12px] leading-tight mt-1" style={{ color: 'var(--text-secondary)', maxWidth: 150, margin: '4px auto 0' }}>
                                    {g2.map(id => FOOD_LIBRARY.find(f => f.id === id)?.shortName).filter(Boolean).join(' · ')}
                                  </p>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-center pt-3">
                            {selectedCombo.requiredGroups[0].length === 2 && (
                              <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>Pick 2+</p>
                            )}
                            {renderCircleBasket(selectedCombo.requiredGroups[0], 65, selectedCombo.requiredGroups[0].length >= 3 ? 'Pick 2+' : undefined)}
                            <p className="text-[12px] leading-tight mt-1" style={{ color: 'var(--text-secondary)', maxWidth: 160, margin: '4px auto 0' }}>
                              {selectedCombo.requiredGroups[0].map(id => FOOD_LIBRARY.find(f => f.id === id)?.shortName).filter(Boolean).join(' · ')}
                            </p>
                          </div>
                        )}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center p-4">
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {discoveredCount === 0 ? "Start combining foods to discover synergies and antagonists!" : "Select a discovered combo from the left to read its effects."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}