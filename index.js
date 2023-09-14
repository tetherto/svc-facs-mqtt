'use strict'

const BaseFacility = require('bfx-facs-base')
const mqtt = require('mqtt')
const aedes = require('aedes')()
const async = require('async')

class MQTTFacility extends BaseFacility {
  constructor (caller, opts, ctx) {
    super(caller, opts, ctx)
    this.name = 'mqtt'
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

    const srv = require('net').createServer(aedes.handle)
    this.server = srv
    this.aedes = aedes

    return this.server.listen({
      host: '0.0.0.0',
      port: this.opts.port || 10883
    })
  }

  _stop (cb) {
    async.series([
      next => { super._stop(next) },
      () => {
        if (this.server) {
          this.server.close()
        }
        aedes.close()
        for (const client of this.clients) {
          client.end()
        }
      }
    ], cb)
  }
}

module.exports = MQTTFacility
