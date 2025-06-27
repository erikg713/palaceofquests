import React, { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "zh", label: "中文" },
  { code: "ar", label: "العربية" },
  { code: "nl", label: "Nederlands" },
  { code: "yue", label: "粵語" },
];

const LanguageToggle = () => {
  const [selected, setSelected] = useState("en");

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-40 p-2 rounded-md">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="bg-gray-800 text-white px-2 py-1 rounded-md"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageToggle;
