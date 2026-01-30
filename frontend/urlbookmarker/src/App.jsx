import React from 'react';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkDialog from './BookmarkDialog';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CustomPaginationActionsTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [bookmarks, setBookmarks] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedBookmarkId, setSelectedBookmarkId] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingBookmark, setEditingBookmark] = React.useState(null);
  const [formData, setFormData] = React.useState({
    title: '',
    url: '',
    category: ''
  });

  // Fetch bookmarks from API
  React.useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/bookmarks');
      const result = await response.json();
      // Sort by createdAt descending (newest first)
      const sorted = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookmarks(sorted);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  // Filter bookmarks based on search term
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredBookmarks.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, bookmarkId) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookmarkId(bookmarkId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBookmarkId(null);
  };

  const handleEdit = () => {
    const bookmark = bookmarks.find(b => b.id === selectedBookmarkId);
    if (bookmark) {
      setEditingBookmark(bookmark);
      setIsEditMode(true);
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/api/bookmarks/${selectedBookmarkId}`, {
        method: 'DELETE',
      });
      fetchBookmarks();
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleOpenDialog = () => {
    setIsEditMode(false);
    setEditingBookmark(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setEditingBookmark(null);
    setFormData({ title: '', url: '', category: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveBookmark = async (data) => {
    if (isEditMode && editingBookmark) {
      // Update existing bookmark
      try {
        const response = await fetch(`http://localhost:3000/api/bookmarks/${editingBookmark.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          fetchBookmarks();
          handleCloseDialog();
        } else {
          alert('Failed to update bookmark');
        }
      } catch (error) {
        console.error('Error updating bookmark:', error);
        alert('Error updating bookmark');
      }
    } else {
      // Add new bookmark
      try {
        const response = await fetch('http://localhost:3000/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          fetchBookmarks();
          handleCloseDialog();
        } else {
          alert('Failed to add bookmark');
        }
      } catch (error) {
        console.error('Error adding bookmark:', error);
        alert('Error adding bookmark');
      }
    }
  };

  const handleUrlClick = async (bookmarkId) => {
    try {
      await fetch(`http://localhost:3000/api/bookmarks/${bookmarkId}/click`, {
        method: 'POST',
      });
      fetchBookmarks();
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}><BookmarkBorderOutlinedIcon sx={{ height: 60, width: 50 }}/> URL BookMarker</h1>
      </div>

      {/* Search Bar */}
      <div style={styles.searchWrapper}>
  <TextField
    placeholder="Search by Title or URL..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setPage(0);
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchTwoToneIcon />
        </InputAdornment>
      ),
    }}
    sx={{...styles.searchInput, padding: '0px'}} 
    fullWidth
  />
</div>
      {/* Table Container */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          {/* Table Head */}
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Title</th>
              <th style={styles.headerCell}>URL</th>
              <th style={styles.headerCell}>Category</th>
              <th style={{...styles.headerCell, textAlign: 'center'}}>Clicks</th>
              <th style={{...styles.headerCell, textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {(rowsPerPage > 0
              ? filteredBookmarks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredBookmarks
            ).map((bookmark, idx) => (
              <tr key={bookmark.id} style={{
                ...styles.bodyRow,
                backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9'
              }}>
                <td style={styles.bodyCell}>{bookmark.title}</td>
                <td style={styles.bodyCell}>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleUrlClick(bookmark.id)}
                    style={styles.link}
                  >
                    {bookmark.url.length > 40 ? bookmark.url.substring(0, 40) + '...' : bookmark.url}
                  </a>
                </td>
                <td style={styles.bodyCell}>
                  <span style={styles.badge}>{bookmark.category}</span>
                </td>
                <td style={{...styles.bodyCell, textAlign: 'center'}}>
                  <span style={styles.clicks}>{bookmark.clicks}</span>
                </td>
                <td style={{...styles.bodyCell, textAlign: 'center'}}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, bookmark.id)}
                    style={{padding: '4px'}}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredBookmarks.length === 0 && (
              <tr>
                <td colSpan="5" style={{...styles.bodyCell, textAlign: 'center', padding: '40px', color: '#999'}}>
                  No bookmarks found. Create your first one!
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Footer */}
          <tfoot>
            <tr style={styles.footerRow}>
              <td colSpan="5" style={{...styles.bodyCell, padding: '16px'}}>
                <div style={styles.paginationContainer}>
                  <div style={styles.rowsPerPage}>
                    <label>Rows per page:</label>
                    <select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      style={styles.select}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={-1}>All</option>
                    </select>
                  </div>

                  <span style={styles.pageInfo}>
                    {filteredBookmarks.length === 0 ? 0 : page * rowsPerPage + 1} – {Math.min((page + 1) * rowsPerPage, filteredBookmarks.length)} of {filteredBookmarks.length}
                  </span>

                  <div style={styles.paginationButtons}>
                    <button
                      onClick={() => handleChangePage(null, 0)}
                      disabled={page === 0}
                      style={{...styles.paginationBtn, opacity: page === 0 ? 0.5 : 1}}
                      title="First page"
                    >
                      <FirstPageIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleChangePage(null, page - 1)}
                      disabled={page === 0}
                      style={{...styles.paginationBtn, opacity: page === 0 ? 0.5 : 1}}
                      title="Previous page"
                    >
                      <KeyboardArrowLeft fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1}
                      style={{...styles.paginationBtn, opacity: page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1 ? 0.5 : 1}}
                      title="Next page"
                    >
                      <KeyboardArrowRight fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleChangePage(null, Math.max(0, Math.ceil(filteredBookmarks.length / rowsPerPage) - 1))}
                      disabled={page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1}
                      style={{...styles.paginationBtn, opacity: page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1 ? 0.5 : 1}}
                      title="Last page"
                    >
                      <LastPageIcon fontSize="small" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Add Button */}

      <Button
        onClick={handleOpenDialog}
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          ...styles.addBtn,
          backgroundColor: '#0066cc',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#0052a3',
          },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Add New Bookmark
      </Button>

      {/* Menu - using MUI */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}><EditIcon sx={{ height: 18, width: 18 , marginRight: '10px'}} />Edit</MenuItem>
        <MenuItem onClick={handleDelete}><DeleteIcon sx={{ height: 18, width: 18,marginRight: '10px' }} /> Delete</MenuItem>
      </Menu>

      {/* Dialog - using custom component */}
      <BookmarkDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveBookmark}
        initialData={isEditMode ? editingBookmark : null}
        isEdit={isEditMode}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    gap: '24px',
    background: 'linear-gradient(135deg, #f5f5f5 0%, #efefef 100%)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '42px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#222',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  searchWrapper: {
    width: '100%',
    maxWidth: '600px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  tableWrapper: {
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerRow: {
    backgroundColor: '#f8f8f8',
    borderBottom: '2px solid #ddd',
  },
  headerCell: {
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
  },
  bodyRow: {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s',
  },
  bodyCell: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#e8f0ff',
    color: '#0066cc',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '500',
  },
  clicks: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
  },
  footerRow: {
    backgroundColor: '#fafafa',
    borderTop: '1px solid #ddd',
  },
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  },
  rowsPerPage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#666',
  },
  select: {
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  pageInfo: {
    fontSize: '14px',
    color: '#666',
  },
  paginationButtons: {
    display: 'flex',
    gap: '4px',
  },
  paginationBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },
  addBtn: {
    padding: '12px 28px',
    backgroundColor: '#0066cc',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px',
  },
};