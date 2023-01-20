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
    </div>
  );
}

export default HomePage;
