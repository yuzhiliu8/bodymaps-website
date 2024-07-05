import React from 'react'
import { useState } from 'react'
import "./App.css"

export default function App() {

  const [data, setData] = useState();


  function test(){
    console.log('test');
    setData('test');
    const url = "https://jsonplaceholder.typicode.com/todos/1";
    fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setData(JSON.stringify(data));
    })
  }


  // useEffect(() => {
  //   const url = "https://www.reddit.com/r/javascript/top/.json?limit=5";
  //   fetch(url)
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //     setData(data);
  //   })

  // })

  return (
    <div className="App">
      <div className="head">
        My Apppp
      </div>

      <button onClick={() => test()}>
        Get
      </button>

      <div className="data-output">
        {data}
      </div>
    </div>    
  )
}
