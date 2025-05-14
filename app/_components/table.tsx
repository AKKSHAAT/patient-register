"use client";

export interface TableProps {
  data: {
    affectedRows: number;
    fields: Array<{ name: string; dataTypeID: number }>;
    rows: Array<Record<string, any>>;
  };
}

export default function DataTable({ data }: TableProps) {
  // Extract headers from fields
  const headers = data?.fields?.map((field) => field.name) || [];

  // Get rows data
  const rows = data?.rows || [];
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full bg-gray-900 border border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-800">
            {headers.map((header, index) => (
              <th
                key={index}
                className="py-3 px-4 border-b border-gray-700 text-left font-medium text-gray-200"
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
            >
              {headers.map((header, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className="py-2 px-4 border-b border-gray-700 text-gray-300"
                >
                  {typeof row[header] === "boolean"
                    ? row[header]
                      ? "✅"
                      : "❌"
                    : row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
