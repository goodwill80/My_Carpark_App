import { useContext, useState } from 'react';
import { CarparkContext } from '../Context/CarparkContext';
import Form from '../components/Form';

function HomePage() {
  const { carpark, getUserData } = useContext(CarparkContext);

  return (
    <div>
      <Form getUserData={getUserData} />
    </div>
  );
}

export default HomePage;
