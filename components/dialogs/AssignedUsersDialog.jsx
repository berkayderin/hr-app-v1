'use client'
import * as Dialog from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { Button } from '../ui/button';

function AssignedUsersDialog({ assignedTests }) {
    const [open, setOpen] = useState(false);
  
    return (
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button>
            Atananları Göster
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg w-auto max-w-md">
            <Dialog.Title className='font-bold'>Atanan Kullanıcılar</Dialog.Title>
            <ul className="list-disc pl-5 my-4">
              {assignedTests.map((assignedTest, index) => (
                <li key={index} className="mb-1">
                  {assignedTest.user.email}
                </li>
              ))}
            </ul>
            <Dialog.Close asChild>
              <Button>
                Kapat
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
  
  export default AssignedUsersDialog;