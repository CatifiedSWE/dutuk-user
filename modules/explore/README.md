# Explore Module

## Overview
This module contains the Explore page components where users can discover and browse through vendors, packages, and events all in one place.

## Structure

```
explore/
├── README.md
└── user/
    ├── ExploreScreen.tsx          # Main screen component
    ├── index.ts                    # Barrel exports
    └── sections/
        ├── ExploreSearchSection.tsx    # Search and filter section
        ├── ExploreListSection.tsx      # Regular items grid
        └── PremiumExploreSection.tsx   # Premium items section
```

## Features

### ExploreSearchSection
- Search box with placeholder
- Filter dropdown (All, Vendors, Packages, Events)
- Clear button (X)
- Search and Filter buttons
- Responsive design

### ExploreListSection
- Grid layout (1-2-3 columns responsive)
- Reuses card design from homepage
- Vendor/Package/Event cards with:
  - Image with overlay
  - Item name
  - Location with icon
  - Star rating
  - Price range
  - Hover effects with "Check now" button

### PremiumExploreSection
- Premium items showcase
- Crown icon header
- Yellow premium badges
- Same card layout as regular section

## Usage

```typescript
import { ExploreScreen } from '@/modules/explore/user';

export default function ExplorePage() {
  return <ExploreScreen />;
}
```

## Demo Data
Uses `/demo/exploreData.ts` for dummy data including:
- Regular explore items (vendors, packages, events)
- Premium explore items
- Filter options
