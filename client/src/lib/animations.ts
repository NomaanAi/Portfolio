export const transitions = {
  premium: {
    duration: 0.8,
    ease: [0.25, 1, 0.5, 1], // Cubic bezier for "premium" feel
  },
  soft: {
    duration: 0.5,
    ease: "easeOut",
  },
};

export const variants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.premium,
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: transitions.premium,
    },
  },
};
