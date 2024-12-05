"use client"; // Component for rendering the client-side

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // import for the App Router

// List of countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", 
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", 
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", 
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", 
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", 
  "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", 
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
  "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", 
  "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", 
  "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", 
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", 
  "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", 
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", 
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", 
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", 
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", 
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", 
  "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", 
  "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];
export default function BasicDetails() {
  const [formData, setFormData] = useState({
    name: "",
    organisation: "",
    country: "",
    email: "" // Added email field
  });

  const [errors, setErrors] = useState({
    name: "",
    organisation: "",
    country: "",
    email: "" // Added email error state
  });

  const [isClient, setIsClient] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false); // State for consent checkbox

  // Initialize router for client-side rendering
  const router = useRouter();

  // Set to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value.trim() === "" && name !== "country") {
      setErrors({ ...errors, [name]: `${name} is required` });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked); // Update the agreement state when checkbox is toggled
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validate email to ensure it contains '@'
  const emailRegex = /\S+@\S+\.\S+/;
  const newErrors = {
    name: formData.name.trim() === "" ? "Name is required" : "",
    organisation:
      formData.organisation.trim() === "" ? "Organisation is required" : "",
    country: formData.country.trim() === "" ? "Country is required" : "",
    email: formData.email.trim() === ""
      ? "Email is required"
      : !emailRegex.test(formData.email)
      ? "Please enter a valid email"
      : "", // Check for valid email format
  };
  setErrors(newErrors);

  // terms agreement
  if (!isAgreed) {
    alert("You must agree to the terms before submitting.");
    return;
  }

  // Check for errors before proceeding
  if (!Object.values(newErrors).some(error => error)) {
    console.log("Submitted data:", formData);

    // Save data to session storage
    sessionStorage.setItem("basicDetails", JSON.stringify(formData));

    // Save data to the database
    try {
      const response = await fetch("/api/basicDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to save data to the database");
      }

      const data = await response.json();
      console.log("Basic details saved successfully");

      // Save the user_id to session storage
      if (data.userId) {
        sessionStorage.setItem("user_id", data.userId);
      }

      // client-side rendering before attempting navigation
      if (isClient) {
        router.push("/survey/dataCollection/question1a"); // Next page Navigation
      }
    } catch (error) {
      console.error("Error saving basic details:", error);
    }
  }
};
  if (!isClient) return null; // Render nothing while waiting for client-side setup

  return (
    <div className="h-screen bg-gradient-to-b from-teal-90 via-blue-200 to-blue-200 text-teal-900 flex flex-col items-center justify-center font-sans overflow-hidden">
      <main className="flex flex-col gap-6 items-center text-center bg-blue-300 bg-opacity-85 p-8 rounded-2xl shadow-2xl max-w-2xl w-full transform hover:scale-[1.01] duration-300">
        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl font-[Inter] font-bold tracking-tight text-gray drop-shadow-md leading-tight mb-4">
          Enter Your Details
        </h1>

        {/* Form */}
        <form className="flex flex-col gap-6 w-full max-w-md" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <div className="text-sm text-red-500 mt-1">{errors.name}</div>
            )}
          </div>

          {/* Organisation Field */}
          <div>
            <input
              type="text"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
              placeholder="Organisation Name"
              className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            {errors.organisation && (
              <div className="text-sm text-red-500 mt-1">{errors.organisation}</div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email Address"
              className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <div className="text-sm text-blue-500 mt-1">{errors.email}</div>
            )}
          </div>

          {/* Country Dropdown */}
          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className="text-sm text-red-500 mt-1">{errors.country}</div>
            )}
          </div>

          <p className="text-sm sm:text-base text-black mb-6 text-justify">
            Thank you for participating in the survey. All your responses will remain confidential and will only be used in an anonymized, generalized form after statistical analysis.
          </p>

          {/* Consent Checkbox */}
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="consent"
              checked={isAgreed}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            <label htmlFor="consent" className="text-sm sm:text-base text-black text-left">
              I agree to the use of my personal details only for the purpose of the survey.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-teal-800 text-white py-3 rounded-md hover:bg-teal-400 transition duration-300"
          >
            Continue
          </button>
        </form>
      </main>
    </div>
  );
}
