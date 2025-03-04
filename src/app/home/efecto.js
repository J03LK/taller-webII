
  const texts = ["16 carreras", "Gráduate en 2 años"];
  let index = 0;
  let charIndex = 0;
  let deleting = false;
  const textElement = document.getElementById("animated-text");
  
  function typeEffect() {
      if (charIndex < texts[index].length && !deleting) {
          textElement.textContent += texts[index].charAt(charIndex);
          charIndex++;
          setTimeout(typeEffect, 150);
      } else if (charIndex > 0 && deleting) {
          textElement.textContent = texts[index].substring(0, charIndex - 1);
          charIndex--;
          setTimeout(typeEffect, 100);
      } else {
          deleting = !deleting;
          if (!deleting) index = (index + 1) % texts.length;
          setTimeout(typeEffect, 1000);
      }
  }
  
  document.addEventListener("DOMContentLoaded", typeEffect);
