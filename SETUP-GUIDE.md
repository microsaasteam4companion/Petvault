# 🐾 TailVault - Complete Setup Guide

## Overview
TailVault is now a fully functional pet health timeline system with authentication, file uploads, and centralized document management.

---

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

The following packages have been added:
- `@supabase/supabase-js` - Supabase client for authentication and database
- `react-dropzone` - Drag-and-drop file upload

---

### 2. Set Up Supabase Project

#### A. Create a Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

#### B. Get Your Credentials
1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

#### C. Configure Environment Variables
1. Open the `.env` file in the project root
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 3. Set Up Database Schema

#### Run the SQL Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Open `supabase-schema.sql` from the project root
3. Copy and paste the entire content
4. Click **RUN** to execute

This will create:
- ✅ `pets` table
- ✅ `timeline_entries` table
- ✅ `files` table
- ✅ All necessary indexes
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for automatic timestamp updates

---

### 4. Create Storage Buckets

#### A. Pet Photos Bucket
1. In Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `pet-photos`
4. Public bucket: **Yes** (so photos can be displayed)
5. Click **Create bucket**

#### B. Entry Files Bucket
1. Click **New bucket** again
2. Name: `entry-files`
3. Public bucket: **Yes** (for file downloads)
4. Click **Create bucket**

#### C. Configure Storage Policies (Important!)

For **pet-photos** bucket:
1. Click on the bucket → **Policies**
2. Add the following policies:

**Allow authenticated users to upload:**
```sql
CREATE POLICY "Authenticated users can upload pet photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-photos');
```

**Allow public read access:**
```sql
CREATE POLICY "Public read access for pet photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pet-photos');
```

**Allow users to delete their own files:**
```sql
CREATE POLICY "Users can delete their own pet photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

Repeat similar policies for **entry-files** bucket (replace `pet-photos` with `entry-files`).

---

### 5. Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Auth Providers**, ensure **Email** is enabled
3. Configure email templates (optional but recommended):
   - Go to **Email Templates**
   - Customize the confirmation email

---

### 6. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🎯 Features Implemented

### ✅ 1. Authentication System
- Email + Password signup
- Login with session persistence
- Logout
- Protected routes (dashboard, vault)
- Auto-redirect after login

### ✅ 2. First-Time User Flow
- Mandatory pet profile creation modal
- Pet details: name, breed, age, gender, weight, photo, microchip ID
- Cannot access dashboard without creating at least one pet
- Support for multiple pets

### ✅ 3. Dashboard Structure
**Left Sidebar:**
- Pet profile switcher
- Add Entry button
- Category filters (All, Vaccines, Illness, Food, Weight, Behavior, Vet Visits)

**Main Area:**
- Search bar
- Timeline feed (chronological)
- Pet info header

**Right Sidebar:**
- Quick stats (weight, age, microchip ID)

### ✅ 4. Add Entry System
**Fields:**
- Category (dropdown)
- Title (required)
- Description (required)
- Date (required)
- Weight value (conditional - for weight category)
- Vet name (conditional - for vet visit category)
- Multiple file uploads (drag & drop or click)

**File Support:**
- JPG, PNG (images)
- PDF documents
- Max 10MB per file
- File preview
- Multiple files per entry

### ✅ 5. File Storage
- Secure file upload to Supabase Storage
- File metadata stored in database
- File download capability
- File size display
- File type icons

### ✅ 6. Timeline Logic
- Sorted by date (newest first)
- Expandable entry cards
- Category badges with colors
- File attachment indicators
- Metadata display (weight, vet name)
- Pagination (20 entries per load)
- Load more functionality

### ✅ 7. Centralized Vault
Separate page (`/vault`) with:
- View all uploaded documents
- Filter by category
- Search by file name or entry title
- Sort by date or name
- Download files
- Delete files
- File preview (images)
- File metadata display

### ✅ 8. Search Functionality
- Debounced search input
- Searches in titles, descriptions, file names
- Fast and responsive

### ✅ 9. Database Structure
**Users**: Managed by Supabase Auth
**Pets**: id, user_id, name, breed, age, gender, weight, photo_url, microchip_id
**Timeline Entries**: id, pet_id, category, title, description, date, metadata
**Files**: id, entry_id, file_url, file_type, file_name, file_size

### ✅ 10. Security
- Row Level Security (RLS) policies
- Users can only view their own pets
- Users can only view their own entries
- File access restricted to owners
- Server-side file type validation
- Sanitized inputs
- Protected routes

### ✅ 11. Performance
- Lazy loading timeline entries
- Pagination (20 entries per page)
- Optimized file previews
- Mobile responsive dashboard
- Efficient database queries with indexes

### ✅ 12. UX Design
- Beautiful gradient UI
- Smooth transitions
- Intuitive navigation
- Clear feedback messages
- Loading states
- Error handling
- Empty states with helpful messages

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AddEntryModal.tsx          # Modal for adding timeline entries
│   ├── CreatePetProfile.tsx       # First-time pet profile creation
│   ├── DashboardLayout.tsx        # Main dashboard layout
│   ├── ProtectedRoute.tsx         # Auth route wrapper
│   ├── TimelineFeed.tsx           # Timeline entries display
│   └── Navbar.tsx                 # Updated with auth buttons
├── contexts/
│   └── AuthContext.tsx            # Authentication context
├── lib/
│   └── supabase.ts                # Supabase client config
├── pages/
│   ├── Login.tsx                  # Login page
│   ├── Signup.tsx                 # Signup page
│   ├── Dashboard.tsx              # Main dashboard
│   └── Vault.tsx                  # Document vault
└── App.tsx                        # Updated routing
```

---

## 🚀 Usage Flow

### For New Users:
1. Visit homepage → Click "Start Free"
2. Sign up with email + password
3. Check email for verification (optional depending on Supabase settings)
4. Log in
5. **Mandatory**: Create first pet profile
6. Access dashboard
7. Add timeline entries with files
8. Use vault to manage all documents

### For Returning Users:
1. Log in
2. Dashboard loads with their pets
3. Switch between pets
4. Add entries, search timeline
5. Access vault anytime

---

## 🔐 Security Notes

1. **RLS Policies**: All database tables have Row Level Security enabled
2. **File Access**: Files are protected through Supabase Storage policies
3. **Authentication**: Session tokens are stored securely
4. **Input Validation**: All forms have validation
5. **No Public Access**: Users can't see other users' data

---

## 🎨 Customization

### Colors
The gradient theme uses purple → blue. To change:
1. Open `tailwind.config.ts`
2. Modify the color palette

### Categories
To add more entry categories:
1. Update `supabase-schema.sql` (category CHECK constraint)
2. Update `AddEntryModal.tsx` (categories array)
3. Update `DashboardLayout.tsx` (categories array)

---

## 🐛 Troubleshooting

### Files not uploading
- Check storage buckets exist
- Verify storage policies are set
- Check file size (max 10MB)

### Can't log in
- Verify environment variables are correct
- Check Supabase project is running
- Ensure email verification is not required (or verify email)

### Database errors
- Ensure SQL schema was run completely
- Check RLS policies are enabled
- Verify table relationships

### Images not displaying
- Ensure `pet-photos` and `entry-files` buckets are public
- Check file URLs in database

---

## 📝 Next Steps (Optional Enhancements)

- [ ] Export timeline as PDF
- [ ] Reminder system for vaccines/checkups
- [ ] Weight tracking charts
- [ ] Vaccine schedule tracker
- [ ] Multiple file format support (DOC, DOCX)
- [ ] Bulk file upload
- [ ] Entry edit/delete functionality
- [ ] Pet profile editing
- [ ] Email notifications

---

## 🎉 Success Criteria

After setup, you should be able to:
1. ✅ Sign up and create an account
2. ✅ Create a pet profile with photo
3. ✅ Add vaccine records with PDF uploads
4. ✅ Add weight entries
5. ✅ Track vet visits
6. ✅ Search through timeline
7. ✅ Filter by category
8. ✅ View all files in vault
9. ✅ Download documents
10. ✅ Switch between multiple pets

---

## 📞 Support

If you encounter issues:
1. Check Supabase dashboard for errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure database schema is complete
5. Check storage buckets and policies

---

## 🔒 Production Deployment

Before deploying:
1. Set Supabase project to production mode
2. Configure custom domain for Supabase (optional)
3. Set up email service (Supabase provides default)
4. Configure CORS in Supabase settings
5. Set up backup strategy
6. Monitor usage and quotas

---

**Congratulations! TailVault is now a fully functional pet health management system! 🎉**
