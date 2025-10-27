# Dark Mode Feature Documentation

## Overview

The micro-frontend monorepo now includes a comprehensive dark mode toggle feature that allows users to switch between light and dark themes seamlessly across all applications.

## Features

### 🌙 **Dynamic Theme Switching**
- Toggle between light and dark modes with a single click
- Smooth transitions and animations
- Persistent theme preference using localStorage
- System preference detection and fallback

### 🎨 **Design System Integration**
- All CSS variables automatically adapt to theme changes
- Consistent styling across all micro-frontends
- No hard-coded colors - everything uses design system variables
- Dark mode optimized color palette

### 📱 **Responsive Design**
- Toggle adapts to different screen sizes
- Mobile-optimized toggle switch
- Label hides on smaller screens for space efficiency

## Implementation

### Components

#### 1. **DarkModeToggle Component**
```javascript
// Location: apps/shell_app/src/components/DarkModeToggle.js
- Interactive toggle switch with sun/moon icons
- Smooth animations and transitions
- Accessible with proper ARIA labels
- Loading state handling
```

#### 2. **ThemeContext Provider**
```javascript
// Location: apps/shell_app/src/contexts/ThemeContext.js
- Centralized theme state management
- localStorage persistence
- System preference detection
- Custom event dispatching for cross-component communication
```

### CSS Integration

#### 1. **Dynamic Theme Variables**
```css
/* Location: libs/ui-styles/src/common.css */
[data-theme="dark"] {
  --color-background-primary: var(--color-secondary-900);
  --color-text-primary: var(--color-neutral-100);
  /* ... more variables */
}
```

#### 2. **Toggle Switch Styles**
```css
/* Comprehensive toggle switch styling */
.dark-mode-toggle { /* Container styles */ }
.toggle-switch { /* Switch background */ }
.toggle-handle { /* Moving handle */ }
.toggle-icon { /* Sun/moon icons */ }
```

## Usage

### For Users
1. **Toggle Theme**: Click the toggle switch in the navigation bar
2. **Persistent Preference**: Your choice is automatically saved
3. **System Detection**: App detects your system preference on first visit
4. **Smooth Transitions**: All elements animate smoothly between themes

### For Developers

#### Using the Theme Context
```javascript
import { useTheme } from './contexts/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {isDarkMode ? 'light' : 'dark'} mode
      </button>
    </div>
  );
}
```

#### Listening to Theme Changes
```javascript
// Listen for theme change events
window.addEventListener('themeChanged', (event) => {
  const { theme, isDark } = event.detail;
  console.log(`Theme changed to: ${theme}`);
});
```

## Technical Details

### Theme Detection Priority
1. **User Preference**: Saved in localStorage
2. **System Preference**: `prefers-color-scheme` media query
3. **Default**: Light mode

### CSS Variable System
- **Light Mode**: Uses default design system colors
- **Dark Mode**: Overrides with dark-optimized colors
- **Smooth Transitions**: All variables transition smoothly
- **No Flash**: Theme loads before first paint

### Performance Optimizations
- **CSS Variables**: Instant theme switching without re-renders
- **localStorage**: Minimal storage footprint
- **Event System**: Efficient cross-component communication
- **Lazy Loading**: Theme context loads asynchronously

## Browser Support

- ✅ **Modern Browsers**: Full support with CSS custom properties
- ✅ **Mobile Browsers**: Responsive design and touch-friendly
- ✅ **Accessibility**: Screen reader compatible
- ✅ **Fallbacks**: Graceful degradation for older browsers

## Future Enhancements

### Planned Features
- **Auto Theme**: Time-based automatic switching
- **Custom Themes**: User-defined color schemes
- **Theme Presets**: Multiple dark mode variants
- **Animation Controls**: User preference for reduced motion

### Integration Opportunities
- **Micro-Frontend Sync**: Theme state across all apps
- **API Integration**: Server-side theme preferences
- **Analytics**: Theme usage tracking
- **A/B Testing**: Theme preference experiments

## Troubleshooting

### Common Issues

#### Theme Not Persisting
```javascript
// Check localStorage availability
if (typeof Storage !== "undefined") {
  localStorage.setItem('theme', 'dark');
} else {
  console.warn('localStorage not available');
}
```

#### CSS Variables Not Updating
```css
/* Ensure data-theme attribute is set */
html[data-theme="dark"] {
  /* Dark mode variables */
}
```

#### Toggle Not Working
```javascript
// Check if ThemeProvider wraps the app
<ThemeProvider>
  <App />
</ThemeProvider>
```

## Testing

### Manual Testing
1. **Toggle Functionality**: Click toggle and verify theme changes
2. **Persistence**: Refresh page and verify theme persists
3. **System Detection**: Change system preference and reload
4. **Responsive**: Test on different screen sizes
5. **Accessibility**: Test with screen readers and keyboard navigation

### Automated Testing
```javascript
// Example test cases
describe('Dark Mode Toggle', () => {
  test('toggles theme on click', () => {
    // Test implementation
  });
  
  test('persists theme in localStorage', () => {
    // Test implementation
  });
});
```

## Contributing

### Adding New Theme-Aware Components
1. Use design system variables instead of hard-coded colors
2. Test in both light and dark modes
3. Ensure proper contrast ratios
4. Add smooth transitions where appropriate

### Updating Theme Colors
1. Modify variables in `common.css`
2. Test across all applications
3. Verify accessibility compliance
4. Update documentation

---

## Summary

The dark mode feature provides a seamless, accessible, and performant way for users to customize their experience across the entire micro-frontend ecosystem. The implementation follows modern React patterns, uses the centralized design system, and provides excellent developer experience for future enhancements.
