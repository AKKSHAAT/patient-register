"use client";
import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import DataTable, { TableProps } from "./table";
import Loading from "./loading";
import SqlEditor from "./SqlEditor";
import Notify from "./Notify";

export default function Home() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [queriedData, setQueriedData] = useState<TableProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = new PGlite();
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize PGlite:", error);
      }
    };

    initDb();

    return () => {};
  }, []);

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

  const fetchData = async () => {
    setLoading(true);
    const ret = await db?.query(`
      SELECT * from todo;
    `);
    setLoading(false);
    setQueriedData(ret);
  };

  const updateData = async () => {
    setLoading(true);
    const ret = await db?.query(
      "UPDATE todo SET task = $2, done = $3 WHERE id = $1",
      [5, "Update a task using parametrised queries", true]
    );
    setQueriedData(ret);
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

  return (
    <div className="items-center min-h-screen p-8 pt-0 pb-20 gap-16 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      {" "}
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {loading && <Loading />}
        {notification && (
          <Notify type={notification.type} message={notification.message} />
        )}
        {queriedData && (
          <div className="overflow-x-auto w-full">
            <DataTable data={queriedData} />
          </div>
        )}
        <SqlEditor query={query} setQuery={setQuery} />
        <div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={createTable}
          >
            Create Table
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700"
            onClick={fetchData}
          >
            fetch data
          </button>
          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-blue-700"
            onClick={updateData}
          >
            update data
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700"
            onClick={executeQuery}
          >
            Run
          </button>
        </div>
      </main>
    </div>
  );
}
