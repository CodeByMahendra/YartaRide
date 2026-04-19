'use client';
import { useEffect, useContext } from 'react';
import { SocketDataContext } from '@/context/SocketContext';
import { useToast } from '@/context/ToastContext';
import { usePathname } from 'next/navigation';

export default function GlobalListeners() {
    const { socket } = useContext(SocketDataContext);
    const { showToast } = useToast();
    const pathname = usePathname();

    useEffect(() => {
        if (!socket) return;

        socket.on('new-message', (data: any) => {
            // Only show toast if NOT on the messages page
            if (pathname !== '/messages') {
                const senderName = data.sender?.fullname ? `${data.sender.fullname.firstname}` : 'Someone';
                showToast(
                    `${senderName}: ${data.content}`,
                    'push',
                    'NEW MESSAGE'
                );
            }
        });

        return () => {
            socket.off('new-message');
        };
    }, [socket, pathname, showToast]);

    return null;
}
