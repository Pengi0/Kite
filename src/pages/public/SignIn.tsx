import { Link } from "react-router-dom";
import { send } from "../../lib/io";
import { useState } from "react";

interface props {
  setUser: any;
  user: any;
  setLoggedIn: any;
}

export default function SignIn(props: props) {
  const [er, setEr] = useState("");

  async function submit() {
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const pass = (document.getElementById("pass") as HTMLInputElement).value;

    const y = {
      type: "validate-user",
      _pass: pass,
      _email: email,
    };

    const x = await send(y);

    if (x.error != 0) {
      setEr(x.msg);
      return;
    } else {
      props.setUser(() => {
        var ret = props.user;
        (ret.uid = x._id), (ret.pass = pass);
        console.log(ret);

        return ret;
      });
      props.setLoggedIn(true);
    }
  }

  return (
    <div className="w-2/3 h-[48rem] text-center mx-auto mt-10 bg-slate-200 rounded-3xl p-5 flex">
      <img src="signIn.jpeg" className="w-1/2 rounded-3xl" />
      <div className="w-1/2">
        <div className="font-bold text-7xl my-5">Hello Again</div>
        <div className="text-xl">login again to get connected!</div>
        <div className="mt-12">
          <input
            type="email"
            id="email"
            autoComplete="off"
            placeholder="Email"
            className="w-96 h-16 p-4 my-5 text-xl rounded-3xl"
          />
          <br />
          <input
            type="password"
            id="pass"
            placeholder="Password"
            className="w-96 h-16 p-4 my-5 text-xl rounded-3xl"
          />
          <br />

          <div className=" mt-16 mb-4 text-red-500 text-xl">{er}</div>
          <button
            onClick={submit}
            className="w-32 h-16 p-4 mt-20 mb-10 text-xl rounded-3xl"
          >
            Sign in
          </button>
        </div>
        new to Kite? Create an account... <Link to={"/sign-up"}>Sign up</Link>
      </div>
    </div>
  );
}
