import { useNavigate, useParams } from "react-router-dom";
import Sidebar, { SearchPlate } from "../components/Sidebar";
import { Post, TextPost } from "./Profile";
import { useEffect, useState } from "react";
import { send, toImg } from "../../lib/io";
var received = false;
interface userProps {
  setUser: React.Dispatch<
    React.SetStateAction<{
      uid: number;
      pass: string;
    }>
  >;
  user: {
    uid: number;
    pass: string;
  };
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
interface relationProps {
  type: string;
  user: any;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

function Relations(props: relationProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fun() {
      if (!received) {
        received = true;
        const x = {
          type: "get-relations",
          _get: props.type,
          _uname: props.user,
          _useUname: true,
        };
        const y = await send(x);
        setData(y.data);
        received = false;
      }
    }

    fun();
  }, []);

  return (
    <div className={"absolute z-20 w-screen h-screen "}>
      <div
        className={
          "w-[36rem] h-[48rem] fixed left-1/3 top-8 rounded-3xl p-4 z-10 bg-gray-200 overflow-y-scroll"
        }
      >
        <span
          onClick={() => {
            props.setEnabled(false);
          }}
          className="material-symbols-rounded p-1 px-2 absolute right-5 top-3 text-3xl hover:cursor-pointer hover:bg-gray-400 rounded-full"
        >
          Close
        </span>
        <div className="text-3xl ml-5">{props.type}</div>
        <hr className="my-3" />
        {data.map((el: any) => {
          return (
            <div
              onClick={() => {
                received = false;
                props.setEnabled(false);
              }}
            >
              <SearchPlate
                key={el[1]}
                pfp={el[0]}
                uname={el[1]}
                rname={el[2]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default function User(props: userProps) {
  const navigate = useNavigate();

  const { uName } = useParams();
  const [rName, setRName] = useState("Real name");
  const [bio, setBio] = useState("Bio");
  const [image, setImage] = useState("");
  const [butText, setButText] = useState("Follow");
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [postNo, setPostNo] = useState(0);
  const [relationWindow, setRelationWindow] = useState(false);
  const [relationType, setRelationType] = useState("");
  const [imgData, setImgData] = useState([] as (string | number)[][]);
  const [msgData, setMsgData] = useState([] as (string | number)[][]);
  var _imgData = [] as (string | number)[][];
  var _msgData = [] as (string | number)[][];
  var data = [];
  useEffect(() => {
    async function res() {
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
        navigate("/profile");
      }
      setRName(y._rname);
      setBio(y._bio);
      setImage(y._pfp);
      setFollower(y._follower);
      setFollowing(y._following);
      setButText(y._doesFollow);

      data = y._posts as (string | number)[][];

      data.forEach((element) => {
        if (element[2] != "") _imgData.push(element);
        else _msgData.push(element);
      });
      setImgData(_imgData);
      setMsgData(_msgData);
    }
    res();
  }, []);

  async function followReq() {
    const x = {
      type: "follow-request",
      _id: props.user.uid,
      _uname: uName,
    };
    const y = await send(x);
    if (y.error == 0) {
      setButText(y._action);
      console.log(y._action);
    }
  }

  return (
    <>
      <Sidebar
        setUser={props.setUser}
        user={props.user}
        setLoggedIn={props.setLoggedIn}
      />
      {relationWindow && (
        <Relations
          user={uName}
          setEnabled={setRelationWindow}
          type={relationType}
        />
      )}
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
            <span> {postNo} posts </span>
            &emsp;
            <span
              onClick={() => {
                setRelationWindow(true);
                setRelationType("Followers");
              }}
              className="hover:cursor-pointer"
            >
              {follower} followers
            </span>
            &emsp;
            <span
              onClick={() => {
                setRelationWindow(true);
                setRelationType("Following");
              }}
              className="hover:cursor-pointer"
            >
              {following} following
            </span>
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
        <div className="mx-auto flex justify-center">
          <div className="w-1/2 inline-block text-xl">
            {imgData.length == 0 && msgData.length == 0 && "No Posts Found"}
            {imgData.map(
              (
                value: (string | number)[],
                index: number,
                array: (string | number)[][]
              ) => {
                if (index % 3 == 0)
                  return (
                    <div className=" flex flex-row">
                      {index < array.length && (
                        <Post
                          user={props.user}
                          key={index + "P"}
                          src={value[2]}
                          pid={value[0] as number}
                          text={value[3] as string}
                          uname={uName as string}
                          pfp={image}
                          own={false}
                          saved={value[6] != null}
                          liked={value[5] != null}
                        />
                      )}
                      {index + 1 < array.length && (
                        <Post
                          user={props.user}
                          key={index + 1 + "P"}
                          src={array[index + 1][2]}
                          pid={array[index + 1][0] as number}
                          text={array[index + 1][3] as string}
                          uname={uName as string}
                          pfp={image}
                          own={false}
                          saved={array[index + 1][6] != null}
                          liked={array[index + 1][5] != null}
                        />
                      )}
                      {index + 2 < array.length && (
                        <Post
                          user={props.user}
                          key={index + 2 + "P"}
                          src={array[index + 2][2]}
                          pid={array[index + 2][0] as number}
                          text={array[index + 2][3] as string}
                          uname={uName as string}
                          pfp={image}
                          own={false}
                          saved={array[index + 2][6] != null}
                          liked={array[index + 2][5] != null}
                        />
                      )}
                    </div>
                  );
              }
            )}
          </div>
          <div className="inline-block">
            {msgData.map((value: (string | number)[], index: number) => {
              return (
                <TextPost
                  user={props.user}
                  key={index}
                  pid={value[0] as number}
                  text={value[3] as string}
                  src={value[2]}
                  uname={uName as string}
                  pfp={image}
                  own={true}
                  saved={value[6] != null}
                  liked={value[5] != null}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
