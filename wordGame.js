const letters = document.querySelectorAll('.scoreboard-letter');
const loading = document.querySelector('.info-bar');
const answerLength = 5;
const rounds = 6;

async function init() {

    let currentGess = '';
    let currentRow = 0;
    let done = false;
    let isLoading = true;

    const res = await fetch('https://words.dev-apis.com/word-of-the-day');
    const {word : wordRes} = await res.json();
    const word = wordRes.toUpperCase();
    const wordParts = word.split('');
    isLoading = false;
    setLoading(isLoading);

    function addLetter(letter) {
        if(currentGess.length < answerLength) {
            currentGess += letter;
        }else {
            current = currentGess.substring(0, currentGess.length - 1) + letter;
        }

        letters[currentRow * answerLength + currentGess.length - 1].innerText = letter;
    }
    
    async function commit() {
        if(currentGess.length !== answerLength){
            return;
        }

        isLoading = true;
        setLoading(isLoading);
        const res = await fetch('https://words.dev-apis.com/validate-word', {
            method: 'POST',
            body: JSON.stringify({word: currentGess}),
        });

        const {validWord} = await res.json();
        isLoading = false;
        setLoading(isLoading);

        if(!validWord) {
            markInvalidWord();
            return;
        }

        const currentGessParts = currentGess.split('');

        for(let i = 0; i < answerLength; i++) {
            if(currentGessParts[i] === wordParts[i]) {
                letters[currentRow * answerLength + i].classList.add('correct');
                Map[currentGessParts[i]]--;
            }
        }

        for(let i = 0; i < answerLength; i++) {
            if(currentGessParts[i] === wordParts[i]) {
            
            }else if(Map[currentGessParts[i]] && Map[currentGessParts[i]] > 0) {
                allRight = false;
                letters[currentRow * answerLength + i].classList.add('close');
                Map[currentGessParts[i]]--;
            }else {
                allRight = false;
                letters[currentRow * answerLength + i].classList.add('wrong');
            }
        }
        currentGess = '';
        currentRow ++;

        if(allRight) {
            alert('You Win!');
            document.querySelector('.brand').classList.add('winner');
            done = true;
        }else if(currentRow === rounds) {
            alert(`You lose, the word was ${word}`);
            done = true;
        }
    }

    function backspace() {
        currentGess = currentGess.substring(0, currentGess.length - 1)
        letters[answerLength * currentRow + currentGess.length].innerText = '';
    }

        function markInvalidWord() {
        for(let i = 0; i < answerLength; i++) {
            letters[currentRow * answerLength + i].classList.add('invalid');

            setTimeout(() => 
                letters[currentRow * answerLength + i].classList.add('invalid'),10);
            }
        };

    document.addEventListener('keydown', function handelKeyPrees (event) {
        if(done || isLoading) {
            return;
        }
        
        const action = event.key;

        if(action === 'Enter'){
            commit();
        }else if(action === 'Backspace'){
            backspace();

        }else if(isLetter(action)){
            addLetter(action.toUpperCase());
        }else {
            //ddddddd    
        }
    });
}

function isLetter(letter){
    return /^[a-zA-Z]$/.test(letter)
}

function setLoading(isLoading) {
    loading.classList.toggle('hidden', !isLoading);
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]]++;
        }else {
            obj[array[i]] = 1;
        }
    }
    return obj;
}

init();