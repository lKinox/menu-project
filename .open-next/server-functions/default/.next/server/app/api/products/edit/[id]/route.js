(()=>{var e={};e.id=590,e.ids=[590],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:e=>{"use strict";e.exports=require("querystring")},12412:e=>{"use strict";e.exports=require("assert")},13440:e=>{"use strict";e.exports=require("util/types")},14305:e=>{"use strict";e.exports=require("diagnostics_channel")},19771:e=>{"use strict";e.exports=require("process")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28303:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=28303,e.exports=t},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},41204:e=>{"use strict";e.exports=require("string_decoder")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},54287:e=>{"use strict";e.exports=require("console")},55511:e=>{"use strict";e.exports=require("crypto")},56285:(e,t,r)=>{"use strict";r.d(t,{AS:()=>x,C1:()=>g,FI:()=>T,JT:()=>O,O$:()=>y,TZ:()=>A,VX:()=>l,Vd:()=>N,i5:()=>R,p7:()=>w,wz:()=>m});var s=r(97329),a=r.n(s),i=r(85663),o=r(46101);a().config();let c=(0,o.createPool)({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME}),u=async()=>{let e=`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      price_discount DECIMAL(10, 2),
      img VARCHAR(255),
      avaible BOOLEAN DEFAULT true
    )
  `;await c.execute(e)},n=async()=>{let e=`
    CREATE TABLE IF NOT EXISTS company (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      img VARCHAR(255),
      welcome_text TEXT,
      about TEXT,
      schedule TEXT,
      phone VARCHAR(255),
      email VARCHAR(255),
      whatsapp VARCHAR(255),
      facebook VARCHAR(255),
      instagram VARCHAR(255)
    )
  `;await c.execute(e);let[t]=await c.execute("SELECT COUNT(*) AS count FROM company");if(0===t[0].count){let e=`
      INSERT INTO company (name, img, welcome_text, about, schedule, phone, email, whatsapp, facebook, instagram) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;await c.execute(e,["","","","","","","","","",""])}},p=async()=>{let e=`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `;await c.execute(e);let[t]=await c.execute("SELECT COUNT(*) AS count FROM users");if(0===t[0].count){let e=await i.Ay.hash("test1234",10),t=`
      INSERT INTO users (email, password) VALUES (?, ?)
    `;await c.execute(t,["test@test.com",e])}},d=async()=>{let e=`
    CREATE TABLE IF NOT EXISTS category (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;await c.execute(e)},E=async()=>{let e=`
    ALTER TABLE products 
    ADD COLUMN category_id INT, 
    ADD FOREIGN KEY (category_id) REFERENCES category(id)
  `;await c.execute(e)};(async()=>{try{await u(),await d(),await E(),await n()}catch(e){console.error("Error al crear la tabla:",e)}})();let l=async(e,t,r,s,a,i)=>(await c.execute("INSERT INTO products (name, description, price, price_discount, img, category_id) VALUES (?, ?, ?, ?, ?, ?)",[e,t,r,s,a,i]))[0].insertId,x=async()=>{let[e]=await c.execute("SELECT * FROM products");return e},T=async e=>{let[t]=await c.execute("SELECT * FROM products WHERE id = ?",[e]);return t},R=async(e,t,r,s,a,i,o,u)=>await c.execute("UPDATE products SET name = ?, description = ?, price = ?, price_discount = ?, img = ?, avaible = ?, category_id = ? WHERE id = ?",[e,t,r,s,a,i,o,u]),A=async e=>{let[t]=await c.execute("DELETE FROM products WHERE id = ?",[e]);return t},m=async e=>{await p();let[t]=await c.execute("SELECT * FROM users WHERE email = ?",[e]);return[t]},w=async()=>{let[e]=await c.execute("SELECT * FROM category");return e},N=async e=>await c.execute("INSERT INTO category (name) VALUES (?)",[e]),y=async e=>{let[t]=await c.execute("DELETE FROM category WHERE id = ?",[e]);return t},g=async()=>{await n();let[e]=await c.execute("SELECT * FROM company");return e},O=async(e,t,r,s,a,i,o,u,n,p)=>await c.execute("UPDATE company SET name = ?, img = ?, welcome_text = ?, about = ?, schedule = ?, phone = ?, email = ?, whatsapp = ?, facebook = ?, instagram = ? WHERE id = 1",[e,t,r,s,a,i,o,u,n,p])},57075:e=>{"use strict";e.exports=require("node:stream")},57975:e=>{"use strict";e.exports=require("node:util")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66136:e=>{"use strict";e.exports=require("timers")},67347:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>A,routeModule:()=>l,serverHooks:()=>R,workAsyncStorage:()=>x,workUnitAsyncStorage:()=>T});var s={};r.r(s),r.d(s,{DELETE:()=>E,GET:()=>d,PUT:()=>p});var a=r(96559),i=r(48088),o=r(37719),c=r(32190),u=r(56285),n=r(50049);async function p(e,t){let r;console.log("PUT request received");let s=await t.params,a=await e.formData(),i=a.get("name"),o=a.get("description"),p=parseFloat(a.get("price")),d=parseFloat(a.get("price_discount")),E=a.get("img"),l=a.get("avaible"),x=parseFloat(a.get("category_id")),T=await s.id,R=null;r=+("true"===l);try{if(E instanceof File){let e=`${i.replace(/\s+/g,"-")}-${Date.now()}.jpg`;R=(await (0,n.yJ)(e,E.stream(),{access:"public",addRandomSuffix:!0})).url,await (0,u.i5)(i,o,p,d,R,r,x,T)}else"string"==typeof E&&E&&await (0,u.i5)(i,o,p,d,E,r,x,T);return c.NextResponse.json({message:"Producto actualizado con \xe9xito"},{status:200})}catch(e){return console.error("Error al actualizar el producto:",e),c.NextResponse.json({error:e.message||"Error desconocido al actualizar el producto"},{status:500})}}async function d(e,t){let{id:r}=await t.params;try{let e=await (0,u.FI)(r);return c.NextResponse.json(e,{status:200})}catch(e){return console.error("Error al obtener el producto:",e),c.NextResponse.json({error:"Error al obtener productos"},{status:500})}}async function E(e,t){let r=(await t.params).id;try{return await (0,u.TZ)(r),c.NextResponse.json({message:"Producto eliminado con \xe9xito"},{status:200})}catch(e){return console.error("Error al eliminar el producto:",e),c.NextResponse.json({error:"Error al eliminar el producto"},{status:500})}}let l=new a.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/products/edit/[id]/route",pathname:"/api/products/edit/[id]",filename:"route",bundlePath:"app/api/products/edit/[id]/route"},resolvedPagePath:"/home/user/menu-project/src/app/api/products/edit/[id]/route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:x,workUnitAsyncStorage:T,serverHooks:R}=l;function A(){return(0,o.patchFetch)({workAsyncStorage:x,workUnitAsyncStorage:T})}},73496:e=>{"use strict";e.exports=require("http2")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},74998:e=>{"use strict";e.exports=require("perf_hooks")},77598:e=>{"use strict";e.exports=require("node:crypto")},78335:()=>{},78474:e=>{"use strict";e.exports=require("node:events")},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},84297:e=>{"use strict";e.exports=require("async_hooks")},91645:e=>{"use strict";e.exports=require("net")},94175:e=>{"use strict";e.exports=require("stream/web")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580,843,49],()=>r(67347));module.exports=s})();