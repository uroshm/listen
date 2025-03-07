package com.listen.services;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
class TranscriptionServiceTest {

    private TranscriptionService transcriptionService;

    @Test
    void transcribeAudio() {
        transcriptionService = new TranscriptionService();
        var transcriptionText = "hello world";
        var audioFilePath = "src/test/helloWorld_converted.wav";

        var result = transcriptionService.transcribeAudio(audioFilePath); 
    
        assertEquals(transcriptionText,result);
    }
}
