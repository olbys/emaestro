/*{ 
    facingMode: "user", 
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 } 
}
*/

let constraintObj = {
    audio:  {
        facingMode: "user",
        width: { min: 540, ideal: 540, max: 540 },
        height: { min: 280, ideal: 280, max: 280 }
    } ,
    video: false
};

if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
        let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraintObj, resolve, reject);
        });
    }
}else{
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            devices.forEach(device=>{
                console.log(device.kind.toUpperCase(), device.label);

            })
        })
        .catch(err=>{
            console.log(err.name, err.message);
        })
}

navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function(mediaStreamObj) {

        let video = document.querySelector('video');
        if ("srcObject" in video) {
            video.srcObject = mediaStreamObj;
        } else {
            //old version
            video.src = window.URL.createObjectURL(mediaStreamObj);
        }

        video.onloadedmetadata = function(ev) {

            // video.play();
        };

        //add listeners for saving video/audio

        console.log("**** Test ****");
        let start = document.getElementById('playscore');
        let stop = document.getElementById('stopscorerecord');
        //let playscore = document.getElementById('playscore');
        //let  save= document.getElementById('btnsave');
        let vidSave = document.getElementById('vid2');
        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        start.addEventListener('click', (ev)=>{

            console.log("**** Test Start  :");
            mediaRecorder.start();
            console.log("**** State de media recorder :",mediaRecorder.state);


        })
        stop.addEventListener('click', (ev)=>{
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
        });


        mediaRecorder.ondataavailable = function(ev) {
            chunks.push(ev.data);
        }

        let link='';
        mediaRecorder.onstop = (ev)=>{
            let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
            chunks = [];
            let videoURL = window.URL.createObjectURL(blob);
            // window.ser
            link=videoURL;
            vidSave.src = videoURL;

            let h = new Headers();
            h.append('Accept', 'video/mp4');
            let fd = new FormData();
            fd.append('user-id', 77);
            //let myFile = vidSave;
            fd.append('avatar', blob, "avatrack.mp4");

            let req = new Request(link, {
                method: 'POST',
                headers: h,
                mode: 'no-cors',
                body: fd
            });

            fetch(req)
                .then( (response)=>{
                    console.log('sucsses');
                })
                .catch( (err) =>{
                    console.log('ERROR:', err.message);
                });

        }


       /* save.addEventListener('click',(ev)=>{


            var a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = link;
            a.download = 'track.mp4';
            a.click();
            window.URL.revokeObjectURL(link);
        });*/


    })
    .catch(function(err) {
        console.log("Erreur recorder marche pas");
        console.log(err.name, err.message);
    });


/*const express=require('express');
const upload=require('express-fileupload');
const app=express()
app.use(upload())
app.get('/',(req,res)=>{
    res.sendFile(__dirname +'/test_audio_CRUD.html');
})
app.post('/',(req,res)=>{
    if(req.files){
        /*
            var file=req.files.filename,
                filename=files.filename;
                files.mv("/upload/"+filename,function(err){
                    if(err){
                        console.log(err)
                        res.send("error occured")
                    }
                    else
                    {
                        res.send("done!")
                    }
                })
                */
       /* console.log(req.files)
    }

})*/

     

