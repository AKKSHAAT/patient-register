"use client";

import { useState, useEffect } from "react";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { Patient } from "../page";

interface FormProps {
  db: PGliteWorker | null;
  onSuccess?: () => void;
  initialData?: Patient | null; // Add this prop
}

export default function PatientRegistrationForm({
  db,
  onSuccess,
  initialData,
}: FormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    dob: initialData?.age ? new Date().toISOString().split("T")[0] : "",
    gender: initialData?.gender || "",
    contact: initialData?.contact || "",
    bloodGroup: initialData?.blood_group || "",
    description: initialData?.description || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      dob: initialData?.age ? new Date().toISOString().split("T")[0] : "",
      gender: initialData?.gender || "",
      contact: initialData?.contact || "",
      bloodGroup: initialData?.blood_group || "",
      description: initialData?.description || "",
    });
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    try {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      return age;
    } catch (err) {
      console.error("Error calculating age:", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!db) throw new Error("Database not initialized");

      // Calculate age from DOB
      const age = calculateAge(formData.dob);

      // Execute the SQL to insert the new patient
      await db.query(
        `
        INSERT INTO patients (name, age, gender, contact, blood_group, description)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          formData.name,
          age,
          formData.gender,
          formData.contact,
          formData.bloodGroup,
          formData.description,
        ]
      );

      // Clear form after successful submission
      setFormData({
        name: "",
        dob: "",
        gender: "",
        contact: "",
        bloodGroup: "",
        description: "",
      });

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Failed to register patient");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!db || !initialData?.id) {
      setError("Database not initialized or invalid patient ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await db.query(`DELETE FROM patients WHERE id = $1`, [initialData.id]);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete patient");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-medium mb-4">
        {initialData ? "View Patient Details" : "Register New Patient"}
      </h4>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              readOnly={!!initialData}
            />
          </div>
          <div>
            <label
              htmlFor="dob"
              className="block text-gray-700 font-medium mb-2"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              readOnly={!!initialData}
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-gray-700 font-medium mb-2"
            >
              Gender
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              required
              disabled={!!initialData}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="contact"
              className="block text-gray-700 font-medium mb-2"
            >
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              readOnly={!!initialData}
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="bloodGroup"
            className="block text-gray-700 font-medium mb-2"
          >
            Blood Group
          </label>
          <select
            id="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            disabled={!!initialData}
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Patient Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full max-h-[370px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            readOnly={!!initialData}
          />
        </div>
        {initialData ? (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Patient"}
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        )}
      </form>
    </div>
  );
}
