/**
 * Utility class to extract text and code blocks from a definition.
 */

class TextUtils {
    static extractTextAndCode(definition) {
        const codeRegex = /```(\w+)?\s*([\s\S]*?)```/g; // Regex to find content inside ``` ```
        const parts = [];
        let lastIndex = 0;

        let match;
        while ((match = codeRegex.exec(definition)) !== null) {
            // Push text before the code block
            if (lastIndex < match.index) {
                parts.push({ type: 'text', content: definition.slice(lastIndex, match.index) });
            }
            // Push the code block with language
            parts.push({ type: 'code', language: match[1], content: match[2] });
            lastIndex = match.index + match[0].length; // Update the last index to the end of the current match
        }

        // Push any remaining text after the last code block
        if (lastIndex < definition.length) {
            parts.push({ type: 'text', content: definition.slice(lastIndex) });
        }

        return parts; // Return array of parts
    }
}

export default TextUtils;