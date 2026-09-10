import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
if (!fs.existsSync('app/room-server/server.mjs')) {
  fs.rmSync('app',{recursive:true,force:true});
  fs.mkdirSync('app',{recursive:true});
  execFileSync('unzip',['-q','bundle.zip','-d','app'],{stdio:'inherit'});
}
const mod = await import(pathToFileURL(process.cwd() + '/app/room-server/server.mjs').href);
mod.createServer({port:Number(process.env.PORT)||10000,host:'0.0.0.0'});
console.log('Riftborn IO v3.6 real build ready');
