
$(document).ready(function() {


  $(".card-comment").click(function(){
let cid = "c"+ $(this).attr("id");
//alert(cid);
//console.log(cid);
    $("#"+cid).toggle(500);
  });

});

