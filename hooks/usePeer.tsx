import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

const usePeer = () => {
  const socket = useSocket();
  const roomId = useRouter().query.roomId as string;
  const [peer, setPeer] = useState<any>(null);
  const [myId, setMyId] = useState<string>('');
  const isPeerSet = useRef(false);

  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return;
    isPeerSet.current = true;
    let myPeer: any;
    (async function initPeer() {
      myPeer = new (await import('peerjs')).default();
      setPeer(myPeer);

      myPeer.on('open', (id: string) => {
        console.log(`your peer id is ${id}`);
        setMyId(id);
        socket?.emit('join-room', roomId, id);
      });
    })();
  }, [roomId, socket]);

  return {
    peer,
    myId
  };
};

export default usePeer;
