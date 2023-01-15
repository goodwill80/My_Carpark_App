import { useContext } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Form from '../components/Form';

function HomePage() {
  const { getUserData, setSignIn } = useContext(CarparkContext);

  return (
    <div className="flex flex-col justify-center items-center min-h-[75vh] h-auto">
      <Form getUserData={getUserData} setSignIn={setSignIn} />
    </div>
  );
}

export default HomePage;
