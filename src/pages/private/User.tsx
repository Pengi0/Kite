import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Post } from "./Profile";
import { useEffect, useState } from "react";
import { send, toImg } from "../../lib/io";
var recved = false;

interface props {
  user: any;
}

export default function User(props: props) {
  const naviagte = useNavigate();

  const { uName } = useParams();
  const [rName, setRName] = useState("Real name");
  const [bio, setBio] = useState("Bio");
  const [image, setImage] = useState("");
  const [butText, setButText] = useState("Follow");
  const [follower, setFollower] = useState(118);
  const [following, setFollowing] = useState(173);
  const [postNo, setPostNo] = useState(0);

  useEffect(() => {
    if (!recved) {
      async function res() {
        recved = true;
        const x = {
          type: "get-others-profile",
          _id: props.user.uid,
          _uname: uName,
        };

        const y = await send(x);

        if (y.error != 0) {
          console.log("error");
          return;
        }
        if (uName == y._uname) {
          naviagte("/profile");
        }
        setRName(y._rname);
        setBio(y._bio);
        setImage(y._pfp);

        setButText(y._doesFollow);

        recved = false;
      }
      res();
    }
  });

  async function followReq() {
    const x = {
      type: "follow-request",
      _id: props.user.uid,
      _uname: uName,
    };
    const y = await send(x);
    if (y.error == 0) {
      setButText(y._action);
    }
  }

  return (
    <>
      <Sidebar />
      <div className="ml-80 mt-10">
        <div className="grid w-1/2 mb-10 mx-auto">
          <img
            src={toImg(image)}
            className="w-40 h-40 mr-14 object-cover rounded-full"
            style={{ gridColumn: "1", gridRow: "1 / span 3" }}
          />
          <div
            className="mt-5 text-2xl"
            style={{ gridColumn: "2", gridRow: "1" }}
          >
            {uName}
          </div>
          <div className="text-2xl" style={{ gridColumn: "2", gridRow: "2" }}>
            {rName}
          </div>
          <div
            className="mb-4 text-xl"
            style={{ gridColumn: "2", gridRow: "3" }}
          >
            {postNo} posts &emsp; {follower} followers &emsp; {following}{" "}
            following
          </div>
          <button
            className={"mb-4 " + (butText == "Follow" || "text-green-400")}
            style={{ gridColumn: "2", gridRow: "4" }}
            onClick={followReq}
          >
            {butText}
          </button>
          <div style={{ gridColumn: "2", gridRow: "5" }}>{bio}</div>
        </div>
        <hr className="w-1/2 mb-5 mx-auto border-gray-700" />
        <div className="w-1/2 mb-5 mx-auto text-3xl">Posts - </div>

        <div className="w-1/2 flex flex-col mx-auto">
          <div className="flex flex-row">
            <Post />
            <Post />
            <Post />
          </div>
          <div className="flex flex-row">
            <Post />
            <Post />
            <Post />
          </div>
        </div>
      </div>
    </>
  );
}
