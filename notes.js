/* /static/js/notes.js */

document.addEventListener('DOMContentLoaded', () => {
    const $ = document.querySelector.bind(document);
    
    // Lấy các phần tử DOM
    const noteTitleInput = $('#note-title');
    const noteContentInput = $('#note-content');
    const saveNoteBtn = $('#save-note-btn');
    const notesListDiv = $('#notes-list');

    const STORAGE_KEY = 'hanamiNotes';

    // Lấy ghi chú từ localStorage
    function getNotes() {
        const notes = localStorage.getItem(STORAGE_KEY);
        return notes ? JSON.parse(notes) : [];
    }

    // Lưu ghi chú vào localStorage
    function saveNotes(notes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }

    // Hiển thị ghi chú
    function renderNotes() {
        const notes = getNotes();
        notesListDiv.innerHTML = ''; // Xóa danh sách cũ

        if (notes.length === 0) {
            notesListDiv.innerHTML = '<p>Chưa có ghi chú nào.</p>';
            return;
        }

        // Sắp xếp ghi chú, mới nhất lên đầu
        notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note-item');
            noteElement.dataset.id = note.id; // Thêm ID vào data-attribute

            const formattedDate = new Date(note.timestamp).toLocaleString('vi-VN');

            noteElement.innerHTML = `
                <h4>${escapeHTML(note.title)}</h4>
                <small class="note-item-date">${formattedDate}</small>
                <p>${escapeHTML(note.content)}</p>
                <button class="note-item-delete" title="Xóa ghi chú">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            notesListDiv.appendChild(noteElement);
        });
    }

    // Hàm xử lý lưu ghi chú mới
    function handleSaveNote() {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();

        if (!title || !content) {
            alert('Vui lòng nhập cả tiêu đề và nội dung ghi chú.');
            return;
        }

        const notes = getNotes();
        const newNote = {
            id: `note-${Date.now()}`,
            title: title,
            content: content,
            timestamp: new Date().toISOString()
        };

        notes.push(newNote);
        saveNotes(notes);

        // Xóa trường nhập liệu
        noteTitleInput.value = '';
        noteContentInput.value = '';

        // Cập nhật danh sách
        renderNotes();
    }

    // Hàm xử lý sự kiện click trên danh sách ghi chú (để xóa)
    function handleListClick(event) {
        // Sử dụng event delegation
        const deleteButton = event.target.closest('.note-item-delete');
        
        if (deleteButton) {
            const noteItem = deleteButton.closest('.note-item');
            const noteId = noteItem.dataset.id;
            
            if (confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
                deleteNoteById(noteId);
            }
        }
    }

    // Xóa ghi chú theo ID
    function deleteNoteById(id) {
        let notes = getNotes();
        notes = notes.filter(note => note.id !== id);
        saveNotes(notes);
        renderNotes(); // Cập nhật lại UI
    }

    // Hàm tiện ích để tránh lỗi XSS
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, function(match) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[match];
        });
    }

    // Gán sự kiện
    saveNoteBtn.addEventListener('click', handleSaveNote);
    notesListDiv.addEventListener('click', handleListClick);

    // Tải ghi chú lần đầu khi mở trang
    renderNotes();
});
