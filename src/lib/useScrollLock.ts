import { useEffect } from "react";

let lockCount = 0;
let savedScrollY = 0;

type SavedBodyStyles = {
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overflow: string;
  paddingRight: string;
};

let savedStyles: SavedBodyStyles | null = null;

function lockPageScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const body = document.body;
  savedScrollY = window.scrollY;

  savedStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
    paddingRight: body.style.paddingRight,
  };

  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  body.style.position = "fixed";
  body.style.top = `-${savedScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockPageScroll() {
  if (lockCount === 0) return;

  lockCount -= 1;
  if (lockCount > 0 || !savedStyles) return;

  const body = document.body;

  body.style.position = savedStyles.position;
  body.style.top = savedStyles.top;
  body.style.left = savedStyles.left;
  body.style.right = savedStyles.right;
  body.style.width = savedStyles.width;
  body.style.overflow = savedStyles.overflow;
  body.style.paddingRight = savedStyles.paddingRight;

  window.scrollTo(0, savedScrollY);
  savedStyles = null;
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockPageScroll();
    return () => unlockPageScroll();
  }, [active]);
}
