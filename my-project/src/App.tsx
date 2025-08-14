import { useState } from 'react'
import './App.css'

function App() {
  let numberOfCounters = 3
  const [counters, setCounters] = useState<Array<Number>>(new Array(numberOfCounters).fill(0))

  return (
    <div className="container">
      <h1>Counter</h1>
      {counters.map((count, index) => (
        <div className="card" key={index}>
          <button onClick={() => setCounters((counters) => {
            const newCounters = [...counters];
            newCounters[index] = Number(newCounters[index]) - 1;
            return newCounters
          })}>
            -
          </button>
          <p>{String(count)}</p>
          <button onClick={() => setCounters((counters) => {
            const newCounters = [...counters]
            newCounters[index] = Number(newCounters[index]) + 1
            return newCounters
          })}>
            +
          </button>
        </div>
      ))}
      
    </div>
  )
}

export default App
