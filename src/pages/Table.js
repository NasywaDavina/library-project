import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

const buttonHoverStyle = {
    backgroundColor: '#E8C89D', // Warna krem yang sedikit lebih gelap saat hover
};

const TableCard = ({ isAdmin, table, onReserve, onCrud, onDelete }) => (
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
        <h3>Meja Nomor: {table.number}</h3>

        {isAdmin ? (
            <>
                <button 
                    onClick={() => onCrud(table)} 
                    style={buttonStyle}
                >
                    Edit Meja
                </button>
                <button 
                    onClick={() => onDelete(table)} 
                    style={buttonStyle}
                >
                    Hapus Meja
                </button>
            </>
        ) : (
            <button 
                onClick={() => onReserve(table)} 
                style={
                    table.isReserved 
                    ? { ...buttonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' }
                    : buttonStyle
                }
                disabled={table.isReserved}
            >
                {table.isReserved ? 'Sudah Dipesan' : 'Pesan Meja'}
            </button>
        )}
    </div>
);

const Table = () => {
    const [isAdmin, setIsAdmin] = useState(false); // Default ke user
    const [tables, setTables] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // Untuk menyimpan nilai pencarian
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role'); 
        setIsAdmin(role === 'admin');
    }, []);

    useEffect(() => {
        const storedTables = JSON.parse(localStorage.getItem('tables')) || [
            { number: 1, isReserved: false },
            { number: 2, isReserved: false },
            { number: 3, isReserved: false },
        ];
        setTables(storedTables);
    }, []);

    useEffect(() => {
        localStorage.setItem('tables', JSON.stringify(tables));
    }, [tables]);

    const handleReserve = (table) => {
        if (table.isReserved) {
            alert(`Meja nomor ${table.number} sudah dipesan.`);
            return;
        }

        const currentUser = localStorage.getItem('currentUser') || 'User1';
        const updatedTable = { ...table, isReserved: true, reservedBy: currentUser };
        setTables(tables.map(t => (t === table ? updatedTable : t)));

        const history = JSON.parse(localStorage.getItem('history')) || [];
        history.push({
            type: 'table',
            action: 'reserved',
            number: updatedTable.number,
            user: currentUser,
            date: new Date().toLocaleString(),
        });
        localStorage.setItem('history', JSON.stringify(history));

        navigate("/detailhistory", { state: { table: updatedTable, type: 'table' } });
    };

    const handleCrud = (table) => {
        const newNumber = prompt('Masukkan nomor meja baru:', table.number);
        if (newNumber && !isNaN(newNumber)) {
            const updatedTable = { ...table, number: parseInt(newNumber) };
            setTables(tables.map(t => (t === table ? updatedTable : t)));
        }
    };

    const handleDelete = (table) => {
        if (window.confirm(`Apakah Anda yakin ingin menghapus meja nomor ${table.number}?`)) {
            setTables(tables.filter(t => t !== table));
        }
    };

    const handleAddTable = () => {
        const newNumber = prompt('Masukkan nomor meja baru:');
        if (newNumber && !isNaN(newNumber)) {
            setTables([...tables, { number: parseInt(newNumber) }]);
        }
    };

    // Menampilkan meja yang dicari, jika tidak ada pencarian, tampilkan semua meja
    const filteredTables = searchTerm.trim() === ''
        ? tables
        : tables.filter(table =>
            table.number.toString() === searchTerm.trim() // Perbandingan yang tepat untuk nomor meja
        );

    return (
        <div style={{ paddingBottom: '80px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 20px',
                alignItems: 'center'
            }}>
                <input
                    type="text"
                    placeholder="Cari Meja..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '8px 15px', // Lebar input seperti contoh
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
                        onClick={handleAddTable}
                        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                        style={buttonStyle}
                    >
                        Tambah Meja
                    </button>
                </div>
            </div>

            {isAdmin ? (
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {filteredTables.map((table, index) => (
                        <TableCard
                            key={index}
                            isAdmin={true}
                            table={table}
                            onCrud={handleCrud}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {filteredTables.map((table, index) => (
                        <TableCard
                            key={index}
                            isAdmin={false}
                            table={table}
                            onReserve={handleReserve}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Table;
