
$(document).ready(function() {

  $(document).on("click", ".card-comment", togglecomment);
  $(document).on("click", "#com-submit", createcomment);

  function togglecomment (){
let cid = "c"+ $(this).attr("id");
//alert(cid);
//console.log(cid);
    $("#"+cid).toggle(500);
  };

  function createcomment (){
    event.preventDefault();
alert("Comment posted!")

      };

});

