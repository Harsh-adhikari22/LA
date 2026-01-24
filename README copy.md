# VPrimeTours

VPrimeTours is a modern travel booking website built with Next.js 15, featuring travel package catalogs, user authentication, and admin management capabilities.

## Features

- 🎯 Travel package catalog with advanced filtering
- 🔐 User authentication (Supabase)
- 👨‍💼 Admin panel for package management
- 💬 WhatsApp integration for customer inquiries
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Backend**: Supabase (Auth & Database)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd VPrimeTours
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Start Production Server

Start the production server (after building):

```bash
npm start
# or
yarn start
# or
pnpm start
```

### Linting

Run the linter:

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

## Project Structure

```
VPrimeTours/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── packages/          # Package listing and details
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── admin/            # Admin-specific components
├── lib/                  # Utility functions and configs
│   ├── supabase/        # Supabase client setup
│   └── design-system.ts # Design system constants
└── public/               # Static assets
```

## Design System

The project uses a standardized design system defined in `lib/design-system.ts` for consistent styling across all components.

## License

Private - All rights reserved
