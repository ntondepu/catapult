import * as tf from '@tensorflow/tfjs';
import { AutoTokenizer, TFAutoModelForSeq2SeqLM } from '@xenova/transformers';

export class summarizeText {
  constructor() {
    this.model = null;
    this.tokenizer = null;
    this.loaded = false;
  }

  async loadModel() {
    // Load model and tokenizer
    this.tokenizer = await AutoTokenizer.from_pretrained('facebook/bart-large-cnn');
    this.model = await TFAutoModelForSeq2SeqLM.from_pretrained('facebook/bart-large-cnn');
    this.loaded = true;
  }

  preprocessText(text, maxLength = 1024) {
    // Remove PII (simplified example)
    let processed = text
      .replace(/Patient ID: \w+/g, '[REDACTED]')
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');

    // Truncate intelligently
    if (processed.length > maxLength) {
      const truncated = processed.substring(0, maxLength);
      const lastPeriod = truncated.lastIndexOf('.');
      return lastPeriod > 0 
        ? truncated.substring(0, lastPeriod + 1) + ' [TRUNCATED]' 
        : truncated + ' [TRUNCATED]';
    }
    return processed;
  }

  async summarize(text, maxOutputLength = 150) {
    if (!this.loaded) {
      await this.loadModel();
    }

    const processedText = this.preprocessText(text);

    // Tokenize input
    const inputs = await this.tokenizer(processedText, {
      max_length: 1024,
      truncation: true,
      return_tensors: 'tf'
    });

    // Generate summary
    const summaryIds = await this.model.generate(inputs.input_ids, {
      max_length: maxOutputLength,
      num_beams: 4,
      early_stopping: true,
      no_repeat_ngram_size: 3
    });

    // Decode output
    const summary = await this.tokenizer.decode(summaryIds[0], {
      skip_special_tokens: true
    });

    return this.addMedicalFormatting(summary);
  }

  addMedicalFormatting(text) {
    // Highlight abnormal values
    let formatted = text.replace(
      /(high|low|abnormal)\b/gi, 
      match => `[${match.toUpperCase()}]`
    );
    
    // Convert to bullet points
    return formatted.split('.')
      .filter(line => line.trim())
      .map(line => `• ${line.trim()}`)
      .join('\n');
  }
}
