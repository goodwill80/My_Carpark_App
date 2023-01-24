import { useContext } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Form from '../components/Form';
import Instructions from '../components/Instructions';

function HomePage() {
  const { getUserData, setSignIn } = useContext(CarparkContext);

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] h-auto pb-12">
      <Instructions />
      <Form getUserData={getUserData} setSignIn={setSignIn} />
      <div className="flex flex-col justify-center items-center">
        <p className="text-sm flex flex-col mt-4 text-center w-[80%] md:w-[32%] text-gray-400">
          A monthly restriction of API calls had been set for this site. We
          apologise for the experience if you encounter any restrictions while
          using this app. This is a group project done by students from NTU SCTP
          program. You may visit us at
        </p>
        <a
          className="text-sm text-blue-400"
          href="https://github.com/orgs/NTU-SCTP-SE-C1-Project-Group-1/people"
          rel="noreferrer noopener"
          target="_blank"
        >
          Github link
        </a>
      </div>
    </div>
  );
}

export default HomePage;
