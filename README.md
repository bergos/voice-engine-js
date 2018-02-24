# voice-engine-js

The library is used to create voice interface applications.
It includes building blocks such as KWS (keyword spotting) and STT (speech to text).

## Requirements

The code is developed on a Raspberry Pi 3 with a [ReSpeaker 4 Mic Array](https://www.seeedstudio.com/ReSpeaker-4-Mic-Array-for-Raspberry-Pi-p-2941.html).
The Pi was running [Raspbian](https://www.raspberrypi.org/downloads/raspbian/) with the [seeed-voicecard](https://github.com/respeaker/seeed-voicecard) kernel modules installed.
Node.js v8.x was installed from the [NodeSource Distributions](https://github.com/nodesource/distributions#installation-instructions).

## Installation

The official npm packages of [Snowboy](https://snowboy.kitt.ai/) didn't work.
Npm showed an error during the installation after running `npm install snowboy --save`.
Installing `Snowboy` from [source](https://github.com/Kitt-AI/snowboy) was working.
Just follow the instructions in the [readme](https://github.com/Kitt-AI/snowboy#compile-a-node-addon).

To run the examples, clone the repository:

```
git clone https://github.com/bergos/voice-engine-js.git
```

Change to the repository folder and install the dependencies:

```
npm install
```

And then create a symlink to your `Snowboy` clone which contains the compiled Node.js module:

```
ln -s $SNOWBOY node_modules/snowboy
```

## Examples

The examples folder contains multiple examples.
All can be run without additional parameters.
After running the example, a message will show more details about the example.

### Speech To Text

A [Google API key](https://support.google.com/googleapi/answer/6158862?hl=en) or [Wit.ai access token](https://github.com/wit-ai/wit-api-only-tutorial/blob/master/README.md#get-your-seed-token) is required for the speech to text examples.

Export one of them like this:

```
export GOOGLE_API_KEY="..."
export WIT_ACCESS_TOKEN="..."
``` 
