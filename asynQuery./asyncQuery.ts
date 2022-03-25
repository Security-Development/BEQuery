import dgram, { Socket } from "dgram";
import crypto from "crypto";
import EventEmitter from "events";
import internal from "stream";

// 클래스 화 및 비동기 처리 하기
export class Query {
    emitter: EventEmitter;
    host: string;
    port: number;
    client: Socket;

    constructor(host: string, port: number) {
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

    getData(): Promise<string[]> {
        return new Promise(
            async (res: any, rej: any) => {
                const token: number = await this.getToken();
                const query: Buffer = Buffer.alloc(15);
                query.writeUInt16BE(0xFEFD, 0); 
                query.writeUInt8(0, 2); 
                query.writeInt32BE(Math.floor(Math.random() * (999 - 1 + 1)) + 1, 3); 
                query.writeInt32BE(token, 7);
                query.writeInt32BE(0x00, 11);

                this.emitter.once('stat', (stat): string[] => res(stat));

                this.client.send(query, this.port, this.host);

                
            }
        );
    }

    getToken(): Promise<number> {
        return new Promise(
            (res: any, rej: any): void => {
                this.emitter.once('token', token => {
                    res(token);
                });
            }
        );
    }

}
