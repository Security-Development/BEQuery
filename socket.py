import socket
import time
import struct
from random import randint


def printServerData(host, port):
    global socket
    
    timeout = 3

    socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    socket.settimeout(timeout)

    dump = b'\xFE\xFD\x09\x10\x20\x30\x40\xFF\xFF\xFF\x01'

    # handshake
    socket.sendto(dump, (host, port))

    token = socket.recv(2048)[5:-1].decode()
    print(token)

    payload = b'\x00' * 4

    request = b'\xFE\xFD\x00'+struct.pack(">L", randint(1, 999)) + struct.pack('>l', int(token)) + payload
    print(request)

    socket.sendto(request, (host, port))


    status = str(socket.recvfrom(2048)[0])[17:]
    data = status.split('\\x00')
    for i in range(len(data)):    
        print(data[i])
