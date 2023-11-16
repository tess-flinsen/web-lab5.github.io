function exchangeContents() {
    const num4Element = document.querySelector('.num_4');
    const num5Element = document.querySelector('.num_5');

    const num4Content = num4Element.textContent;
    const num5Content = num5Element.textContent;

    num4Element.textContent = num5Content;
    num5Element.textContent = num4Content;
}

function calculateTriangleArea() {
    const base = parseFloat(document.querySelector('.base').value);
    const height = parseFloat((document.querySelector('.height').value));

    if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) {
        alert('Please enter valid positive numeric values for base and height.');
        return;
    }
    const area = (base * height) / 2;

    const resultParagraph = document.querySelector('.result');
    resultParagraph.textContent = `The area of the triangle is: ${area.toFixed(2)}`;
}

function calculateMinNumbers() {
    const numbersInput = document.querySelector('.numbers').value;
    const numbersArray = numbersInput.split(',').map(Number);

    if (numbersArray.length !== 10 || numbersArray.some(isNaN)) {
        alert('Please enter 10 valid numbers separated by commas.');
        return;
    }

    const minNumber = Math.min(...numbersArray);

    const storedResult = getCookie('minNumbersResult');

    if (storedResult) {
        alert(`Stored result: ${storedResult}`);
        removeCookie('minNumbersResult');
        location.reload();
    } else {
        const confirmation = confirm(`The minimum number is: ${minNumber}\nPress OK to save the result in cookies.`);
        
        if (confirmation) {
            setCookie('minNumbersResult', minNumber);
        }
    }
}

function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return cookieValue;
        }
    }
    return null;
}

function removeCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function handleMinNumResult() {
    const storedResult = getCookie('minNumbersResult');

    if (storedResult) {
        const confirmation = confirm(`Stored result: ${storedResult}\nPress OK to delete the stored data.`);

        if (confirmation) {
            removeCookie('minNumbersResult');

            const minNumbersForm = document.querySelector('.minNumbersForm');
            if (minNumbersForm) {
                minNumbersForm.remove();
            }

            const secondConfirmation = confirm('Cookies deleted. Press OK to reload the page with the initial form.');

            if (secondConfirmation) {
                location.reload();
            }
        }
    }
}

function changeTextColor(color) {
    const num3Element = document.querySelector('.num_3');
    num3Element.style.color = color;

    localStorage.setItem('num3TextColor', color);
}

function setTextColorFromLocalStorage() {
    const savedColor = localStorage.getItem('num3TextColor');
    if (savedColor) {
        changeTextColor(savedColor);
    }
}

function handleColorChange() {
    const savedColor = localStorage.getItem('block3TextColor');

    if (savedColor) {
        document.querySelector('.num_3').style.color = savedColor;
    }

    document.querySelector('.button-4').addEventListener('click', function () {
        const selectedColor = document.querySelector('.color-picker').value;
        document.querySelector('.num_3').style.color = selectedColor;
        localStorage.setItem('block3TextColor', selectedColor);
    });
}

function createUnorderedList(content) {
    let listItems = content.split('\n').map(item => `<li>${item.trim()}</li>`).join('');
    return `<ul class="scrollable-list">${listItems}</ul>`;
}

function addListForm() {
    let targetBlock = event.target.closest('.num_1, .num_2, .num_3, .num_4, .num_5, .num_6');
    if (targetBlock) {
        let originalContent = targetBlock.innerHTML;

        let formHTML = `
            <form class="user-input-form">
                <label for="userInput">Enter items (separate with Enter):</label>
                <textarea id="userInput" class="user-input" rows="4" required></textarea>
                <button type="button" class="save-button">Save</button>
            </form>
        `;
        targetBlock.insertAdjacentHTML('beforeend', formHTML);

        let userInputElement = document.getElementById('userInput');

        let saveButton = document.querySelector('.save-button');
        saveButton.addEventListener('click', function () {
            let userInput = userInputElement.value;
            let unorderedList = createUnorderedList(userInput);
            targetBlock.innerHTML = unorderedList;

            localStorage.setItem(`block_${targetBlock.dataset.blockNumber}_content`, unorderedList);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.button-1').addEventListener('click', exchangeContents);
    document.querySelector('.button-2').addEventListener('click', calculateTriangleArea);
    document.querySelector('.button-3').addEventListener('click',  calculateMinNumbers);

    handleMinNumResult();
    handleColorChange();
    document.body.addEventListener("dblclick", function (event) {
        addListForm()
    });

    for (let i = 1; i <= 6; i++) {
        let savedContent = localStorage.getItem(`block_${i}_content`);
        if (savedContent) {
            document.querySelector(`.num_${i} .central`).innerHTML = savedContent;
        }
    }

    window.addEventListener('beforeunload', function () {
        for (let i = 1; i <= 6; i++) {
            localStorage.removeItem(`block_${i}_content`);
        }
    });
});
