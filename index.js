document.addEventListener("DOMContentLoaded", function() {
    const nowtimeSearch = document.getElementById("nowtime-search");
    const choicetimeSearch = document.getElementById("choicetime-search");
    const classroomsSearch = document.getElementById("classrooms-search");

    nowtimeSearch.addEventListener("click", function(event) {
        const clickednowtimeSearch = event.target.textContent;
        if (clickednowtimeSearch){
            window.location.href = "https://ichiken26.github.io/search_class/nowtime/faculties";
        }
    });

    choicetimeSearch.addEventListener("click", function(event) {
        const clickedchoicetimeSearch = event.target.textContent;
        if (clickedchoicetimeSearch){
            window.location.href = "https://ichiken26.github.io/search_class/choicetime/choicetime";
        }
    });

    classroomsSearch.addEventListener("click", function(event) {
        const clickedclassroomsSearch = event.target.textContent;
        if (clickedclassroomsSearch){
            window.location.href = "https://ichiken26.github.io/search_class/classrooms/classrooms";
        }
    });
});
