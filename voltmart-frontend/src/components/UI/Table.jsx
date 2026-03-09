function Table({ columns, data, rowKey, renderRow }) {
  return (
    <div className="vm-table__wrapper">
      <table className="vm-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key || column.accessor}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="vm-table__empty">
                No records found
              </td>
            </tr>
          ) : renderRow ? (
            data.map((item) => renderRow(item))
          ) : (
            data.map((item) => (
              <tr key={item[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key || column.accessor}>
                    {item[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
