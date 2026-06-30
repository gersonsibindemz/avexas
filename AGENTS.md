# Project Rules

- **Modular Component Structure**: All new application sessions/views must be organized in their own subdirectories within `/src/components/` (e.g., `/src/components/<feature-name>/<FeatureView>.tsx`).
- **Main App Integration**: These components must be imported and rendered within `/src/App.tsx` based on the current view state, following the established routing pattern.
