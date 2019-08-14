// requerimos los paquetes instalados
const express = require('express');
const ig = require('instagram-node').instagram();
const admin = require ('firebase-admin');
global.accestoken;


// creamos la app con express
var app = express();

//Nos conectamos a firestore


let serviceAccount = require('./private/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

//Opciones para recoger la info de instagram

var options = {
    count : 10
};

// especificamos a node la ruta

app.use(express.static(__dirname + '/public'));

// especificamos que utilizaremos ejs como motor de vistas
app.set('view engine', 'ejs');

// creamos la ruta
app.get('/', function (req, res) {
/*
  ig.user_self_media_recent(options,function(err, medias, pagination, remaining, limit) {
     // render the home page and pass in the popular images
    // res.render('pages/index', { grams: medias });
      
    
     medias.forEach(el => {


       console.log("el link es",el.images.standard_resolution.url);
       console.log("el id es",el.caption.id);
    });

  });

*/

//Access to firestore data
          let cliniquesRef = db.collection('cliniques');
          let query = cliniquesRef.where('instagram_feed', '==', true).get().then(snapshot => {
             if (snapshot.empty) {
                   console.log('No matching documents.');
                 return;
              }  
             snapshot.forEach(doc => {
                 console.log(doc.id, '=>', doc.data());
     
              // El ID TOKEN ES 
               
                ig.use({
                access_token: doc.instagram_token,
                 });

              //GET DATA FROM INSTAGRAM

              options.count = doc.instagaram_imagenes;


/*
              ig.user_self_media_recent(options,function(err, medias, pagination, remaining, limit) {
                // render the home page and pass in the popular images
               // res.render('pages/index', { grams: medias });
                 
               
                medias.forEach(el => {
                  console.log("el link es",el.images.standard_resolution.url);
                  console.log("el id es",el.caption.id);
                  console.log("el texto es",el.caption.text);
               });
           
             });

*/


    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });



 
});

// configure instagram app with your access_token
ig.use({
  access_token: '7307471092.1677ed0.d8a279cdc470462d8471aa6a6d5a617a',
});

ig.subscriptions(function(err, subscriptions, remaining, limit){
  console.log(subscriptions);
});

// especificamos el puerto
app.listen(8080);
console.log('Escuchando en el puerto 8080');