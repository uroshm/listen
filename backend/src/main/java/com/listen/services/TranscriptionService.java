package com.listen.services;

import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.StreamSpeechRecognizer;
import lombok.extern.slf4j.Slf4j;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;

@Service
@Slf4j
public class TranscriptionService {

    public String transcribeAudio(String audioFilePath) {
        var recognizer = getRecognizer();
        return getTranscription(audioFilePath, recognizer);
    }

    private String getTranscription(String audioFilePath, StreamSpeechRecognizer recognizer) {
        try (InputStream audioStream = new FileInputStream(audioFilePath)) {
            if (recognizer != null) {
                recognizer.startRecognition(audioStream);
                String resultText = recognizer.getResult().getHypothesis();
                recognizer.stopRecognition();
                return resultText;
            } else {
                throw new IllegalStateException("Recognizer initialization failed.");
            }
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
}
