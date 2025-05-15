"use client";
import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import DataTable, { TableProps } from "./_components/table";
import Loading, { InlineLoading } from "./_components/loading";
import SqlEditor from "./_components/SqlEditor";
import Notify from "./_components/Notify";
import PatientRegistrationForm from "./_components/Form";

export default function Home() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [queriedData, setQueriedData] = useState<TableProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = new PGlite({
          dataDir: "idb://my-pgdata",
        });
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize PGlite:", error);
      }
    };

    initDb();
  }, []);

  const createPatientsTable = async () => {
    setInitialLoading(true);
    try {
      const res = await db?.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER,
          gender TEXT,
          contact TEXT,
          blood_group TEXT,
          created_at TEXT
        );
        INSERT INTO patients (name, age, gender, contact, created_at)
        VALUES ('Akshat', 21, 'male', '1234567890', '${Date.now()}');
        INSERT INTO patients (name, age, gender, contact, created_at)
        VALUES ('akshay', 21, 'male', '1234567890', '${Date.now()}');
      `);

      if (res) {
        setNotification({
          type: "success",
          message: "Patients table initialized successfully!",
        });
        fetchPatients();
      }
    } catch (error: any) {
      console.error("Error creating patients table:", error);
      setNotification({
        type: "error",
        message: `Error creating patients table: ${error.message}`,
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const results = await db?.query(`
        SELECT * FROM patients ORDER BY created_at DESC;
      `);
      if (results) {
        const typedRows = results.rows as Record<string, any>[];
        setQueriedData({
          data: {
            affectedRows: results.affectedRows ?? 0,
            fields: results.fields ?? [],
            rows: typedRows,
          },
        });
      }
      setNotification({
        type: "success",
        message: "Patients data loaded successfully!",
      });
    } catch (error: any) {
      console.error("Error fetching patients:", error);
      setNotification({
        type: "error",
        message: `Error fetching patients: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const ret = await db?.query(`
      SELECT * from patients;
    `);
    setLoading(false);
    if (ret) {
      const typedRows = ret.rows as Record<string, any>[];
      setQueriedData({
        data: {
          affectedRows: ret.affectedRows ?? 0,
          fields: ret.fields ?? [],
          rows: typedRows,
        },
      });
    }
  };

  const updateData = async () => {
    setLoading(true);
    const ret = await db?.query(
      "UPDATE todo SET task = $2, done = $3 WHERE id = $1",
      [5, "Update a task using parametrised queries", true]
    );
    if (ret) {
      const typedRows = ret.rows as Record<string, any>[];
      setQueriedData({
        data: {
          affectedRows: ret.affectedRows ?? 0,
          fields: ret.fields ?? [],
          rows: typedRows,
        },
      });
    }
    setLoading(false);
    alert("Data inserted!");
  };

  const executeQuery = async () => {
    setLoading(true);
    setNotification(null);

    try {
      const ret = await db?.exec(query);
      if (ret) {
        console.log("Query executed successfully:", ret, query);
        fetchData();
      }
      setNotification({
        type: "success",
        message: "Query executed successfully!",
      });
    } catch (error: any) {
      console.error("SQL Error:", error);
      setNotification({
        type: "error",
        message: `Error executing query: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setNotification({
      type: "success",
      message: "Patient registered successfully!",
    });
    fetchPatients();
  };

  // Add keyboard shortcut for executing queries
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Enter") {
        console.log("Ctrl + Enter pressed");
        await executeQuery();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [executeQuery, query, db]);

  return (
    <div className="items-center min-h-screen p-8 pt-0 pb-20 gap-16 sm:px-18 sm:py-2 font-[family-name:var(--font-geist-sans)] bg-[#dfdfdf]">
      <div className="mt-2 flex gap-2 items-center sm:justify-start justify-center text-blue-700">
        <img src="/logo.svg" alt="Logo" width={30} height={30} style={{ filter: "invert(23%) sepia(99%) saturate(7477%) hue-rotate(203deg) brightness(97%) contrast(101%)" }} />
        <h1 className="text-2xl font-semibold">Patient Registration System</h1>
      </div>
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <div className="flex gap-2 items-baseline">
            <button
              onClick={fetchPatients}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors mb-4"
            >
              Load Patient Records
            </button>
            <button
              onClick={createPatientsTable}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors mb-4"
            >
              createPatientsTable
            </button>
          </div>
          <div className="flex justify-between items-center ">
          </div>
        </div>
        {(initialLoading || !db) && <Loading />}
       

        <div className="w-full gap-2 flex flex-col sm:flex-row  mx-auto">
          <DataTable {...queriedData} />
          <div className="flex flex-col w-full sm:w-[50%]  mx-auto h-[80vh] bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-black text-white py-2 px-4 w-32 rounded-md hover:bg-gray-700 transition-colors"
                >
                {showForm ? "Use SQL" : "Use Form"}
              </button>
              {loading && <InlineLoading />}
              {notification && (
                <Notify type={notification.type} message={notification.message} />
              )}
            </div>
            {showForm ? (
              <div className="mb-8 ">
                <PatientRegistrationForm db={db} onSuccess={handleFormSuccess} />
              </div>
            ) : (
              <div className="w-full">
                <SqlEditor query={query} setQuery={setQuery} executeQuery={executeQuery}/> 
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
