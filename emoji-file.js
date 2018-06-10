const em = require('emojilib').lib;


console.log(em);
const mainExp = new RegExp(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/);
// Copied from the internet
const notWords = '.,/!\'\"-+*&^%#$@;:|\\=?()[]{}<>~_';

function isItAnEmoji(word){
  return mainExp.test(word);
}

function allPossiblesFor(word){
  let wordCopy = word.trim().toLowerCase();
  let allEmojis = [];
  if(isItAnEmoji(wordCopy)){
    return allEmojis;
  }

  if(!wordCopy || wordCopy == 'a' || wordCopy == 'an' || wordCopy == 'the' || wordCopy == 'it'){
    return allEmojis;
  }

  let singular = '';
  if(wordCopy.length > 2 && wordCopy[wordCopy.length - 1] == 's'){
    singular = wordCopy.slice(0, wordCopy.length - 1);
  }
  let plural = '';
  if(wordCopy.length > 1){
    plural = wordCopy + 's';
  }
  let verb = '', verbWithE = '', doubledVerb = '';
  if(wordCopy.slice(wordCopy.length - 3) == 'ing'){
    verb = wordCopy.slice(0, wordCopy.length - 3); //reading becomes read
    verbWithE = verb + 'e'; //danc becomes dance
    doubledVerb = verb.slice(0, verb.length - 1); //swimm becomes swim
  }
  switch(wordCopy){
    case 'i':
    case 'you':
      allEmojis.push('😀 ', '😃 ');
      break;
    case 'he':
      allEmojis.push('🙋🏻‍♂️ ');
      break;
    case 'she':
      allEmojis.push('🙋🏻 ');
      break;
    case 'we':
    case 'they':
      allEmojis.push('👨‍👩‍👧‍👦 ');
      break;
    case 'is':
    case 'am':
    case 'are':
      allEmojis.push('👉 ');
      break;
  }
  let compareArray = [wordCopy, wordCopy + '_face', plural, singular, verb, verbWithE, doubledVerb];
  for(key in em){
    let keywords = new Set(em[key].keywords);
    let flag = false;
    compareArray.map(el => {
      if(keywords.has(el)){ 
        flag = true;
        return;
      }
    });
    if(keywords && ((flag || compareArray.indexOf(key) >= 0) && em[key].category != 'flags')){
      allEmojis.push(em[key].char + ' ');
    }
  }

  return allEmojis;
}


function translateAndHTML(Oword){
  let begin = '', end = '', node;
  // let word = Oword.toLowerCase();

  while(notWords.indexOf(Oword[0]) !== -1){
    begin += Oword[0];
    Oword = Oword.slice(1);
  }
  while(notWords.indexOf(Oword[Oword.length - 1]) !== -1){
    end = Oword[Oword.length - 1] + end; //So that it doesn't reverse like end += word[word.length - 1];
    Oword = Oword.slice(0, Oword.length - 1);
  }

  let allEmojis = allPossiblesFor(Oword);
  console.log(allEmojis);
  if(!allEmojis.length){
    allEmojis = [Oword];
  }
  // console.log(allEmojis);
  if(allEmojis.length == 1){
    node = document.createElement('span');
    node.innerHTML = begin + allEmojis[0] + end + ' ';
  }
  else{
    node = document.createElement('select');
    allEmojis.map(emo => {
      let option = document.createElement('option');
      option.innerHTML = begin + emo + end + ' ';
      node.appendChild(option);
    })
  }
  return node;
}

module.exports.translateAndHTML = translateAndHTML;