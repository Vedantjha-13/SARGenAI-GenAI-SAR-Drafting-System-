import { Link } from 'react-router-dom';
import { mockUserProfile } from '../data/mockData';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            S
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white">SAR AI</h1>
            <p className="text-xs text-slate-400">Compliance Suite</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8">
          <Link
            to="/dashboard"
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/history"
            className="text-slate-300 hover:text-white transition-colors font-medium"
          >
            History
          </Link>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{mockUserProfile.name}</p>
            <p className="text-xs text-slate-400">{mockUserProfile.role}</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-lg border border-slate-700">
            {mockUserProfile.avatar}
          </div>
        </div>
      </div>
    </nav>
  );
}
