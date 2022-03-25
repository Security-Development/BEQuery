const dgram = require("dgram");
const challenge = "fefd0910203040ffffff01";
const session = 0x01;
const client = dgram.createSocket('udp4');
let data = null;
let query = null;
let token = null;

// var bytes = Array(10);

// bytes[0] = 0xFE;
// bytes[1] = 0xFD
// bytes[2] = 0X09
// bytes[3] = 0X10
// bytes[4] = 0X20
// bytes[5] = 0X30
// bytes[6] = 0X40
// bytes[7] = 0XFF
// bytes[8] = 0XFF
// bytes[9] = 0X01

//Buffer.from('fefd0910203040ffffff01', 'hex');

const dump = Buffer.from(challenge, 'hex');

client.connect(19132, "crush24.kro.kr");
console.log("연결 완료");

client.on("connect", () => {
    client.send(dump);
    //console.log("패킷 보냄 : "+dump);
});

client.on("message", (buff) => {
    token = buff.toString().replace(/[^0-9\-]/g, "").substr(1);
    query = Buffer.alloc(15)
    query.writeUInt16BE(0xFEFD, 0); 
    query.writeUInt8(0, 2); 
    query.writeInt32BE(55, 3); 
    query.writeInt32BE(token, 7);
    query.writeInt32BE(0x00, 11);                               

    console.log("토큰 : "+token);

    setTimeout(() => client.send(query), 500);
    
    console.log("패킷 보냄 : "+query);

    /**
     * Skey => data
     * 3 => mote
     * 5 => gametype
     * 7 => game_id
     * 9 => version
     * 11 => plugins
     * 13 => map
     * 15 => online_players
     * 17 => max_players
     * 19 => port
     */
    data = buff.toString('utf-8',11).split("\x00\x01player_\x00\x00")[0].split("\0");
});



setTimeout(() => console.log(data[3]), 1000);


