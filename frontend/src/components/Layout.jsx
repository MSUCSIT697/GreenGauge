import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="container mx-auto p-6">
        <Outlet /> {/* This will load the correct page */}
      </main>
    </div>
  );
}
