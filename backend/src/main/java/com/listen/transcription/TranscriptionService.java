package com.listen.transcription;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.SpeechResult;
import edu.cmu.sphinx.api.StreamSpeechRecognizer;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TranscriptionService {
  public record TranscriptionResult(
      String expectedText, String expectedPhonemes, String transcribedPhonemes) {}

  public record PhonemeResult(
      String expectedText, String expectedPhonemes, String transcribedPhonemes) {}

  public String transcribeAudio(MultipartFile multipartFile, String expectedText) {
    File tempFile = null;
    try {
      tempFile = File.createTempFile("audio-", ".wav");
      multipartFile.transferTo(tempFile);

      var recognizer = getRecognizer();
      var processedAudioPath = preprocessAudio(tempFile.getAbsolutePath());
      String transcribedText = getTranscription(processedAudioPath, recognizer);
      var result = convertToPhonemes(transcribedText);
      log.info("Transcription result: {}", result);
      return transcribedText;
    } catch (Exception e) {
      log.error("Error processing audio file", e);
      return "Error: " + e.getMessage();
    } finally {
      if (tempFile != null && tempFile.exists()) {
        if (!tempFile.delete()) {
          log.warn("Failed to delete temporary file: {}", tempFile.getAbsolutePath());
          tempFile.deleteOnExit();
        } else {
          log.info("Successfully deleted temporary file");
        }
      }
    }
  }

  private String preprocessAudio(String inputPath) {
    File inputFile = new File(inputPath);
    if (!inputFile.exists() || !inputFile.canRead() || inputFile.length() == 0) {
      log.error(
          "Input file issue - exists: {}, readable: {}, size: {}",
          inputFile.exists(),
          inputFile.canRead(),
          inputFile.length());
      return inputPath;
    }

    String outputPath = inputPath + "_processed.wav";

    try {
      ProcessBuilder pb =
          new ProcessBuilder(
              "ffmpeg",
              "-y", // Overwrite output
              "-v",
              "warning", // Be more verbose about errors
              "-i",
              inputPath, // Input file
              "-ar",
              "16000", // Sample rate
              "-ac",
              "1", // Mono channel
              "-c:a",
              "pcm_s16le", // PCM 16-bit encoding
              "-f",
              "wav", // Force WAV format
              outputPath); // Output path

      pb.redirectErrorStream(true);
      Process process = pb.start();

      StringBuilder output = new StringBuilder();
      try (BufferedReader reader =
          new BufferedReader(new InputStreamReader(process.getInputStream()))) {
        String line;
        while ((line = reader.readLine()) != null) {
          output.append(line).append("\n");
          log.debug("ffmpeg: {}", line);
        }
      }

      int exitCode = process.waitFor();

      if (exitCode != 0) {
        log.error("ffmpeg error (code {}): {}", exitCode, output.toString());
        return inputPath;
      }

      var outputFile = new File(outputPath);
      if (outputFile.exists() && outputFile.length() > 0) {
        log.info(
            "Successfully converted audio: {} ({}KB) -> {} ({}KB)",
            inputPath,
            inputFile.length() / 1024,
            outputPath,
            outputFile.length() / 1024);
        return outputPath;
      } else {
        log.error(
            "Output file invalid: exists={}, size={}",
            outputFile.exists(),
            outputFile.exists() ? outputFile.length() : 0);
        return inputPath;
      }
    } catch (Exception e) {
      log.error("Exception during preprocessing: {}", e.getMessage(), e);
      return inputPath;
    }
  }

  private String getTranscription(String audioFilePath, StreamSpeechRecognizer recognizer) {
    if (recognizer == null) {
      log.error("Recognizer is null");
      throw new IllegalStateException("Recognizer initialization failed.");
    }
    try (InputStream audioStream = new FileInputStream(audioFilePath)) {
      recognizer.startRecognition(audioStream);
      var fullTranscription = new StringBuilder();
      SpeechResult result;
      while ((result = recognizer.getResult()) != null) {
        String hypothesis = result.getHypothesis();
        log.debug("Recognized: {}", hypothesis);

        if (hypothesis != null && !hypothesis.trim().isEmpty()) {
          if (fullTranscription.length() > 0) {
            fullTranscription.append(" ");
          }
          fullTranscription.append(hypothesis.trim());
        }
      }

      recognizer.stopRecognition();

      String transcription = fullTranscription.toString().trim();
      log.info("Complete transcription: '{}'", transcription);

      return transcription.isEmpty() ? null : transcription;
    } catch (FileNotFoundException e) {
      log.error("File not found: " + audioFilePath);
      return null;
    } catch (IOException e) {
      log.error("Error reading file: " + audioFilePath);
      return null;
    }
  }

  private StreamSpeechRecognizer getRecognizer() {
    Configuration configuration = new Configuration();
    configuration.setAcousticModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us");
    configuration.setDictionaryPath("resource:/edu/cmu/sphinx/models/en-us/cmudict-en-us.dict");
    configuration.setLanguageModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us.lm.bin");

    StreamSpeechRecognizer recognizer = null;
    try {
      recognizer = new StreamSpeechRecognizer(configuration);
    } catch (IOException e) {
      log.error("Error initializing recognizer", e);
    }
    return recognizer;
  }

  public PhonemeResult getPhonemesFromText(String transcribedText) {
    if (transcribedText == null || transcribedText.isEmpty()) {
      return new PhonemeResult("", "", "");
    }

    // Simple implementation - just space out the characters
    String simplified = transcribedText.toLowerCase().replaceAll("[^a-z ]", "");
    String phonemes = String.join(" ", simplified.split(""));

    return new PhonemeResult(transcribedText, phonemes, phonemes);
  }

  private List<String> convertToPhonemes(String text) {
    if (text == null || text.isEmpty()) {
      return new ArrayList<>();
    }

    // Clean and normalize the text
    String cleanText =
        text.toLowerCase()
            .replaceAll("[^a-z0-9 ]", "") // Remove non-alphanumeric characters
            .trim();

    List<String> words = Arrays.asList(cleanText.split("\\s+"));
    List<String> phonemes = new ArrayList<>();

    // Load the CMU dictionary if needed
    try {
      InputStream dictStream =
          getClass().getResourceAsStream("/edu/cmu/sphinx/models/en-us/cmudict-en-us.dict");
      if (dictStream == null) {
        log.warn("Could not load CMU dictionary, using simple phoneme approximation");
        return simplePhonemeConversion(words);
      }

      // Parse dictionary
      Map<String, List<String>> pronunciations = new HashMap<>();
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(dictStream))) {
        String line;
        while ((line = reader.readLine()) != null) {
          if (line.trim().startsWith("#") || line.trim().isEmpty()) {
            continue; // Skip comments and empty lines
          }

          String[] parts = line.trim().split("\\s+", 2);
          if (parts.length == 2) {
            String word = parts[0].toLowerCase();
            // Remove trailing numbers for words with multiple pronunciations
            word = word.replaceAll("\\(\\d+\\)$", "");

            List<String> wordPhonemes = Arrays.asList(parts[1].split("\\s+"));
            pronunciations.put(word, wordPhonemes);
          }
        }
      }

      // Look up each word
      for (String word : words) {
        List<String> wordPhonemes = pronunciations.get(word);
        if (wordPhonemes != null) {
          phonemes.addAll(wordPhonemes);
        } else {
          // Fall back to approximation for unknown words
          phonemes.addAll(approximatePhonemes(word));
        }
      }

      return phonemes;
    } catch (Exception e) {
      log.error("Error converting to phonemes", e);
      return simplePhonemeConversion(words);
    }
  }

  // Fallback method for simple phoneme approximation
  private List<String> simplePhonemeConversion(List<String> words) {
    List<String> approximatedPhonemes = new ArrayList<>();

    for (String word : words) {
      approximatedPhonemes.addAll(approximatePhonemes(word));
    }

    return approximatedPhonemes;
  }

  // Basic phoneme approximation for English words
  private List<String> approximatePhonemes(String word) {
    List<String> phonemes = new ArrayList<>();

    // Very basic English phoneme approximation
    // This is a simplified version - in real life, you'd want a more sophisticated algorithm
    char[] chars = word.toCharArray();
    for (int i = 0; i < chars.length; i++) {
      switch (chars[i]) {
        case 'a':
          phonemes.add("AH");
          break;
        case 'e':
          phonemes.add("EH");
          break;
        case 'i':
          phonemes.add("IH");
          break;
        case 'o':
          phonemes.add("OW");
          break;
        case 'u':
          phonemes.add("UW");
          break;
        case 'b':
          phonemes.add("B");
          break;
        case 'c':
          if (i < chars.length - 1 && (chars[i + 1] == 'h')) {
            phonemes.add("CH");
            i++;
          } else {
            phonemes.add("K");
          }
          break;
        case 'd':
          phonemes.add("D");
          break;
        case 'f':
          phonemes.add("F");
          break;
        case 'g':
          phonemes.add("G");
          break;
        case 'h':
          phonemes.add("HH");
          break;
        case 'j':
          phonemes.add("JH");
          break;
        case 'k':
          phonemes.add("K");
          break;
        case 'l':
          phonemes.add("L");
          break;
        case 'm':
          phonemes.add("M");
          break;
        case 'n':
          phonemes.add("N");
          break;
        case 'p':
          phonemes.add("P");
          break;
        case 'q':
          phonemes.add("K");
          break;
        case 'r':
          phonemes.add("R");
          break;
        case 's':
          if (i < chars.length - 1 && (chars[i + 1] == 'h')) {
            phonemes.add("SH");
            i++;
          } else {
            phonemes.add("S");
          }
          break;
        case 't':
          if (i < chars.length - 1 && (chars[i + 1] == 'h')) {
            phonemes.add("TH");
            i++;
          } else {
            phonemes.add("T");
          }
          break;
        case 'v':
          phonemes.add("V");
          break;
        case 'w':
          phonemes.add("W");
          break;
        case 'x':
          phonemes.add("K");
          phonemes.add("S");
          break;
        case 'y':
          phonemes.add("Y");
          break;
        case 'z':
          phonemes.add("Z");
          break;
        default: // Skip any other characters
      }
    }

    return phonemes;
  }
}
