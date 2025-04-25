(()=>{var e={};e.id=188,e.ids=[188],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19771:e=>{"use strict";e.exports=require("process")},21820:e=>{"use strict";e.exports=require("os")},27910:e=>{"use strict";e.exports=require("stream")},28303:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=28303,e.exports=t},28354:e=>{"use strict";e.exports=require("util")},29021:e=>{"use strict";e.exports=require("fs")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},34631:e=>{"use strict";e.exports=require("tls")},41204:e=>{"use strict";e.exports=require("string_decoder")},44870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},53847:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>N,routeModule:()=>R,serverHooks:()=>x,workAsyncStorage:()=>l,workUnitAsyncStorage:()=>A});var s={};r.r(s),r.d(s,{POST:()=>T});var a=r(96559),i=r(48088),o=r(37719),c=r(32190),n=r(56285),u=r(85663),p=r(43205),E=r.n(p),d=r(97329);async function T(e){let{email:t,password:r}=await e.json(),s=process.env.JWT_SECRET;try{let[e]=await (0,n.wz)(t),a=e[0];if(!a)return c.NextResponse.json({error:"Usuario no encontrado"},{status:404});if(!await u.Ay.compare(r,a.password))return c.NextResponse.json({error:"Contrase\xf1a incorrecta"},{status:401});if(!s)throw Error("JWT_SECRET no est\xe1 definido en las variables de entorno");let i=E().sign({userId:a.id},s,{expiresIn:"24h"}),o=c.NextResponse.json({message:"Inicio de sesi\xf3n exitoso"});return o.cookies.set("session",i,{httpOnly:!0,secure:!0,path:"/",maxAge:3600}),o}catch(e){return console.error("Error al autenticar:",e),c.NextResponse.json({error:"Error del servidor"},{status:500})}}r.n(d)().config();let R=new a.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/auth/route",pathname:"/api/auth",filename:"route",bundlePath:"app/api/auth/route"},resolvedPagePath:"/home/user/menu-project/src/app/api/auth/route.ts",nextConfigOutput:"standalone",userland:s}),{workAsyncStorage:l,workUnitAsyncStorage:A,serverHooks:x}=R;function N(){return(0,o.patchFetch)({workAsyncStorage:l,workUnitAsyncStorage:A})}},55511:e=>{"use strict";e.exports=require("crypto")},56285:(e,t,r)=>{"use strict";r.d(t,{AS:()=>R,C1:()=>O,FI:()=>l,JT:()=>C,O$:()=>y,TZ:()=>x,VX:()=>T,Vd:()=>w,i5:()=>A,p7:()=>m,wz:()=>N});var s=r(97329),a=r.n(s),i=r(85663),o=r(46101);a().config();let c=(0,o.createPool)({host:process.env.DB_HOST,port:Number(process.env.DB_PORT),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME}),n=async()=>{let e=`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      price_discount DECIMAL(10, 2),
      img VARCHAR(255),
      avaible BOOLEAN DEFAULT true
    )
  `;await c.execute(e)},u=async()=>{let e=`
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
  `;await c.execute(e)};(async()=>{try{await n(),await E(),await d(),await u()}catch(e){console.error("Error al crear la tabla:",e)}})();let T=async(e,t,r,s,a,i)=>(await c.execute("INSERT INTO products (name, description, price, price_discount, img, category_id) VALUES (?, ?, ?, ?, ?, ?)",[e,t,r,s,a,i]))[0].insertId,R=async()=>{let[e]=await c.execute("SELECT * FROM products");return e},l=async e=>{let[t]=await c.execute("SELECT * FROM products WHERE id = ?",[e]);return t},A=async(e,t,r,s,a,i,o,n)=>await c.execute("UPDATE products SET name = ?, description = ?, price = ?, price_discount = ?, img = ?, avaible = ?, category_id = ? WHERE id = ?",[e,t,r,s,a,i,o,n]),x=async e=>{let[t]=await c.execute("DELETE FROM products WHERE id = ?",[e]);return t},N=async e=>{await p();let[t]=await c.execute("SELECT * FROM users WHERE email = ?",[e]);return[t]},m=async()=>{let[e]=await c.execute("SELECT * FROM category");return e},w=async e=>await c.execute("INSERT INTO category (name) VALUES (?)",[e]),y=async e=>{let[t]=await c.execute("DELETE FROM category WHERE id = ?",[e]);return t},O=async()=>{await u();let[e]=await c.execute("SELECT * FROM company");return e},C=async(e,t,r,s,a,i,o,n,u,p)=>await c.execute("UPDATE company SET name = ?, img = ?, welcome_text = ?, about = ?, schedule = ?, phone = ?, email = ?, whatsapp = ?, facebook = ?, instagram = ? WHERE id = 1",[e,t,r,s,a,i,o,n,u,p])},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66136:e=>{"use strict";e.exports=require("timers")},74075:e=>{"use strict";e.exports=require("zlib")},78335:()=>{},79428:e=>{"use strict";e.exports=require("buffer")},79551:e=>{"use strict";e.exports=require("url")},91645:e=>{"use strict";e.exports=require("net")},94735:e=>{"use strict";e.exports=require("events")},96487:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[447,580,843,205],()=>r(53847));module.exports=s})();