import { createAnimation } from '@ionic/core';

export const crossFade = (_baseEl: any, opts: any) => {
  const enteringEl = opts?.enteringEl as HTMLElement | undefined;
  const leavingEl = opts?.leavingEl as HTMLElement | undefined;

  const enterAnimation = createAnimation();
  if (enteringEl) {
    enterAnimation.addElement(enteringEl);
  }
  enterAnimation
    .duration(320)
    .easing('cubic-bezier(.22,.9,.3,1)')
    .fromTo('opacity', '0', '1')
    .fromTo('transform', 'translateY(6px)', 'translateY(0px)');

  const root = createAnimation().addAnimation(enterAnimation);

  if (leavingEl) {
    const leaveAnimation = createAnimation()
      .addElement(leavingEl)
      .duration(220)
      .easing('ease-out')
      .fromTo('opacity', '1', '0');

    root.addAnimation(leaveAnimation);
  }

  return root;
};
