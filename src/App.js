import React, { useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { FaStop, FaUtensils } from "react-icons/fa";
import "./App.css";

function App() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  
  const [result, setResult] = useState("");//chave para utlizar a api do gpt
  const OPENAI_API_KEY = "INSIRA A CHAVE AQUI";

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  
  //conexoa com a api do gpt para enviar o texto e exibir a resposta abaixo do botão do mic
  const sendQuestion = (question)=>{
    fetch("https://api.openai.com/v1/completions",{
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 2048,
        temperature: 0.5,
      }),
    })
    .then((response)=> response.json())
    .then((json)=>{
      if(json.error?.message){
        setResult((prevResult) => prevResult + `Error: ${json.error.message}\n`);
      } else if (json.choices?.[0].text){
        setResult((prevResult) => prevResult + `Chat GPT: ${json.choices[0].text}\n`);
      }
    })
    .catch((error) => console.error("Error:", error));
  };

  const handleSend = () =>{
    setResult((prevResult)=> prevResult + `${transcript}\n`);
    sendQuestion(transcript);
    resetTranscript();
  };

  return (
    <div className="App">
      <div className="AppTitle">
        <h1>Hunt</h1>
        <h2>speech-to-text</h2>
      </div>
      <div className="AppContent">
        <p>Aperte o botão abaixo e fale</p>
        {listening ? (
          <button
            className="AppButton PulseAnimation"
            onClick={SpeechRecognition.stopListening}
          >
            <FaStop style={{ height: '50%', width: '50%' }}/>
          </button>
        ) : (
          <button
            className="AppButton"
            onClick={() => SpeechRecognition.startListening({
              continuous: true,
              language: "pt-br",
            })}
          >
            <FaUtensils style={{ height: '52%', width: '52%' }} />
          </button>
        )}
        <button
          className="AppButon SendButton"
          onClick={handleSend}
          disabled={!transcript}>
            Enviar
          </button>
      </div>
      <div className="ResultContainer">
        <p className="Transcript">{transcript}</p>
        <div clasName="Result">{result}</div>
      </div>
    </div>
  );
}

export default App;
