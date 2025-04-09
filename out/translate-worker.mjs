import { pipeline } from '@xenova/transformers';

const translate = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');

process.stdin.on('data', async (chunk) => {
    try {
        const { text, src_lang, tgt_lang } = JSON.parse(chunk.toString());
        const output = await translate(text, { src_lang, tgt_lang });
        process.stdout.write(JSON.stringify(output));
    } catch (error) {
        console.error('Error processing input:', error);
        process.exit(1); // Ensure process exits correctly on error
    }
});

// Gracefully handle when stdin ends
process.stdin.on('end', () => {
    process.stdout.end(); // Ensure stdout is properly closed
});

process.on('SIGPIPE', () => {
    console.log('SIGPIPE received, shutting down gracefully...');
    process.exit(0); // Ensure we exit without throwing an error
});