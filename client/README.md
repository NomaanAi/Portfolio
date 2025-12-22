# Noman.Dev | AI & Machine Learning Engineer

> **Status**: System Online  
> **Theme**: Neo-Dominant Futuristic  
> **Tech Stack**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Three.js (R3F)

A high-performance, production-ready portfolio designed for an AI Engineer. Built with strict architectural rigor and dominant visual aesthetics.

## 🚀 Features

- **Real 3D Core**: Interactive geometric particle system using `@react-three/fiber` and `@react-three/drei`.
- **Performance First**: Lazy-loaded 3D components (`next/dynamic`), localized animations, and optimized assets.
- **Strict Architecture**: Clean separation of concerns (`/app`, `/components`, `/data`, `/three`).
- **Data Driven**: Content powered by static data files for easy updates without touching UI code.
- **Neo-Dominant UI**: Custom Tailwind v4 theme with glassmorphism, glows, and kinetic typography.

## 🛠️ Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the system.

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📂 Project Structure

```
/src
  /app           # Next.js App Router pages & global styles
  /components    # React components (Hero, About, Skills, etc.)
  /data          # Static content (projects.js)
  /three         # Shared Three.js logic
```

## 🎨 Customization

- **Projects**: Edit `src/data/projects.js` to add your real work.
- **Content**: Update text directly in `src/components/*` files.
- **Theme**: Modify `src/app/globals.css` for palette adjustments.

---

*System Architected by Antigravity.*
