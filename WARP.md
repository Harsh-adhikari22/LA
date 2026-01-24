# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

VPrimeTours is a travel catalogue and enquiry website project. This is currently a new repository with initial setup.

## Repository Information

- **Repository**: https://github.com/Harsh-adhikari22/VPrimeTours.git
- **Current State**: Initial repository with basic README.md
- **Purpose**: Travel catalogues and enquiry system

## Development Setup

Since this is a new project, the technology stack will need to be determined. Common setups for travel websites include:

### Frontend Options
- React/Next.js with TypeScript for modern web applications
- Vue.js/Nuxt.js for progressive web applications  
- Traditional HTML/CSS/JavaScript for simpler implementations

### Backend Options
- Node.js with Express for JavaScript-based backend
- Python with Django/Flask for robust web frameworks
- PHP with Laravel for traditional web development

## Common Development Commands

*Note: These commands will be relevant once the project structure is established*

### For Node.js/React Projects:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### For Python Projects:
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python manage.py runserver  # Django
# or
flask run  # Flask

# Run tests
python -m pytest

# Run migrations (Django)
python manage.py migrate
```

## Project Structure Recommendations

Based on the travel catalogue and enquiry nature of the project, consider organizing code around:

### Core Components
- **Catalogue System**: Display travel packages, destinations, and services
- **Enquiry System**: Handle customer inquiries and bookings
- **Content Management**: Manage travel content, images, and descriptions
- **User Management**: Customer accounts and authentication
- **Admin Interface**: Backend management for travel agents

### Typical Directory Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route-specific components
├── services/      # API calls and business logic
├── utils/         # Helper functions
├── assets/        # Static files (images, fonts)
├── styles/        # CSS/styling files
└── types/         # Type definitions (if using TypeScript)

backend/ (if applicable)
├── models/        # Data models
├── controllers/   # Route handlers
├── services/      # Business logic
├── middleware/    # Custom middleware
└── config/        # Configuration files
```

## Key Features to Implement

### Travel Catalogue Features
- Destination browsing with filters (price, duration, location)
- Package details with images, itineraries, and pricing
- Search functionality for destinations and packages
- Featured tours and recommendations

### Enquiry System Features
- Contact forms with validation
- Quote request system
- Booking inquiries with calendar integration
- Customer communication tracking

## Development Best Practices

### For Travel Websites
- Optimize images for web (use modern formats like WebP)
- Implement responsive design for mobile users
- Consider SEO optimization for destination pages
- Ensure fast loading times for image-heavy content
- Implement proper error handling for booking systems

### Security Considerations
- Validate all user inputs, especially in enquiry forms
- Implement proper authentication for admin areas
- Secure customer data and payment information
- Use HTTPS for all communications

## Testing Strategy

### Frontend Testing
- Unit tests for utility functions and components
- Integration tests for booking flows
- E2E tests for critical user journeys (browsing → enquiry → submission)

### Backend Testing
- API endpoint testing
- Database integration tests
- Authentication flow testing

## Getting Started with Development

1. **Choose Technology Stack**: Decide on frontend and backend technologies
2. **Set up Project Structure**: Create appropriate directories and configuration files
3. **Implement Core Components**: Start with catalogue display and basic enquiry form
4. **Add Styling**: Implement responsive design with travel-focused aesthetics
5. **Integrate Backend**: Connect to database and implement API endpoints
6. **Testing**: Add comprehensive tests for critical functionality
7. **Deployment**: Set up CI/CD and hosting infrastructure

## Future Considerations

- Payment gateway integration for bookings
- Multi-language support for international customers
- Integration with travel APIs for real-time availability
- Mobile app development
- Customer review and rating system
- Social media integration for marketing

## Git Workflow

- Use feature branches for new development
- Write descriptive commit messages
- Consider conventional commit format for automated changelog generation
- Use pull requests for code review before merging to main

This document will be updated as the project evolves and the technology stack is determined.
