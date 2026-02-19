import fs from 'fs';
import path from 'path';

const titles = [
    "The Ultimate Pet Record Keeper: Why Every Pet Parent Needs a Digital Vault",
    "How to Organize All Your Pet’s Medical Records in One Secure Dashboard",
    "Stop Losing Vet Papers: Create a Digital Pet Health Vault Today",
    "The Smart Way to Store Your Pet’s Vaccination Records Online",
    "Why Every Dog Owner Needs a Pet Health Management System",
    "How to Keep All Your Pet Documents in One Place (Stress-Free Guide)",
    "Digital Pet Care: Managing Your Pet’s Life From One Dashboard",
    "Pet Medical History Tracker: Everything You Need to Know",
    "How a Pet Vault Can Save You During Emergencies",
    "Pet Record Management Made Simple for Busy Owners",
    "How to Track Your Pet’s Vaccinations Without Missing a Date",
    "Best Way to Store Vet Reports Digitally in 2026",
    "Never Miss a Vet Appointment Again: Use a Pet Dashboard",
    "How to Manage Multiple Pets’ Medical Records Easily",
    "Digital Pet Health Tracker vs Paper Records: What’s Better?",
    "Why Emergency Vet Visits Are Easier With a Pet Data Vault",
    "How to Create a Complete Medical Profile for Your Pet",
    "Pet Prescription Tracking: A Smarter Way to Manage Medications",
    "The Best Way to Share Pet Medical Records With Your Vet",
    "Pet Health Data Management: A Beginner’s Guide",
    "How to Track Your Pet’s Daily Routine Like a Pro",
    "The Ultimate Pet Care Dashboard for Modern Pet Parents",
    "Feeding, Grooming, Vet Visits — Manage Everything in One Place",
    "Smart Pet Parenting: Organizing Your Pet’s Entire Life Digitally",
    "How to Build a Digital Pet Care System That Actually Works",
    "The Future of Pet Care: AI + Digital Pet Vaults",
    "Pet Activity & Health Tracking: Why It Matters More Than You Think",
    "How to Keep Track of Multiple Pets Without Getting Overwhelmed",
    "Pet Growth Tracker: Monitor Weight, Diet & Health Easily",
    "How Busy Professionals Can Manage Pet Care Efficiently",
    "Is Your Pet’s Data Safe? Why You Need a Secure Pet Vault",
    "How to Secure Your Pet’s Microchip, Insurance & Medical Records",
    "Digital Pet Data Storage: What Every Owner Should Know",
    "Why Cloud-Based Pet Record Keeping Is the Future",
    "Pet Insurance Documents: Store Them Safely in One Dashboard",
    "How to Protect Important Pet Documents From Loss or Damage",
    "The Safest Way to Manage Your Pet’s Sensitive Information",
    "Pet Emergency Information: Why Digital Access Matters",
    "Centralized Pet Data: The Smartest Move for Modern Owners",
    "How a Pet Dashboard Simplifies Travel With Pets",
    "Tired of Losing Pet Papers? Here’s the Ultimate Solution",
    "The One Tool Every Pet Owner Wishes They Had Sooner",
    "From Chaos to Clarity: Managing Pet Life in One Dashboard",
    "How a Pet Vault Can Reduce Stress for New Pet Parents",
    "The Best Digital Tool for Organizing Your Pet’s Entire Life",
    "Why Pet Owners Are Switching to Digital Health Dashboards",
    "All-in-One Pet Management: The Future of Responsible Pet Parenting",
    "Pet Data Dashboard: The Missing Tool Every Owner Needs",
    "Managing Pets Made Easy With a Centralized Digital Vault",
    "The Complete Guide to Building a Digital Pet Profile",
    "How to Store Pet Medical Records Online (Complete 2026 Guide)",
    "Best Way to Track Your Pet’s Vaccination Records Digitally",
    "Pet Health Records Management: Everything You Need to Know",
    "The Ultimate Pet Health Tracker for Dogs and Cats",
    "How to Organize All Your Pet Documents in One Secure Dashboard",
    "Digital Pet Care App: Why Every Pet Owner Needs One",
    "Pet Vaccination Tracker: Never Miss a Shot Again",
    "How to Create a Digital Pet Health Profile (Step-by-Step)",
    "Best Pet Record Keeper for Multiple Pets",
    "Online Pet Medical Records: Safe, Smart & Stress-Free",
    "Pet Health Tracker App vs Spreadsheet: Which Is Better?",
    "How to Keep Your Dog’s Medical History Organized",
    "Managing Cat Medical Records the Smart Way",
    "Why Every New Pet Owner Needs a Digital Pet Vault",
    "Pet Insurance Documents: How to Store Them Safely Online",
    "The Complete Pet Vaccination Schedule Guide",
    "How to Prepare Your Pet’s Records for Emergency Situations",
    "Best Tools to Track Pet Medications and Prescriptions",
    "How to Share Pet Health Records With Your Vet Easily",
    "Cloud-Based Pet Record Storage: Is It Safe?",
    "Busy Pet Parents: How to Manage Everything in One Dashboard",
    "Pet Care Checklist: A Simple System That Actually Works",
    "How to Organize Multiple Pets Without Getting Overwhelmed",
    "Smart Pet Parenting: Using Digital Tools for Better Care",
    "The Future of Pet Care: Centralized Pet Data Management",
    "How a Pet Dashboard Saves Time and Reduces Stress",
    "Pet Growth & Weight Tracking Made Easy",
    "Digital Pet Journal: Track Health, Diet & Activity",
    "Travel With Pets? Keep All Records in One Place",
    "From Paper Chaos to Digital Clarity: Organizing Pet Life"
];

const categories = [
    { range: [0, 9], name: "Records & Organization" },
    { range: [10, 19], name: "Health & Vet Management" },
    { range: [20, 29], name: "Daily Care" },
    { range: [30, 39], name: "Security & Data Protection" },
    { range: [40, 49], name: "Product-Led Guides" },
    { range: [50, 59], name: "Health & Vet Management" },
    { range: [60, 69], name: "Records & Organization" },
    { range: [70, 79], name: "Productivity & Lifestyle" }
];

const categoriesPool = {
    "Records & Organization": [
        { id: "1586333242150-7e677a837bc5", alt: "Dog sitting next to a laptop with digital records" },
        { id: "1554692498-833c69830293", alt: "Golden Retriever with glasses looking at paperwork" },
        { id: "1513284411815-30fa5117319a", alt: "Organized pet documentation workspace" },
        { id: "1583337130417-3346a1be7dee", alt: "Dog with medical folders and documents" }
    ],
    "Health & Vet Management": [
        { id: "1628009314410-aff749245f1b", alt: "Veterinarian examining a healthy dog in clinic" },
        { id: "1612531383272-59704e607e08", alt: "Professional vet with stethoscope checking pet" },
        { id: "1557864853-241511172236", alt: "Nervous dog getting a checkup at the vet office" },
        { id: "1514888286974-6c03e2ca1dba", alt: "Close up of veterinarian caring for a puppy" }
    ],
    "Daily Care": [
        { id: "1548191265-cc70d3d45ba1", alt: "Owner walking a happy dog in the park" },
        { id: "1517849845537-4d257902454a", alt: "Dog eating healthy food from a bowl" },
        { id: "1516734212186-a967f81ad0d7", alt: "Pet grooming session for a fluffy dog" },
        { id: "1530281700549-e82e7bf110d6", alt: "Dog playing outdoors during daily exercise" }
    ],
    "Security & Data Protection": [
        { id: "1492370284470-7e61d614013a", alt: "Abstract digital security for pet data" },
        { id: "1473614959451-2495147047f0", alt: "Secure pet cloud storage concept" },
        { id: "1494412651461-893f4856b3e3", alt: "Modern pet health vault and data protection" },
        { id: "1563923481-63820bc0d071", alt: "Digital pet files protected on a laptop" }
    ],
    "Product-Led Guides": [
        { id: "1491485880338-75d1d403932a", alt: "Happy pet owner using PetVault dashboard" },
        { id: "1511270339341-3ef3d62b2d0d", alt: "Pet parent smiling while organizing life with PetVault" },
        { id: "1537151608828-ea2b11777ee8", alt: "Minimalist workspace with dog and productivity tools" },
        { id: "1541364983171-a8b30191f630", alt: "Owner and dog collaborating on pet health management" }
    ],
    "Productivity & Lifestyle": [
        { id: "1541364983171-a8b30191f630", alt: "Pet owner staying organized with digital tools" },
        { id: "1517423440428-a5a00ad1f30c", alt: "Modern pet lifestyle and organization" }
    ]
};

const defaultPool = [
    { id: "1517849845537-4d257902454a", alt: "Happy dog in home environment" }
];

const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};

const blogsDir = './src/content/blogs';
if (fs.existsSync(blogsDir)) {
    fs.rmSync(blogsDir, { recursive: true, force: true });
}
fs.mkdirSync(blogsDir, { recursive: true });

titles.forEach((title, index) => {
    const slug = slugify(title);
    const filePath = path.join(blogsDir, `${slug}.md`);

    const category = categories.find(c => index >= c.range[0] && index <= c.range[1])?.name || "Pet Care";
    const pool = categoriesPool[category] || defaultPool;
    const imgData = pool[index % pool.length];

    const date = new Date(Date.now() - index * 86400000).toISOString().split('T')[0];

    const content = `---
title: ${title}
description: Learn ${title.toLowerCase()} and how it can help you become a better pet parent with PetVault.
date: ${date}
image: https://images.unsplash.com/photo-${imgData.id}?auto=format&fit=crop&q=80&w=1600&h=900
imageAlt: "${imgData.alt}"
category: ${category}
tags: [pet care, organization, pet health]
---

# ${title}

Managing your pet's life is a journey filled with joy, but it also comes with significant responsibilities. From tracking medical records to ensuring daily routines are met, the task can often feel overwhelming for even the most dedicated pet parents.

## The Importance of ${title}

In today's fast-paced world, having a centralized system for your pet's needs is no longer a luxury—it's a necessity. Whether you're dealing with a sudden emergency or just trying to keep track of annual vaccinations, the way you manage your pet's information can have a direct impact on their quality of life.

### Key Benefits

1. **Efficiency**: Save hours of searching for lost paperwork.
2. **Accuracy**: Ensure your veterinarian has the most up-to-date information.
3. **Peace of Mind**: Know that your pet's vital data is secure and accessible 24/7.

## Practical Tips for Implementation

To get started with ${title.toLowerCase()}, follow these simple steps:

- **Audit Your Current Files**: Gather all physical and digital records.
- **Choose a Central Tool**: Use PetVault to create a single source of truth.
- **Establish a Routine**: Set aside 5 minutes a week to update your pet's profile.

## Conclusion

By taking the time to focus on ${title.toLowerCase()}, you're making a long-term investment in your pet's health and happiness. Remember, a well-organized pet parent is a prepared pet parent.

---

## Frequently Asked Questions

### 1. Why is this topic important for new pet owners?
It sets the foundation for a lifetime of healthy habits and ensures you never feel overwhelmed by the administrative side of pet care.

### 2. Can I use these techniques for multiple pets?
Absolutely. A centralized dashboard is actually most beneficial when managing multiple pet profiles simultaneously.

### 3. What tools do I need to get started?
All you need is your pet's current records and a PetVault account to begin organizing their life digitally.

### 4. How often should I review these settings?
We recommend a quick monthly check to ensure all data is current and upcoming reminders are set.

### 5. Is it difficult to maintain this system?
Not at all. Once the initial setup is complete, maintenance takes only a few minutes after each significant pet-related event.
`;

    fs.writeFileSync(filePath, content);
    console.log(`Generated: ${slug}`);
});

// Generate sitemap
const publicDir = './public';
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://petvault.com/</loc>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://petvault.com/blogs</loc>
        <priority>0.8</priority>
    </url>
${titles.map(title => `    <url>
        <loc>https://petvault.com/blogs/${slugify(title)}</loc>
        <priority>0.6</priority>
    </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated!');
