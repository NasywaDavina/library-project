import React, { useState, useEffect } from 'react';

const DetailHistory = () => {
    const [history, setHistory] = useState([]);
    const [username, setUsername] = useState('');

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
        <div style={styles.container}>
            {history.length === 0 ? (
                <p style={styles.noHistoryText}>No history available.</p>
            ) : (
                <div style={styles.historyList}>
                    {history.map((entry, index) => (
                        <div key={index} style={styles.historyItem}>
                            <h3 style={styles.subHeading}>
                                {entry.type === 'book' ? 'Book' : 'Table'}
                            </h3>
                            <p style={styles.text}>Date: {entry.date}</p>
                            <p style={styles.text}>Action: {entry.action}</p>
                            <p style={styles.text}>User: {username}</p>

                            {entry.type === 'book' && (
                                <>
                                    <p style={styles.text}>Title: {entry.title}</p>
                                    <div style={styles.imageContainer}>
                                        <img
                                            src={entry.image || 'https://via.placeholder.com/60'}
                                            alt={entry.title}
                                            style={styles.fixedImage}
                                        />
                                    </div>
                                </>
                            )}

                            {entry.type === 'table' && (
                                <p style={styles.text}>Table Number: {entry.number}</p>
                            )}

                            <button
                                onClick={() => handleDone(entry)}
                                style={{
                                    ...styles.doneButton,
                                    backgroundColor: entry.isReturned ? '#bdc3c7' : '#e74c3c', // Grey if returned, Cream if not
                                }}
                                disabled={entry.isReturned} // Disable button if already returned
                            >
                                Done
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f7f7f7',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noHistoryText: {
        fontSize: '14px',
        color: '#888',
        textAlign: 'center',
    },
    historyList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        flexGrow: 1,
    },
    historyItem: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '240px',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: '12px',
        color: '#555',
        margin: '2px 0',
    },
    subHeading: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '4px',
    },
    doneButton: {
        color: '#fff',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '8px',
        fontSize: '12px',
    },
    imageContainer: {
        textAlign: 'center',
        marginTop: '6px',
    },
    fixedImage: {
        width: '60px',
        height: '60px',
        objectFit: 'cover',
        borderRadius: '4px',
    },
};

export default DetailHistory;
