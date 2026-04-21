'use client';

import React, { useState, useEffect } from 'react';
import ProjectModal from '../Projects/ProjectModal';
import { useRouter } from 'next/navigation';
import { fetchAllUsersAction } from '@/app/actions/users';
import { createProjectAction } from '@/app/actions/projects';
import { useToast } from '@/components/Toast/ToastContext';

export default function CreateProjectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetchAllUsersAction().then(res => {
      if (res.users) setAllUsers(res.users);
    });
  }, []);

  const handleCreate = async (payload) => {
    const result = await createProjectAction(payload);
    if (result?.error) {
      addToast(result.error, 'error');
    } else {
      addToast('Projet créé avec succès !', 'success');
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn btn-secondary">
        + Créer un projet
      </button>
      {isOpen && (
        <ProjectModal
          onClose={() => setIsOpen(false)}
          onSave={handleCreate}
          allUsers={allUsers}
        />
      )}
    </>
  );
}
