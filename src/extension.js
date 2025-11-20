const vscode = require('vscode');

let wordCountStatusBarItem;
let charCountStatusBarItem;
let lineCountStatusBarItem;
let isActive = true;

function activate(context) {

    wordCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    charCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    lineCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);

    let toggleCommand = vscode.commands.registerCommand('text-statistics.toggleStatistics', () => {
        isActive = !isActive;
        if (isActive) {
            updateStatistics();
            showStatistics();
            vscode.window.showInformationMessage('Статистика текста включена');
        } else {
            hideStatistics();
            vscode.window.showInformationMessage('Статистика текста выключена');
        }
    });

    let changeDisposable = vscode.workspace.onDidChangeTextDocument(updateStatistics);
    
    let editorDisposable = vscode.window.onDidChangeActiveTextEditor(updateStatistics);

    updateStatistics();

    context.subscriptions.push(
        wordCountStatusBarItem,
        charCountStatusBarItem,
        lineCountStatusBarItem,
        toggleCommand,
        changeDisposable,
        editorDisposable
    );
}

function updateStatistics() {
    if (!isActive) return;

    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        hideStatistics();
        return;
    }

    const document = editor.document;
    const text = document.getText();
    
    const wordCount = countWords(text);
    const charCount = text.length;
    const lineCount = document.lineCount;

    const config = vscode.workspace.getConfiguration('textStatistics');    
    
    if (config.showWordCount) {
        wordCountStatusBarItem.text = `$(symbol-text) Слов: ${wordCount}`;
        wordCountStatusBarItem.show();
    } else {
        wordCountStatusBarItem.hide();
    }

    if (config.showCharCount) {
        charCountStatusBarItem.text = `$(edit) Символов: ${charCount}`;
        charCountStatusBarItem.show();
    } else {
        charCountStatusBarItem.hide();
    }

    if (config.showLineCount) {
        lineCountStatusBarItem.text = `$(list-ordered) Строк: ${lineCount}`;
        lineCountStatusBarItem.show();
    } else {
        lineCountStatusBarItem.hide();
    }
}

function countWords(text) {
    if (!text.trim()) return 0;
    
    return text.trim().split(/\s+/).length;
}

function showStatistics() {
    if (wordCountStatusBarItem) wordCountStatusBarItem.show();
    if (charCountStatusBarItem) charCountStatusBarItem.show();
    if (lineCountStatusBarItem) lineCountStatusBarItem.show();
}

function hideStatistics() {
    if (wordCountStatusBarItem) wordCountStatusBarItem.hide();
    if (charCountStatusBarItem) charCountStatusBarItem.hide();
    if (lineCountStatusBarItem) lineCountStatusBarItem.hide();
}

function deactivate() {
    hideStatistics();
}

module.exports = { activate, deactivate };