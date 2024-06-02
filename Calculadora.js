const functionInput = document.getElementById('function');
const outputDisplay = document.getElementById('outputDisplay');
const clearBtn = document.getElementById('clear');
const enterBtn = document.getElementById('enter');

const recognizedFunctions = ['sin', 'cos', 'tan', 'log', 'sqrt', 'log', 'ln', 'e', 'E', 'i', 'phi', 'pi', 'PI'];

/*------------ Configurações das teclas e botões ------------*/

// Configuração das teclas do teclado
document.querySelectorAll('.key').forEach(key => {

    key.addEventListener('click', () => {

        const cursorPosition = functionInput.selectionStart;
        const keyValue = key.textContent;

        // Insere o caractere na posição cursor
        const beforeCursor = functionInput.value.slice(0, cursorPosition);
        const afterCursor = functionInput.value.slice(cursorPosition);
        functionInput.value = beforeCursor + keyValue + afterCursor;

        // Move o cursor para a posição correta
        const newCursorPosition = cursorPosition + keyValue.length - (keyValue.length > 1 ? 1 : 0);
        functionInput.setSelectionRange(newCursorPosition, newCursorPosition);

        // Retorna o foco para o campo de entrada
        functionInput.focus();

        outputDisplay.innerHTML = ''
    });
});

// Configuração do botão clear
// Um clique: apaga o último caractere do campo de entrada
clearBtn.addEventListener('click', () => {

    if(functionInput.value.length < 1)
        return;

    const cursorPosition = functionInput.selectionStart;

    // Remove o caractere na posição do cursor
    const beforeCursor = functionInput.value.slice(0, cursorPosition - 1);
    const afterCursor = functionInput.value.slice(cursorPosition);
    functionInput.value = beforeCursor + afterCursor;

    // Move o cursor uma posição para trás
    const newCursorPosition = cursorPosition - 1;
    functionInput.setSelectionRange(newCursorPosition, newCursorPosition);

    // Retorna o foco para o campo de entrada
    functionInput.focus();

    // Limpa o campo de saída
    outputDisplay.innerHTML = ''
});

// Duplo clique: apaga todo o campo de entrada
clearBtn.addEventListener('dblclick', () => {

    // Limpa os campos de entrada e saída
    functionInput.value = '';
    outputDisplay.innerHTML = '';

    // Retorna o foco para o campo de entrada
    functionInput.focus();
});

// Configurando botão enter, que calcula e mostra as derivadas parciais
enterBtn.addEventListener('click', function () {
    
    const input = functionInput.value;

    // Verifica se expressão é válida
    if(!isValidExpression(input)){ return; }

    const variables = extractVariables(input);
    const partialDerivatives = calculatePartialDerivatives(input, variables);
    displayResults(partialDerivatives);
});

/*------------ Cálculo de derivada ------------*/

// Verifica se expressão é válida/calculável
function isValidExpression(expression) {
    
    try {
        math.parse(expression); // tenta fazer o parser da expressão
        return true;
    } catch (e) {
        displayError(); // Em caso de falha inicia o randle de erro de expressão
        return false;
    }
}

function extractVariables(expression) {

    const variableSet = new Set(expression.match(/[a-zA-Z]+/g));

    // Exclui funções dentre as variáveis encontradas
    variableSet.forEach(variable => {
        if(recognizedFunctions.includes(variable))
            variableSet.delete(variable);
    });
    return Array.from(variableSet);
}

// Calcula as derivadas parciais
function calculatePartialDerivatives(expression, variables) {

    const math = window.math;
    const derivatives = {};

    variables.forEach(variable => {
        const derivative = math.derivative(expression, variable);
        derivatives[variable] = derivative.toString();
    });

    return derivatives;
}

// Mostra o resultado encontrado no campo de saída
function displayResults(derivatives) {
    
    // Verifica se foram encontradas variáveis
    if(Object.keys(derivatives).length == 0){
        outputDisplay.innerHTML = 'Nenhuma variável encontrada';
        return;
    }

    outputDisplay.innerHTML = '';

    for (const variable in derivatives) {
        const derivative = derivatives[variable];
        const result = document.createElement('div');
        result.textContent = `∂/∂${variable}: ${derivative}`;
        outputDisplay.appendChild(result);
    }
}

function displayError(){

    outputDisplay.style.animation = "error-border-anim 700ms ease";
    document.getElementById('inputDisplay').style.animation = "error-border-anim 700ms ease";
    enterBtn.style.animation = "error-btn-anim 700ms ease";
    document.getElementById('shake').style.animation = "error-shake-btn-anim 700ms ease";
    clearBtn.style.animation = "error-txt-anim 700ms ease";

    outputDisplay.innerHTML = "Expressão inválida.";
    setTimeout("displayNormal()", 700);
}

function displayNormal(){
    outputDisplay.style.animation = null;
    document.getElementById('inputDisplay').style.animation = null;
    enterBtn.style.animation = null;
    document.getElementById('shake').style.animation = null;
    clearBtn.style.animation = null;
}
