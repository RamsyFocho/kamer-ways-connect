# GlobalBush Quick Ride - TODO & Progress Tracker

## ✅ Completed
- Role-based login redirection (admin → /admin, customer → /bookings)
- Admin dashboard analytics (charts: line, bar, pie) with fallback UI
- Admin sidebar navigation for dashboard, agencies, routes, users
- Scaffolded and connected CRUD pages for agencies, routes, users
- Implemented full CRUD UI for agencies (list, create, edit, delete) with React Query and mock data
- Sidebar integrated into all admin CRUD pages

## 🚧 In Progress / Next Up
- Implement CRUD logic for routes (list, create, edit, delete)
- Implement CRUD logic for users (list, create, edit, delete)
- Add confirmation dialogs and feedback for destructive actions (delete)
- Polish UI/UX for all admin pages (loading, error, empty states)
- Ensure type safety and error handling throughout
- Add tests for critical flows

## 📝 Notes
- All admin pages are protected by role
- Mock data is used for development; API integration can be swapped in later
- React Query is used for server state management

TODO: change all mockAPi callings
