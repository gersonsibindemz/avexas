import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Users } from 'lucide-react';

interface UserPresence {
  id: string;
  name?: string;
  surname?: string;
  status: 'online' | 'offline';
}

export const OnlineUsers: React.FC = () => {
  const [users, setUsers] = useState<Record<string, UserPresence>>({});
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channel = supabase.channel('onlineuser');

    const handlePresence = async () => {
      const presenceState = channel.presenceState() as any;
      const onlineIds = new Set(
        Object.values(presenceState).flatMap((p: any) => p.map((item: any) => item.user_id))
      );

      const allIds = Array.from(new Set([...Object.keys(users), ...onlineIds]));
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, surname')
        .in('id', allIds);

      const newUsers: Record<string, UserPresence> = { ...users };
      
      profiles?.forEach(p => {
        const isOnline = onlineIds.has(p.id);
        newUsers[p.id] = {
          ...p,
          status: isOnline ? 'online' : 'offline',
        };
      });
      
      setUsers(newUsers);
    };

    channel
      .on('presence', { event: 'sync' }, handlePresence)
      .on('presence', { event: 'join' }, handlePresence)
      .on('presence', { event: 'leave' }, handlePresence)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            await channel.track({ user_id: session.user.id });
          }
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onlineUsers = (Object.values(users) as UserPresence[]).filter((u: UserPresence) => u.status === 'online');
  const onlineCount = onlineUsers.length;
  
  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
      >
        <Users size={16} />
        <span>Online: {onlineCount}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100 font-semibold text-sm">Usuários</div>
          <div className="max-h-64 overflow-y-auto">
            {Object.values(users).map((user: UserPresence) => (
              <div key={user.id} className={`flex items-center justify-between p-3 border-b border-slate-50 last:border-0 ${user.status === 'offline' ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span className="text-sm font-medium">{user.name} {user.surname}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
