import GoogleLoginButton from "./GoogleLoginButton";

function LoginForm() {
  return (
    <div className="bg-black flex flex-col gap-4 items-center mx-2 text-center">
      <h1 className="text-2xl font-semibold">Welcome back to Talkative</h1>
      <h2 className="mt-3 text-neutral-400">
        Chat with your friends anywhere and everywhere
      </h2>
      <GoogleLoginButton/>
    </div>
  );
}

export default LoginForm;
