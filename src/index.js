import EmojiFile from '../emoji-file.js';

const come = document.getElementById('in');
come.value = 'i need a doctor to bring me back to life';
const go = document.getElementById('out');
console.log(come);
come.addEventListener('input', mostImportantFunction);
document.getElementById('copyBtn').addEventListener('click', copy);
mostImportantFunction();

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
function copy(){
  let generateString = getString();
  document.getElementById('hidden').textContent = generateString;

  let e = window.getSelection();
  let n = document.createRange();

  n.selectNodeContents(document.getElementById('hidden'));
  e.removeAllRanges();
  e.addRange(n);
  let s = false;

  try{
    s = document.execCommand("copy");
  }
  catch(err){
    console.error(err);
  }
  e.removeAllRanges();
  return s;
}

function getString(){
  let v = '';
  let childArray = Array.from(go.children);
  childArray.map(child => {
    if(child.tagName == 'SELECT'){
      v += child.options[child.selectedIndex].textContent;
    }
    else if(child.tagName == 'BR'){
      v += '\n';
    }
    else if(child.tagName == 'SPAN'){
      v += child.textContent;
    }
  })
  return v;
}

