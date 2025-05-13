'use client'
import { useState, useEffect } from "react";
import { PGlite } from '@electric-sql/pglite'
import DataTable, {TableProps} from "./table";


export default function Home() {
  const [db, setDb] = useState<PGlite | null>(null);
  const [queriedData, setQueriedData] = useState<TableProps | null >(null);
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    const initDb = async () => {
      try {
        const database = new PGlite()
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize PGlite:", error);
      }
    };
    
    initDb();
    
    return () => {
    };
  }, []);


  const createTable = async () => {
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
    alert("Table created!");
  };

  const fetchData = async () => {
    const ret = await db?.query(`
      SELECT * from todo;
    `)
    setQueriedData(ret);
  };

  const updateData = async () => {
    const ret = await db?.query(
      'UPDATE todo SET task = $2, done = $3 WHERE id = $1',
      [5, 'Update a task using parametrised queries', true],
    );
    setQueriedData(ret);
    alert("Data inserted!");
  }

  const executeQuery = async () => {
    const ret = await db?.exec(query);
    if (ret) {
      console.log("Query executed successfully:", ret, query);
      fetchData();
    }
    alert("Data inserted!");
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pt-0 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {queriedData && (
          <div className="overflow-x-auto w-full">
            <DataTable data={queriedData} />
          </div>
        )}
        <textarea
          value={query}
          onChange={(e) => {
            const query = e.target.value;
            setQuery(query);
          }}
          className="w-full sm:w-[400px] h-[250px] border px-3 py-2 rounded resize-none"
          placeholder="text field"
        />
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={createTable} >
            Create Table
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-blue-700" onClick={fetchData}  >
            fetch data
          </button>
          <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-blue-700" onClick={updateData}  >
            update data
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-blue-700" onClick={executeQuery}  >
            Run
          </button>
        </div>
      </main>
    </div>
  );
}
