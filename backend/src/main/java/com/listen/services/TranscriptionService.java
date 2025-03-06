package com.listen.services;

import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.StreamSpeechRecognizer;

import java.io.FileInputStream;
import java.io.InputStream;

public class TranscriptionService {

    public static String transcribeAudio(String audioFilePath) throws Exception {
        // Configuration for Sphinx4
        Configuration configuration = new Configuration();
        configuration.setAcousticModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us");
        configuration.setDictionaryPath("resource:/edu/cmu/sphinx/models/en-us/cmudict-en-us.dict");
        configuration.setLanguageModelPath("resource:/edu/cmu/sphinx/models/en-us/en-us.lm.bin");

        StreamSpeechRecognizer recognizer = new StreamSpeechRecognizer(configuration);

        // Open audio file input stream
        try (InputStream audioStream = new FileInputStream(audioFilePath)) {
            recognizer.startRecognition(audioStream);
            String resultText = recognizer.getResult().getHypothesis();
            recognizer.stopRecognition();
            return resultText;
        }
    }
}
