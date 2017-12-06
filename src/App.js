import React, { Component } from 'react';
import './App.css';

const Display = (props) => <div id="display">{props.displayText}</div>

const Volume = (props) => {
  return (
    <div id="volume">
      <i 
        className={`fa ${props.volumeIcon} volume-icon`} 
        aria-hidden="true"
        onClick={props.handleToggleMute}
      ></i>
      <input 
        type="range"
        id="volume-slider"
        min="0.0"
        max="1.0"
        step="0.01"
        value={props.volume}
        onChange={props.handleVolumeChange}
      />
    </div>
  )
}

const PowerButton = (props) => {
  return (
    <div id="power-container">
      <button id="power-button" className={props.status} onClick={props.handlePowerChange}>
        <i className="fa fa-power-off" aria-hidden="true"></i>
      </button>
      <label htmlFor="power">Power</label>
    </div>);
}

const DrumPad = (props) => {
  return (
    <button 
      className="drum-pad" 
      id={props.sound.name} 
      onClick={() => props.playAudio(props.sound.keyTrigger, props.sound.name)}
    >
      <p>{props.sound.keyTrigger} <br/> {props.sound.name}</p>
      <audio 
        src={props.sound.src} 
        type="audio/wav" 
        id={props.sound.keyTrigger} 
        className="clip">
      </audio>
    </button>
  );
}

class DrumMachine extends Component {
  constructor() {
    super()
    this.state = {
      status: "on",
      volume: 1.0,
      drumPads: [
        {keyTrigger: "Q", name: "snare1", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/snare-808.wav"},
        {keyTrigger: "W", name: "snare2", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/snare-tape.wav"},
        {keyTrigger: "E", name: "tom", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/tom-808.wav"},
        {keyTrigger: "R", name: "bongo", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/perc-tribal.wav"},
        {keyTrigger: "A", name: "kick", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/kick-acoustic01.wav"},
        {keyTrigger: "S", name: "open-hat", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/openhat-slick.wav"},
        {keyTrigger: "D", name: "hi-hat", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/hihat-808.wav"},
        {keyTrigger: "F", name: "laser", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/perc-laser.wav"},
        {keyTrigger: "Z", name: "clap", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/clap-tape.wav"},
        {keyTrigger: "X", name: "shaker", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/shaker-shuffle.wav"},
        {keyTrigger: "C", name: "metal", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/perc-metal.wav"},
        {keyTrigger: "V", name: "plastic", src: "https://s3.amazonaws.com/laurabrandt/drum_machine/perc-weirdo.wav"}
      ],
      volumeIcon: "fa-volume-up",
      displayText: "",
    }
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyPress, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyPress, false);
  }

  handlePowerChange = () => {
    this.setState({
      status: this.state.status === "on" ? "off" : "on",
      displayText: "",
    });
  }
  
  handleKeyPress = (event) => {
    if (event.key) {
      this.handleAudio(event.key.toUpperCase())
    }    
  }

  handleAudio = (key, name) => {
    if( this.state.status === "on") {
      const audioElement = document.getElementById(key);
      if (audioElement) {
        audioElement.play();
      }
      this.setState({
        displayText: name,
      })
    }    
  }

  handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    this.setState({
      volume: newVolume,
      volumeIcon: this.getVolumeIcon(newVolume),
    });
    for (var elem of document.getElementsByTagName('audio')) {
      elem.volume = newVolume;
    }
  }

  getVolumeIcon(volume) {
    return volume >= 0.5 ? "fa-volume-up" : volume > 0 ? "fa-volume-down" : "fa-volume-off"
  }

  handleToggleMute = () => {
    let newVolume;
    let oldVolume = this.state.volume;
    if (this.state.volume > 0) {
      newVolume = 0.0;
      this.setState({
        volume: newVolume,
        volumeIcon: this.getVolumeIcon(newVolume),
        prevVolume: oldVolume,
      });
    } else {
      newVolume = this.state.prevVolume;
      this.setState({
        volume: newVolume,
        volumeIcon: this.getVolumeIcon(newVolume),
      });
    }
    for (var elem of document.getElementsByTagName('audio')) {
      elem.volume = newVolume;
    }   
  }

  render() {
    return (
      <div id="drum-machine">
        <PowerButton status={this.state.status} handlePowerChange={this.handlePowerChange} />
        <Display displayText={this.state.displayText} />
        <Volume 
          volume={this.state.volume} 
          handleVolumeChange={this.handleVolumeChange}
          volumeIcon={this.state.volumeIcon}
          handleToggleMute={this.handleToggleMute}
        />
        {
          this.state.drumPads.map( drumPad => 
            <DrumPad 
              key={drumPad.keyTrigger}
              sound={drumPad}                
              playAudio={this.handleAudio}
            /> )
        }
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <DrumMachine />
      </div>
    );
  }
}

export default App;
