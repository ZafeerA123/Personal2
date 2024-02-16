---
toc: false
comments: false
layout: post
title: Guess the number
description: A game I found online
type: ccc
courses: { csse: {week: 2} }
permalink: /GuessNumber
---

<!DOCTYPE html>
<html>
<head>
    <title>Guess the Number</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>Guess the Number</h1>
    <p>I'm thinking of a number between 1 and 100. Can you guess it?</p>
    <input type="number" id="guessInput">
    <button onclick="checkGuess()">Submit Guess</button>
    <p id="message"></p>

    <script>
        // Generate a random number between 1 and 100
        const secretNumber = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;

        function checkGuess() {
            const guess = parseInt(document.getElementById("guessInput").value);
            attempts++;

            if (guess === secretNumber) {
                document.getElementById("message").innerHTML = `Congratulations! You guessed the number ${secretNumber} in ${attempts} attempts!`;
                document.getElementById("message").style.color = "green";
                document.getElementById("guessInput").disabled = true;
            } else if (guess < secretNumber) {
                document.getElementById("message").innerHTML = "Too low! Try again.";
                document.getElementById("message").style.color = "red";
            } else {
                document.getElementById("message").innerHTML = "Too high! Try again.";
                document.getElementById("message").style.color = "red";
            }
        }
    </script>
</body>
</html>
