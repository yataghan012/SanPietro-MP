import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Edit2, Trash2, Image as ImageIcon, Check, X, List, Utensils } from 'lucide-react';

interface Categoria {
  id: string;
  nombre: string;
  orden: number;
  activo: boolean;
}

interface MenuItem {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: string;
  foto_url: string | null;
  es_sin_tacc: boolean;
  es_vegetariano: boolean;
  activo: boolean;
  orden: number;
  sucursal: string;
}

const SUCURSALES = ['ambas', 'general_paz', 'cerro'];

export default function AdminMenuView() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'platos' | 'categorias'>('platos');
  
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [catsResponse, itemsResponse] = await Promise.all([
        supabase.from('categorias').select('*').order('orden'),
        supabase.from('menu_items').select('*').order('orden')
      ]);
      
      if (catsResponse.error) throw catsResponse.error;
      if (itemsResponse.error) throw itemsResponse.error;
      
      setCategorias(catsResponse.data || []);
      setItems(itemsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // --- CATEGORIAS ---
  async function handleDeleteCategoria(id: string) {
    const hasItems = items.some(item => item.categoria_id === id);
    if (hasItems) {
      alert('No puedes eliminar esta categoría porque tiene platos asociados. Elimina o mueve los platos primero.');
      return;
    }
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;
    
    try {
      const { error } = await supabase.from('categorias').delete().eq('id', id);
      if (error) throw error;
      setCategorias(categorias.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría');
    }
  }

  async function handleToggleCategoriaActivo(id: string, currentActivo: boolean) {
    try {
      const { error } = await supabase.from('categorias').update({ activo: !currentActivo }).eq('id', id);
      if (error) throw error;
      setCategorias(categorias.map(c => c.id === id ? { ...c, activo: !currentActivo } : c));
    } catch (error) {
      console.error('Error toggling category:', error);
    }
  }

  async function handleSaveCategoria(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategoria) return;

    try {
      if (editingCategoria.id) {
        const { error } = await supabase.from('categorias').update(editingCategoria).eq('id', editingCategoria.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categorias').insert([editingCategoria]);
        if (error) throw error;
      }
      setIsCategoriaModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría');
    }
  }

  function openCategoriaModal(cat?: Categoria) {
    if (cat) {
      setEditingCategoria(cat);
    } else {
      setEditingCategoria({
        nombre: '',
        orden: (categorias.length + 1) * 10,
        activo: true
      } as Categoria);
    }
    setIsCategoriaModalOpen(true);
  }

  // --- PLATOS ---
  async function handleDeleteItem(id: string) {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este plato?')) return;
    
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error al eliminar el plato');
    }
  }

  async function handleToggleItemActivo(id: string, currentActivo: boolean) {
    try {
      const { error } = await supabase.from('menu_items').update({ activo: !currentActivo }).eq('id', id);
      if (error) throw error;
      setItems(items.map(item => item.id === id ? { ...item, activo: !currentActivo } : item));
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !editingItem) return;
    const file = e.target.files[0];
    
    // Basic validation
    if (file.size > 2 * 1024 * 1024) {
      setUploadStatus({ type: 'error', message: 'La imagen es demasiado grande (máx 2MB)' });
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploadingImage(true);
    setUploadStatus({ type: null, message: '' });
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('menu-fotos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase Storage Error:', uploadError);
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('menu-fotos')
        .getPublicUrl(filePath);

      setEditingItem({ ...editingItem, foto_url: publicUrl });
      setUploadStatus({ type: 'success', message: 'Imagen subida correctamente' });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message === 'Object not found' 
          ? 'El bucket "menu-fotos" no existe. Por favor, créalo en Supabase.' 
          : `Error: ${error.message}` 
      });
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSaveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    try {
      if (editingItem.id) {
        // Update
        const { error } = await supabase.from('menu_items').update(editingItem).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from('menu_items').insert([editingItem]);
        if (error) throw error;
      }
      setIsItemModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error al guardar el plato');
    } finally {
      setSaving(false);
    }
  }

  function openItemModal(item?: MenuItem) {
    if (categorias.length === 0) {
      alert('Debes crear al menos una categoría antes de agregar platos.');
      return;
    }

    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria_id: categorias[0].id,
        foto_url: null,
        es_sin_tacc: false,
        es_vegetariano: false,
        activo: true,
        orden: 0,
        sucursal: 'ambas'
      } as MenuItem);
    }
    setIsItemModalOpen(true);
  }

  if (loading) return <div className="p-8">Cargando menú...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className={`font-serif text-3xl ${theme === 'dark' ? 'text-warm-gold-400' : 'text-terracotta-600'}`}>
            Gestión de Menú
          </h2>
          <p className={`font-sans text-sm mt-2 ${theme === 'dark' ? 'text-sand-100/60' : 'text-charcoal-900/60'}`}>
            Administra las categorías y platos de tu carta.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('categorias')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm font-sans text-xs uppercase tracking-widest font-bold transition-colors ${
              activeTab === 'categorias'
                ? theme === 'dark' ? 'bg-warm-gold-400 text-charcoal-900' : 'bg-terracotta-600 text-white'
                : theme === 'dark' ? 'bg-charcoal-800 text-sand-100 hover:bg-charcoal-700' : 'bg-white text-charcoal-900 border hover:bg-charcoal-50'
            }`}
          >
            <List size={16} /> Categorías
          </button>
          <button
            onClick={() => setActiveTab('platos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm font-sans text-xs uppercase tracking-widest font-bold transition-colors ${
              activeTab === 'platos'
                ? theme === 'dark' ? 'bg-warm-gold-400 text-charcoal-900' : 'bg-terracotta-600 text-white'
                : theme === 'dark' ? 'bg-charcoal-800 text-sand-100 hover:bg-charcoal-700' : 'bg-white text-charcoal-900 border hover:bg-charcoal-50'
            }`}
          >
            <Utensils size={16} /> Platos
          </button>
        </div>
      </div>

      {activeTab === 'categorias' && (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => openCategoriaModal()}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm font-sans text-xs uppercase tracking-widest font-bold transition-colors ${
                theme === 'dark'
                  ? 'bg-warm-gold-400 text-charcoal-900 hover:bg-warm-gold-500'
                  : 'bg-terracotta-600 text-white hover:bg-terracotta-700'
              }`}
            >
              <Plus size={16} /> Nueva Categoría
            </button>
          </div>

          <div className={`rounded-sm border overflow-hidden ${theme === 'dark' ? 'border-warm-gold-400/20' : 'border-charcoal-900/10'}`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs uppercase tracking-widest ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20' : 'bg-charcoal-50 border-charcoal-900/10'}`}>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Orden</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map(cat => (
                  <tr key={cat.id} className={`border-b last:border-0 ${theme === 'dark' ? 'border-charcoal-800' : 'border-charcoal-100'}`}>
                    <td className="p-4 font-serif text-lg">{cat.nombre}</td>
                    <td className="p-4">{cat.orden}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleCategoriaActivo(cat.id, cat.activo)}
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          cat.activo 
                            ? 'bg-green-500/20 text-green-600' 
                            : 'bg-charcoal-500/20 text-charcoal-500'
                        }`}
                      >
                        {cat.activo ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openCategoriaModal(cat)}
                          className={`p-1.5 rounded-sm transition-colors ${
                            theme === 'dark' ? 'text-warm-gold-400 hover:bg-warm-gold-400/10' : 'text-terracotta-600 hover:bg-terracotta-600/10'
                          }`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategoria(cat.id)}
                          className="p-1.5 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center opacity-50">No hay categorías creadas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'platos' && (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => openItemModal()}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm font-sans text-xs uppercase tracking-widest font-bold transition-colors ${
                theme === 'dark'
                  ? 'bg-warm-gold-400 text-charcoal-900 hover:bg-warm-gold-500'
                  : 'bg-terracotta-600 text-white hover:bg-terracotta-700'
              }`}
            >
              <Plus size={16} /> Nuevo Plato
            </button>
          </div>

          <div className="space-y-12">
            {categorias.map(category => {
              const categoryItems = items.filter(item => item.categoria_id === category.id);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category.id}>
                  <h3 className={`font-serif text-2xl mb-4 border-b pb-2 ${
                    theme === 'dark' ? 'text-sand-100 border-warm-gold-400/20' : 'text-charcoal-900 border-charcoal-900/10'
                  }`}>
                    {category.nombre}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map(item => (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-sm border flex flex-col gap-3 ${
                          theme === 'dark' 
                            ? 'bg-charcoal-800 border-warm-gold-400/10' 
                            : 'bg-white border-charcoal-900/10'
                        } ${!item.activo && 'opacity-60'}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex gap-3 items-center">
                            {item.foto_url ? (
                              <img src={item.foto_url} alt={item.nombre} className="w-10 h-10 object-cover rounded-sm flex-shrink-0" />
                            ) : (
                              <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-charcoal-700' : 'bg-charcoal-50'}`}>
                                <Utensils size={16} className="opacity-20" />
                              </div>
                            )}
                            <h4 className="font-serif text-lg font-bold">{item.nombre}</h4>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleToggleItemActivo(item.id, item.activo)}
                              className={`p-1.5 rounded-sm transition-colors ${
                                item.activo 
                                  ? 'text-green-500 hover:bg-green-500/10' 
                                  : 'text-charcoal-500 hover:bg-charcoal-500/10'
                              }`}
                              title={item.activo ? 'Desactivar' : 'Activar'}
                            >
                              {item.activo ? <Check size={16} /> : <X size={16} />}
                            </button>
                            <button 
                              onClick={() => openItemModal(item)}
                              className={`p-1.5 rounded-sm transition-colors ${
                                theme === 'dark' ? 'text-warm-gold-400 hover:bg-warm-gold-400/10' : 'text-terracotta-600 hover:bg-terracotta-600/10'
                              }`}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 rounded-sm text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <span className="font-bold">${item.precio.toLocaleString('es-AR')}</span>
                          {item.es_sin_tacc && <span className="text-terracotta-500 border border-terracotta-500/30 px-1 rounded">Sin TACC</span>}
                          {item.es_vegetariano && <span className="text-green-600 border border-green-600/30 px-1 rounded">Veg</span>}
                        </div>
                        <p className={`text-xs line-clamp-2 ${theme === 'dark' ? 'text-sand-100/60' : 'text-charcoal-900/60'}`}>
                          {item.descripcion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Categoria Modal */}
      {isCategoriaModalOpen && editingCategoria && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-sm shadow-2xl ${
            theme === 'dark' ? 'bg-charcoal-900 border border-warm-gold-400/20' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl">{editingCategoria.id ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
              <button onClick={() => setIsCategoriaModalOpen(false)} className="p-2 hover:bg-charcoal-500/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategoria} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Nombre</label>
                <input 
                  type="text" 
                  required
                  value={editingCategoria.nombre}
                  onChange={e => setEditingCategoria({...editingCategoria, nombre: e.target.value})}
                  className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Orden (menor número aparece primero)</label>
                <input 
                  type="number" 
                  required
                  value={editingCategoria.orden}
                  onChange={e => setEditingCategoria({...editingCategoria, orden: Number(e.target.value)})}
                  className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                />
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingCategoria.activo}
                    onChange={e => setEditingCategoria({...editingCategoria, activo: e.target.checked})}
                  />
                  <span className="text-sm">Activa (Visible)</span>
                </label>
              </div>
              
              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-charcoal-500/20">
                <button 
                  type="button"
                  onClick={() => setIsCategoriaModalOpen(false)}
                  className="px-4 py-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className={`px-6 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors ${
                    theme === 'dark'
                      ? 'bg-warm-gold-400 text-charcoal-900 hover:bg-warm-gold-500'
                      : 'bg-terracotta-600 text-white hover:bg-terracotta-700'
                  }`}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-sm shadow-2xl ${
            theme === 'dark' ? 'bg-charcoal-900 border border-warm-gold-400/20' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl">{editingItem.id ? 'Editar Plato' : 'Nuevo Plato'}</h3>
              <button onClick={() => setIsItemModalOpen(false)} className="p-2 hover:bg-charcoal-500/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Nombre</label>
                  <input 
                    type="text" 
                    required
                    value={editingItem.nombre}
                    onChange={e => setEditingItem({...editingItem, nombre: e.target.value})}
                    className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Precio</label>
                  <input 
                    type="number" 
                    required
                    value={editingItem.precio}
                    onChange={e => setEditingItem({...editingItem, precio: Number(e.target.value)})}
                    className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Descripción</label>
                  <textarea 
                    rows={3}
                    value={editingItem.descripcion}
                    onChange={e => setEditingItem({...editingItem, descripcion: e.target.value})}
                    className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Categoría</label>
                  <select 
                    value={editingItem.categoria_id}
                    onChange={e => setEditingItem({...editingItem, categoria_id: e.target.value})}
                    className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                  >
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Sucursal</label>
                  <select 
                    value={editingItem.sucursal}
                    onChange={e => setEditingItem({...editingItem, sucursal: e.target.value})}
                    className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                  >
                    {SUCURSALES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Orden</label>
                  <input 
                    type="number" 
                    value={editingItem.orden}
                    onChange={e => setEditingItem({...editingItem, orden: Number(e.target.value)})}
                    className={`w-full p-2 rounded-sm border ${theme === 'dark' ? 'bg-charcoal-800 border-warm-gold-400/20 text-sand-100' : 'bg-white border-charcoal-900/20 text-charcoal-900'}`}
                  />
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingItem.es_sin_tacc}
                      onChange={e => setEditingItem({...editingItem, es_sin_tacc: e.target.checked})}
                    />
                    <span className="text-sm">Es Sin TACC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingItem.es_vegetariano}
                      onChange={e => setEditingItem({...editingItem, es_vegetariano: e.target.checked})}
                    />
                    <span className="text-sm">Es Vegetariano</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={editingItem.activo}
                      onChange={e => setEditingItem({...editingItem, activo: e.target.checked})}
                    />
                    <span className="text-sm">Activo (Visible)</span>
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest mb-1 opacity-70">Foto</label>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                      {editingItem.foto_url ? (
                        <div className="relative group w-24 h-24">
                          <img src={editingItem.foto_url} alt="Preview" className="w-full h-full object-cover rounded-sm border border-charcoal-500/20" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                            <ImageIcon className="text-white" size={20} />
                          </div>
                        </div>
                      ) : (
                        <div className={`w-24 h-24 rounded-sm border-2 border-dashed flex items-center justify-center ${
                          theme === 'dark' ? 'border-warm-gold-400/20 bg-charcoal-800' : 'border-charcoal-900/10 bg-charcoal-50'
                        }`}>
                          <ImageIcon size={24} className="opacity-20" />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2">
                        <label className={`flex items-center gap-2 px-4 py-2 border rounded-sm cursor-pointer transition-colors ${
                          theme === 'dark' ? 'border-warm-gold-400/30 hover:bg-warm-gold-400/10' : 'border-charcoal-900/30 hover:bg-charcoal-900/5'
                        } ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {uploadingImage ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Plus size={16} />
                          )}
                          <span className="text-xs uppercase tracking-widest font-bold">
                            {uploadingImage ? 'Subiendo...' : editingItem.foto_url ? 'Cambiar Imagen' : 'Subir Imagen'}
                          </span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                        <p className="text-[10px] opacity-50 uppercase tracking-tighter">Máx 2MB. Formatos: JPG, PNG, WEBP.</p>
                      </div>
                    </div>

                    {uploadStatus.type && (
                      <div className={`text-xs p-2 rounded-sm flex items-center gap-2 ${
                        uploadStatus.type === 'success' 
                          ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                          : 'bg-red-500/10 text-red-600 border border-red-500/20'
                      }`}>
                        {uploadStatus.type === 'success' ? <Check size={14} /> : <X size={14} />}
                        {uploadStatus.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-charcoal-500/20">
                <button 
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 text-sm uppercase tracking-widest opacity-70 hover:opacity-100"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={uploadingImage || saving}
                  className={`px-6 py-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-colors flex items-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-warm-gold-400 text-charcoal-900 hover:bg-warm-gold-500'
                      : 'bg-terracotta-600 text-white hover:bg-terracotta-700'
                  } disabled:opacity-50`}
                >
                  {saving && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
