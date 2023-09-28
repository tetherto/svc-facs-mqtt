'use strict'

const BaseFacility = require('bfx-facs-base')
const mqtt = require('mqtt')
const async = require('async')

class MQTTFacility extends BaseFacility {
  constructor (caller, opts, ctx) {
    super(caller, opts, ctx)
    this.name = 'mqtt'

    if (!opts.port) {
      throw new Error('ERR_FACS_SERVER_MQTT_PORT_REQ')
    }

    this._hasConf = false
    this.clients = []
    this.init()
  }

  getClient (opts) {
    const client = mqtt.connect(opts.url, opts.libOpts)
    this.clients.push(client)
    return client
  }

  async startServer () {
    if (this.server) {
      throw new Error('ERR_FACS_SERVER_MQTT_CREATE_DUP')
    }

    this.aedes = require('aedes')()
    this.server = require('net').createServer(this.aedes.handle)

    return this.server.listen({
      host: '0.0.0.0',
      port: this.opts.port
    })
  }

  _stop (cb) {
    async.series([
      next => { super._stop(next) },
      () => {
        if (this.server) {
          this.server.close()
        }
        this.aedes.close()
        for (const client of this.clients) {
          client.end()
        }
      }
    ], cb)
  }
}

module.exports = MQTTFacility
