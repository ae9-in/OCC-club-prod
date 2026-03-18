# Implementation Plan: Real Login Flow

## Overview

This implementation transforms the login page from a demo authentication flow into a real-looking entry point by removing demo indicators, updating button text, redirecting to the feed page, adding branding to the navbar, and creating a profile page placeholder. All changes preserve existing code structure and styling.

## Tasks

- [x] 1. Update login page to remove demo indicators and change redirect
  - [ ] 1.1 Remove demo text from login page (frontend/app/login/page.tsx)
    - Remove the "Demo Auth" badge div (line 20: `<div className="absolute -top-6 -left-6 bg-black text-white px-4 py-2 font-black uppercase border-4 border-black">Demo Auth</div>`)
    - Remove the disclaimer paragraph (lines 52-55: `<p className="mt-8 text-center font-bold text-gray-500">This is a dummy login for the frontend demo. <br /> Any credentials will work.</p>`)
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ] 1.2 Update login button text and redirect behavior (frontend/app/login/page.tsx)
    - Change button text from "Enter Dashboard" to "Enter OCC" (line 49)
    - Update handleSubmit to call `router.push("/feed")` instead of `router.push("/")` (line 14)
    - _Requirements: 2.1, 2.3_
  
  - [ ]* 1.3 Write unit tests for login page changes
    - Test that no demo text appears in rendered output
    - Test that handleSubmit calls router.push("/feed")
    - Test that form submission prevents default behavior
    - _Requirements: 2.2, 2.3_

- [x] 2. Update navbar with branding text
  - [ ] 2.1 Add "Off Campus Clubs" text under OCC logo (frontend/components/Navbar.tsx)
    - Modify the logo Link component (lines 7-9) to include a subtitle
    - Add a flex-col wrapper and subtitle text element
    - Use existing brutal design styling (font-bold, uppercase, text-xs or text-sm)
    - Ensure responsive behavior is preserved
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ]* 2.2 Write unit tests for navbar changes
    - Test that "Off Campus Clubs" text renders correctly
    - Test that all navigation links remain functional
    - Test responsive behavior (desktop/mobile)
    - _Requirements: 3.1, 3.2_

- [-] 3. Create profile page placeholder
  - [ ] 3.1 Create profile page component at frontend/app/profile/page.tsx
    - Create new file with Next.js page component structure
    - Use "use client" directive for client-side rendering
    - Use brutal design system styling (bg-brutal-gray background, min-h-screen)
    - Add placeholder heading with brutal styling (text-4xl or text-5xl, font-black, uppercase)
    - Add placeholder content text (font-bold)
    - Match the styling patterns from login page and other pages
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 3.2 Write unit tests for profile page
    - Test that page renders without errors
    - Test that brutal design styling is applied
    - Test that placeholder content is displayed
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

- [ ] 4. Checkpoint - Verify all navigation links work
  - Manually test navigation from login to feed
  - Test all navbar links (/feed, /explore, /profile, /login)
  - Ensure no 404 errors occur
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- All changes preserve existing code structure, styling, and functionality
- No new dependencies are required
- TypeScript types and interfaces remain unchanged
- Client-side navigation using Next.js router (no page reloads)
- File paths are relative to project root
