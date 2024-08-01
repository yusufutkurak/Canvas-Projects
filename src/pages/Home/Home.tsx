import React, { Component, useEffect } from 'react'
import RandomId from '../../webSocket/RandomId'

function Home () {
    const { updateUser } = RandomId();

    useEffect(() =>{
      updateUser(false);
    }, [updateUser]);
  
    return (
      <div>Home</div>
    );
  
}

export default Home;