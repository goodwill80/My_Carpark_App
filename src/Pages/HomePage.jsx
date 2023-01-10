import { useContext } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Form from '../components/Form';

function HomePage() {
  const { getUserData } = useContext(CarparkContext);

  return (
    <div className="flex flex-col justify-center items-center min-h-[75vh] h-auto">
      <Form getUserData={getUserData} />
    </div>
  );
}

export default HomePage;
