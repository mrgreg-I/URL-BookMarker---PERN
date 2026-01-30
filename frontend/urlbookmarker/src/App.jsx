import React, { useState, useEffect }from 'react';
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
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './App.css';


export default function CustomPaginationActionsTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: ''
  });

  // Fetch bookmarks from API
  useEffect(() => {
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

  // Filter bookmarks based on search term and category
  // categoryFilter added to the filtering logic for dropdown category selection
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || bookmark.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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

  //dropdown category 
  const handleChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  return (
    <div className='container'>
      {/* Header */}
      <div className='header'>
        <h1 className='title'><BookmarkBorderOutlinedIcon sx={{ height: 60, width: 50 }}/> URL BookMarker</h1>
      </div>

      {/* Search Bar */}
      <div className='search-wrapper'>
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
    className='search-input'
    sx={{padding: '0px'}} 
    fullWidth
  />
</div>

      {/* Category Filter */}
       <Box sx={{ width: 180, marginBottom: '20px' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categoryFilter}
          label="Category"
          onChange={handleChange}
        >
          <MenuItem value=''>All Categories</MenuItem>
          <MenuItem value='Socials'>Socials</MenuItem>
          <MenuItem value='Work'>Work</MenuItem>
          <MenuItem value='Entertainment'>Entertainment</MenuItem>
          <MenuItem value='Education'>Education</MenuItem>
          <MenuItem value='Others'>Others</MenuItem>
        </Select>
      </FormControl>
    </Box>
      {/* Table Container */}
      <div className='table-wrapper'>
        <table className='table'>
          {/* Table Head */}
          <thead>
            <tr className='header-row'>
              <th className='header-cell'>Title</th>
              <th className='header-cell'>URL</th>
              <th className='header-cell'>Category</th>
              <th className='header-cell' sx={{textAlign: 'center'}}>Clicks</th>
              <th className='header-cell' sx={{textAlign: 'center'}}>Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {(rowsPerPage > 0
              ? filteredBookmarks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredBookmarks
            ).map((bookmark, idx) => (
              <tr key={bookmark.id} className='body-row' sx={{
                backgroundColor: idx % 2 === 0 ? '#fff' : '#f9f9f9'
              }}>
                <td className='body-cell'>{bookmark.title}</td>
                <td className='body-cell'>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleUrlClick(bookmark.id)}
                    className='link'
                  >
                    {bookmark.url.length > 40 ? bookmark.url.substring(0, 40) + '...' : bookmark.url}
                  </a>
                </td>
                <td className='body-cell'>
                  <span className='badge'>{bookmark.category}</span>
                </td>
                <td className='body-cell' sx={{textAlign: 'center'}}>
                  <span className='clicks'>{bookmark.clicks}</span>
                </td>
                <td className='body-cell' sx={{textAlign: 'center'}}>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, bookmark.id)}
                    sx={{padding: '4px'}}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {filteredBookmarks.length === 0 && (
              <tr>
                <td colSpan="5" className='body-cell' sx={{textAlign: 'center', padding: '40px', color: '#999'}}>
                  No bookmarks found. Create your first one!
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Footer */}
          <tfoot>
            <tr className='footer-row'>
              <td colSpan="5" className='body-cell' sx={{padding: '16px'}}>
                <div className='pagination-container'>
                  <div className='rows-per-page'>
                    <label>Rows per page:</label>
                    <select
                      value={rowsPerPage}
                      onChange={handleChangeRowsPerPage}
                      className='select'
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={-1}>All</option>
                    </select>
                  </div>

                  <span className='page-info'>
                    {filteredBookmarks.length === 0 ? 0 : page * rowsPerPage + 1} – {Math.min((page + 1) * rowsPerPage, filteredBookmarks.length)} of {filteredBookmarks.length}
                  </span>

                  <div className='pagination-buttons'>
                    <button
                      onClick={() => handleChangePage(null, 0)}
                      disabled={page === 0}
                      className='pagination-btn'  
                      title="First page"
                    >
                      <FirstPageIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleChangePage(null, page - 1)}
                      disabled={page === 0}
                      className='pagination-btn'
                      sx={{ opacity: page === 0 ? 0.5 : 1}}
                      title="Previous page"
                    >
                      <KeyboardArrowLeft fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleChangePage(null, page + 1)}
                      disabled={page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1}
                      className='pagination-btn'
                      sx={{opacity: page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1 ? 0.5 : 1}}
                      title="Next page"
                    >
                      <KeyboardArrowRight fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleChangePage(null, Math.max(0, Math.ceil(filteredBookmarks.length / rowsPerPage) - 1))}
                      disabled={page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1}
                      className='pagination-btn'
                      sx={{ opacity: page >= Math.ceil(filteredBookmarks.length / rowsPerPage) - 1 ? 0.5 : 1}}
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
        className='add-btn'
        sx={{
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

