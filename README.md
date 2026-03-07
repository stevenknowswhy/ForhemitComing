# Forhemit Capital - Coming Soon

A modern, responsive landing page and recruitment portal for Forhemit Capital, a private equity firm.

## 🚀 Live Demo

Visit the live site: [https://forhemit.com](https://forhemit.com) *(update with actual URL)*

## 📋 Project Overview

Forhemit Capital is a private equity firm focused on acquiring and operating small to mid-sized businesses. This project includes:

- **Landing Page** - Minimalist dark-themed homepage with recruitment modal
- **About Page** - Company philosophy and value proposition
- **Introduction Page** - Placeholder for future content
- **Recruitment Portal** - Multi-step Typeform-style application form with resume upload

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Tailwind CSS
- **UI Components**: Custom components with UploadThing integration
- **File Upload**: [UploadThing](https://uploadthing.com/) for resume uploads
- **Fonts**: Google Fonts (Cormorant Garamond, DM Mono, Outfit)

## 📁 Project Structure

```
app/
├── page.tsx              # Homepage with recruitment modal
├── page.css              # Homepage styles
├── layout.tsx            # Root layout with font configuration
├── about/
│   ├── page.tsx          # About page
│   └── page.css          # About page styles
├── introduction/
│   ├── page.tsx          # Introduction placeholder
│   └── page.css          # Introduction styles
└── api/uploadthing/
    └── route.ts          # UploadThing API route

public/
└── recruit-face.jpg      # Modal image asset

utils/
└── uploadthing.ts        # UploadThing client utilities

uploadthing.ts            # UploadThing file router config
```

## ✨ Features

### Homepage
- Animated mesh gradient background (dark brown theme)
- Minimalist navigation (About, Introduction)
- "Join the Movement" recruitment modal
- "Get Early Access" email capture
- Responsive design optimized for mobile-first

### Recruitment Modal
- **5-Step Typeform-style flow**:
  1. Welcome intro
  2. First & Last Name
  3. Email address
  4. Phone number (US format with auto-formatting)
  5. Position selection + Resume upload
- Progress bar with step indicators
- Resume upload via UploadThing (PDF, DOC, DOCX up to 8MB)
- Toggle option to submit without resume
- Keyboard navigation (Enter to advance)
- Back button navigation on each step

### About Page
- Company philosophy and COOP model explanation
- Stats section (30yr, ≤40%, 3-5yr, ESOP)
- Comparison table vs traditional private equity
- Responsive typography with clamp()

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/stevenknowswhy/ForhemitComing.git
cd ForhemitComing
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your UploadThing credentials to `.env.local`:
```env
UPLOADTHING_TOKEN=your_token_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Configuration

### UploadThing Setup
1. Create an account at [uploadthing.com](https://uploadthing.com/)
2. Create a new app
3. Copy your token to `.env.local`
4. Update `uploadthing.ts` with your file router config

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `UPLOADTHING_TOKEN` | UploadThing API token | Yes (for file uploads) |

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🎨 Design System

### Colors
- Primary Orange: `#FF6B00`
- Primary Red: `#FF3D00`
- Dark Background: `#1a1209`
- Light Text: `#ffffff`
- Muted Text: `#a0a0a0`

### Typography
- Headlines: Cormorant Garamond (serif)
- Body: Inter / Outfit (sans-serif)
- Labels/Mono: DM Mono

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📝 License

This project is proprietary and confidential. All rights reserved by Forhemit Capital.

## 📧 Contact

For questions or inquiries, contact: [contact@forhemit.com](mailto:contact@forhemit.com)

---

Built with ❤️ by Forhemit Capital Team
