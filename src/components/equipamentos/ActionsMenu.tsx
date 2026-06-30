import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  actions: string[];
  onAction: (action: string) => void;
}

export const ActionsMenu: React.FC<ActionsMenuProps> = ({ isOpen, onClose, anchorRef, actions, onAction }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const isNearBottom = rect.bottom > window.innerHeight - 200; // threshold

      setStyle({
        position: 'fixed',
        top: isNearBottom ? rect.top - 8 : rect.bottom + 8,
        left: rect.right - 224, // width
        transform: isNearBottom ? 'translateY(-100%)' : undefined,
      });
    }
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="z-[9999] w-56 bg-white border border-slate-200 shadow-lg py-1"
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map((action) => (
        <button
          key={action}
          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
          onClick={() => {
            onAction(action);
            onClose();
          }}
        >
          {action}
        </button>
      ))}
    </div>,
    document.body
  );
};
