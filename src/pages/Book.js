import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Style untuk button
const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#F5DEB3', // Warna krem (cream)
    color: '#333', // Teks berwarna gelap untuk kontras
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    margin: '5px',
    transition: 'background-color 0.3s',
};

// Style saat hover pada button
const buttonHoverStyle = {
    backgroundColor: '#E8C89D', // Warna krem yang sedikit lebih gelap saat hover
};

// Komponen BookCard untuk menampilkan detail buku
const BookCard = ({ isAdmin, book, onAddOrder, onCrud, onDelete }) => (
    <div style={{
        border: '1px solid #ddd',
        padding: '20px',
        margin: '10px',
        width: '250px',
        textAlign: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer'
    }}>
        <div style={{
            height: '200px',
            width: '150px',
            margin: '0 auto',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            marginBottom: '15px',
        }}>
            {book.image ? (
                <img src={book.image} alt={book.title} style={{ height: '100%', width: 'auto', objectFit: 'cover', borderRadius: '8px' }} />
            ) : (
                <div>No Image</div>
            )}
        </div>
        <h3 style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#333' }}>{book.title}</h3>

        {/* Kondisi untuk admin, menampilkan tombol untuk edit dan delete */}
        {isAdmin ? (
            <>
                <button
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={() => onCrud(book)}
                    style={buttonStyle}
                >
                    Edit Buku
                </button>
                <button
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                    onClick={() => onDelete(book)}
                    style={buttonStyle}
                >
                    Hapus Buku
                </button>
            </>
        ) : (
            <>
                {/* Kondisi untuk user, menampilkan tombol pinjam buku */}
                <button
                    onMouseOver={(e) => e.target.style.backgroundColor = book.isBorrowed ? '#ccc' : buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = book.isBorrowed ? '#ccc' : buttonStyle.backgroundColor}
                    onClick={() => onAddOrder(book)}
                    style={book.isBorrowed ? { ...buttonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' } : buttonStyle}
                    disabled={book.isBorrowed}
                >
                    {book.isBorrowed ? 'Sedang Dipinjam' : 'Pinjam Buku'}
                </button>
            </>
        )}
    </div>
);

// Komponen utama Book
const Book = () => {
    const [isAdmin, setIsAdmin] = useState(false); // Menyimpan status role admin
    const [books, setBooks] = useState([]); // Menyimpan daftar buku
    const [searchQuery, setSearchQuery] = useState(''); // Menyimpan query pencarian buku
    const navigate = useNavigate();

    // Mengambil role dari localStorage untuk menentukan apakah user adalah admin
    useEffect(() => {
        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
    }, []);

    // Mengambil daftar buku dari localStorage
    useEffect(() => {
        const storedBooks = JSON.parse(localStorage.getItem('books')) || [
            { title: 'Buku A', image: '', isBorrowed: false },
            { title: 'Buku B', image: '', isBorrowed: false },
            { title: 'Buku C', image: '', isBorrowed: false },
        ];
        setBooks(storedBooks);
    }, []);

    // Menyimpan daftar buku ke localStorage setiap kali ada perubahan
    useEffect(() => {
        localStorage.setItem('books', JSON.stringify(books));
    }, [books]);

    // Fungsi untuk menambahkan order (meminjam buku)
    const handleAddOrder = (book) => {
        if (book.isBorrowed) {
            alert(`Buku '${book.title}' sudah dipinjam.`);
            return;
        }

        const currentUser = localStorage.getItem('currentUser') || 'User1';
        const updatedBook = { ...book, isBorrowed: true, borrowedBy: currentUser };

        setBooks(books.map(b => (b === book ? updatedBook : b)));

        // Simpan ke Riwayat
        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.push({
            type: 'book',
            action: 'borrowed',
            title: updatedBook.title,
            user: currentUser,
            date: new Date().toLocaleString(),
            image: updatedBook.image,
        });
        localStorage.setItem('history', JSON.stringify(history));

        // Arahkan ke halaman detail history
        navigate("/detailhistory", { state: { book: updatedBook, type: 'book' } });
    };

    // Fungsi untuk mengedit buku (CRUD)
    const handleCrud = (book) => {
        const choice = prompt('Ketik "judul" untuk mengedit judul, "gambar" untuk mengedit gambar, atau "keduanya" untuk mengedit keduanya:').toLowerCase();
        const updatedBook = { ...book };

        if (choice === 'judul' || choice === 'keduanya') {
            const newTitle = prompt('Edit judul buku:', book.title);
            if (newTitle) updatedBook.title = newTitle;
        }

        if (choice === 'gambar' || choice === 'keduanya') {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        updatedBook.image = reader.result;
                        setBooks(books.map(b => (b === book ? updatedBook : b)));
                    };
                    reader.readAsDataURL(file);
                }
            };
            fileInput.click();
        } else {
            setBooks(books.map(b => (b === book ? updatedBook : b)));
        }
    };

    // Fungsi untuk menghapus buku
    const handleDelete = (book) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus buku '${book.title}'?`)) {
            const updatedBooks = books.filter(b => b !== book);
            setBooks(updatedBooks);
            localStorage.setItem('books', JSON.stringify(updatedBooks));
        }
    };

    // Fungsi untuk menambahkan buku baru
    const handleAddBook = () => {
        const newTitle = prompt('Masukkan judul buku baru:');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setBooks([...books, { title: newTitle, image: reader.result, isBorrowed: false }]);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };

    // Menyaring buku berdasarkan query pencarian
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Cari Buku..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '8px',
                        fontSize: '1em',
                        borderRadius: '20px',
                        border: '1px solid #ddd',
                        width: '250px',
                        outline: 'none',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                    }}
                />
                <div>
                    <button
                        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                        onClick={handleAddBook}
                        style={buttonStyle}
                    >
                        Tambah Buku
                    </button>
                </div>
            </div>

            {isAdmin ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        {filteredBooks.map((book, index) => (
                            <BookCard
                                key={index}
                                isAdmin={true}
                                book={book}
                                onCrud={handleCrud}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        {filteredBooks.map((book, index) => (
                            <BookCard
                                key={index}
                                isAdmin={false}
                                book={book}
                                onAddOrder={handleAddOrder}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Book;
