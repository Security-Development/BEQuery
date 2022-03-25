const dgram = require("dgram");
const crypto = require('crypto');
const EventEmitter = require('events');

// 클래스 화 및 비동기 처리 하기
class Query {

    constructor(host, port) {
        this.emitter = new EventEmitter();
        this.host = host;
        this.port = port;
        this.client = dgram.createSocket('udp4');

        this.client.send(Buffer.from('fefd0910203040ffffff01', 'hex'), this.port, this.host);

        this.client.on("message", (buff) => {
            this.emitter.emit('token', buff.toString().replace(/[^0-9\-]/g, "").substr(1));
            this.emitter.emit('stat', buff.toString('utf-8',11).split("\x00\x01player_\x00\x00")[0].split("\0"));
        });
    }

    close() {
        this.client.close();
    }

    getData() {
        return new Promise(
            async (res, rej) => {
                var query = Buffer.alloc(15);
                var token = await this.getToken();
                query.writeUInt16BE(0xFEFD, 0); 
                query.writeUInt8(0, 2); 
                query.writeInt32BE(crypto.randomBytes(2), 3); 
                query.writeInt32BE(token, 7);
                query.writeInt32BE(0x00, 11);

                this.emitter.once('stat', stat => res(stat));

                this.client.send(query, this.port, this.host);

                
            }
        );
    }

    getToken() {
        return new Promise(
            (res, rej) => {
                this.emitter.once('token', token => {
                    res(token);
                });
            }
        );
    }

}

module.exports = Query;
