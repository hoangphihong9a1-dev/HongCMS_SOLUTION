import { useState } from 'react';
import Header from '../components/Header';
import { Plus, Search, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import { useCategoryContext } from '../context/CategoryContext';
import './GenericPage.css';
import './SharedComponents.css';
import './ProductCategoriesPage.css';

const colorPalette = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];
const iconPalette = ['💻', '👗', '🍎', '🏠', '💄', '⚽', '📦', '🎨', '🎵', '📚'];

export default function ProductCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, getProductCount } = useCategoryContext();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState('active');

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingCat(null);
    setFormName('');
    setFormDesc('');
    setFormStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormName(cat.name);
    setFormDesc(cat.description);
    setFormStatus(cat.status);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCat) {
      updateCategory(editingCat.id, {
        name: formName.trim(),
        description: formDesc.trim(),
        status: formStatus,
      });
    } else {
      addCategory({
        name: formName.trim(),
        description: formDesc.trim(),
        status: formStatus,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteCategory(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="page">
      <Header title="Danh Mục Sản Phẩm" subtitle="Quản lý các danh mục cho sản phẩm" />
      <div className="page-body">
        <div className="card animate-fadeInUp">
          <div className="gp-toolbar">
            <div className="gp-search">
              <Search size={15} />
              <input
                placeholder="Tìm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="gp-actions">
              <button className="btn-primary" onClick={openAddModal}>
                <Plus size={14} /> Thêm danh mục
              </button>
            </div>
          </div>

          <div className="cat-grid">
            {filtered.map((cat, i) => {
              const productCount = getProductCount(cat.id);
              return (
                <div key={cat.id} className="cat-card">
                  <div className="cat-icon" style={{
                    background: `${colorPalette[i % colorPalette.length]}20`,
                    border: `1px solid ${colorPalette[i % colorPalette.length]}30`
                  }}>
                    <span style={{ fontSize: '22px' }}>
                      {iconPalette[i % iconPalette.length]}
                    </span>
                  </div>
                  <div className="cat-info">
                    <h4 className="cat-name">{cat.name}</h4>
                    <p className="cat-desc">{cat.description}</p>
                    <div className="cat-meta">
                      <span className="cat-slug">/{cat.slug}</span>
                      <span style={{
                        fontSize: '12px', fontWeight: 600,
                        color: colorPalette[i % colorPalette.length]
                      }}>
                        {productCount} sản phẩm
                      </span>
                    </div>
                  </div>
                  <div className="cat-actions">
                    <span className={`status-badge ${cat.status === 'active' ? 'status-completed' : 'status-cancelled'}`}>
                      {cat.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                    </span>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEditModal(cat)}>
                        <Edit2 size={14} />
                      </button>
                      <button className="action-btn delete" onClick={() => setDeleteConfirm(cat)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="cat-empty">
                <span>📂</span>
                <p>Không tìm thấy danh mục nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ ADD/EDIT MODAL ============ */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCat ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Tên danh mục <span className="required">*</span></label>
                <input
                  className="form-input"
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="VD: Điện tử & Công nghệ"
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mô tả</label>
                <textarea
                  className="form-input form-textarea"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Mô tả ngắn gọn về danh mục..."
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Trạng thái</label>
                <div className="status-toggle">
                  <button
                    type="button"
                    className={`st-btn ${formStatus === 'active' ? 'active' : ''}`}
                    onClick={() => setFormStatus('active')}
                  >
                    <Check size={14} /> Hoạt động
                  </button>
                  <button
                    type="button"
                    className={`st-btn ${formStatus === 'inactive' ? 'active inactive' : ''}`}
                    onClick={() => setFormStatus('inactive')}
                  >
                    Ẩn
                  </button>
                </div>
              </div>
              {editingCat && (
                <div className="form-notice">
                  <span className="notice-icon">💡</span>
                  <span>Khi sửa tên danh mục, tất cả sản phẩm thuộc danh mục này sẽ tự động được cập nhật.</span>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Huỷ
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={14} /> {editingCat ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRM ============ */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content modal-sm animate-fadeInUp" onClick={e => e.stopPropagation()}>
            <div className="delete-modal-body">
              <div className="delete-icon">
                <AlertTriangle size={32} />
              </div>
              <h3>Xoá danh mục?</h3>
              <p>Bạn có chắc muốn xoá <strong>"{deleteConfirm.name}"</strong>?</p>
              <p className="delete-warning">
                {getProductCount(deleteConfirm.id)} sản phẩm thuộc danh mục này sẽ trở thành chưa phân loại.
              </p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setDeleteConfirm(null)}>
                  Huỷ bỏ
                </button>
                <button className="btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>
                  <Trash2 size={14} /> Xác nhận xoá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
