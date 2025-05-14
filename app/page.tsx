"use client";
import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import DataTable, { TableProps } from "./_components/table";
import Loading from "./_components/loading";
import SqlEditor from "./_components/SqlEditor";
import Notify from "./_components/Notify";
import PatientRegistrationForm from "./_components/Form";

export default function Home() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [queriedData, setQueriedData] = useState<TableProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
          dataDir: 'idb://my-pgdata',
        })
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize PGlite:", error);
      }
    };

    initDb();

    return () => {};
  }, []);

  const createPatientsTable = async () => {
    setLoading(true);
    try {
      const res = await db?.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER,
          gender TEXT,
          contact TEXT,
          email TEXT,
          blood_group TEXT,
          allergies TEXT,
          created_at TEXT
        );
        INSERT INTO patients (name, age, gender, contact)
        VALUES ('Akshat', 21, 'male', '1234567890');
        INSERT INTO patients (name, age, gender, contact)
        VALUES ('akshay', 21, 'male', '1234567890');
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
      setLoading(false);
    }
  };

  const createTable = async () => {
    setLoading(true);
    await db?.exec(`
      CREATE TABLE IF NOT EXISTS todo (
        id SERIAL PRIMARY KEY,
        task TEXT,
        done BOOLEAN DEFAULT false
      );
      INSERT INTO todo (task, done) VALUES ('Install PGlite from NPM', true);
      INSERT INTO todo (task, done) VALUES ('Load PGlite', true);
      INSERT INTO todo (task, done) VALUES ('Create a table', true);
      INSERT INTO todo (task, done) VALUES ('Insert some data', true);
      INSERT INTO todo (task) VALUES ('Update a task');
  `);
    setLoading(false);
    alert("Table created!");
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
      SELECT * from todo;
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

  return (
    <div className="items-center min-h-screen p-8 pt-0 pb-20 gap-16 sm:p-8 font-[family-name:var(--font-geist-sans)] bg-[#fffdfa]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {(loading || !db) && <Loading />}
        {notification && (
          <Notify type={notification.type} message={notification.message} />
        )}

        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Patient Registration System</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Hide Form" : "Register New Patient"}
            </button>
          </div>

          {showForm && (
            <div className="mb-8">
              <PatientRegistrationForm db={db} onSuccess={handleFormSuccess} />
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Patient Records</h2>
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
            {queriedData && <DataTable {...queriedData} />}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">SQL Query</h2>
            <SqlEditor query={query} setQuery={setQuery} />
            <button
              onClick={executeQuery}
              className="mt-2 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Execute Query
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
