#!/usr/bin/env python

import gtk
import ssl
import thread
import BaseHTTPServer

gtk.threads_init()

class HTTPHandler(BaseHTTPServer.BaseHTTPRequestHandler):
   def write_common_headers(self):
      self.wfile.write("HTTP/1.1 200 OK\n")
      self.wfile.write("Access-Control-Allow-Origin: https://squareweave.hipchat.com\n")
      # self.wfile.write("Access-Control-Allow-Origin: http://localhost:8008\n")

   def do_OPTIONS(self):
      self.write_common_headers()
      self.wfile.write("Access-Control-Allow-Methods: POST\n")
      self.wfile.write("\n")
      self.wfile.write("ok")

   def do_POST(self):
      if self.headers["Origin"] != "https://squareweave.hipchat.com":
         return 

      gtk.threads_enter()
      if self.path == "/set_high":
         tray.set_from_file("high.png")
      elif self.path == "/set_neutral":
         tray.set_from_file("neutral.png")
      gtk.threads_leave()

      self.write_common_headers()
      self.wfile.write("\nok")


def change_listener(tray):
   httpd = BaseHTTPServer.HTTPServer(('', 9021), HTTPHandler)
   httpd.socket = ssl.wrap_socket (httpd.socket, keyfile='server.key', certfile='server.crt', server_side=True)
   httpd.tray = tray
   httpd.serve_forever()

tray = gtk.StatusIcon()
tray.set_from_file("neutral.png")
thread.start_new_thread(change_listener, (tray,))

gtk.main()
