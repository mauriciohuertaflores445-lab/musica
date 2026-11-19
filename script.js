 <!-- JavaScript del menú lateral -->

        const abrirMenu = document.getElementById("abrirMenu");
        const cerrarMenu = document.getElementById("cerrarMenu");
        const menuLateral = document.getElementById("menuLateral");
        const fondoMenu = document.getElementById("fondoMenu");

        function abrir() {
            menuLateral.classList.add("activo");
            fondoMenu.classList.add("activo");
            abrirMenu.setAttribute("aria-expanded", "true");
        }

        function cerrar() {
            menuLateral.classList.remove("activo");
            fondoMenu.classList.remove("activo");
            abrirMenu.setAttribute("aria-expanded", "false");
        }

        abrirMenu.addEventListener("click", abrir);
        cerrarMenu.addEventListener("click", cerrar);
        fondoMenu.addEventListener("click", cerrar);

        document.querySelectorAll(".menu-lateral a").forEach(enlace => {
            enlace.addEventListener("click", cerrar);
        });

        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape") {
                cerrar();
            }
        });

        const canciones =
        document.querySelectorAll("audio");
        const videos =
        document.querySelectorAll("video");
        
        canciones.forEach(function(cancion) {
            cancion.addEventListener("play",function() {
            canciones.forEach(function(otraCancion) { 
            if (otraCancion !== cancion)
{ 
                   otraCancion.pause();
                 }
              });

            videos.forEach(function(video) { 
                 video.pause();
                  });
             });
        });

           
         videos.forEach(function(video) {
            video.addEventListener("play",function() {
            canciones.forEach(function(cancion) { 
                   cancion.pause();
                    });
            

            videos.forEach(function(otroVideo) {
                    if (otroVideo !== video) {
                      otroVideo.pause();
                    }
                });
             });
        });


