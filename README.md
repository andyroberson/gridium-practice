# Gridium Dashboard

A quick prototype dashboard built with **Recharts** to visualize energy data using React / TS.
It highlights what I thought would be most valuable for a user:

- Latest cost
- Overall summary
- Usage patterns
- Data preview

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/andyroberson/gridium-practice

# Install dependencies
npm install

# Start the dev server
npm run dev
```

---

## Notes / Next steps

- Tests - Add unit tests, esp for data processor / component rendering
- Componentization - Break dashboard sections into smaller reusable components.
- Add a real loading animation rather than just text.
- Styling:
  - Improve overall styling
  - Cnetralized variables / overall style defined (color variables, fonts, spacing, etc)
- Update raw table:
  - this would be better if we had a table component, and the table had pagination / sorting. Would also consider having a tab view for this, especially for mobile
- Refactoring

  - Remove inline styles: separate style files
  - Move type definitions into its own file
  - Long term, i'd probably prefer D3 to Recharts, especially for lots of flexibility / greater styling

- Asking questions
  - In a normal situation, I'd also ask a few questions about this like: what do we want users to focus on most? I did an overall summary that uses both endpoints, but if there were different goals, maybe we could've made this with tabs so users are seeing one billing and one readings and endpoints are loaded / memoized through tab clicks.
