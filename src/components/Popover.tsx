import { type ReactNode, useEffect, useState, useCallback } from 'react';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  width?: number;
  fadingOut?: boolean;
  animateIn?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  positionMode?: 'anchored' | 'top-left';
}

export function Popover({ isOpen, onClose, anchorRef, children, width = 360, fadingOut = false, animateIn = false, onMouseEnter, onMouseLeave, positionMode = 'anchored' }: PopoverProps) {
  const [pos, setPos] = useState({ top: 0, left: 0, arrowX: 0, width });
  const [mounted, setMounted] = useState(false); // <-- This was missing!

  const recalc = useCallback(() => {
    if (!isOpen) return;

    if (positionMode === 'top-left') {
      const headerHeight = 60; 
      const top = headerHeight + 8;
      
      const vw = window.innerWidth;
      const maxW = 1600;
      const containerWidth = Math.min(vw, maxW);
      const containerLeft = Math.max(0, (vw - maxW) / 2);
      
      const col1Fraction = 4 / 19;
      const col1Width = containerWidth * col1Fraction;
      const col1Left = containerLeft;
      
      const inset = 8; 
      const left = col1Left + inset;
      const calcWidth = Math.max(200, col1Width - (inset * 2));
      
      setPos({ top, left, arrowX: 0, width: calcWidth });
    } else {
      if (!anchorRef?.current) return;
      const rect = anchorRef.current.getBoundingClientRect();
      const top = rect.bottom + 16;
      const left = Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8));
      const arrowX = rect.left + rect.width / 2 - left;
      setPos({ top, left, arrowX, width });
    }
  }, [isOpen, anchorRef, width, positionMode]);

  useEffect(() => { recalc(); }, [recalc]);

  useEffect(() => {
    if (!isOpen) return;

    setMounted(false);
    if (animateIn) {
      const animTimer = requestAnimationFrame(() => setMounted(true));
      window.addEventListener('resize', recalc);
      return () => {
        cancelAnimationFrame(animTimer);
        window.removeEventListener('resize', recalc);
      };
    } else {
      setMounted(true);
      window.addEventListener('resize', recalc);
      return () => window.removeEventListener('resize', recalc);
    }
  }, [isOpen, recalc, animateIn]);

  if (!isOpen) return null;

  const maxHeight = window.innerHeight - pos.top - 16;
  const targetOpacity = fadingOut ? 0 : 1;
  const currentOpacity = animateIn ? (mounted ? targetOpacity : 0) : targetOpacity;

  let transitionSpeed = '0s';
  if (fadingOut) transitionSpeed = '1.5s';
  else if (animateIn) transitionSpeed = '0.5s';

  return (
    <>
      {/* Click-outside layer */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ backgroundColor: 'transparent', opacity: 1 }}
      />

      {/* Speech-bubble panel — simplified clean styling */}
      <div
        className="fixed z-50 shadow-lg"
        style={{
          top: pos.top, 
          left: pos.left, 
          width: pos.width, 
          maxHeight: Math.max(120, maxHeight),
          overflowY: 'auto',
          backgroundColor: 'var(--bg-interactive)',
          border: '1px solid var(--border-light)',
          borderRadius: '15px 4px 15px 4px',
          opacity: currentOpacity,
          transition: `opacity ${transitionSpeed} ease-in-out`,
          pointerEvents: 'auto',
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Arrow — only in anchored mode, subtle border */}
        {positionMode === 'anchored' && pos.arrowX > 0 && (
          <>
            <div style={{ position: 'absolute', top: -9, left: pos.arrowX - 9, width: 0, height: 0, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: '9px solid var(--border-light)' }} />
            <div style={{ position: 'absolute', top: -7, left: pos.arrowX - 8, width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid var(--bg-interactive)' }} />
          </>
        )}

        {children}
      </div>
    </>
  );
}