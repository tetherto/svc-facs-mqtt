'use strict'

const BaseFacility = require('bfx-facs-base')
const mqtt = require('mqtt')
const aedes = require('aedes')()
const async = require('async')

class MQTTFacility extends BaseFacility {
  constructor (caller, opts, ctx) {
    super(caller, opts, ctx)
    this.name = 'mqtt'
    // only for server
    this._hasConf = true
    this.init()
  }

  getClient (opts) {
    const client = mqtt.connect(opts.url, opts.libOpts)
    return client
  }

  async startServer () {
    if (this.server) {
      throw new Error('ERR_FACS_SERVER_MQTT_CREATE_DUP')
    }

    const srv = require('net').createServer(aedes.handle)
    this.server = srv

    return await this.server.listen({ port: this.conf.port })
  }

  _stop (cb) {
    async.series([
      next => { super._stop(next) },
      async () => {
        if (this.server) {
          await this.server.close()
          aedes.close()
        }
      }
    ], cb)
  }
}

module.exports = MQTTFacility
