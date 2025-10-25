[33mcommit d24af8990f2f9ab706bd413eee001dc4b9271a4b[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: BeaverTrap <jonwaynec@gmail.com>
Date:   Fri Oct 24 19:12:08 2025 -0700

    Fix lightbox captions to show series name and photo name in glossy box with fade effect

[1mdiff --git a/app/page.js b/app/page.js[m
[1mindex 8ca756d8..cdaea57a 100644[m
[1m--- a/app/page.js[m
[1m+++ b/app/page.js[m
[36m@@ -63,6 +63,21 @@[m [mconst styles = `[m
   .yarl__slide:hover .yarl__captions_description_container {[m
     opacity: 1 !important;[m
   }[m
[32m+[m[41m  [m
[32m+[m[32m  /* Ensure captions are visible on hover */[m
[32m+[m[32m  .yarl__slide:hover .yarl__captions_description_container {[m
[32m+[m[32m    opacity: 1 !important;[m
[32m+[m[32m    transition: opacity 0.3s ease-in-out !important;[m
[32m+[m[32m  }[m
[32m+[m[41m  [m
[32m+[m[32m  /* Additional hover rules for lightbox captions */[m
[32m+[m[32m  .yarl__container:hover .yarl__captions_description_container {[m
[32m+[m[32m    opacity: 1 !important;[m
[32m+[m[32m  }[m
[32m+[m[41m  [m
[32m+[m[32m  .yarl__slide:hover .yarl__captions_description_container {[m
[32m+[m[32m    opacity: 1 !important;[m
[32m+[m[32m  }[m
 `;[m
 [m
 // Custom toolbar with sliders[m
[36m@@ -794,7 +809,8 @@[m [mexport default function Home() {[m
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',[m
               opacity: '0',[m
               transition: 'opacity 0.3s ease-in-out',[m
[31m-              pointerEvents: 'none'[m
[32m+[m[32m              pointerEvents: 'none',[m
[32m+[m[32m              zIndex: 1000[m
             },[m
             captionsDescription: {[m
               color: 'white',[m
