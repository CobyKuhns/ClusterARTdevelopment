from tkinter import *
import socket
import threading
import time

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
HOST = "192.168.5.94"
PORT = 4000
packetQueue = []
drawingQueue = []

def get_x_and_y(event):
    global lasx, lasy
    lasx, lasy = event.x, event.y

def draw_smth(event):
    global lasx, lasy
    canvas.create_line((lasx, lasy, event.x, event.y), fill='white', width=2)
    packet = "{} {} {} {}".format(lasx, lasy, event.x, event.y)
    packetQueue.append(packet)
    lasx, lasy = event.x, event.y

def clearCanvas(canvas):
    canvas.delete('all')

def startConnection():
    s.connect((HOST,PORT))

def receiveUpdates():
    while True:
        data = (s.recv(1024).decode())
        drawingQueue.append(data)

def drawingUpdates():
    while True:
        if drawingQueue:
            data = drawingQueue.pop(0)
            dataList = data.split(" ")
            print(dataList)
            canvas.create_line((dataList[0],dataList[1],dataList[2],dataList[3]), fill = 'blue', width= 2)
            dataList = []
        time.sleep(.01)

def sendUpdates():
    while True:
        if packetQueue:
            packet = packetQueue[0]
            packetQueue.pop(0)
            s.send(packet.encode())
            time.sleep(.01)

startConnection()
app = Tk()
app.geometry("400x400")
canvas = Canvas(app, bg='black')
canvas.pack()
canvas.bind("<Button-1>", get_x_and_y)
canvas.bind("<B1-Motion>", draw_smth)
clearButton = Button(app, text= "Clear", command= lambda: clearCanvas(canvas))
clearButton.pack()
t1 = threading.Thread(target=receiveUpdates, daemon= True)
t1.start()
t2 = threading.Thread(target=sendUpdates, daemon= True)
t2.start()
t3 = threading.Thread(target= drawingUpdates, daemon= True)
t3.start()
app.mainloop()