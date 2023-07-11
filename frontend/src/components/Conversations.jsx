import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
//import "./Conversations.css";

const Conversation = ({ conversation }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState();
  const receiver = conversation.members.find((m) => m !== session.user.email);
  const index = receiver.indexOf("@");
  const check = receiver.slice(index);
  var doctor = false;
  if (check == "@pec.edu.in") {
    doctor = true;
     useEffect(() => {
       if (router.isReady) {
         fetch(`http://localhost:5000/search/${receiver}`, {
           method: "GET",
         })
           .then((res) => res.json())
           .then((data) => {
             setUser(data);
           });
       }
     }, [router.isReady]);
  }
  else {
    useEffect(() => {
      if (router.isReady) {
        fetch(`http://localhost:5000/patientProfile/${receiver}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
          });
      }
    }, [router.isReady]);
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="conversation">
        <img className="conversationImg" src={user.picturePath} alt="" />
        <span className="conversationName">{user.name}</span>
      </div>
      <div>
        {!doctor && (
          <button>
            <Link href={`/patientProfile/${receiver}`}>See Profile</Link>
          </button>
        )}
      </div>
      <div>
        {doctor && (
          <p>{user.domain}</p>
        )}
      </div>
    </>
  );
};

export default Conversation;
