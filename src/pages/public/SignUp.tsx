import { Link } from "react-router-dom";
import { isAlphaNum, send, validateEmail } from "../../lib/io";
import { useState } from "react";

interface props {
  setUser: any;
  user: any;
  setLoggedIn: any;
}

export default function SignUp(props: props) {
  const [er, setEr] = useState("");

  async function submit() {
    setEr("");

    const uname = (document.getElementById("uname") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const pass = (document.getElementById("pass") as HTMLInputElement).value;
    const rePass = (document.getElementById("repass") as HTMLInputElement)
      .value;

    if (uname.length < 3) {
      setEr("User name is less than minimum length (3)");
      return;
    }
    if (uname.length > 255) {
      setEr("User name is over maximum length (255)");
      return;
    }
    if (!isAlphaNum(uname)) {
      setEr("Invalid symbol in user name");
      return;
    }
    if (email.length > 255) {
      setEr("Email is over maximum length (255)");
      return;
    }
    if (!validateEmail(email)) {
      setEr("Improper syntax for Email");
      return;
    }
    if (pass.length < 8) {
      setEr("Password is less than minimum length (8)");
      return;
    }
    if (pass.length > 255) {
      setEr("password is over maximum length (255)");
      return;
    }
    if (pass != rePass) {
      setEr("Re-Entered password does not match");
      return;
    }
    const y = {
      type: "create-user",
      _uname: uname,
      _pass: pass,
      _email: email,
    };
    console.log("submit");

    var x = await send(y);

    if (x.error != 0) setEr(x.msg);
    else
      props.setUser(() => {
        var ret = props.user;
        (ret.uid = x._id), (ret.pass = pass);

        props.setLoggedIn(true);
        return ret;
      });

    return;
  }

  return (
    <div className="w-2/3 text-center mx-auto mt-10 bg-slate-200 rounded-3xl p-5 flex">
      <div className="w-1/2 mx-auto xl:mx-0">
        <div className="font-bold text-7xl my-5">Welcome</div>
        <div className="text-xl">sign up and have fun!</div>
        <div className="mt-12">
          <input
            type="text"
            id="uname"
            autoComplete="new-password"
            placeholder="Username"
            className="w-96 h-16 p-4 my-2 text-xl rounded-3xl"
          />
          <br />
          <input
            type="email"
            id="email"
            placeholder="Email"
            autoComplete="new-password"
            className="w-96 h-16 p-4 my-2 text-xl rounded-3xl"
          />
          <br />
          <input
            type="password"
            id="pass"
            autoComplete="new-password"
            placeholder="Password"
            className="w-96 h-16 p-4 my-2 text-xl rounded-3xl"
          />
          <br />
          <input
            type="password"
            id="repass"
            autoComplete="new-password"
            placeholder="Re-enter password"
            className="w-96 h-16 p-4 my-2 text-xl rounded-3xl"
          />
          <br />
          <div className=" mt-16 mb-4 text-red-500 text-xl">{er}</div>
          <button
            onClick={submit}
            className="w-32 h-16 p-4 mb-10 bg-white text-xl rounded-3xl"
          >
            sign up
          </button>
        </div>
        Already have an account? <Link to={"/sign-in"}>Sign in</Link>
      </div>
      <img src="signIn.jpeg" className="w-0 h-[48rem] rounded-3xl xl:w-1/2" />
    </div>
  );
}
