"use client";
import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import DataTable, { TableProps } from "./_components/table";
import Loading, { InlineLoading } from "./_components/loading";
import SqlEditor from "./_components/SqlEditor";
import Notify from "./_components/Notify";
import PatientRegistrationForm from "./_components/Form";
import {
  createPatientsTableHandler,
  fetchPatientsHandler,
  executeQueryHandler,
} from "./utlis/sqlUtils";

export interface Patient {
  id: number;
  name: string;
  age: number | null;
  gender: string | null;
  contact: string | null;
  blood_group: string | null;
}

export default function Home() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [queriedData, setQueriedData] = useState<TableProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("SELECT * FROM patients");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = new PGlite({
          dataDir: "idb://my-pgdata",
        });
        setDb(database);
        if (database) {
          setInitialLoading(true);
          await createPatientsTableHandler(
            database,
            setNotification,
            fetchPatients
          );
          setInitialLoading(false);
        }
      } catch (error) {
        console.error("Failed to initialize PGlite:", error);
      }
    };

    initDb();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    await fetchPatientsHandler(db, setQueriedData, setNotification);
    setLoading(false);
  }; 

  const handleSelectPatient = (data: Patient)=>{
    setShowForm(true);
    setSelectedPatient({...data});
  }

  const executeQuery = async () => {
    setLoading(true);
    setNotification(null);
    await executeQueryHandler(
      db,
      query,
      setNotification,
      setQueriedData,
      fetchPatients
    );
    setLoading(false);
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
      <div className="mt-2 flex gap-2 items-baseline sm:justify-start justify-center text-blue-700 mb-4">
        <img
          src="/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          style={{
            filter:
              "invert(23%) sepia(99%) saturate(7477%) hue-rotate(203deg) brightness(97%) contrast(101%)",
          }}
        />
        <h1 className="text-4xl font-semibold">Patient Registration System</h1>
      </div>
      <main className="flex flex-col gap-2 row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4">
          <div className="flex justify-between items-center "></div>
        </div>
        {(initialLoading || !db) && <Loading />}

        <div className="w-full gap-2 flex flex-col sm:flex-row  mx-auto">
          <DataTable {...queriedData} handleSelectPatient={handleSelectPatient} />
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
                <Notify
                  type={notification.type}
                  message={notification.message}
                />
              )}
            </div>
            {showForm ? (
              <div className="mb-8">
                <PatientRegistrationForm
                  db={db}
                  onSuccess={handleFormSuccess}
                  initialData={selectedPatient} // Pass selectedPatient here
                />
              </div>
            ) : (
              <div className="w-full h-full">
                <SqlEditor
                  query={query}
                  setQuery={setQuery}
                  executeQuery={executeQuery}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
