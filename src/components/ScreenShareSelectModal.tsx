import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Monitor, CheckCircle, Circle } from "lucide-react";

interface OnlineUser {
  id: string;
  user_name: string;
  user_avatar_url?: string;
}

interface ScreenShareSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onlineUsers: OnlineUser[];
  currentUserId: string;
  onStartShare: (targetUserIds: string[]) => void;
}

export function ScreenShareSelectModal({
  isOpen,
  onClose,
  onlineUsers,
  currentUserId,
  onStartShare,
}: ScreenShareSelectModalProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  // Filter out ourselves
  const otherUsers = onlineUsers.filter(u => String(u.id) !== String(currentUserId));
  
  // Clear selection when opened
  useEffect(() => {
    if (isOpen) {
      setSelectedUserIds(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleUser = (id: string) => {
    setSelectedUserIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUserIds.size === otherUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(otherUsers.map(u => u.id)));
    }
  };

  const handleStart = () => {
    if (selectedUserIds.size > 0) {
      onStartShare(Array.from(selectedUserIds));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="overlay-backdrop" onClick={onClose} aria-label="Close screen share modal" />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="modal-shell relative z-10 flex max-h-[85vh] w-full max-w-md flex-col"
        >
          {/* Header */}
          <div className="modal-header flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(239,188,130,0.2)] bg-[rgba(215,163,102,0.12)] text-[var(--accent-strong)]">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">Share Screen</h3>
                <p className="text-sm text-[var(--text-muted)]">Select users to view your screen</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="modal-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User List */}
          <div className="p-6 overflow-y-auto flex-1">
            {otherUsers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto mb-3 h-12 w-12 text-[var(--text-soft)]" />
                <p className="font-medium text-[var(--text-secondary)]">No other users in the space</p>
                <p className="mt-1 text-sm text-[var(--text-soft)]">Invite people to share your screen with them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-sm font-semibold text-[var(--text-secondary)]">Online Users ({otherUsers.length})</span>
                  <button 
                    onClick={toggleAll}
                    className="text-sm font-medium text-[var(--accent-strong)] hover:text-[var(--text-primary)]"
                  >
                    {selectedUserIds.size === otherUsers.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                
                <div className="space-y-2">
                  {otherUsers.map(user => {
                    const isSelected = selectedUserIds.has(user.id);
                    return (
                      <div 
                        key={user.id}
                        onClick={() => toggleUser(user.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[rgba(239,188,130,0.22)] bg-[rgba(215,163,102,0.12)]' 
                            : 'border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(239,188,130,0.2)] bg-[rgba(215,163,102,0.12)] text-sm font-bold text-[var(--accent-strong)] shadow-sm">
                            {user.user_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate pr-4 font-medium text-[var(--text-primary)]">{user.user_name}</span>
                        </div>
                        <div className={`flex-shrink-0 ${isSelected ? 'text-[var(--accent-strong)]' : 'text-white/20'}`}>
                          {isSelected ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer flex gap-3 p-6">
            <button
              onClick={onClose}
              className="btn-secondary flex-1 rounded-2xl"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              disabled={selectedUserIds.size === 0}
              className="btn-success flex-1 rounded-2xl disabled:cursor-not-allowed"
            >
              <Monitor className="w-4 h-4" />
              Start Sharing ({selectedUserIds.size})
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
