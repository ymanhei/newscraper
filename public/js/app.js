
$(document).ready(function() {

  $(document).on("click", ".card-comment", togglecomment);
  $(document).on("click", ".btn", createcomment);

  
  var commentData = {
    newsid: "",
    comment: ""
  };

  function togglecomment (){
let cid = "c"+ $(this).attr("id");
//alert(cid);
//console.log(cid);
    $("#"+cid).toggle(500);
  };

  function createcomment (){
    event.preventDefault();
    let id = $(this).attr("id").substr(2);
    console.log(id);
    let commentInput = $("#t" + id);
    commentData.comment = commentInput.val().trim();
    commentData.newsid = id;
    alert("Comment posted!");
    location.reload();




postComment(commentData);

      };

      function postComment(commentData) {
        console.log(commentData);
        $.post("/postcomment", commentData);
      }

});

