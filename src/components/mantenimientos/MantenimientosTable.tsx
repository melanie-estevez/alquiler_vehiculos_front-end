interface Props {
  mantenimientos: any[];
  loading: boolean;
}

export default function MantenimientosTable({
  mantenimientos,
  loading,
}: Props) {
  if (loading) {
    return <p>Cargando mantenimientos...</p>;
  }

  if (!loading && mantenimientos.length === 0) {
    return <p>No hay mantenimientos registrados</p>;
  }

  return (
    <table className="table table-bordered table-hover">
      <thead className="table-dark">
        <tr>
          <th>Vehículo</th>
          <th>Placa</th>
          <th>Descripción</th>
          <th>Fecha inicio</th>
          <th>Fecha fin</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {mantenimientos.map((m) => (
          <tr key={m.id_mantenimiento}>
            <td>
              {m.vehiculo?.marca} {m.vehiculo?.modelo}
            </td>
            <td>{m.vehiculo?.placa}</td>
            <td>{m.descripcion}</td>
            <td>{m.fecha_inicio}</td>
            <td>{m.fecha_fin}</td>
            <td>
              <span
                className={`badge ${
                  m.estado === "ACTIVO"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
              >
                {m.estado}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
