# noble-root

## Customization

### Changing Colors

Open `css/variables.css` and edit the color values:

```css
:root {
  --color-olive: #6b7c4c;        /* Envelope, accent cards */
  --color-burgundy: #722f37;     /* Wax seal, buttons */
  --color-cream: #f9f6f0;        /* Background */
  --color-gold: #c9a962;         /* Accents */
  /* ... more colors */
}
```

### Replacing Placeholder Images

Replace the placeholder elements with your actual images:

1. **Envelope scenic liner** - Add an image inside `.envelope-liner`
2. **Floral decorations** - Replace `.floral-placeholder` with `<img>` tags
3. **Couple photos** - Replace `.photo-placeholder` with `<img>` tags

Place your images in `assets/images/` and update the HTML accordingly.

### Adjusting Animation Timing

Open `js/scroll-animation.js` and edit the `CONFIG` object:

```javascript
const CONFIG = {
  flapStartOpen: 0.08,    // When flap starts opening (0-1)
  flapFullyOpen: 0.20,    // When flap is fully open
  cards: {
    names:   { start: 0.22, end: 0.35 },
    date:    { start: 0.30, end: 0.45 },
    // ... adjust timing for each card
  },
};
```

## File Structure

```
wedding-site-v2/
├── index.html              # Main HTML file
├── css/
│   ├── variables.css       # Colors & fonts (edit this!)
│   ├── base.css            # Reset, typography, layout
│   ├── envelope.css        # Envelope 3D styles
│   └── cards.css           # Card styles & positioning
├── js/
│   └── scroll-animation.js # Scroll-driven animation logic
├── assets/
│   └── images/             # Your images go here
└── README.md
```