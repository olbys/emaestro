<<<<<<< HEAD

const url = '/';
=======
//fetch using a Request and a Headers objects
// uploading an image along with other POST data
//using jsonplaceholder for the data

const url = 'https://postman-echo.com/post';
>>>>>>> 220c48d4dd07457d60b7e7bebd8ea3c8937b1b3c

document.addEventListener('DOMContentLoaded', init);

function init(){
    document.getElementById('btnSubmit').addEventListener('click', upload);
}

function upload(ev){
    ev.preventDefault();    //stop the form submitting

    //create any headers we want
    let h = new Headers();
    h.append('Accept', 'application/json'); //what we expect back
    //bundle the files and data we want to send to the server
    let fd = new FormData();
    fd.append('user-id', document.getElementById('user_id').value);
<<<<<<< HEAD
    
    let myFile = document.getElementById('avatar_img').files[0];
    fd.append('avatar', myFile, "avatar.mp4");
=======

    let myFile = document.getElementById('avatar_img').files[0];
    fd.append('avatar', myFile, "avatar.png");
>>>>>>> 220c48d4dd07457d60b7e7bebd8ea3c8937b1b3c
    // $_FILES['avatar']['file_name']  "avatar.png"
    let req = new Request(url, {
        method: 'POST',
        headers: h,
        mode: 'no-cors',
        body: fd
    });

    fetch(req)
        .then( (response)=>{
            document.getElementById('output').textContent = "Response received from server";
        })
        .catch( (err) =>{
            console.log('ERROR:', err.message);
        });
<<<<<<< HEAD
}
=======
}
>>>>>>> 220c48d4dd07457d60b7e7bebd8ea3c8937b1b3c
