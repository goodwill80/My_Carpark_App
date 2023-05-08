import React from 'react';

function NoAccessPage() {
  return (
    <div className="flex justify-center items-center min-h-[100vh]">
      <h1 className="text-3xl w-[50%] text-center text-red-400">
        Either page has expired or you are not authorised to access to its
        content.
      </h1>
    </div>
  );
}

export default NoAccessPage;
