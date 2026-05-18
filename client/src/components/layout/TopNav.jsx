import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-6">
      <div></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="bg-slate-700 p-2 rounded-full">
            <User size={18} />
          </div>
          <span className="font-medium">{user?.name}</span>
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full ml-2">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
