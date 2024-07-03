import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { BiSolidLeaf } from "react-icons/bi";
import { FaStop } from "react-icons/fa";
import "./App.css";

function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
      <div className="AppTitle">
        <h1>Hunt</h1>
        <h2>Funcionalidade speech-to-text</h2>
      </div>
      <div className="AppContent">
        <p>Aperte o botão abaixo e fale</p>
        {listening ? (
          <button
            className="AppButton PulseAnimation"
            onClick={SpeechRecognition.stopListening}
          >
            {<FaStop />}
          </button>
        ) : (
          <button
            className="AppButton"
            onClick={() => SpeechRecognition.startListening({
              continuous: true,
              language: "pt-br",
            })}
          >
            {<BiSolidLeaf />}
          </button>
        )}
      </div>
      <p className="AppContent">{transcript}</p>
    </div>
  );
}

export default App;
