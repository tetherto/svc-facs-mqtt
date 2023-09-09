# svc-facs-mqtt

This facility implements a promise based mqtt client and a simple mqtt broker.

## Config

This uses config file and it can only have one param `port` which can be used to configure the port of the aedes broker. When initializing the facility, you can pass `_hasConf: false` in opts to disable the config file.

## API

### fac.getClient

Initiates a mqtt client instance for specific server.

Params:
- `opts.url<string>` - MQTT broker url
- `opts.libOpts<object>` - options for the underlying `mqttjs` library

Result:
- `MQTTClient`

Example:
```js
const mqtt = fac.getClient({
  url: 'mqtt://127.0.0.1:7070'
})
```

### fac.startServer

Starts a mqtt broker powered by aedes. The broker will be started on the port specified in config file.
