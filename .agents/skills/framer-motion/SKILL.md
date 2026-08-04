---
name: framer-motion
description: Framer Motion animation intelligence, gestures, layout transitions, exit animations, variants, spring physics, and scroll-linked animations for React and Web applications.
---

# Framer Motion Animation Skill

## Overview
Framer Motion is a production-ready motion library for React and modern web applications. Use this skill when building animated user interfaces, micro-interactions, page transitions, gesture controls, or scroll-based animations.

## Core Concepts & Syntax

### 1. Basic Motion Components
Replace standard HTML tags with `motion` primitives:
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  Animated Content
</motion.div>
```

### 2. Variants (Clean Orchestration)
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  <motion.li variants={itemVariants}>Item 1</motion.li>
  <motion.li variants={itemVariants}>Item 2</motion.li>
</motion.ul>
```

### 3. AnimatePresence (Exit Animations)
```jsx
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      Modal Content
    </motion.div>
  )}
</AnimatePresence>
```

### 4. Layout Animations & Shared Element Transitions
```jsx
<motion.div layout transition={{ type: 'spring', stiffness: 350, damping: 25 }}>
  {/* Automatic layout animation when container size changes */}
</motion.div>

{/* Shared Layout ID for morphing transitions */}
<motion.div layoutId="activeTabPill" className="active-indicator" />
```

### 5. Gestures (Hover, Tap, Drag)
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  drag
  dragConstraints={{ left: 0, right: 100, top: 0, bottom: 0 }}
>
  Interactive Button
</motion.button>
```

### 6. Scroll Animations & Hooks
```jsx
import { motion, useScroll, useTransform } from 'framer-motion';

const { scrollYProgress } = useScroll();
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

<motion.div style={{ opacity }}>
  Scroll Faded Element
</motion.div>
```

## Best Practices
- **Performance**: Animate transform properties (`x`, `y`, `scale`, `rotate`) and `opacity` for GPU-accelerated 60fps performance.
- **Accessibility**: Respect `prefers-reduced-motion` settings.
- **Spring Physics**: Use spring physics (`type: 'spring', stiffness: 400, damping: 30`) for tactile feedback (buttons, cards). Use easing curves for entrance transitions.
