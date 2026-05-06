import { cn } from '../../utils/cn'
/*const columns = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "role", header: "Role" },
];

const data = [
  { id: 1, name: "Vladimir", email: "vlada@gmail.com", role: "Admin" },
  { id: 2, name: "Marko", email: "marko@gmail.com", role: "User" },
  { id: 3, name: "Jovana", email: "jovana@gmail.com", role: "Moderator" },
];*/
export function DataTable({ title, description, columns = [], data = [], className }) {
  return (
    <section className={cn('rounded-2xl border border-border bg-surface p-6 shadow-sm', className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>}

          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left font-semibold text-gray-900">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={row.id ?? index} className="border-b border-border last:border-b-0">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle">
                      {row[column.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
