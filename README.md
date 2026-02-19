# 🐾 TailVault - Pet Health Timeline System

A fully functional, authenticated pet health management system with file uploads, categorization, and searchable history.

![TailVault](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

---

## ✨ Features

### 🔐 Authentication System
- ✅ Email + Password signup
- ✅ Secure login with session persistence
- ✅ Logout functionality
- ✅ Protected routes for dashboard and vault
- ✅ Auto-redirect to dashboard after login

### 🐕 First-Time User Flow
- ✅ Mandatory pet profile creation
- ✅ Pet details: name, breed, age, gender, weight, photo, microchip ID
- ✅ Cannot proceed without creating at least one pet
- ✅ Support for multiple pets

### 📊 Dashboard
**Left Sidebar:**
- Pet profile switcher
- Add Entry button
- Category filters (Vaccines, Illness, Food, Weight, Behavior, Vet Visits)

**Main Area:**
- Real-time search functionality
- Timeline feed (chronological order)
- Expandable entry cards
- File attachment indicators

**Right Sidebar:**
- Quick stats (weight, age, microchip ID)
- Pet information summary

### 📝 Timeline Entry System
- **Categories**: Vaccine, Illness, Food Changes, Weight, Behavior, Vet Visits, Other
- **Fields**: Title, Description, Date
- **Conditional Fields**: Weight value, Vet name
- **File Uploads**: 
  - Drag & drop or click to upload
  - Support for JPG, PNG, PDF
  - Max 10MB per file
  - Multiple files per entry
  - File preview and download

### 📦 Centralized Vault
- View all uploaded documents
- Filter by category
- Search by file name or entry title
- Sort by date or name (ascending/descending)
- Download files
- Delete files with confirmation
- Image previews
- File metadata display

### 🔍 Search & Filter
- Debounced search input
- Search in titles, descriptions, and file names
- Fast and responsive filtering
- Category-based filtering

### 🔒 Security
- Row Level Security (RLS) policies
- Users can only access their own data
- Secure file storage
- Protected API endpoints
- Input sanitization

### ⚡ Performance
- Lazy loading timeline entries
- Pagination (20 entries per page)
- Optimized database queries with indexes
- Efficient file handling
- Mobile responsive design

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd pet-health-logbook-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase** (Detailed in [SETUP-GUIDE.md](./SETUP-GUIDE.md))
   - Create a Supabase project
   - Run the SQL schema (`supabase-schema.sql`)
   - Create storage buckets (`pet-photos`, `entry-files`)
   - Configure storage policies

4. **Configure environment variables**
```bash
# Copy .env.example to .env
# Add your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:5173
```

---

## 📖 Documentation

For detailed setup instructions, see **[SETUP-GUIDE.md](./SETUP-GUIDE.md)**

The setup guide includes:
- Complete Supabase configuration
- Database schema setup
- Storage bucket configuration
- Security policies
- Troubleshooting tips

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 5.4** - Build tool
- **React Router 6.30** - Routing
- **Tailwind CSS 3.4** - Styling
- **shadcn-ui** - UI components
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **React Dropzone** - File uploads

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Row Level Security
  - Real-time subscriptions

### Developer Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Testing

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn-ui components
│   ├── AddEntryModal.tsx        # Modal for adding timeline entries
│   ├── CreatePetProfile.tsx     # Pet profile creation
│   ├── DashboardLayout.tsx      # Main dashboard layout
│   ├── ProtectedRoute.tsx       # Auth route wrapper
│   ├── TimelineFeed.tsx         # Timeline display
│   └── Navbar.tsx               # Navigation with auth
├── contexts/
│   └── AuthContext.tsx          # Authentication context
├── lib/
│   └── supabase.ts              # Supabase client config
├── pages/
│   ├── Index.tsx                # Landing page
│   ├── Login.tsx                # Login page
│   ├── Signup.tsx               # Signup page
│   ├── Dashboard.tsx            # Main dashboard
│   └── Vault.tsx                # Document vault
└── App.tsx                      # App routing
```

---

## 🎯 Usage Flow

### New User
1. Visit homepage → Click "Start Free"
2. Sign up with email + password
3. Create first pet profile (mandatory)
4. Access dashboard
5. Add timeline entries with files
6. Manage documents in vault

### Returning User
1. Log in
2. Dashboard loads with existing pets
3. Switch between pets
4. Add/view entries
5. Search and filter timeline
6. Access vault for all documents

---

## 🔐 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Secure file storage with access policies
- ✅ Session-based authentication
- ✅ Protected routes
- ✅ Input validation and sanitization
- ✅ No public access to user data
- ✅ Secure file uploads with type validation

---

## 🌟 Key Highlights

- **No fake data**: All data comes from real backend
- **Fully authenticated**: Complete user management
- **Production ready**: Security, performance, and UX optimized
- **Scalable**: Built on Supabase infrastructure
- **Mobile responsive**: Works on all devices
- **Beautiful UI**: Premium design with gradients and animations

---

## 📝 Future Enhancements

- [ ] Export timeline as PDF
- [ ] Vaccine reminder system
- [ ] Weight tracking charts
- [ ] Email notifications
- [ ] Entry edit/delete functionality
- [ ] Pet profile editing
- [ ] Bulk file upload
- [ ] Sharing capabilities

---

## 🐛 Troubleshooting

Common issues and solutions are documented in [SETUP-GUIDE.md](./SETUP-GUIDE.md#-troubleshooting)

---

## 📄 License

This project is built with Lovable and uses open-source technologies.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues and questions:
1. Check the [SETUP-GUIDE.md](./SETUP-GUIDE.md)
2. Review Supabase dashboard for errors
3. Check browser console for frontend errors
4. Verify environment variables

---

**Built with ❤️ for pet lovers everywhere** 🐾

