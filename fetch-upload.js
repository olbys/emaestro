
const url = '/';

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
    
    let myFile = document.getElementById('avatar_img').files[0];
    fd.append('avatar', myFile, "avatar.mp4");
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
}