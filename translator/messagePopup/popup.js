// Read OpenAI API
let secrets = await fetch("../secrets.json").then(response => response.json())

async function translate(text, api_key, max_tokens){
    let prompt = "Translate the following to English. "
    let translation = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+api_key
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': prompt+text,
        'max_tokens': max_tokens,
        'temperature': 0
      })
    }).then(function(response) {
        if (!response.ok){
            console.log("Translation failed");
            document.getElementById("status").innerHTML = "Error! Failed to establish communication with OpenAI"
        }else{
            return response.json();
        }
    });

    return translation.choices[0].text.trim().replace(/(\r\n|\n|\r)/gm, "<br>")
}

// The user clicked the button, get active tab in the current window.
let tabs = await messenger.tabs.query({active: true, currentWindow: true});

// Get the message currently displayed in the active tab, using the messageDisplay API.
let message = await messenger.messageDisplay.getDisplayedMessage(tabs[0].id)

// Request the full message to access headers and body.
let full = await messenger.messages.getFull(message.id);
document.getElementById("subject").textContent = "Subject: "+await translate(full.headers.subject[0], secrets["openAIKey"], 100)
document.getElementById("from").textContent = "From: "+await translate(full.headers.from[0], secrets["openAIKey"], 100);
// Get text content for the body of the message
let parts = full.parts;
while (parts[0].hasOwnProperty("parts")){
    console.log(parts);
	parts = parts[0].parts;
}
console.log(parts)
document.getElementById("body").innerHTML = await translate(parts[0].body, secrets["openAIKey"], 500);
// remove loader and show content
document.getElementById("status").innerHTML = ""
document.getElementById("main-space").style.display = "grid"

