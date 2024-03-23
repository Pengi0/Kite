import { useEffect, useState } from "react";
import Sidebar, { SearchPlate } from "../components/Sidebar";
import { isAlphaNum, send, toImg, validateEmail } from "../../lib/io";

interface editProfileProps {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  pfp: string;
  uName: string;
  rName: string;
  bio: string;
  user: {
    uid: number;
    pass: string;
  };
  setUser: React.Dispatch<
    React.SetStateAction<{
      uid: number;
      pass: string;
    }>
  >;
  email: string;
}
interface profileProps {
  user: {
    uid: number;
    pass: string;
  };
  setUser: React.Dispatch<
    React.SetStateAction<{
      uid: number;
      pass: string;
    }>
  >;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}
interface relationProps {
  type: string;
  user: any;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

var useEffectOn = false;
var EditSend = false;
export function Post() {
  return (
    <div className="w-60 aspect-square rounded-2xl m-2 bg-gray-600 hover:cursor-pointer hover:m-0 hover:w-64 transition-all">
      <img src="" alt="" />
    </div>
  );
}

function EditProfile(props: editProfileProps) {
  const [src, setSrc] = useState(toImg(props.pfp));
  const [er, setEr] = useState("");
  function toBase64(file: File) {
    return new Promise<string | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result?.toString();
        if (encoded && encoded.length % 4 > 0) {
          encoded += "=".repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function imageSubmit() {
    const img = document.getElementById("image-file") as HTMLInputElement;
    img.click();
  }

  async function imageSend() {
    const img = document.getElementById("image-file") as HTMLInputElement;
    if (img.files) {
      let b64 = await toBase64(img.files[0]);

      const x = {
        type: "post-img",
        base64: b64 ? b64.replace(/^data:(.*,)?/, "") : "",
        img_type: img.files[0].type.replace("image/", ""),
      };

      const y = await send(x);
      const pfp = document.getElementById("edit-pfp") as HTMLImageElement;

      pfp.src = toImg(y.loc);
      return y.loc;
    }
  }

  async function submit() {
    if (!EditSend) {
      EditSend = true;

      const img = document.getElementById("image-file") as HTMLInputElement;
      if (img.files?.length || 0 > 0) var pfpLoc = await imageSend();
      else pfpLoc = props.pfp;
      const UName = (document.getElementById("EUname") as HTMLInputElement)
        .value;
      const RName = (document.getElementById("ERname") as HTMLInputElement)
        .value;
      const Bio = (document.getElementById("EBio") as HTMLInputElement).value;

      var Email = (document.getElementById("EEmail") as HTMLInputElement).value;
      var pass = (document.getElementById("EPass") as HTMLInputElement).value;
      const rePass = (document.getElementById("ERPass") as HTMLInputElement)
        .value;
      if (Email.length > 0) {
        if (Email.length > 255) {
          setEr("Email is over maximum length (255)");
          EditSend = false;
          return;
        }
        if (!validateEmail(Email)) {
          setEr("Improper syntax for Email");
          EditSend = false;
          return;
        }
        if (pass.length < 8) {
          setEr("Password is less than minimum length (8)");
          EditSend = false;
          return;
        }
        if (pass.length > 255) {
          setEr("password is over maximum length (255)");
          EditSend = false;
          return;
        }
        console.log(pass);
        console.log(rePass);

        if (pass != rePass) {
          setEr("Re-Entered password does not match");
          EditSend = false;
          return;
        }
      } else {
        Email = props.email;
        pass = props.user.pass;
      }
      if (!isAlphaNum(UName)) {
        setEr("User Name is not Alpha-Numeric");
      }
      if (!isAlphaNum(RName)) {
        setEr("Real Name is not Alpha-Numeric");
      }
      const x = {
        type: "update-profile",
        _id: props.user.uid,
        _pass: props.user.pass,
        _uname: UName,
        _rname: RName,
        _bio: Bio,
        _pfp: pfpLoc,
        _email: Email,
        _repass: pass,
      };

      const y = await send(x);
      if (y.error != 0) setEr(y.msg);
      else {
        var z = props.user;
        z.pass = pass;
        props.setUser(z);
        props.setEdit(false);
      }
      EditSend = false;
    }
  }

  return (
    <div className={"absolute z-20 w-screen h-screen "}>
      <div
        className={
          "w-[36rem] h-[48rem] fixed left-1/3 top-8 rounded-3xl p-4 z-10 bg-gray-300 overflow-y-scroll"
        }
      >
        <span
          onClick={() => props.setEdit(false)}
          className="material-symbols-rounded p-1 px-2 absolute right-5 top-3 text-3xl hover:cursor-pointer hover:bg-gray-400 rounded-full"
        >
          Close
        </span>
        <div className="text-3xl ml-5">Edit Profile -</div>
        <hr className="mt-3" />
        <div className="bg-gradient-to-r from-teal-300 to-teal-500 p-1 w-[10.5rem] inline-block mt-7 ml-5 rounded-full">
          <img
            src={src}
            id="edit-pfp"
            className="w-40 h-40 object-cover rounded-full"
          />
        </div>
        <button
          onClick={imageSubmit}
          className="relative -translate-y-28 translate-x-10"
        >
          Change Profile Picture
        </button>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          id="image-file"
          accept="image/*"
        />
        <hr className="my-3 mx-10 border-gray-400" />
        <div className="ml-10 text-2xl">Enter User name -</div>
        <input
          type="text"
          id="EUname"
          maxLength={255}
          defaultValue={props.uName}
          placeholder="User name"
          className="ml-10 my-2 w-96 text-xl hover:cursor-text border border-gray-500"
        />
        <div className="ml-10 text-2xl">Enter Real name -</div>
        <input
          type="text"
          id="ERname"
          maxLength={255}
          defaultValue={props.rName}
          placeholder="Real name"
          className="ml-10 my-2 w-96 text-xl hover:cursor-text border border-gray-500"
        />
        <div className="ml-10 text-2xl">Enter Bio -</div>
        <textarea
          id="EBio"
          defaultValue={props.bio}
          placeholder="Bio"
          maxLength={255}
          className="ml-10 my-2 p-2 w-96 h-40 text-xl resize-none rounded-xl bg-white hover:cursor-text hover:border-blue-500 border border-gray-500"
        />
        <hr className="my-3 mx-10 border-gray-400" />

        <div className="ml-10 text-2xl">Enter Email -</div>
        <input
          type="text"
          id="EEmail"
          maxLength={255}
          placeholder={
            props.email.substring(0, 3) +
            "***" +
            props.email.substring(props.email.indexOf("@"))
          }
          className="ml-10 my-2 w-96 text-xl hover:cursor-text border border-gray-500"
        />
        <div className="ml-10 text-2xl">Enter Password -</div>
        <input
          type="password"
          id="EPass"
          maxLength={255}
          placeholder="Password"
          autoComplete="new-password"
          className="ml-10 my-2 w-96 text-xl hover:cursor-text border border-gray-500"
        />
        <div className="ml-10 text-2xl">Re-enter Password -</div>
        <input
          type="password"
          id="ERPass"
          maxLength={255}
          placeholder="Repeat Password"
          className="ml-10 my-2 w-96 text-xl hover:cursor-text border border-gray-500"
        />
        <hr className="my-3 mx-10 border-gray-400 " />
        <div className="mb-5 text-center text-red-500 text-xl">{er}</div>
        <button id="" onClick={submit} className="relative translate-x-72 mb-3">
          Change
        </button>
      </div>
    </div>
  );
}

function Relations(props: relationProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fun() {
      if (!useEffectOn) {
        useEffectOn = true;
        const x = {
          type: "get-relations",
          _get: props.type,
          _id: props.user.uid,
          _useUname: false,
        };
        const y = await send(x);
        setData(y.data);
        useEffectOn = false;
      }
    }

    fun();
  });

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
            <SearchPlate key={el[1]} pfp={el[0]} uname={el[1]} rname={el[2]} />
          );
        })}
      </div>
    </div>
  );
}

export default function Profile(props: profileProps) {
  const [uName, setUname] = useState("");
  const [rName, setRName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [follower, setFollower] = useState(118);
  const [following, setFollowing] = useState(173);
  const [postNo, setPostNo] = useState(0);

  const [edit, setEdit] = useState(false);
  const [relationWindow, setRelationWindow] = useState(false);
  const [relationType, setRelationType] = useState("");

  useEffect(() => {
    async function fun() {
      if (!useEffectOn) {
        useEffectOn = true;
        const x = {
          type: "get-profile",
          _id: props.user.uid,
          _pass: props.user.pass,
        };
        const y = await send(x);

        setUname(y._uname);
        setRName(y._rname);
        setBio(y._bio);
        setImage(y._pfp);
        setEmail(y._email);
        setFollower(y._follower);
        setFollowing(y._following);
        useEffectOn = false;
      }
    }

    fun();
  });

  return (
    <>
      <Sidebar setUser={props.setUser} setLoggedIn={props.setLoggedIn} />
      {relationWindow && (
        <Relations
          user={props.user}
          setEnabled={setRelationWindow}
          type={relationType}
        />
      )}
      {edit && (
        <EditProfile
          setUser={props.setUser}
          user={props.user}
          email={email}
          edit={edit}
          setEdit={setEdit}
          uName={uName}
          rName={rName}
          bio={bio}
          pfp={image}
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
            className="mb-8 text-xl"
            style={{ gridColumn: "2 / span 2", gridRow: "3" }}
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
          <div style={{ gridColumn: "2", gridRow: "4" }}>{bio}</div>
          <button onClick={() => setEdit(true)} style={{ gridColumn: "3" }}>
            Edit Profile
          </button>
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
