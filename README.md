# Wedding Website

An elegant, scroll-driven wedding invitation website with an interactive envelope animation.

## Features

- **Scroll-driven envelope animation** - The envelope opens and cards emerge as you scroll
- **Responsive design** - Works beautifully on desktop and mobile
- **Easy customization** - Colors, names, dates, and content are easy to change
- **No build tools** - Plain HTML, CSS, and JavaScript
- **Google Forms RSVP** - Link directly to your RSVP form

## Quick Start

1. Open `index.html` in your browser to preview
2. Edit the content (see Customization below)
3. Deploy to any static hosting (GitHub Pages, Netlify, Vercel, etc.)

## Customization

### Changing Names, Dates & Details

Open `index.html` and look for comments marked with `========== EDIT ... ==========`:

```html
<!-- ========== EDIT COUPLE'S LAST NAME HERE ========== -->
<p class="names">the Smiths</p>

<!-- ========== EDIT NAMES HERE ========== -->
<span>Alice</span>
<span class="ampersand">&</span>
<span>Benjamin</span>

<!-- ========== EDIT DATE/TIME/VENUE HERE ========== -->
<p class="date-day">15</p>
<p class="date-month">September</p>
<p class="date-year">2026</p>

<!-- ========== EDIT GOOGLE FORM LINK HERE ========== -->
<a href="https://forms.google.com/your-form-link" ...>
```

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

## Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- iOS Safari, Chrome Mobile
- Requires JavaScript enabled

## Deployment

### GitHub Pages

1. Push this repo to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch" → `main` → `/ (root)`
4. Your site will be live at `https://username.github.io/repo-name`

### Netlify

1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repo for auto-deploy

### Custom Domain

Add a `CNAME` file with your domain name, then configure DNS with your registrar.

## License

Feel free to use and modify for your wedding!
