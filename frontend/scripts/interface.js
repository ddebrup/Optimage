/*  ==========================================
    SHOW UPLOADED IMAGE
* ========================================== */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }

}

// $(function () {
//     $('#upload').on('change', function () {
//         readURL(input);
//     });
// });

/*  ==========================================
    SHOW UPLOADED IMAGE NAME
* ========================================== */
let modalVisible=false;
var input = document.getElementById( 'upload' );
var infoArea = document.getElementById( 'upload-label' );

input.addEventListener( 'change', showFileName );
function showFileName( event ) {
  var input = event.srcElement;
  var fileName = input.files[0].name;
  infoArea.textContent = 'File name: ' + fileName;
}

// $('.file-upload').file_upload();

const closeModal=()=>
{
     document.getElementById('modal').style.display="none"
        modalVisible=false
}
const openModal=()=>
{
    document.getElementById('modal').style.display="flex"
        modalVisible=true
}

document.getElementById('resize-btn').addEventListener('click',(e)=>
{
    console.log('in here')
    if(!modalVisible)
    {
        openModal()
    }
    else
    {
        closeModal()
    }
})

console.log('end')