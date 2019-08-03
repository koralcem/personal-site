$(document).ready(function() {
  function elementForLetter(letter) {
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
      "," : "Comma",
      "." : "Period",
      "/" : "Slash",
      "?" : "Question mark",
      ";" : "Semicolon",
      ":" : "Colon",
      "\\": "Backslash",
      "-" : "Dash"
    }

    let codeWord = radioCodes[letter]
    return "<p>" + letter + (codeWord == undefined ? "" : " - " + codeWord) + "</p>"
  }

  $("input").on("input propertychange paste", function() {
    let spellingDiv = $("div#spelling").empty()
    let words = $(this).val().trim().split(" ")

    words.forEach(function(word) {
      let wordDiv = $("<div></div>").addClass("word")
      for (i = 0; i < word.length; i++) {
        let letter = word.charAt(i).toUpperCase()
        wordDiv.append(elementForLetter(letter))
      }
      spellingDiv.append(wordDiv)
    })
  })
})
