import React from "react";

export default function Template1({
  brideName,
  groomName,
  location,
  date,
  guestName,
}) {
  return (
    <div className="max-w-md mx-auto bg-white border border-pink-200 rounded-2xl p-6 shadow-lg relative overflow-hidden">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 w-full h-24 bg-pink-100 rounded-b-full -z-10"></div>

      <h2 className="text-3xl font-extrabold text-pink-700 mb-3 tracking-wide">
        💐 Wedding Invitation
      </h2>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {groomName} <span className="text-pink-600">❤️</span> {brideName}
      </h3>

      <p className="text-gray-700 mb-2 italic">
        cordially invite you to celebrate their wedding
      </p>

      <div className="mt-4 bg-pink-50 p-4 rounded-lg">
        <p className="text-gray-800 mb-1">
          📍 <span className="font-medium">{location}</span>
        </p>
        <p className="text-gray-800">
          📅 <span className="font-medium">{date}</span>
        </p>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        We can’t wait to celebrate with you! 🎉
      </div>

      {/* Decorative bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-pink-100 rounded-full blur-2xl opacity-50 -z-10"></div>
    </div>
  );
}
