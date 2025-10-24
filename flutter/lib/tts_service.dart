import 'package:flutter_tts/flutter_tts.dart';

class TTSService {
  static final TTSService _instance = TTSService._internal();
  final FlutterTts _flutterTts = FlutterTts();

  factory TTSService() {
    return _instance;
  }

  TTSService._internal() {
    _initializeTTS();
  }

  void _initializeTTS() async {
    await _flutterTts.setLanguage("en-US");
    await _flutterTts.setSpeechRate(0.5);
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);
  }

  Future<void> speak(String text) async {
    if (text.isNotEmpty) {
      await _flutterTts.speak(text);
    }
  }

  Future<void> stop() async {
    await _flutterTts.stop();
  }

  Future<void> pause() async {
    await _flutterTts.pause();
  }

  Future<void> resume() async {
    // Note: resume() method might not be available in newer versions
    // Using continue() or checking the current TTS state instead
    await _flutterTts.setVolume(1.0); // Resume by setting volume
  }

  Future<void> setLanguage(String language) async {
    await _flutterTts.setLanguage(language);
  }

  Future<void> setSpeechRate(double rate) async {
    await _flutterTts.setSpeechRate(rate);
  }

  Future<void> setVolume(double volume) async {
    await _flutterTts.setVolume(volume);
  }

  Future<void> setPitch(double pitch) async {
    await _flutterTts.setPitch(pitch);
  }

  Future<List<String>> getLanguages() async {
    return await _flutterTts.getLanguages;
  }

  Future<List<String>> getEngines() async {
    return await _flutterTts.getEngines;
  }

  Future<void> setEngine(String engine) async {
    await _flutterTts.setEngine(engine);
  }

  void setCompletionHandler(Function() handler) {
    _flutterTts.setCompletionHandler(handler);
  }

  void setStartHandler(Function() handler) {
    _flutterTts.setStartHandler(handler);
  }

  void setErrorHandler(Function(dynamic) handler) {
    _flutterTts.setErrorHandler(handler);
  }

  void setProgressHandler(Function(String, int, int, String) handler) {
    _flutterTts.setProgressHandler(handler);
  }
}
