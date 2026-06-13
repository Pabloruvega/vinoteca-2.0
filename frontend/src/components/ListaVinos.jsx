import api from '../api';

const ListaVinos = ({ vinos, onActualizar, onEditar, modo }) => {

    const eliminarVino = async (vino) => {
        if (!window.confirm(`¿Seguro que querés eliminar ${vino.nombre}?`)) return;
        try {
            await api.delete(`/vinos/${vino._id}`);
            onActualizar();
        } catch (error) {
            alert('Hubo un error al eliminar, intentá de nuevo.');
            console.error('Error al borrar:', error);
        }
    };

    const stockClass = (stock) =>
        stock <= 3 ? 'tv-stock-low' : stock <= 10 ? 'tv-stock-medium' : 'tv-stock-high';

    return (
        <div className="lv-container">
            <h2 className="lv-title">Inventario ({vinos.length})</h2>
            {vinos.length > 0 ? (
                <table className="lv-table">
                    <thead>
                        <tr>
                            <th className="lv-th">Nombre</th>
                            <th className="lv-th">Bodega</th>
                            <th className="lv-th">Precio</th>
                            <th className="lv-th">Stock</th>
                            {modo !== 'stock' && <th className="lv-th">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {vinos.map(vino => (
                            <tr key={vino._id} className="tv-tr">
                                <td className="tv-td"><strong>{vino.nombre}</strong></td>
                                <td className="tv-td">{vino.bodega}</td>
                                <td className="tv-td">${vino.precio}</td>
                                <td className={`tv-td tv-stock ${stockClass(vino.stock)}`}>
                                    {vino.stock} u.
                                </td>
                                {modo !== 'stock' && (
                                    <td className="tv-td">
                                        {modo === 'modificar' && (
                                            <button onClick={() => onEditar(vino)} className="tv-btn-edit">
                                                Editar
                                            </button>
                                        )}
                                        {modo === 'eliminar' && (
                                            <button onClick={() => eliminarVino(vino)} className="tv-btn-delete">
                                                Borrar
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="lv-empty">No hay vinos para mostrar.</p>
            )}
        </div>
    );
};

export default ListaVinos;