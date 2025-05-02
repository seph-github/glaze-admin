'use client';

import { Profile } from '@/types/interfaces/Profile';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { UserRole } from '@/types/enums/UserRole';

export default function UserList({ profiles }: { profiles: Profile[] }) {
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return profiles
      .filter((profile) => profile.role === UserRole.User) // 👈 Only show users
      .filter((profile) =>
        [profile.username, profile.email, profile.full_name, profile.role].some(
          (field) => field?.toLowerCase().includes(searchLower)
        )
      );
  }, [profiles, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        {/* <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
          + Add New User
        </button> */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center p-6 bg-gray-100 rounded-xl animate-pulse"
            >
              <div className="w-12 h-12 rounded-full bg-gray-300 mr-4" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="h-3 bg-gray-300 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProfiles.length > 0 ? (
            filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition"
              >
                {/* Avatar */}
                <div className="w-14 h-14 relative flex-shrink-0 rounded-full overflow-hidden bg-blue-500 text-white text-xl font-bold flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
                  {profile.profile_image_url ? (
                    <Image
                      src={profile.profile_image_url}
                      alt={profile.username || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    profile.username?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {profile.full_name || profile.username || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {profile.email || 'No email provided'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Joined{' '}
                    {profile.created_at
                      ? new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }).format(new Date(profile.created_at))
                      : 'N/A'}
                  </p>
                  {profile.role && (
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded-full ${
                        profile.role.toLowerCase() === 'admin'
                          ? 'bg-yellow-500 text-white'
                          : profile.role.toLowerCase() === 'editor'
                            ? 'bg-purple-500 text-white'
                            : 'bg-green-500 text-white'
                      }`}
                    >
                      {profile.role}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {/* <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition">
                    Delete
                  </button> */}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No users found matching your search.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
