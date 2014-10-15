#!usr/bin/env
'''
	Programa creado usando yuwsup-cli para Dromos. 
 	Este programa sera capaz de mandar un mensaje a
	uno o varios destinatarios que busquen rutas 
	entre hitos usando el API de Dromos.

	Programado por:
		@DavidFernandoC
'''
# IMPORTS 

import base64
#Importa la Clase WhatsappEchoClient, dedicada a envio de mensajes.
from yowsup.src.Examples.EchoClient import WhatsappEchoClient
from yowsup.src.Examples.ListenerClient import WhatsappListenerClient


# CONFIG INICIAL

#................Clave de Acceso a WhatsApp............................
password = "FiCJyEpH+7oJo+mQbmNPiG+Ed0A="                      #Password dada al registrar el numero.
password = base64.b64decode(bytes(password.encode('utf-8')))   #Codificacion de Password para envio a los servidores de whatsApp.
username = '593991002395'                                      #Numero de telefono para el inicio de secion.
waitforreceipt= False                                          #Conexion persistente con el servidor.
keepalive = True
#......................................................................


# ------- DROMOS CONFIG

APIendpoint = "http://safe-reaches-3195.herokuapp.com"
city = "gye"
start = ""
end = ""

# ---------

#dromosRoute = APIendpoint + '/routes/' + data.city + '/' + data.start + '/' + data.end + '?callback=?'

#dromosTransportInfo = APIendpoint + '/transports/' + city + '?callback=?'


# DAVID USA
#echoer = WhatsappEchoClient("12016885648", "Mensaje de Dromos", waitforreceipt)     #Inicia el cliente para el envio de mensajes por WhatsApp.
#echoer.login(username, password)  

#ANCA
#echoer = WhatsappEchoClient("56999922351", "Mensaje de Dromos", waitforreceipt)     #Inicia el cliente para el envio de mensajes por WhatsApp.
#echoer.login(username, password)  

#BLINI
#echoer = WhatsappEchoClient("56951190365", "Mensaje de Dromos", waitforreceipt)     #Inicia el cliente para el envio de mensajes por WhatsApp.
#echoer.login(username, password)  

#RODCHA
#echoer = WhatsappEchoClient("56975178380", "Mensaje de Dromos", waitforreceipt)     #Inicia el cliente para el envio de mensajes por WhatsApp.
#echoer.login(username, password)  

#FRANCISCA
#echoer = WhatsappEchoClient("56976176242", "Mensaje de Dromos", waitforreceipt)     #Inicia el cliente para el envio de mensajes por WhatsApp.
#echoer.login(username, password)  

#GEORGE
echoer = WhatsappEchoClient("56952472990", "Mensaje de Dromos", waitforreceipt)     #Inicia el cliente para el envio de mensajes por WhatsApp.
echoer.login(username, password)

#JOSE
echoer = WhatsappEchoClient("56977012473", "Mensaje de Dromos", waitforreceipt)     #Inicia el cliente para el envio de mensajes por WhatsApp.
echoer.login(username, password)  

#listener = WhatsappListenerClient(True, True)

