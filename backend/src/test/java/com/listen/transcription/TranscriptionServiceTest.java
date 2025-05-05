package com.listen.transcription;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.FileInputStream;
import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(SpringExtension.class)
class TranscriptionServiceTest {

  @Test
  void transcribeAudio() throws IOException {
    FileInputStream fileInputStream = new FileInputStream("src/test/resources/helloWorld.wav");
    MultipartFile file =
        new MockMultipartFile("file", "cowOverMoon.wav", "audio/wav", fileInputStream);
    var expectedTranscription = "hello world";
    var transcriptionService = new TranscriptionService();
    var result = transcriptionService.transcribeAudio(file, expectedTranscription);

    assertNotNull(result);
    assertFalse(result.isEmpty());
    assertEquals(expectedTranscription, result);
  }
}
