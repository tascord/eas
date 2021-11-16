<div align="center">
  <h1>CAREFUL!!</h1>
  <h3>The Pages Site Contains Flashing Images And Loud Sounds</h3>
  
  <br />
</div>

## Quick Access
* [View the preview](https://tascord.github.io/eas/)
* [View the config file](./script.js)

## Editing
To make your own funny EAS-que (EAS Esque) site, simply clone the project and edit the Config ([script.js](./script.js)) file.
This file contains the following mutable properties:
|      Name     |                                                 Description                                                | Default Value |
|:-------------:|------------------------------------------------------------------------------------------------------------|:-------------:|
|     speed     | Text 'scroll' speed in seconds                                                                             |       3       |
|      loop     | Whether the text should loop on completion, or halt on the final screen                                    |     false     |
|   corruption  | How many bits of the canvas output should be randomized. Effects image overlay                             |       10      |
|     speak     | Whether or not the web speech synthesizer should be used to speak the current screen                       |     false     |
|     voice     | Target voice to use for speech synthesis. Defaults to first avaliable if browser supports speech synthesis |    'David'    |
|  voice_volume | Volume of the speech synthesis                                                                             |      0.25     |
| pitch         | Pitch of the speech synthesis                                                                              | 0.1           |
| rate          | Rate of speech for synthesis                                                                               | 0.85          |
| eas_volume    | Volume of the EAS alarm tone                                                                               | 0.05          |
| static_volume | Volume of the background static                                                                            | 0.05          |
