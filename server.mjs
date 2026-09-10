import http from 'node:http';
import {gunzipSync} from 'node:zlib';
const keys=Object.keys(process.env).filter(k=>/^GAME_\d+$/.test(k)).sort();
if(!keys.length) throw new Error('GAME payload missing');
const b64=keys.map(k=>process.env[k]).join('');
const html=gunzipSync(Buffer.from(b64,'base64'));
const server=http.createServer((req,res)=>{
  if(req.url==='/health'){res.writeHead(200,{'content-type':'application/json','cache-control':'no-store'});return res.end(JSON.stringify({ok:true,build:'Riftborn v3.6.0 solo'}));}
  res.writeHead(200,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});res.end(html);
});
server.listen(process.env.PORT||10000,'0.0.0.0',()=>console.log('Riftborn v3.6.0 solo ready'));
