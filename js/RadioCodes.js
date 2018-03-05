$(document).ready(function() {
  function codeWordForLetter(letter) {
    let radioCodes = {
      "A" : "Alfa",
      "B" : "Bravo",
      "C" : "Charlie",
      "D" : "Delta",
      "E" : "Echo",
      "F" : "Foxtrot",
      "G" : "Golf",
      "H" : "Hotel",
      "I" : "India",
      "J" : "Juliett",
      "K" : "Kilo",
      "L" : "Lima",
      "M" : "Mike",
      "N" : "November",
      "O" : "Oscar",
      "P" : "Papa",
      "Q" : "Quebec",
      "R" : "Romeo",
      "S" : "Sierra",
      "T" : "Tango",
      "U" : "Uniform",
      "V" : "Victor",
      "W" : "Whiskey",
      "X" : "Xray",
      "Y" : "Yankee",
      "Z" : "Zulu",
      " " : "Say \"Space\" or \"Next word\""
    }

    return radioCodes[letter]
  }

  $("input").on("input propertychange paste", function() {
    let spellingDiv = $("div#spelling").empty()
    spellingDiv.empty()
    let text = $(this).val()

    for (i=0; i < text.length; i++) {
      let letter = text.charAt(i).toUpperCase()
      spellingDiv.append("<p>" + letter + " - " + codeWordForLetter(letter) + "</p>")
    }
  })
})
