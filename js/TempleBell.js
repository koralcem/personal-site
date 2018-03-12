document.addEventListener("DOMContentLoaded", function(event) {
  setInterval(playGong, 15 * 60 * 1000)
})

function playGong() {
  document.getElementById("gong").play()
}