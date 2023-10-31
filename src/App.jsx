import { createSignal } from "solid-js";

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <h1 class="text-2xl text-center h-screen flex flex-col justify-center font-bold">
        Waiting For Update ⏳
      </h1>
    </>
  );
}

export default App;
