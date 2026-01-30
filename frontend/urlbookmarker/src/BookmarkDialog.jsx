import React from 'react';
import './BookmarkDialog.css';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';

export default function BookmarkDialog({ open, onClose, onSave, initialData, isEdit }) {
  const [formData, setFormData] = React.useState({
    title: '',
    url: '',
    category: ''
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', url: '', category: '' });
    }
  }, [initialData, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.url || !formData.category) {
      alert('Please fill in all fields');
      return;
    }
    onSave(formData);
  };

  const handleClose = () => {
    setFormData({ title: '', url: '', category: '' });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
         <h2>{isEdit ? (<><EditIcon sx={{ height: 60, width: 50 }}/> Edit Bookmark</>):(<><BookmarkBorderOutlinedIcon sx={{ height: 60, width: 50 }}/> Add New Bookmark</>)}</h2>
          <button className="dialog-close" onClick={handleClose}>&times;</button>
        </div>

        <div className="dialog-body">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter bookmark title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              id="url"
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Work, Personal, Design"
            />
          </div>
        </div>

        <div className="dialog-footer">
          <button className="btn-cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            {isEdit ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
