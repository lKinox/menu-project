(()=>{var e={};e.id=146,e.ids=[146],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:e=>{"use strict";e.exports=require("querystring")},12412:e=>{"use strict";e.exports=require("assert")},13440:e=>{"use strict";e.exports=require("util/types")},14305:e=>{"use strict";e.exports=require("diagnostics_channel")},19771:e=>{"use strict";e.exports=require("process")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28303:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=28303,e.exports=t},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},41204:e=>{"use strict";e.exports=require("string_decoder")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},52504:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>R,routeModule:()=>d,serverHooks:()=>x,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>T});var s={};r.r(s),r.d(s,{GET:()=>E,POST:()=>p});var a=r(96559),i=r(48088),o=r(37719),c=r(32190),u=r(56285),n=r(50049);async function p(e){let t=await e.formData(),r=t.get("name"),s=t.get("description"),a=parseFloat(t.get("price")),i=parseFloat(t.get("price_discount")),o=parseFloat(t.get("category_id")),p=t.get("img");try{let e=`${r.replace(/\s+/g,"-")}-${Date.now()}.jpg`,t=(await (0,n.yJ)(e,p.stream(),{access:"public",addRandomSuffix:!0})).url,E=await (0,u.VX)(r,s,a,i,t,o);return c.NextResponse.json({id:E},{status:201})}catch(e){return console.error("Error al insertar el producto:",e),c.NextResponse.json({error:"Error en la base de datos"},{status:500})}}async function E(){try{let e=await (0,u.AS)();return c.NextResponse.json(e,{status:200})}catch(e){return console.error("Error al obtener los productos:",e),c.NextResponse.json({error:"Error al obtener productos"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/products/route",pathname:"/api/products",filename:"route",bundlePath:"app/api/products/route"},resolvedPagePath:"/home/user/menu-project/src/app/api/products/route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:T,serverHooks:x}=d;function R(){return(0,o.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:T})}},54287:e=>{"use strict";e.exports=require("console")},55511:e=>{"use strict";e.exports=require("crypto")},56285:(e,t,r)=>{"use strict";r.d(t,{AS:()=>T,C1:()=>O,FI:()=>x,JT:()=>g,O$:()=>y,TZ:()=>A,VX:()=>l,Vd:()=>w,i5:()=>R,p7:()=>N,wz:()=>m});var s=r(97329),a=r.n(s),i=r(85663),o=r(46101);a().config();let c=(0,o.createPool)({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME}),u=async()=>{let e=`
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
    `;await c.execute(t,["test@test.com",e])}},E=async()=>{let e=`
    CREATE TABLE IF NOT EXISTS category (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;await c.execute(e)},d=async()=>{let e=`
    ALTER TABLE products 
    ADD COLUMN category_id INT, 
    ADD FOREIGN KEY (category_id) REFERENCES category(id)
  `;await c.execute(e)};(async()=>{try{await u(),await E(),await d(),await n()}catch(e){console.error("Error al crear la tabla:",e)}})();let l=async(e,t,r,s,a,i)=>(await c.execute("INSERT INTO products (name, description, price, price_discount, img, category_id) VALUES (?, ?, ?, ?, ?, ?)",[e,t,r,s,a,i]))[0].insertId,T=async()=>{let[e]=await c.execute("SELECT * FROM products");return e},x=async e=>{let[t]=await c.execute("SELECT * FROM products WHERE id = ?",[e]);return t},R=async(e,t,r,s,a,i,o,u)=>await c.execute("UPDATE products SET name = ?, description = ?, price = ?, price_discount = ?, img = ?, avaible = ?, category_id = ? WHERE id = ?",[e,t,r,s,a,i,o,u]),A=async e=>{let[t]=await c.execute("DELETE FROM products WHERE id = ?",[e]);return t},m=async e=>{await p();let[t]=await c.execute("SELECT * FROM users WHERE email = ?",[e]);return[t]},N=async()=>{let[e]=await c.execute("SELECT * FROM category");return e},w=async e=>await c.execute("INSERT INTO category (name) VALUES (?)",[e]),y=async e=>{let[t]=await c.execute("DELETE FROM category WHERE id = ?",[e]);return t},O=async()=>{await n();let[e]=await c.execute("SELECT * FROM company");return e},g=async(e,t,r,s,a,i,o,u,n,p)=>await c.execute("UPDATE company SET name = ?, img = ?, welcome_text = ?, about = ?, schedule = ?, phone = ?, email = ?, whatsapp = ?, facebook = ?, instagram = ? WHERE id = 1",[e,t,r,s,a,i,o,u,n,p])},57075:e=>{"use strict";e.exports=require("node:stream")},57975:e=>{"use strict";e.exports=require("node:util")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66136:e=>{"use strict";e.exports=require("timers")},73496:e=>{"use strict";e.exports=require("http2")},73566:e=>{"use strict";e.exports=require("worker_threads")},74075:e=>{"use strict";e.exports=require("zlib")},74998:e=>{"use strict";e.exports=require("perf_hooks")},77598:e=>{"use strict";e.exports=require("node:crypto")},78335:()=>{},78474:e=>{"use strict";e.exports=require("node:events")},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},81630:e=>{"use strict";e.exports=require("http")},84297:e=>{"use strict";e.exports=require("async_hooks")},91645:e=>{"use strict";e.exports=require("net")},94175:e=>{"use strict";e.exports=require("stream/web")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580,843,49],()=>r(52504));module.exports=s})();