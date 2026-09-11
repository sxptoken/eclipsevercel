import json
from http.server import BaseHTTPRequestHandler
class handler(BaseHTTPRequestHandler):
    def send(self,code,payload):
        data=json.dumps(payload).encode(); self.send_response(code); self.send_header('Content-Type','application/json'); self.end_headers(); self.wfile.write(data)
    def do_GET(self): self.send(200,{'ok':True,'service':'ECLIPSE'})
    def do_POST(self):
        try:
            n=int(self.headers.get('Content-Length','0')); body=json.loads(self.rfile.read(n) or b'{}')
        except Exception: return self.send(400,{'error':'invalid JSON'})
        if body.get('type')==1: return self.send(200,{'type':1})
        self.send(200,{'type':4,'data':{'content':'ECLIPSE is online. Use the configured Discord commands in your server.'}})
