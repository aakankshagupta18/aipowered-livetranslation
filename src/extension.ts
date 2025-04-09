// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import { pipeline } from '@xenova/transformers';
import * as vscode from 'vscode';
// import { pipeline } from '@xenova/transformers';
import { spawn } from 'child_process';
import path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "aipowered-livetranslate" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('aipowered-livetranslate.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from aipowered-liveTranslate!');
	});

	context.subscriptions.push(disposable);


	const disposable1 = vscode.commands.registerCommand('aipowered-livetranslate.translate', async () => {
		try {
			const text = await vscode.window.showInputBox({
				prompt: 'Enter text to translate',
				placeHolder: 'Type your sentence here...',
			});

			if (!text) {
				vscode.window.showInformationMessage('No text entered.');
				return;
			}

			try {
                const translateWorkerPath = path.join(__dirname, 'translate-worker.mjs');
				const translator = spawn('node', [translateWorkerPath]);

				translator.stdout.on('data', (data) => {
					const result = JSON.parse(data.toString());
					console.log('Translation:', result);
					vscode.window.showInformationMessage("Translation result", result[0].translation_text);
				});

				// Handle error output
				translator.stderr.on('data', (data) => {
					console.error('Error from child process:', data.toString());
				});

				// Handle child process exit
				translator.on('exit', (code) => {
					if (code !== 0) {
						console.error(`Child process exited with code ${code}`);
					}
				});


			    translator.stdin.write(JSON.stringify({
					text: text,
					src_lang: 'eng_Latn',
					tgt_lang: 'fra_Latn'
				}));

				translator.stdin.end();

			} catch (err) {
				vscode.window.showErrorMessage("Translation failed: " + err);
			}
		} catch (err: any) {
			vscode.window.showErrorMessage('Command failed: ' + (err.message || err.toString()));
		}
	});

	context.subscriptions.push(disposable1);



}

// This method is called when your extension is deactivated
export function deactivate() { }

