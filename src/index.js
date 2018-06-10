import EmojiFile from '../emoji-file.js';

// const
const come = document.getElementById('in');
come.value = '';
const go = document.getElementById('out');
console.log(come);
come.addEventListener('input', mostImportantFunction);
// console.log(EmojiFile);

function mostImportantFunction(){
  let inContent = come.value;
  go.innerHTML = '';
  let linesSplit = inContent.trim().split('\n');
  for(let lineNumber = 0; lineNumber < linesSplit.length; lineNumber++){
    if(linesSplit[lineNumber] == ''){ // Can't do anything if its a blank line
      continue;
    }
    let wordsSplit = linesSplit[lineNumber].split(' ');
    for(let i = 0; i < wordsSplit.length; i++){
      let translated = EmojiFile.translateAndHTML(wordsSplit[i]);
      go.appendChild(translated);
    }
    go.appendChild(document.createElement('br'));
  }
}