package com.listen.transcription;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.listen.records.RecordsService;
import com.listen.transcription.TranscriptionService.TranscriptionResult;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/listen/transcription")
@RequiredArgsConstructor
@Slf4j
public class TranscriptionController {

  private final RecordsService recordsService;

  @CrossOrigin(origins = "http://localhost:8081")
  @PostMapping("/uploadAudio")
  // @PreAuthorize("hasAuthority('ROLE_USER')")
  public TranscriptionResult uploadAudio(
      @RequestParam("file") MultipartFile file, @RequestParam("expectedText") String expectedText) {
    return recordsService.uploadAudio(file, expectedText);
  }
}
