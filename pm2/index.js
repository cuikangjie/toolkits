const pm2 = require('pm2');

const defaultOption = {
  name: 'node_app',
  script: "./app.js",
  watch: false,
  "env": {
      "PORT": "9090"
  }
}


/**
 * 启动pm2
 * @param  {[type]} err [description]
 * @return {[type]}     [description]
 */
function nodeStart(config){
  let option = Object.assign({},defaultOption,config)
  pm2.connect(async (err) => {
    if (err) {console.error(err);process.exit(2);}
    let app = await list(option.name)
    console.log(`=============     LOG  START       ===============`);
    app ? console.log(`      ${option.name} is exsit and will be restart`)  : console.log(`      ${option.name} will be start`)
    app ? await restart(app.name).catch((err) => {}) : await start(option).catch((err) => {})
    app ? console.log(`      ${option.name} restart complete !`)  : console.log(`      ${option.name} start  complete !`)
    console.log(`=============     LOG  END        ===============`);
    console.log('\n pm2 start complete ! \n');
    process.exit()
  });
}

// process.on('exit', function(code) {
//   console.log('\n pm2 start complete ! \n');
// });

function list (name){
  return new Promise((resolve, reject) =>{
    pm2.list( (err, apps) => {
      if(err){resolve(null);return}
      let li = apps.filter((item) => {return item.name == name});
      li.length > 0 ? resolve(li[0]) : resolve(null);
    })
  })
}

function restart(name){
  return new Promise((resolve, reject) =>{
    pm2.restart(name, (err)=>{
      if(err){console.log(`      ${name} restart fail !\n ${err}`);reject();return;}
      console.log(`      ${name} restart success !`);
      resolve();
    })
  })
}

function start(deploy) {
  return new Promise((resolve, reject) =>{
    pm2.start(deploy, function(err, proc) {
      if (err) { console.log(`      ${deploy.name} start fail !`);reject(err);return}
      console.log(`      ${deploy.name} start success !`);
      resolve();
    });
  })
}

module.exports =  nodeStart
