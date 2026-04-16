"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    slug: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        duration: Number(form.duration),
      }),
    });

    router.push("/");
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="duration"
          placeholder="Duration (mins)"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          name="slug"
          placeholder="Slug"
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button className="bg-black text-white px-4 py-2">
          Create
        </button>
      </form>
    </div>
  );
}