export default function Home() {
  return (
    <>
      <h1 className="text-5xl font-bold underline">Temporary Credentials</h1>
      <h6 className="text-xl">Email - user@slamitt.com</h6>
      <h6 className="text-xl">Password - Test@1234</h6>
      <br />
      <br />
      <h1 className="text-5xl font-bold underline">Modules</h1>
      <h5 className="text-4xl">Non-Authorised Module</h5>
      <a
        href="http://3.111.78.130:3000/login"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">1. Login Module</h1>
      </a>

      <a
        href="http://3.111.78.130:3000/signup"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">2. Registration Module</h1>
      </a>
      <a
        href="http://3.111.78.130:3000/reset-password"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">3. Reset Password Module</h1>
      </a>
      <a
        href="http://3.111.78.130:3000/signup/invitation/prayas-2022/testcontainer"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">4. Invitation Signup Module</h1>
      </a>
      <a
        href="http://3.111.78.130:3000/login/judge"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">5. Judge Login Module</h1>
      </a>
      <a
        href="http://3.111.78.130:3000/signup/invitation/ef5s7gd5fv54dfvd45df5f24b"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">4. Invitation Signup Module</h1>
      </a>
      <br />
      <br />
      <h5 className="text-4xl">Authorised Module</h5>
      <a
        href="http://3.111.78.130:3000/auth/get-started"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">1. Get Started Module</h1>
      </a>
      <a
        href="http://3.111.78.130:3000/auth/dashboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">2. Dashboard Module</h1>
      </a>
      <a
        href="http://3.111.78.130:3000/auth/competitions/prayas-2022"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">3. Competitions Module</h1>
      </a>
      <a
        href="http://3.111.78.130:3000/auth/get-started/invitation "
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">
          4. Invitation Profile Details addition Module
        </h1>
      </a>
      <a
        href="http://3.111.78.130:3000/auth/dashboard/judge"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h1 className="text-2xl underline">5. Judge Dashboard Module</h1>
      </a>
    </>
  );
}
