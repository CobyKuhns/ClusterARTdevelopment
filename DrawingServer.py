import socket
import threading
import time

connections = []
HOST = "192.168.5.94"
PORT = 4000
receivingThreads = []
packetQueue = []

def receiveConnections():
    while True:
        if len(connections) < 10:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.bind((HOST, PORT))
            s.listen()
            conn, addr = s.accept()
            connections.append(conn)
            t1 = threading.Thread(target=receiveMessages, args=(conn,), daemon= True)
            t2 = threading.Thread(target=sendMessages, daemon= True)
            t2.start()
            receivingThreads.append(t1)
            t1.start()

def receiveMessages(conn):
    while True:
        data = conn.recv(1024)
        packetQueue.append(data)
        

def sendMessages():
    while True:
        if packetQueue:
            packet = packetQueue[0]
            packetQueue.pop(0)
            for conn in connections:
                conn.send(packet)
            time.sleep(.01)

receiveConnections()