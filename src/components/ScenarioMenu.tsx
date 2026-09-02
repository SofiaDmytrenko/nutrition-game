import { SCENARIOS, type Scenario, type CoinBreakdown, FOOD_LIBRARY } from '../data/nutritionModels';
import { useGameStore } from '../store/gameStore';
import { Fragment, useState } from 'react';
import { NutritionGuide } from './NutritionGuide';

// ─── Import your downloaded SVG files ─────────────────────────────
import Leaf0 from '../assets/plant-leaf-garden-0.svg';
import Leaf11 from '../assets/plant-leaf-garden-10.svg';
import Leaf12 from '../assets/plant-leaf-garden-11.svg';
import Leaf21 from '../assets/plant-leaf-garden-21.svg';
import Clover from '../assets/plant-leaf-garden-clover.svg';

const TIER_INFO: Record<number, { name: string }> = {
  1: { name: 'I. Basics' },
  2: { name: 'II. Vitamins & Minerals' },
  3: { name: 'III. Micro Interactions' },
  4: { name: 'IV. Meal Mechanics' },
  5: { name: 'V. Lifestyles' },
  6: { name: 'VI. Two-Meal Mastery' },
  7: { name: 'VII. Master Challenges' },
};

const SLOTS = 3;
const PATH_MAX_WIDTH = 900;

// ─── Clover Trail Component for Path Connections ──────────────────
const rotations = [15, -30, 45, -60, 75, -90, 105, -120, 135, -150, 165, 180];

const cloverStyle: React.CSSProperties = {
  width: '28px',
  filter: 'brightness(0) saturate(100%) invert(74%) sepia(21%) saturate(580%) hue-rotate(10deg) brightness(80%)',
  opacity: 0.8,
};

interface PathNodeProps {
  scenario: Scenario;
  isUnlocked: boolean;
  isCompleted: boolean;
  breakdown?: CoinBreakdown;
  onSelect: (id: string) => void;
  onHoverBreakdown: (id: string | null) => void;
}

function PathNode({ scenario, isUnlocked, isCompleted, breakdown, onSelect, onHoverBreakdown }: PathNodeProps) {
  const totalEarned = breakdown?.total ?? 0;
  const goldColor = '#D4AF37';

  return (
    <div style={{ flex: '1 1 0', minWidth: 0, position: 'relative' }}>
      {/* Organic Double Border Element */}
      {isUnlocked && (
        <div style={{
          position: 'absolute',
          inset: '-3px',
          border: `1px solid ${isCompleted ? 'var(--accent-green)' : goldColor}`,
          borderRadius: '18px 6px 14px 5px',
          transform: 'rotate(-0.8deg)',
          pointerEvents: 'none',
          opacity: 0.6,
          zIndex: 0,
        }} />
      )}

      <button
        onClick={() => isUnlocked && onSelect(scenario.id)}
        disabled={!isUnlocked}
        style={{
          backgroundColor: isCompleted ? 'var(--feedback-good-bg)' : isUnlocked ? 'var(--bg-interactive)' : 'var(--bg-dark)',
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: isCompleted ? 'var(--accent-green)' : isUnlocked ? goldColor : 'var(--text-secondary)',
          borderRadius: '15px 4px 15px 4px',
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
          opacity: isUnlocked || isCompleted ? 1 : 0.5,
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
        className="p-2 text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-1.5">
          <h3 className="font-semibold text-sm flex-1 line-clamp-2 leading-snug pb-1"
            style={{ color: isCompleted ? 'var(--feedback-good-text)' : 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>
            {scenario.title}
          </h3>
          <span className="text-sm shrink-0 font-bold">
            {isCompleted ? '✓' : !isUnlocked ? '🔒' : ''}
          </span>
        </div>

        <div className="flex items-center justify-end mt-1">
          <span className="text-sm font-semibold"
            style={{ color: isCompleted ? 'var(--feedback-good-text)' : goldColor, fontFamily: "'Nunito', sans-serif" }}>
            💰 {isCompleted ? `${totalEarned}/${scenario.coinsReward}` : scenario.coinsReward}
          </span>

          {/* Hover target for Sidebar Breakdown */}
          {isCompleted && breakdown && (
            <button
              type="button"
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ml-2"
              style={{
                backgroundColor: 'var(--bg-dark)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                border: '1px solid var(--border-light)',
              }}
              onMouseEnter={(e) => {
                onHoverBreakdown(scenario.id);
                e.currentTarget.style.backgroundColor = 'var(--feedback-warn-bg)';
                e.currentTarget.style.color = 'var(--feedback-warn-text)';
                e.currentTarget.style.borderColor = 'var(--accent-cream)';
              }}
              onMouseLeave={(e) => {
                onHoverBreakdown(null);
                e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              ?
            </button>
          )}
        </div>
      </button>
    </div>
  );
}

// ─── Spacer ───────────────────────────────────────────────────────
function Spacer() {
  return <div style={{ width: 240, minHeight: 60 }} />;
}

// ─── ScenarioMenu ──────────────────────────────────────────────────
interface ScenarioMenuProps {
  onSelectScenario: (id: string) => void;
}

export function ScenarioMenu({ onSelectScenario }: ScenarioMenuProps) {
  const { completedScenarios, earnedCoins, character, selectedTier, setSelectedTier } = useGameStore();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [hoveredBreakdownId, setHoveredBreakdownId] = useState<string | null>(null);

  const canUnlock = (scenario: Scenario): boolean => true; // TESTING

  const tierScenarios = SCENARIOS.filter(s => s.tier === selectedTier);

  // Data for the sidebar overlay
  const activeBreakdownScenario = hoveredBreakdownId ? SCENARIOS.find(s => s.id === hoveredBreakdownId) : null;
  const activeBreakdownData = hoveredBreakdownId ? earnedCoins[hoveredBreakdownId] : null;

  const rows: Scenario[][] = [];
  for (let i = 0; i < tierScenarios.length; i += SLOTS) {
    rows.push(tierScenarios.slice(i, i + SLOTS));
  }

  const getSlots = (row: Scenario[], rowIndex: number): (Scenario | null)[] => {
    const isForward = rowIndex % 2 === 0;
    const slots: (Scenario | null)[] = Array(SLOTS).fill(null);
    if (isForward) {
      row.forEach((s, i) => slots[i] = s);
    } else {
      const reversed = [...row].reverse();
      const offset = SLOTS - row.length;
      reversed.forEach((s, i) => slots[offset + i] = s);
    }
    return slots;
  };

  // Shared style for the decorative background SVGs
  const leafStyle: React.CSSProperties = {
    position: 'absolute',
    width: '180px',
    height: 'auto',
    opacity: 0.1,
    pointerEvents: 'none',
    filter: 'brightness(0) saturate(100%) invert(74%) sepia(21%) saturate(580%) hue-rotate(10deg) brightness(92%)',
    zIndex: 0,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-dark)' }}>
      {/* ── Themed Topbar ── */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0 z-20"
        style={{ backgroundColor: 'var(--bg-interactive)', borderBottom: '2px solid var(--border-light)', boxShadow: '0 4px 6px -4px rgba(0,0,0,0.05)' }}>

        {/* Game Title */}
        <h1 className="text-2xl px-2" style={{
          color: 'var(--text-primary)',
          fontFamily: "'Fraunces', serif",
          fontWeight: 900,
        }}>
          The Culinary Monastery
        </h1>

        <div className="flex items-center gap-3">
          <div className="text-sm font-bold px-4 py-2 flex items-center gap-2"
            style={{ color: 'var(--feedback-warn-text)' }}>
            <span className="text-base">💰</span> {character.coins}
          </div>

          {/* Guide Button */}
          <button onClick={() => setIsGuideOpen(true)}
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 shadow-sm flex items-center gap-2"
            style={{ backgroundColor: 'var(--accent-orange)', color: 'white' }}>
            The Dietary Codex
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: '4fr 15fr' }}>
        {/* ── Sidebar (Widened, with Overlay Logic) ── */}
        <div className="flex flex-col p-3 gap-2 overflow-y-auto z-20 relative"
          style={{ backgroundColor: 'var(--bg-interactive)', borderRight: '1px solid var(--border-light)' }}>

          {/* Tier list (Fades out if breakdown is active) */}
          <div className={`absolute inset-0 p-3 flex flex-col gap-2 transition-opacity duration-300 ${hoveredBreakdownId ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            {[1, 2, 3, 4, 5, 6, 7].map(tier => {
              const info = TIER_INFO[tier];
              const isActive = selectedTier === tier;
              if (!SCENARIOS.some(s => s.tier === tier)) return null;
              return (
                <button key={tier} onClick={() => setSelectedTier(tier)}
                  className="text-sm py-2 px-2 rounded-lg font-semibold text-left transition-all whitespace-nowrap hover:translate-x-1"
                  style={{
                    fontFamily: "'Nunito', sans-serif",
                    backgroundColor: isActive ? 'var(--accent-orange)' : 'var(--bg-dark)',
                    color: isActive ? 'white' : 'var(--text-primary)',
                    borderWidth: 1,
                    borderColor: isActive ? 'var(--accent-orange)' : 'var(--border-light)',
                  }}>
                  {info.name}
                </button>
              );
            })}
          </div>

          {/* Breakdown Receipt */}
          {activeBreakdownScenario && activeBreakdownData && (
            <div className={`absolute inset-2 p-3 flex flex-col transition-all duration-300 z-10 ${hoveredBreakdownId ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              style={{
                backgroundColor: 'var(--bg-interactive)',
                border: '1px solid var(--border-light)', // Subtle border instead of gold
                borderRadius: '15px 4px 15px 4px', // Match Popover's organic shape
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              }}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--accent-orange)', fontFamily: "'Fraunces', serif" }}>
                {activeBreakdownScenario.title}
              </h4>

              <div className="space-y-1.5 flex-1 text-xs">
                {/* Base & Bonuses */}
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Base</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>+{activeBreakdownData.base}</span></div>
                {activeBreakdownData.variety > 0 && <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Variety</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>+{activeBreakdownData.variety}</span></div>}
                {activeBreakdownData.noHintBonus > 0 && <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>No-Hint</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>+{activeBreakdownData.noHintBonus}</span></div>}

                {/* Good Combos */}
                {activeBreakdownData.goodCombos.map((c, i) => (
                  <div key={`g-${i}`} className="flex justify-between"><span style={{ color: 'var(--accent-green)' }}>{c.label}</span><span className="font-bold" style={{ color: 'var(--accent-green)' }}>+{c.amount}</span></div>
                ))}

                {/* Bad Combos & Thresholds */}
                {activeBreakdownData.badCombos.map((c, i) => (
                  <div key={`b-${i}`} className="flex justify-between"><span style={{ color: 'var(--feedback-bad-text)' }}>{c.label}</span><span className="font-bold" style={{ color: 'var(--feedback-bad-text)' }}>-{c.amount}</span></div>
                ))}
                {activeBreakdownData.thresholds?.map((c, i) => (
                  <div key={`t-${i}`} className="flex justify-between"><span style={{ color: 'var(--feedback-bad-text)' }}>{c.label}</span><span className="font-bold" style={{ color: 'var(--feedback-bad-text)' }}>{c.amount}</span></div>
                ))}
              </div>

              {/* Total & Unlocked (Pinned to bottom) */}
              <div className="mt-auto pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Total Earned</span>
                  <span className="font-bold" style={{ color: 'var(--accent-rust)' }}>{activeBreakdownData.total} 💰</span>
                </div>

                {activeBreakdownScenario.unlocksFoods && activeBreakdownScenario.unlocksFoods.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold uppercase mb-1.5" style={{ color: 'var(--text-secondary)' }}>Unlocked</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {activeBreakdownScenario.unlocksFoods.map(fid => {
                        const food = FOOD_LIBRARY.find(f => f.id === fid);
                        return food ? (
                          <div key={fid} className="flex items-center gap-1.5 text-xs">
                            <img src={`/food/${food.id}.svg`} alt={food.shortName} className="w-4 h-4 object-contain" />
                            <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>{food.shortName}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── S-Path Content ── */}
        <div className="relative flex flex-col items-center justify-center py-4 px-4 overflow-hidden"
          style={{ backgroundColor: 'var(--bg-dark)' }}>

          {/* Decorative Corner leaves using your downloaded SVGs */}
          <img src={Leaf0} style={{ ...leafStyle, top: '10px', left: '10px' }} alt="decorative-leaf" />
          <img src={Leaf11} style={{ ...leafStyle, bottom: '10px', right: '10px', transform: 'scale(-1, -1)' }} alt="decorative-leaf" />
          <img src={Leaf12} style={{ ...leafStyle, top: '10px', right: '10px', transform: 'scale(-1, 1)' }} alt="decorative-leaf" />
          <img src={Leaf21} style={{ ...leafStyle, bottom: '10px', left: '10px', transform: 'scale(1, -1)' }} alt="decorative-leaf" />

          {/* Path Rows */}
          <div className="relative z-10 w-full flex flex-col items-center">
            {rows.map((row, rowIndex) => {
              const isForward = rowIndex % 2 === 0;
              const isLastRow = rowIndex === rows.length - 1;
              const slots = getSlots(row, rowIndex);

              const nonNullIndices = slots.map((s, i) => (s ? i : -1)).filter(i => i >= 0);
              const connectorSlotIdx = isForward ? nonNullIndices[nonNullIndices.length - 1] : nonNullIndices[0];

              return (
                <Fragment key={rowIndex}>
                  {/* ── Node row (Fixed narrow cards, wide gaps for 3 clovers) ── */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '240px 110px 240px 110px 240px',
                    width: '100%',
                    maxWidth: PATH_MAX_WIDTH,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Card 1 */}
                    {slots[0] ? <PathNode key={slots[0].id} scenario={slots[0]} isUnlocked={canUnlock(slots[0])} isCompleted={completedScenarios.includes(slots[0].id)} breakdown={earnedCoins[slots[0].id]} onSelect={onSelectScenario} onHoverBreakdown={setHoveredBreakdownId} /> : <Spacer />}

                    {/* Gap 1 (3 Clovers) */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      {slots[0] && slots[1] && Array.from({ length: 3 }).map((_, i) => (
                        <img key={i} src={Clover} style={{ ...cloverStyle, transform: `rotate(${rotations[(rowIndex * 10 + i) % rotations.length]}deg)` }} alt="clover" />
                      ))}
                    </div>

                    {/* Card 2 */}
                    {slots[1] ? <PathNode key={slots[1].id} scenario={slots[1]} isUnlocked={canUnlock(slots[1])} isCompleted={completedScenarios.includes(slots[1].id)} breakdown={earnedCoins[slots[1].id]} onSelect={onSelectScenario} onHoverBreakdown={setHoveredBreakdownId} /> : <Spacer />}

                    {/* Gap 2 (3 Clovers) */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                      {slots[1] && slots[2] && Array.from({ length: 3 }).map((_, i) => (
                        <img key={i} src={Clover} style={{ ...cloverStyle, transform: `rotate(${rotations[(rowIndex * 10 + i + 3) % rotations.length]}deg)` }} alt="clover" />
                      ))}
                    </div>

                    {/* Card 3 */}
                    {slots[2] ? <PathNode key={slots[2].id} scenario={slots[2]} isUnlocked={canUnlock(slots[2])} isCompleted={completedScenarios.includes(slots[2].id)} breakdown={earnedCoins[slots[2].id]} onSelect={onSelectScenario} onHoverBreakdown={setHoveredBreakdownId} /> : <Spacer />}
                  </div>

                  {/* ── Vertical connector to next row (1 Clover) ── */}
                  {!isLastRow && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '240px 120px 240px 120px 240px',
                      width: '100%',
                      maxWidth: PATH_MAX_WIDTH,
                      height: 40,
                      justifyContent: 'center'
                    }}>
                      <div style={{ gridColumn: connectorSlotIdx * 2 + 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Clover} style={{ ...cloverStyle, transform: `rotate(${rotations[(rowIndex * 3 + 2) % rotations.length]}deg)` }} alt="clover" />
                      </div>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <NutritionGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}