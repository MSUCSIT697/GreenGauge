// src/components/FormInput.js
export default function FormInput({ label, value, onChange, showError }) {
    return (
      <div className="mb-4">
        <label className="block">{label}</label>
        <input
          type="number"
          className={`input input-bordered w-full mt-2 ${
            showError && (value === "" || value === 0) ? "border-red-500" : ""
          }`}
          value={value ?? ""}
          onChange={onChange}
        />
      </div>
    );
  }
  