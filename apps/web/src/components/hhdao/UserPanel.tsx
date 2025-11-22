"use client";

export default function UserPanel() {
  return (
    <div className="flex items-center justify-between bg-gray-700 p-4">
      <div className="flex items-center space-x-4">
        <img src="/pfp.png" className="w-12 h-12 rounded-full" alt="PFP" />
        <div>
          <div className="font-bold">Rajesh Soni</div>
          <div className="text-sm text-gray-300">Level 12 • Bronze Badge</div>
        </div>
      </div>
      <div>
        <button className="bg-blue-600 px-3 py-1 rounded mr-2">Edit Profile</button>
        <button className="bg-transparent border border-white/10 px-3 py-1 rounded">Achievements</button>
      </div>
    </div>
  );
}
