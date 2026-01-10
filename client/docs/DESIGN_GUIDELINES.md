# Minimal AI Design Guidelines

## Philosophy
**"Subtle Intelligence"**
The design communicates technical depth through precision, not flashiness. It should feel like a serious engineering tool rather than a sci-fi game.

## Color Palette

### Backgrounds
- **Deep Slate**: `#020617` (Slate 950) - Primary background. Deep, rich, and professional.
- **Surface**: `rgba(255, 255, 255, 0.03)` - For cards and distinct areas.

### Accents
- **Primary**: `#6366f1` (Indigo 500) - Used for primary actions and active states.
- **Secondary**: `#94a3b8` (Slate 400) - For borders, muted text, and inactive elements.
- **Glows**: Avoided. If used, maximum opacity 5% (`rgba(99, 102, 241, 0.05)`).

### Typography
- **Heading**: `Inter` (Bold, Tight Tracking) - Clean, authoritative.
- **Body**: `Inter` (Light/Regular, Relaxed Tracking) - High readability.
- **Code**: `JetBrains Mono` - For technical terms and snippets.

## Components

### Buttons
- **Primary**: Solid foreground/white text, subtle hover lift. No neon borders.
- **Secondary**: Ghost or subtle border, muted text.

### Visual Effects
- **Neural Background**: 
  - Particle Count: 40 (Desktop)
  - Opacity: 20%
  - Speed: Very Slow
  - Interaction: Muted Indigo connections
- **Cursor**:
  - Opacity-based dot.
  - No trailing rings.

## Rules
1. **No Neon**: Avoid pure cyan (`#00FFFF`) or magenta (`#FF00FF`).
2. **Readability First**: Contrast ratios must be high.
3. **Motion is Texture**: Animations should be felt, not seen.
