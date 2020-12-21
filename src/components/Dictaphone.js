import React, { useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
const Dictaphone = ({ sendAns, voiceCommands }) => {
  //Recognized language
  const [language, setLanguage] = useState('he');
  const [continuous, setContinuous] =useState(false);
  //A Check if the speech recognition is currently running
  const { listening } = useSpeechRecognition();


  //A call to start listening
  const handleStart = () => {
    SpeechRecognition.startListening({
      language: language
    });
  }
  //handle switching the recognized laguage
  const onValueChange = (e) => {
    resetTranscript();
    setLanguage(e.target.value)

  }
  //what to run on voice commands
  const videoCommandCallback = (command) => {
    sendAns(command)
    resetTranscript();
  }
  //voice commands command can be a string to regonize or an array of strings to recognize
  const commands = [
    {
      command: ['clear', 'נקי'],
      callback: ({ resetTranscript }) => resetTranscript(),
      matchInterim: true
    },

    {
      command: [...voiceCommands],
      callback: (command) => videoCommandCallback(command),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.6,
      bestMatchOnly: true
    }
  ]

  //The actual displayed transcript, won't be needed in final product, must be placed after commands to allow voice command clear
  const { transcript, resetTranscript } = useSpeechRecognition({ commands })
  const handleContinuous = ()=>{
    setContinuous(!continuous);
    resetTranscript();
  }
  //don't return if speech regonition is not supported
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }
  else {
    if(continuous!==false){
      SpeechRecognition.startListening({
        language: language
      });
    }
  }

  return (
    <div>

      <div className="row" onChange={onValueChange}>
        <div className="col-4"></div>
        <div className="col-2">
          <input type="radio" value="en-GB" name="language" /> English
        </div>
        <div className="col-2">
          <input type="radio" value="he" name="language" defaultChecked /> עיברית
        </div>
        <div className="col-4"></div>
      </div>
      <button onClick={resetTranscript}>Reset</button>
      <div className="row justify-content-center">
        {continuous?null:<button onClick={listening? SpeechRecognition.stopListening:handleStart}>{listening? "Stop":"Start" } Dic</button>}

      </div>
      <div className="row justify-content-center">
      <button onClick={handleContinuous}>Continous Listening {continuous? "Enabled":"Disabled"}</button>
      </div>
      <div className="row">
        <div className="col-4"></div>
        <div className="trans col-4">
          <span>language: {language}</span>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <span>{transcript}</span>
            </div>
            <div className="col-2"></div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
    </div>
  )
}
export default Dictaphone