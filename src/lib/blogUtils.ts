export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
    image: string;
    imageAlt?: string;
    category: string;
    tags: string[];
    content: string;
}

const blogFiles = import.meta.glob('../content/blogs/*.md', { query: '?raw', import: 'default', eager: true });
const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1543466448-21d4992dc648?auto=format&fit=crop&q=80&w=1600&h=900";

export const getAllBlogs = (): BlogPost[] => {
    return Object.keys(blogFiles).map((filePath) => {
        const rawContent = (blogFiles[filePath] as string).trim();

        // More robust regex for frontmatter extraction
        const parts = rawContent.split(/^---$/m);
        let frontmatterRaw = '';
        let content = rawContent;

        if (parts.length >= 3) {
            frontmatterRaw = parts[1];
            content = parts.slice(2).join('---').trim();
        }

        const data: any = {};
        frontmatterRaw.split(/\r?\n/).forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();

                // Remove surrounding quotes
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                    data[key] = value.slice(1, -1).split(',').map(t => t.trim().replace(/['"]/g, ''));
                } else {
                    data[key] = value;
                }
            }
        });

        const slug = filePath.split('/').pop()?.replace('.md', '') || '';

        return {
            slug,
            title: data.title || '',
            description: data.description || '',
            date: data.date || '',
            author: data.author || 'PetVault Team',
            image: data.image || DEFAULT_FALLBACK_IMAGE,
            imageAlt: data.imageAlt || data.title || 'Pet health documentation',
            category: data.category || 'Pet Care',
            tags: data.tags || [],
            content,
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getBlogBySlug = (slug: string): BlogPost | undefined => {
    const blogs = getAllBlogs();
    return blogs.find((blog) => blog.slug === slug);
};

export const getRelatedBlogs = (currentBlog: BlogPost, limit = 3): BlogPost[] => {
    const allBlogs = getAllBlogs();
    return allBlogs
        .filter((blog) => blog.slug !== currentBlog.slug)
        .sort((a, b) => {
            // Prioritize same category
            if (a.category === currentBlog.category && b.category !== currentBlog.category) return -1;
            if (a.category !== currentBlog.category && b.category === currentBlog.category) return 1;
            return 0;
        })
        .slice(0, limit);
};
