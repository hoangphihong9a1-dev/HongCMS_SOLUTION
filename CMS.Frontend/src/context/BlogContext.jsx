import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import blogService from '../services/blogService';

const BlogContext = createContext();

const slugify = (name) =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-').replace(/-+/g, '-').trim();

export function BlogProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [postsData, catsData] = await Promise.all([
        blogService.getAllPosts().catch(() => null),
        blogService.getCategories().catch(() => null),
      ]);
      setPosts(postsData || []);
      setCategories(catsData || []);
    } catch (err) {
      console.error('BlogContext loadData error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ============ CATEGORY CRUD ============
  const addCategory = useCallback(async (cat) => {
    try {
      const created = await blogService.createCategory({ name: cat.name, description: cat.description || '' });
      setCategories(prev => [...prev, created]);
    } catch {
      const newId = Math.max(0, ...categories.map(c => c.id)) + 1;
      setCategories(prev => [...prev, { id: newId, name: cat.name, description: cat.description || '', slug: slugify(cat.name) }]);
    }
  }, [categories]);

  const updateCategory = useCallback(async (id, updates) => {
    try {
      await blogService.updateCategory(id, { id, name: updates.name, description: updates.description || '' });
    } catch (e) { /* optimistic fallback */ }
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates, slug: slugify(updates.name || c.name) } : c));
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      await blogService.deleteCategory(id);
    } catch (e) { console.warn('delete category error', e); }
    setCategories(prev => prev.filter(c => c.id !== id));
    setPosts(prev => prev.map(p => p.categoryId === id ? { ...p, categoryId: null, category: null } : p));
  }, []);

  const getCategoryName = useCallback((catId) => {
    const c = categories.find(c => c.id === catId);
    return c ? c.name : 'Chưa phân loại';
  }, [categories]);

  const getPostCount = useCallback((catId) =>
    posts.filter(p => p.categoryId === catId).length, [posts]);

  // ============ POST CRUD ============
  const addPost = useCallback(async (post) => {
    try {
      const created = await blogService.createPost({
        title: post.title, content: post.content || '',
        imageUrl: post.imageUrl || '', categoryId: post.categoryId,
        createdDate: new Date().toISOString(),
      });
      setPosts(prev => [created, ...prev]);
    } catch {
      const newId = Math.max(0, ...posts.map(p => p.id)) + 1;
      setPosts(prev => [{ ...post, id: newId, createdDate: new Date().toISOString() }, ...prev]);
    }
  }, [posts]);

  const updatePost = useCallback(async (id, updates) => {
    try {
      await blogService.updatePost(id, {
        id, title: updates.title, content: updates.content || '',
        imageUrl: updates.imageUrl || '', categoryId: updates.categoryId,
      });
    } catch (e) { console.warn('update post error', e); }
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deletePost = useCallback(async (id) => {
    try {
      await blogService.deletePost(id);
    } catch (e) { console.warn('delete post error', e); }
    setPosts(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <BlogContext.Provider value={{
      posts, categories, loading, loadData,
      addCategory, updateCategory, deleteCategory, getCategoryName, getPostCount,
      addPost, updatePost, deletePost,
    }}>
      {children}
    </BlogContext.Provider>
  );
}

export function useBlogContext() {
  const ctx = useContext(BlogContext);
  if (!ctx) throw new Error('useBlogContext must be used within BlogProvider');
  return ctx;
}
