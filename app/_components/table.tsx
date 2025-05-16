"use client";
import { Dispatch, SetStateAction } from "react";
import { Patient } from "../page";
export interface TableProps {
  data?: {
    affectedRows: number;
    fields: Array<{ name: string; dataTypeID: number }>;
    rows: Array<Record<string, any>>;
  } | null;
  handleSelectPatient?: (data: Patient) => void;
}

export default function DataTable({ data, handleSelectPatient }: TableProps) {
  // Extract headers from fields
  const headers = data?.fields?.map((field) => field.name) || [];

  // Get rows data
  const rows = data?.rows || [];
  return (
    <div className="overflow-x-auto overflow-y-auto w-full rounded-xl max-h-[80vh] bg-white shadow-md">
      {!data || !data.rows?.length ? (
        <div className="text-gray-400 text-center font-bold text-3xl py-8">
          Fetch data from patients table
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="py-3 px-4 border-b border-gray-300 text-left font-medium text-gray-700"
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
                className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-300`}
                onClick={() => handleSelectPatient?.({
                  id: row.id,
                  name: row.name,
                  age: row.age,
                  gender: row.gender,
                  contact: row.contact,
                  blood_group: row.blood_group,
                  description: row.description,
                })}
                >
                {headers.map((header, colIndex) => (
                  <td
                  key={`${rowIndex}-${colIndex}`}
                  className="py-2 px-4 border-b border-gray-300 text-gray-600"
                  >
                  {row[header]}
                  </td>
                ))}
                </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
