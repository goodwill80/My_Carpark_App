import { useContext } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Form from '../components/Form';

function HomePage() {
  const { getUserData, setSignIn } = useContext(CarparkContext);

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] h-auto pb-12">
      <Form getUserData={getUserData} setSignIn={setSignIn} />
    </div>
  );
}

export default HomePage;
