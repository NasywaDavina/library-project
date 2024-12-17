import React, { useState, useEffect } from 'react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [username, setUsername] = useState('');

    // Load riwayat dari localStorage saat komponen dimuat
    useEffect(() => {
        // Ambil username dari localStorage
        const loggedUsername = localStorage.getItem('username');
        setUsername(loggedUsername);

        const storedHistory = JSON.parse(localStorage.getItem('history')) || [];
        setHistory(storedHistory);
    }, []);

    const handleDone = (entry) => {
        let updatedHistory = [...history];

        if (entry.type === 'book') {
            const updatedBook = { ...entry, isBorrowed: false, borrowedBy: null };
            const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
            const updatedBooks = storedBooks.map((book) =>
                book.title === updatedBook.title ? updatedBook : book
            );
            localStorage.setItem('books', JSON.stringify(updatedBooks));

            updatedHistory = updatedHistory.map((item) =>
                item.title === entry.title && item.type === 'book'
                    ? { ...item, action: 'Returned', isReturned: true }
                    : item
            );
            alert(`Buku '${updatedBook.title}' sudah dikembalikan dan dapat dipinjam kembali.`);
        } else if (entry.type === 'table') {
            const updatedTable = { ...entry, isReserved: false, reservedBy: null };
            const storedTables = JSON.parse(localStorage.getItem('tables')) || [];
            const updatedTables = storedTables.map((table) =>
                table.number === updatedTable.number ? updatedTable : table
            );
            localStorage.setItem('tables', JSON.stringify(updatedTables));

            updatedHistory = updatedHistory.map((item) =>
                item.number === entry.number && item.type === 'table'
                    ? { ...item, action: 'Cancelled', isReturned: true }
                    : item
            );
            alert(`Meja nomor ${updatedTable.number} sudah dibatalkan dan dapat dipesan kembali.`);
        }

        // Simpan riwayat yang telah diperbarui tanpa menghapus item
        setHistory(updatedHistory);
        localStorage.setItem('history', JSON.stringify(updatedHistory));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            {history.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Tidak ada riwayat yang tersedia.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f4f4f4' }}>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>No</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Tipe</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Aksi</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Judul Buku / Nomor Meja</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>User</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Tanggal</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Gambar</th>
                            <th style={{ border: '1px solid #ddd', padding: '10px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            const rows = [];
                            for (let i = 0; i < history.length; i++) {
                                const item = history[i];
                                rows.push(
                                    <tr key={i} style={{ textAlign: 'center' }}>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{i + 1}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px', textTransform: 'capitalize' }}>
                                            {item.type}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px', textTransform: 'capitalize' }}>
                                            {item.action}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                            {item.type === 'book' ? item.title : `Meja ${item.number}`}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.user || username}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.date}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                            {item.image ? (
                                                <img src={item.image} alt="Gambar" style={{ height: '120px', borderRadius: '5px' }} />
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                        <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                                            <button
                                                onClick={() => handleDone(item)}
                                                style={{
                                                    backgroundColor: item.isReturned ? '#bdc3c7' : '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    cursor: 'pointer',
                                                    borderRadius: '5px',
                                                    pointerEvents: item.isReturned ? 'none' : 'auto',
                                                }}
                                            >
                                                Done
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }
                            return rows;
                        })()}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default History;
