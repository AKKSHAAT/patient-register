import { PGliteWorker } from '@electric-sql/pglite/worker';

export const createPatientsTableQuery = `
  CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    contact TEXT,
    blood_group TEXT,
    description TEXT
  );
`;

export const insertSamplePatientsQuery = `
  INSERT INTO patients (name, age, gender, contact,blood_group ,description)
  VALUES 
    ('Akshat', 21, 'male', '1234567890', 'B+','allergic to garlic'),
    ('Akshay', 21, 'male', '1234567890', 'B+','None');
`;

export const fetchPatientsQuery = `
  SELECT * FROM patients;
`;

export const createPatientsTableHandler = async (
  db: PGliteWorker | null,
  setNotification: Function,
  fetchPatients: Function
) => {
  try {
    const res = await db?.exec(
      `${createPatientsTableQuery}` //`${createPatientsTableQuery} ${insertSamplePatientsQuery}`
    );

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
  }
};

export const fetchPatientsHandler = async (
  db: PGliteWorker | null,
  setQueriedData: Function,
  setNotification: Function
) => {
  try {
    const results = await db?.query(fetchPatientsQuery);
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
  }
};

export const executeQueryHandler = async (
  db: PGliteWorker | null,
  query: string,
  setNotification: Function,
  setQueriedData: Function,
  fetchPatients: Function
) => {
  try {
    const ret = await db?.exec(query);
    if (query.toLowerCase().includes('select')) {
      const results = ret[0];
      // console.log("results: ", results);
      if (results) {
        setQueriedData({
          data: {
            affectedRows: results.affectedRows ?? 0,
            fields: results.fields ?? [],
            rows: results.rows,
          },
        });
      }
    } else fetchPatients();

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
  }
};
