
$(document).ready(function() {
    var queryURL = "http://localhost:3000/all";
    //var newsobject = {};

    function initnews () {
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(function(response) {
              newsobject = response;
              console.log(newsobject);
            
              $.each(newsobject,function(index, value){
                let card = `<div class='card' style='width: 100%;'>
                <div class='card-body'>
                  <a href='` + this.url + `'><h5 class='card-title'>` + this.headline + `</h5></a>
                  <h6 class='card-subtitle mb-2 text-muted'>`+moment(this.newstime).format('MMMM Do YYYY, h:mm:ss a')+`</h6>
                  <p class='card-text'>`+this.content+`</p>
                  <a href='#' class='card-link'>Comments</a>
                  
                </div>
              </div>`;

                $(".articles").append(card);
                console.log(( index + ": " + value ));
          });

         

          });
    }

    initnews ();

});

