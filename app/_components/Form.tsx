"use client";

import { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";
import { Patient } from "../page";

interface FormProps {
  db: PGlite | null;
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
    });
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      console.log(age);

      // Format date for SQL
      const currentDate = new Date().toISOString();

      // Execute the SQL to insert the new patient
      await db.query(
        `
        INSERT INTO patients (name, age, gender, contact, blood_group, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          formData.name,
          age,
          formData.gender,
          formData.contact,
          formData.bloodGroup,
          currentDate,
        ]
      );

      // Clear form after successful submission
      setFormData({
        name: "",
        dob: "",
        gender: "",
        contact: "",
        bloodGroup: "",
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

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-xl font-medium mb-4">
        Register New Patient Using a Form
      </h4>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}{" "}
      <form onSubmit={handleSubmit}>
        {/* Responsive grid for name, dob, gender, contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Name field */}
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
            />
          </div>

          {/* DOB field */}
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
              placeholder="MM/DD/YYYY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Gender field */}
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
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Contact field */}
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
        { !initialData && (
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
