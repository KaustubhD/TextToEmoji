const em = require('emojilib');


// console.log(em.lib);
const mainExp = new RegExp(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/);
// Copied from the internet
const notWords = '.,/!\'\"-+*&^%#$@;:|\\=?()[]{}<>~_';

function isItAnEmoji(word){
  return word.test(mainExp);
}

function translate(word){
  let span = document.createElement('span');
  span.innerHTML = '-- ' + word + ' --  ';
  return span;
}
function translateAndHTML(word){
  let begin = '', end = '', node;

  while(notWords.indexOf(word[0]) !== -1){
    begin += word[0];
    word = word.slice(1);
  }
  while(notWords.indexOf(word[word.length - 1]) !== -1){
    end = word[word.length - 1] + end; //So that it doesn't reverse like end += word[word.length - 1];
    word = word.slice(1);
  }

  let allEmojis = allPossiblesFor(word);
  if(allEmojis == ''){
    allEmojis = [word];
  }

  if(allEmojis.length == 1){
    node = document.createElement('span').innerHTML = begin + allEmojis[0] + end + ' ';
  }
  else{
    node = document.createElement('select');
    allEmojis.map(emo => {
      let option = document.createElement('option');
      option.innerHTML = begin + allEmojis[0] + end + ' ';
      node.appendChild(option);
    })
  }
  return node;
}

module.exports.translate = translate;